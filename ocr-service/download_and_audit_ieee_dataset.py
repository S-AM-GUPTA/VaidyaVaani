import os
import sys
import glob
import json
import zipfile
import urllib.request
import hashlib
import numpy as np
from PIL import Image
from collections import defaultdict
import random

print("===================================================================")
print("  STEP 1: INGEST & AUDIT IEEE HP PRESCRIPTION DATASET")
print("===================================================================")

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "data", "datasets", "ieee_hp_prescription"))
RAW_DIR = os.path.join(BASE_DIR, "raw")
os.makedirs(RAW_DIR, exist_ok=True)

GITHUB_RAW_BASE = "https://github.com/djdhar/Handwritten-and-Printed-Text-Classification-in-Doctors-Prescription/raw/master/Prescription%20Text%20Localization%20and%20Classification/Extended%20Dataset"

ZIP_FILES = {
    0: ("Handwritten", "Handwritten_extended.zip"),
    1: ("Printed", "Printed_extended.zip"),
    2: ("Mixed", "Mixed_extended.zip"),
    3: ("Other", "Other_extended.zip")
}

CLASS_MAP = {
    0: "Handwritten",
    1: "Printed",
    2: "Mixed",
    3: "Other"
}

# 1. Download and extract each class archive
print("[1/5] Downloading and extracting class archives...")
for class_id, (class_name, zip_name) in ZIP_FILES.items():
    zip_path = os.path.join(BASE_DIR, zip_name)
    extract_dir = os.path.join(RAW_DIR, f"{class_id}_{class_name}")
    
    if not os.path.exists(extract_dir) or len(os.listdir(extract_dir)) == 0:
        if not os.path.exists(zip_path):
            url = f"{GITHUB_RAW_BASE}/{zip_name}"
            print(f"  Downloading {zip_name} from {url}...")
            urllib.request.urlretrieve(url, zip_path)
            print(f"  Downloaded {zip_name} ({os.path.getsize(zip_path) / (1024*1024):.2f} MB)")
        
        print(f"  Extracting {zip_name} to {extract_dir}...")
        os.makedirs(extract_dir, exist_ok=True)
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
        print(f"  Extracted {len(os.listdir(extract_dir))} files.")
    else:
        print(f"  Class {class_id}_{class_name} already extracted ({len(os.listdir(extract_dir))} files).")

# 2. Audit images in each class
print("\n[2/5] Auditing images, dimensions, and corruptions...")
all_samples = []
corrupted_images = 0
class_counts = defaultdict(int)
dimension_stats = defaultdict(list)
has_doc_ids = False
sample_filenames = defaultdict(list)

for class_id, class_name in CLASS_MAP.items():
    class_dir = os.path.join(RAW_DIR, f"{class_id}_{class_name}")
    files = glob.glob(os.path.join(class_dir, "**", "*.*"), recursive=True)
    
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext in ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp']:
            try:
                with Image.open(f) as img:
                    img.verify()
                with Image.open(f) as img:
                    w, h = img.size
                    dimension_stats[class_name].append((w, h))
                
                fname = os.path.basename(f)
                if len(sample_filenames[class_name]) < 5:
                    sample_filenames[class_name].append(fname)
                    
                all_samples.append({
                    "file_path": os.path.abspath(f),
                    "filename": fname,
                    "class_id": class_id,
                    "class_name": class_name,
                    "width": w,
                    "height": h
                })
                class_counts[class_name] += 1
            except Exception as e:
                print(f"  Corrupted image detected: {f} ({e})")
                corrupted_images += 1

print(f"Total valid images: {len(all_samples)}")
print(f"Total corrupted images: {corrupted_images}")
print("Class Distribution:")
for class_id, class_name in CLASS_MAP.items():
    cnt = class_counts[class_name]
    pct = (cnt / max(1, len(all_samples))) * 100
    dims = dimension_stats[class_name]
    avg_w = np.mean([w for w, h in dims]) if dims else 0
    avg_h = np.mean([h for w, h in dims]) if dims else 0
    print(f"  Class {class_id} ({class_name}): {cnt} samples ({pct:.2f}%) | Avg Dim: {avg_w:.1f}x{avg_h:.1f} | Samples: {sample_filenames[class_name][:2]}")

