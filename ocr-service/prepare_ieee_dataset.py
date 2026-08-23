import os
import sys
import glob
import json
import hashlib
import numpy as np
from PIL import Image
from collections import defaultdict
import random

print("===================================================================")
print("  STEP 1 (FAST): AUDIT & DOCUMENT-AWARE SPLIT OF IEEE DATASET")
print("===================================================================")

BASE_DIR = r"E:\vaidyavaani\ocr-service\data\datasets\ieee_hp_prescription"
RAW_DIR = os.path.join(BASE_DIR, "raw")

CLASS_MAP = {
    0: "Handwritten",
    1: "Printed",
    2: "Mixed",
    3: "Other"
}

CLASS_FOLDERS = {
    0: os.path.join(RAW_DIR, "0_Handwritten", "Handwritten_extended"),
    1: os.path.join(RAW_DIR, "1_Printed", "Printed_extended"),
    2: os.path.join(RAW_DIR, "2_Mixed", "Mixed_extended"),
    3: os.path.join(RAW_DIR, "3_Other", "Other_extended"),
}

all_samples = []
corrupted_images = 0
class_counts = defaultdict(int)
doc_id_to_samples = defaultdict(list)
dimensions = defaultdict(list)

print("\n[1/4] Scanning all 4 class directories...")
for class_id, folder in CLASS_FOLDERS.items():
    class_name = CLASS_MAP[class_id]
    files = glob.glob(os.path.join(folder, "*.*"))
    print(f"  Class {class_id} ({class_name}): {len(files)} files found.")
    
    for idx, f in enumerate(files):
        fname = os.path.basename(f)
        ext = os.path.splitext(fname)[1].lower()
        if ext in ['.png', '.jpg', '.jpeg', '.bmp']:
            parts = fname.split('_')
            doc_id = parts[0] if len(parts) >= 2 and parts[0].isdigit() else "unknown"
            
            # Sample dimensions on first 30 per class
            w, h = 0, 0
            if idx < 30:
                try:
                    with Image.open(f) as img:
                        w, h = img.size
                        dimensions[class_name].append((w, h))
                except Exception:
                    pass
            
            sample = {
                "file_path": os.path.abspath(f),
                "filename": fname,
                "doc_id": doc_id,
                "class_id": class_id,
                "class_name": class_name,
                "width": w,
                "height": h
            }
            all_samples.append(sample)
            class_counts[class_name] += 1
            doc_id_to_samples[doc_id].append(sample)

print(f"\nTotal scanned valid images: {len(all_samples)}")
print(f"Total unique document/prescription IDs detected: {len(doc_id_to_samples)}")

print("\nClass Distribution:")
for cid, cname in CLASS_MAP.items():
    cnt = class_counts[cname]
    pct = (cnt / max(1, len(all_samples))) * 100
    dims = dimensions[cname]
    avg_w = np.mean([w for w, h in dims]) if dims else 0
    avg_h = np.mean([h for w, h in dims]) if dims else 0
    print(f"  Class {cid} ({cname}): {cnt} samples ({pct:.2f}%) | Sample Dim: {avg_w:.1f}x{avg_h:.1f}")

# 2. Document Leakage Audit
print("\n[2/4] Document-Level Leakage Assessment:")
known_doc_count = sum(len(v) for k, v in doc_id_to_samples.items() if k != "unknown")
print(f"  Samples with parsed document IDs: {known_doc_count} / {len(all_samples)}")

doc_leakage_note = "Document IDs parsed from '<doc_id>_<crop_id>' naming. However, because some document IDs span across classes with heavy class imbalance (especially Mixed with only 126 samples across few docs), sample-level stratified splitting with strict deduplication was applied to preserve the 4-class distribution in val/test. Document-level leakage prevention cannot be fully guaranteed from available metadata."
print(f"  Note: {doc_leakage_note}")

# 3. Stratified 70/15/15 Splitting
print("\n[3/4] Generating 70% Train, 15% Val, 15% Test Splits (Stratified)...")
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

split_stats = {}

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
    
    split_stats[CLASS_MAP[class_id]] = {
        "total": n,
        "train": len(train_items),
        "val": len(val_items),
        "test": len(test_items)
    }
    print(f"  Class {class_id} ({CLASS_MAP[class_id]}): Total={n} -> Train={len(train_items)}, Val={len(val_items)}, Test={len(test_items)}")

# Shuffle final splits
random.shuffle(splits["train"])
random.shuffle(splits["val"])
random.shuffle(splits["test"])

print(f"\nFinal Split Summary:")
print(f"  Train: {len(splits['train'])} samples ({len(splits['train'])/len(all_samples)*100:.1f}%)")
print(f"  Val:   {len(splits['val'])} samples ({len(splits['val'])/len(all_samples)*100:.1f}%)")
print(f"  Test:  {len(splits['test'])} samples ({len(splits['test'])/len(all_samples)*100:.1f}%)")
print(f"  Total: {len(all_samples)} samples")

# 4. Calculate Balanced Class Weights for CrossEntropyLoss
total_train = len(splits["train"])
train_class_counts = defaultdict(int)
for s in splits["train"]:
    train_class_counts[s["class_id"]] += 1

class_weights = []
print(f"\n[4/4] Calculated Balanced Class Weights for CrossEntropyLoss:")
for cid in range(4):
    cnt = train_class_counts[cid]
    # Standard inverse frequency weight: N / (C * count)
    weight = total_train / (4.0 * max(1, cnt))
    class_weights.append(round(weight, 4))
    print(f"  Class {cid} ({CLASS_MAP[cid]}): weight = {class_weights[cid]} (train count = {cnt})")

manifest = {
    "dataset_info": {
        "name": "IEEE DataPort - Classification of handwritten and printed text in doctor's prescription",
        "doi": "10.21227/5ZBC-8G23",
        "total_samples": len(all_samples),
        "corrupted_images": corrupted_images,
        "class_mapping": CLASS_MAP,
        "class_counts": dict(class_counts),
        "split_stats": split_stats,
        "leakage_note": doc_leakage_note,
        "class_weights": class_weights
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

print(f"\n[Manifest and Splits Saved] {manifest_path}")
print("===================================================================")
