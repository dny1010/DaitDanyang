import os
import re
import shutil
from collections import defaultdict

def parse_weight(filename):
    """
    Extracts weight from a filename and normalizes it to grams.
    Handles formats like: 1.5kg, 5kg, 85g, 10kg(5kgx2), 79g 12개, 300g x 20개
    Returns the total weight in grams and the base name of the product.
    """
    filename_lower = filename.lower()
    
    # Patterns to find weight and unit
    # This will match numbers (including decimals) followed by kg, g, ml, or l.
    patterns = [
        re.compile(r"([\d\.]+)\s*(kg)"),
        re.compile(r"([\d\.]+)\s*(g)"),
        re.compile(r"([\d\.]+)\s*(ml)"),
        re.compile(r"([\d\.]+)\s*(l)"),
    ]
    
    match = None
    unit = None
    value = 0
    base_name_part = filename
    
    # Search for weight patterns from right to left to get the main product weight
    for pattern in patterns:
        matches = list(pattern.finditer(filename_lower))
        if matches:
            match = matches[-1] # Take the last match
            break
            
    if match:
        value_str = match.group(1)
        unit = match.group(2)
        
        try:
            value = float(value_str)
        except ValueError:
            return None, filename # Cannot parse number

        # Normalize to grams/ml
        if unit == 'kg':
            value *= 1000
        elif unit == 'l':
            value *= 1000

        # Check for multipliers like 'x 12', '12개'
        base_name_part = filename[:match.start()].strip()
        rest_of_string = filename[match.end():]
        
        multiplier_match = re.search(r"(\d+)(?:개|ea)", rest_of_string, re.IGNORECASE)
        if not multiplier_match:
             multiplier_match = re.search(r"x\s*(\d+)", rest_of_string, re.IGNORECASE)

        if multiplier_match:
            try:
                multiplier = int(multiplier_match.group(1))
                value *= multiplier
            except ValueError:
                pass # Ignore if multiplier is not a valid int
    else:
        # If no standard weight, check for patterns like 85g*12ea
        special_match = re.search(r"(\d+)\s*g\s*\*\s*(\d+)", filename_lower)
        if special_match:
             try:
                g_val = float(special_match.group(1))
                multiplier = int(special_match.group(2))
                value = g_val * multiplier
                base_name_part = filename[:special_match.start()].strip()
             except ValueError:
                return None, filename
        else:
            return None, filename


    # Clean up base name
    base_name_part = re.sub(r'[,_\-\s]+$', '', base_name_part)
    
    return value, base_name_part

def clean_product_name(name):
    """
    Cleans the product name by removing common noise and standardizing it.
    This helps in grouping similar products more effectively.
    """
    # Remove text in parentheses and brackets
    name = re.sub(r'\[.*?\]', '', name)
    name = re.sub(r'\(.*?\)', '', name)
    
    # Remove some common marketing terms
    noise = ['리뉴얼', '무료배송', '단품', '1+1', '2+1', '증정']
    for n in noise:
        name = name.replace(n, '')

    # Standardize and strip whitespace
    return name.strip()