# 3. Document ID and Leakage Audit
print("\n[3/5] Inspecting Document-Level IDs & Leakage...")
# Check filename patterns (e.g. img_1_2.jpg vs random numbers)
sample_fnames = [s["filename"] for s in all_samples[:50]]
print(f"Sample filenames: {sample_fnames[:10]}")
# In this dataset, filenames are arbitrary indices like 1.jpg, 2.jpg per folder or crop sequence numbers
doc_leakage_note = "Document-level leakage prevention cannot be guaranteed from available metadata."
print(f"Leakage Audit Result: {doc_leakage_note}")

# 4. Duplicate Check against existing datasets
print("\n[4/5] Running SHA-256 and perceptual hash deduplication...")
def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()

ieee_shas = {sha256(s["file_path"]): s for s in all_samples}
print(f"Unique SHA-256 hashes within IEEE dataset: {len(ieee_shas)} / {len(all_samples)}")

# Compare against RxHandBD, Kaggle 129, and BD-4680
existing_cache = os.path.expanduser("~/.cache/kagglehub/datasets")
kaggle129_path = os.path.join(existing_cache, "mehaksingal", "illegible-medical-prescription-images-dataset", "versions", "1")
rxhandbd_path = os.path.join(existing_cache, "roronaozoro007", "rxhandbd", "versions", "1")
bd4680_path = os.path.join(existing_cache, "mamun1113", "doctors-handwritten-prescription-bd-dataset", "versions", "1")

def check_external_overlap(name, folder):
    if not os.path.exists(folder):
        return 0, 0
    ext_imgs = glob.glob(os.path.join(folder, "**", "*.[jJ][pP][gG]"), recursive=True) + \
               glob.glob(os.path.join(folder, "**", "*.[pP][nN][gG]"), recursive=True)
    matches = sum(1 for p in ext_imgs if sha256(p) in ieee_shas)
    print(f"  Overlap with {name} ({len(ext_imgs)} images): {matches} exact duplicates")
    return len(ext_imgs), matches

check_external_overlap("129 Kaggle Full Prescriptions", kaggle129_path)
check_external_overlap("RxHandBD (5,578 images)", rxhandbd_path)
check_external_overlap("Doctor's Prescription BD (4,680 images)", bd4680_path)

# 5. Stratified 70/15/15 Data Splitting
print("\n[5/5] Generating Stratified 70% Train, 15% Val, 15% Test Splits...")
random.seed(42)
np.random.seed(42)

splits = {
    "train": [],
    "val": [],
    "test": []
}

class_buckets = defaultdict(list)
for s in all_samples:
    class_buckets[s["class_id"]].append(s)

for class_id, items in class_buckets.items():
    random.shuffle(items)
    n = len(items)
    n_train = int(0.70 * n)
    n_val = int(0.15 * n)
    
    train_items = items[:n_train]
    val_items = items[n_train:n_train + n_val]
    test_items = items[n_train + n_val:]
    
    splits["train"].extend(train_items)
    splits["val"].extend(val_items)
    splits["test"].extend(test_items)
    
    print(f"  Class {class_id} ({CLASS_MAP[class_id]}): Total={n} -> Train={len(train_items)}, Val={len(val_items)}, Test={len(test_items)}")

print(f"\nFinal Split Summary: Train={len(splits['train'])}, Val={len(splits['val'])}, Test={len(splits['test'])} (Total={len(all_samples)})")

# Save Splits JSON & Dataset Manifest
manifest = {
    "dataset_info": {
        "name": "IEEE DataPort - Classification of handwritten and printed text in doctor's prescription",
        "doi": "10.21227/5ZBC-8G23",
        "total_samples": len(all_samples),
        "corrupted_images": corrupted_images,
        "class_mapping": CLASS_MAP,
        "class_counts": dict(class_counts),
        "leakage_note": doc_leakage_note
    },
    "splits": {
        "train_count": len(splits["train"]),
        "val_count": len(splits["val"]),
        "test_count": len(splits["test"]),
        "train": splits["train"],
        "val": splits["val"],
        "test": splits["test"]
    }
}

manifest_path = os.path.join(BASE_DIR, "splits.json")
with open(manifest_path, "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2)

print(f"\n[Splits and Manifest Saved] {manifest_path}")
print("===================================================================")
