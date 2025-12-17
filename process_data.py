import os
import json
import traceback

def find_image_path(product_name, base_folders):
    for base_folder in base_folders:
        for root, dirs, files in os.walk(base_folder):
            for file in files:
                if file.endswith(('.jpg', '.png')):
                    file_product_name = os.path.splitext(file)[0]
                    if product_name in file_product_name or file_product_name in product_name:
                        return os.path.join(root, file).replace('\\', '/')
    return None

def generate_product_list():
    product_list = []
    
    # Process cat data
    try:
        pet_type = 'cat'
        cat_base_path = 'back/crawled_data/cat'
        if os.path.exists(cat_base_path):
            cat_categories = [d for d in os.listdir(cat_base_path) if os.path.isdir(os.path.join(cat_base_path, d))]
            for category in cat_categories:
                category_path = os.path.join(cat_base_path, category)
                if category == '다른 무게 물건' or not os.path.isdir(category_path):
                    continue
                for item in os.listdir(category_path):
                    if item.endswith('.txt'):
                        title = item[:-4]
                        price = 0
                        try:
                            with open(os.path.join(category_path, item), 'r', encoding='utf-8') as f:
                                for line in f:
                                    if '최저가' in line and ':' in line:
                                        price_str = line.split(':')[1].strip()
                                        if price_str:
                                            price = int(price_str)
                            
                            img_path = f'/DAITDANYANG/back/crawled_data/cat/{category}/{title}.jpg'
                            product = { "title": title, "price": price, "img_url": img_path, "category": category, "pet_type": pet_type }
                            product_list.append(product)
                        except Exception as e:
                            pass # Silently ignore errors for now
    except Exception as e:
        pass


    # Process dog data with heavy debugging
    print("\n--- STARTING DOG DATA PROCESSING ---")
    try:
        pet_type = 'dog'
        dog_base_path = 'back/crawled_data'
        dog_categories = [d for d in os.listdir(dog_base_path) if os.path.isdir(os.path.join(dog_base_path, d)) and d != 'cat']
        print(f"Found dog top-level categories: {dog_categories}")

        for category in dog_categories:
            category_path = os.path.join(dog_base_path, category)
            print(f"\nProcessing top-level category: '{category}'")
            
            for root, dirs, files in os.walk(category_path):
                if '다른무게 폴더' in dirs:
                    print(f"  - Excluding '다른무게 폴더' in '{root}'")
                    dirs.remove('다른무게 폴더')

                print(f"  - Walking into: '{root}'")
                print(f"  - Found {len(files)} files: {files if len(files) < 10 else str(files[:10]) + '...'}")
                
                json_files_found = 0
                for item in files:
                    if item.endswith('.json'):
                        json_files_found += 1
                        try:
                            json_path = os.path.join(root, item)
                            with open(json_path, 'r', encoding='utf-8') as f:
                                data = json.load(f)
                            
                            title = data.get('title', item[:-5])
                            price = data.get('price', 0)
                            
                            img_filename = item[:-5] + '.jpg'
                            img_path = os.path.join(root, img_filename).replace('\\', '/')

                            if not os.path.exists(img_path):
                                print(f"    - WARNING: Image not found for {item} at {img_path}. Skipping.")
                                continue

                            product = { 
                                "title": title, 
                                "price": price, 
                                "img_url": f'/DAITDANYANG/{img_path}', 
                                "category": os.path.basename(root), # e.g., '껌'
                                "pet_type": pet_type 
                            }
                            product_list.append(product)
                            print(f"    - SUCCESS: Added '{title}'")
                        except Exception as e:
                            print(f"    - ERROR: Could not process {item}. Reason: {e}")
                if json_files_found == 0:
                    print("  - No .json files found in this directory.")

        print("\n--- FINISHED DOG DATA PROCESSING ---")
    except Exception as e:
        print("--- CRITICAL ERROR in dog data processing ---")
        traceback.print_exc()
    
    # Final list creation
    print("\n--- FINALIZING ---")
    # No filtering for now to see all results
    # final_product_list = [p for p in product_list if p['pet_type'] in ['cat', 'dog']]
    final_product_list = product_list
    print(f"Total products in list (before filtering): {len(product_list)}")
    dog_products = [p for p in product_list if p['pet_type'] == 'dog']
    print(f"Number of dog products: {len(dog_products)}")
    
    print("Saving final list to products.json...")
    with open('products.json', 'w', encoding='utf-8') as f:
        json.dump(final_product_list, f, ensure_ascii=False, indent=4)
    print("Script finished successfully.")

if __name__ == '__main__':
    generate_product_list()
