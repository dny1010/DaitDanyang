
import json
import re
import os

try:
    print("Starting update_seed_file.py script...")

    # 1. Read the products.json file
    print("Reading products.json...")
    if not os.path.exists('products.json'):
        print("Error: products.json not found!")
    else:
        with open('products.json', 'r', encoding='utf-8') as f:
            products = json.load(f)
        print(f"Successfully loaded {len(products)} products from products.json")

        # 2. Generate the Product(...) strings
        print("Generating Product strings...")
        product_strings = []
        for product in products:
            # Escape double quotes in the title
            title = product.get('title', '').replace('"', '\"')
            price = product.get('price', 0)
            img_url = product.get('img_url', '')
            category = product.get('category', '')
            pet_type = product.get('pet_type', '')
            product_strings.append(f'        Product(title="{title}", price={price}, img_url="{img_url}", category="{category}", pet_type="{pet_type}"),')

        new_feed1_content = '\n'.join(product_strings)
        print(f"Generated {len(product_strings)} product strings.")

        # 3. Read the back/seedgemini.py file
        seed_file_path = 'back/seedgemini.py'
        print(f"Reading {seed_file_path}...")
        if not os.path.exists(seed_file_path):
            print(f"Error: {seed_file_path} not found!")
        else:
            with open(seed_file_path, 'r', encoding='utf-8') as f:
                seed_file_content = f.read()
            print("Successfully read seed file.")

            # 4. Replace the feed1 list with the new data
            print("Replacing feed1 list...")
            # This regex is designed to find the feed1 list assignment.
            old_feed1_regex = r'feed1 = \[.*?]'
            
            # Create the new content for the list
            new_feed1 = f"feed1 = [\n{new_feed1_content}\n    ]"
            
            # Use re.sub with the DOTALL flag to ensure multiline matching
            updated_seed_file_content, count = re.subn(old_feed1_regex, new_feed1, seed_file_content, flags=re.DOTALL)
            
            if count > 0:
                print("Successfully found and replaced feed1 list.")
                # 5. Write the updated content back to back/seedgemini.py
                print(f"Writing updated content back to {seed_file_path}...")
                with open(seed_file_path, 'w', encoding='utf-8') as f:
                    f.write(updated_seed_file_content)
                print("Successfully updated back/seedgemini.py")
            else:
                print("Error: Could not find 'feed1 = [...]' in the seed file. Replacement failed.")

except Exception as e:
    print(f"An error occurred: {e}")
    import traceback
    traceback.print_exc()