def process_category(category_path, target_count=20):
    """
    Processes a single category directory to organize files.
    """
    print(f"--- Processing directory: {category_path} ---")
    
    # --- Step 1: Filter heavier duplicates ---
    print("Step 1: Filtering heavier duplicates...")
    heavy_items_dir = os.path.join(category_path, "다른 무게 물건")
    os.makedirs(heavy_items_dir, exist_ok=True)
    
    products_by_name = defaultdict(list)
    initial_files = os.listdir(category_path)
    
    file_pairs = defaultdict(dict)
    for f in initial_files:
        if os.path.isdir(os.path.join(category_path, f)):
            continue
        base, ext = os.path.splitext(f)
        if ext.lower() in ['.jpg', '.png', '.jpeg']:
            file_pairs[base]['image'] = f
        elif ext.lower() == '.txt':
            file_pairs[base]['meta'] = f

    for base, pair in file_pairs.items():
        if 'image' not in pair:
            continue

        image_file = pair.get('image')
        meta_file = pair.get('meta')
        weight, raw_base_name = parse_weight(base)
        
        if weight is None:
            # If no weight, treat as unique. Add it to a group with its own name.
            products_by_name[base].append({
                'weight': float('inf'), # No weight means it won't be the 'smallest'
                'image_file': image_file,
                'meta_file': meta_file,
            })
            continue

        cleaned_base_name = clean_product_name(raw_base_name)
        products_by_name[cleaned_base_name].append({
            'weight': weight,
            'image_file': image_file,
            'meta_file': meta_file,
        })

    moved_duplicates_count = 0
    for name, items in products_by_name.items():
        if len(items) <= 1:
            continue

        items.sort(key=lambda x: x['weight'])
        
        # Move all but the smallest
        for item_to_move in items[1:]:
            try:
                if item_to_move['image_file']:
                    shutil.move(os.path.join(category_path, item_to_move['image_file']), os.path.join(heavy_items_dir, item_to_move['image_file']))
                if item_to_move['meta_file'] and os.path.exists(os.path.join(category_path, item_to_move['meta_file'])):
                    shutil.move(os.path.join(category_path, item_to_move['meta_file']), os.path.join(heavy_items_dir, item_to_move['meta_file']))
                moved_duplicates_count += 1
            except Exception as e:
                print(f"  Error moving duplicate file {item_to_move.get('image_file', '')}: {e}")
    print(f"Step 1 Complete. Moved {moved_duplicates_count} heavier items.")

    # --- Step 2: Prune to target count ---
    print(f"Step 2: Pruning folder to ~{target_count} items...")
    
    remaining_files = [f for f in os.listdir(category_path) if os.path.isfile(os.path.join(category_path, f))]
    
    # Get remaining items with weights
    remaining_items_with_weight = []
    
    rem_file_pairs = defaultdict(dict)
    for f in remaining_files:
        base, ext = os.path.splitext(f)
        if ext.lower() in ['.jpg', '.png', '.jpeg']:
            rem_file_pairs[base]['image'] = f
        elif ext.lower() == '.txt':
            rem_file_pairs[base]['meta'] = f

    for base, pair in rem_file_pairs.items():
        if 'image' not in pair:
            continue
        
        weight, _ = parse_weight(base)
        # Assign a very large weight if none is found to place it at the end
        weight = weight if weight is not None else float('inf')

        remaining_items_with_weight.append({
            'weight': weight,
            'image_file': pair.get('image'),
            'meta_file': pair.get('meta'),
        })
        
    if len(remaining_items_with_weight) <= target_count:
        print(f"Step 2 Complete. No pruning needed (Item count: {len(remaining_items_with_weight)}).")
        return

    # Sort remaining items by weight
    remaining_items_with_weight.sort(key=lambda x: x['weight'])
    
    # Identify items to move
    items_to_move = remaining_items_with_weight[target_count:]
    
    # Create destination for excess files
    excess_items_dir = os.path.join(category_path, "초과 파일")
    os.makedirs(excess_items_dir, exist_ok=True)

    moved_excess_count = 0
    for item in items_to_move:
        try:
            if item['image_file']:
                shutil.move(os.path.join(category_path, item['image_file']), os.path.join(excess_items_dir, item['image_file']))
            if item['meta_file'] and os.path.exists(os.path.join(category_path, item['meta_file'])):
                shutil.move(os.path.join(category_path, item['meta_file']), os.path.join(excess_items_dir, item['meta_file']))
            moved_excess_count += 1
        except Exception as e:
                print(f"  Error moving excess file {item.get('image_file', '')}: {e}")
            
    print(f"Step 2 Complete. Moved {moved_excess_count} excess items.")
    # Calculate final count excluding subfolders and their contents
    final_count = len([f for f in os.listdir(category_path) if os.path.isfile(os.path.join(category_path, f)) and re.search(r'\.(jpg|png|jpeg)$', f, re.IGNORECASE)])
    print(f"--- Finished {category_path}. Final image count: {final_count} ---")

def main():
    base_dir = "crawled_data" 

    if not os.path.isdir(base_dir):
        print(f"Error: Directory not found at '{base_dir}'")
        return

    processed_dirs = set() 
    
    print(f"Starting recursive processing from: {base_dir}")

    for root, dirs, files in os.walk(base_dir, topdown=True):
        # Exclude special folders from further traversal
        dirs[:] = [d for d in dirs if d not in ["다른 무게 물건", "초과 파일"]]
        
        # Check if the current directory contains any image files
        has_image_files = any(re.search(r'\.(jpg|png|jpeg)$', f, re.IGNORECASE) for f in files)
        
        # Only process if it contains image files and hasn't been processed as a parent
        # Also, avoid processing the special folders themselves as main categories
        if has_image_files and root not in processed_dirs and \
           os.path.basename(root) not in ["다른 무게 물건", "초과 파일"]:
            print(f"Processing deep category: {root}")
            process_category(root)
            processed_dirs.add(root) # Mark this directory as processed

    print("\nAll categories processed recursively.")

if __name__ == "__main__":
    main()