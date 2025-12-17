
import os
import re
import shutil
from collections import defaultdict

def parse_weight_from_naver_img(filename):
    """
    Extracts weight from a naver_img filename and normalizes it to a comparable unit.
    Handles formats like: 20kg, 1.2L, 150큐브, 50g, 100ml.
    Returns the total weight and the base name of the product.
    """
    filename_lower = filename.lower()
    
    # Patterns to find weight and unit. Ordered by priority.
    patterns = [
        re.compile(r"([\d\.]+)\s*kg"),
        re.compile(r"([\d\.]+)\s*l"),
        re.compile(r"([\d\.]+)\s*g"),
        re.compile(r"([\d\.]+)\s*ml"),
        re.compile(r"([\d\.]+)\s*큐브"), # cube
    ]
    
    match = None
    unit_type = None
    value = float('inf') # Default to a large value if no weight is found
    base_name_part = filename

    # Find the last occurrence of a weight pattern in the filename
    last_match_pos = -1
    
    for i, pattern in enumerate(patterns):
        for m in pattern.finditer(filename_lower):
            if m.start() > last_match_pos:
                last_match_pos = m.start()
                match = m
                # Normalize weight: kg, l -> 1000; g, ml, 큐브 -> 1
                unit_multiplier = 1000 if i < 2 else 1

    if match:
        value_str = match.group(1)
        try:
            # The value is the parsed number multiplied by its unit's significance
            value = float(value_str) * unit_multiplier
            base_name_part = filename[:match.start()].strip()
        except ValueError:
            # If parsing fails, revert to default weight and use full name
            value = float('inf')
            base_name_part = filename
    
    # Clean up base name by removing trailing special chars
    base_name_part = re.sub(r'[,_\-\s]+$', '', base_name_part)
    
    # Define a cleaner base name for grouping by removing animal/category prefixes
    name_parts = base_name_part.split('_')
    if len(name_parts) > 2:
        # e.g., "물고기_사료_..." -> "..."
        cleaned_base_name = '_'.join(name_parts[2:]).strip()
    else:
        cleaned_base_name = base_name_part.strip()
        
    # Further clean the name for better grouping
    cleaned_base_name = re.sub(r'\[.*?\]', '', cleaned_base_name)
    cleaned_base_name = re.sub(r'\(.*?\)', '', cleaned_base_name)
    # Take first few words as the core product name
    core_name = ' '.join(cleaned_base_name.split()[:3])

    return value, core_name

def main():
    source_dir = "img_naver"
    dest_dir = "기초물품"

    if not os.path.isdir(source_dir):
        print(f"Error: Source directory not found at '{source_dir}'")
        return

    os.makedirs(dest_dir, exist_ok=True)
    print(f"Destination directory '{dest_dir}' is ready.")

    # Group files by a generated base product name
    products = defaultdict(list)
    all_files = [f for f in os.listdir(source_dir) if os.path.isfile(os.path.join(source_dir, f))]

    for filename in all_files:
        weight, base_name = parse_weight_from_naver_img(filename)
        
        # Skip if no sensible base name could be created
        if not base_name:
            continue
            
        products[base_name].append({
            'weight': weight,
            'filename': filename,
        })

    print(f"Found {len(all_files)} files and grouped them into {len(products)} products.")

    # Find the lightest item in each group and move it
    moved_count = 0
    for name, items in products.items():
        if not items:
            continue

        # Sort by weight, smallest first
        items.sort(key=lambda x: x['weight'])
        
        # The first item is the lightest
        item_to_move = items[0]
        
        # If the lightest item has infinite weight, it means no weight was parsed.
        # We probably shouldn't move it as we can't be sure it's the "lightest".
        if item_to_move['weight'] == float('inf'):
            # print(f"Skipping group '{name}' as no weight could be parsed.")
            continue

        try:
            src_path = os.path.join(source_dir, item_to_move['filename'])
            dest_path = os.path.join(dest_dir, item_to_move['filename'])
            
            if os.path.exists(src_path):
                shutil.move(src_path, dest_path)
                moved_count += 1
        except Exception as e:
            print(f"Error moving file {item_to_move.get('filename', '')}: {e}")

    print(f"\nProcessing complete. Moved {moved_count} lightest items to '{dest_dir}'.")

if __name__ == "__main__":
    main()
