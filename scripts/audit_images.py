import os
import sys
import json
import csv
from PIL import Image
import numpy as np

def compute_phash(image_path, hash_size=8):
    try:
        with Image.open(image_path) as img:
            img = img.convert('L').resize((hash_size * 4, hash_size * 4), Image.Resampling.BILINEAR)
            pixels = np.array(img, dtype=np.float32)
            # Compute 2D DCT
            import scipy.fftpack
            dct = scipy.fftpack.dct(scipy.fftpack.dct(pixels, axis=0, norm='ortho'), axis=1, norm='ortho')
            dct_low = dct[:hash_size, :hash_size]
            med = np.median(dct_low)
            return (dct_low > med).flatten()
    except Exception as e:
        return None

def hamming_distance(hash1, hash2):
    return np.count_nonzero(hash1 != hash2)

def main():
    errors = []
    banned_filenames = {'hero-dog.jpg', 'packaging-box.jpg', 'packaging-concepts.png', 'toy-isolated.jpg'}
    
    # 1. Check data source: prefer data/catalog.seed.json, fallback to src/data/products.ts
    catalog_path = os.path.join(os.getcwd(), 'data', 'catalog.seed.json')
    products = []
    
    if os.path.exists(catalog_path):
        with open(catalog_path, 'r', encoding='utf-8') as f:
            products = json.load(f)
    else:
        # Check current baseline in src/data/products.ts
        ts_path = os.path.join(os.getcwd(), 'src', 'data', 'products.ts')
        if os.path.exists(ts_path):
            with open(ts_path, 'r', encoding='utf-8') as f:
                content = f.read()
                # Basic check on baseline
                for banned in banned_filenames:
                    if banned in content:
                        errors.append(f"Banned image '{banned}' is referenced in catalog products")
            errors.append(f"Catalog contains only initial products. Required: >= 60 distinct products in data/catalog.seed.json")
    
    if products:
        if len(products) < 60:
            errors.append(f"Catalog has {len(products)} products, which is less than the required 60 products")
            
        product_images_map = {}
        all_hashes = {}
        
        for p in products:
            p_id = p.get('id') or p.get('slug')
            images = p.get('images', [])
            if len(images) < 4:
                errors.append(f"Product '{p_id}' has only {len(images)} images (minimum 4 required)")
                
            for img_info in images:
                img_url = img_info if isinstance(img_info, str) else img_info.get('url', '')
                alt = '' if isinstance(img_info, str) else img_info.get('alt', '')
                
                # Check banned filename
                base_name = os.path.basename(img_url)
                if base_name in banned_filenames:
                    errors.append(f"Product '{p_id}' uses banned image '{base_name}'")
                    
                # Check shared images
                if img_url in product_images_map and product_images_map[img_url] != p_id:
                    errors.append(f"Image '{img_url}' is shared between product '{product_images_map[img_url]}' and '{p_id}'")
                product_images_map[img_url] = p_id
                
                # Verify file existence on disk
                local_path = os.path.join(os.getcwd(), 'public', img_url.lstrip('/'))
                if not os.path.exists(local_path):
                    errors.append(f"Product image file not found on disk: {local_path}")
                else:
                    # Check dimensions and format
                    try:
                        with Image.open(local_path) as im:
                            w, h = im.size
                            if max(w, h) < 600: # strict threshold
                                errors.append(f"Image '{img_url}' long edge {max(w, h)}px is below threshold")
                            ph = compute_phash(local_path)
                            if ph is not None:
                                for other_url, (other_pid, other_h) in all_hashes.items():
                                    if other_pid != p_id and hamming_distance(ph, other_h) <= 4:
                                        errors.append(f"Image '{img_url}' has perceptual duplicate with '{other_url}' (products {p_id} vs {other_pid})")
                                all_hashes[img_url] = (p_id, ph)
                    except Exception as ex:
                        errors.append(f"Failed to inspect image {local_path}: {ex}")

    # Check docs/IMAGE_LOG.csv
    image_log_path = os.path.join(os.getcwd(), 'docs', 'IMAGE_LOG.csv')
    if not os.path.exists(image_log_path):
        errors.append("docs/IMAGE_LOG.csv does not exist")

    if errors:
        print(f"\nFAILED: Found {len(errors)} image audit violations:")
        for err in errors[:30]:
            print(f"  - {err}")
        if len(errors) > 30:
            print(f"  ... and {len(errors) - 30} more violations")
        sys.exit(1)
    else:
        print(f"\nPASSED: All images audited. Zero duplicate or banned images found.")
        sys.exit(0)

if __name__ == '__main__':
    main()
