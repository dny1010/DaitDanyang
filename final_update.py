import json
import traceback

def final_update():
    try:
        # --- 1. Generate the new content ---
        print("Loading products.json")
        with open('products.json', 'r', encoding='utf-8') as f:
            products = json.load(f)
        print(f"Loaded {len(products)} products.")
        
        new_product_lines = []
        for product in products:
            title = product.get('title', '').replace('"', '\"')
            price = product.get('price', 0)
            img_url = product.get('img_url', '')
            category = product.get('category', '')
            pet_type = product.get('pet_type', '')
            new_product_lines.append(f'        Product(title="{title}", price={price}, img_url="{img_url}", category="{category}", pet_type="{pet_type}"),')
        
        new_feed1_content = '\n'.join(new_product_lines)
        print(f"Generated {len(new_product_lines)} product strings.")

        # --- 2. Read the template from seedgemini.py ---
        seed_file_path = 'back/seedgemini.py'
        print(f"Reading template file: {seed_file_path}")
        with open(seed_file_path, 'r', encoding='utf-8') as f:
            seed_template = f.read()
        
        # --- 3. Replace the placeholder ---
        print("Replacing placeholder in template...")
        # This regex is designed to find the feed1 list assignment.
        old_feed1_regex = r'feed1 = \[.*?]'
        
        # Create the new content for the list
        new_feed1 = f"feed1 = [\n{new_feed1_content}\n    ]"
        
        # Use re.sub with the DOTALL flag to ensure multiline matching
        import re
        final_content, count = re.subn(old_feed1_regex, new_feed1, seed_template, flags=re.DOTALL)
        
        if count > 0:
            print("Successfully found and replaced feed1 list.")
        else:
            print("Error: Could not find 'feed1 = [...]' in the seed file. Replacement failed.")
            return

        # --- 4. Write to the new seedgemini.py file ---
        target_file_path = 'back/seedgemini.py'
        print(f"Writing final content to {target_file_path}...")
        with open(target_file_path, 'w', encoding='utf-8') as f:
            f.write(final_content)
            
        print(f"Successfully wrote {len(final_content)} characters to {target_file_path}.")

    except Exception as e:
        print(f"--- CRITICAL ERROR in final_update.py ---")
        traceback.print_exc()

if __name__ == '__main__':
    final_update()