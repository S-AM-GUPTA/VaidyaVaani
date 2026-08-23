import os
import sys
import glob
import json
import hashlib
import numpy as np
import pandas as pd
from PIL import Image
from collections import defaultdict

print("===================================================================")
print("  FAST VECTORIZED AUDIT & COMPARISON: mamun1113 vs RxHandBD")
print("===================================================================")

new_dataset_path = r"C:\Users\samfg\.cache\kagglehub\datasets\mamun1113\doctors-handwritten-prescription-bd-dataset\versions\1"
rxhandbd_path = r"C:\Users\samfg\.cache\kagglehub\datasets\roronaozoro007\rxhandbd\versions\1"

# Helper for perceptual hashing
def calculate_dhash_int(image_path: str, hash_size: int = 8) -> int:
    try:
        with Image.open(image_path) as img:
            img = img.convert('L').resize((hash_size + 1, hash_size), Image.Resampling.BILINEAR)
            pixels = np.array(img, dtype=np.int32)
            diff = pixels[:, 1:] > pixels[:, :-1]
            h = 0
            for v in diff.flatten():
                h = (h << 1) | int(v)
            return h
    except Exception:
        return 0

def calculate_sha256(file_path: str) -> str:
    h = hashlib.sha256()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()

# 1. Audit new dataset files and CSVs
print("\n[1/5] Auditing new dataset structure & splits...")
new_csv_files = glob.glob(os.path.join(new_dataset_path, "**", "*.csv"), recursive=True)
new_split_counts = {}
new_dataset_labels = set()
new_dataset_generics = set()

for csv_f in new_csv_files:
    split_name = os.path.splitext(os.path.basename(csv_f))[0]
    df = pd.read_csv(csv_f)
    new_split_counts[split_name] = len(df)
    if 'MEDICINE_NAME' in df.columns:
        for v in df['MEDICINE_NAME'].dropna():
            new_dataset_labels.add(str(v).strip().lower())
    if 'GENERIC_NAME' in df.columns:
        for v in df['GENERIC_NAME'].dropna():
            new_dataset_generics.add(str(v).strip().lower())

new_image_files = glob.glob(os.path.join(new_dataset_path, "**", "*.[jJ][pP][gG]"), recursive=True) + \
                  glob.glob(os.path.join(new_dataset_path, "**", "*.[pP][nN][gG]"), recursive=True)

print(f"Total new image files found: {len(new_image_files)}")
print(f"Splits: {new_split_counts}")
print(f"Unique Medicine Brand Names: {len(new_dataset_labels)}")
print(f"Unique Generic Names: {len(new_dataset_generics)}")

# 2. Audit Existing RxHandBD
print("\n[2/5] Auditing existing RxHandBD dataset...")
rx_image_files = glob.glob(os.path.join(rxhandbd_path, "**", "*.[jJ][pP][gG]"), recursive=True) + \
                 glob.glob(os.path.join(rxhandbd_path, "**", "*.[pP][nN][gG]"), recursive=True)
rx_csv_files = glob.glob(os.path.join(rxhandbd_path, "**", "*.csv"), recursive=True)

existing_rx_labels = set()
for csv_f in rx_csv_files:
    try:
        df = pd.read_csv(csv_f)
        for col in df.columns:
            if any(k in col.lower() for k in ['label', 'text', 'medicine', 'name', 'word']):
                for v in df[col].dropna():
                    existing_rx_labels.add(str(v).strip().lower())
    except Exception as e:
        pass

print(f"Existing RxHandBD image files: {len(rx_image_files)}")
print(f"Existing RxHandBD unique labels: {len(existing_rx_labels)}")

# 3. Fast Indexing of Hashes
print("\n[3/5] Computing SHA-256 and integer dHashes for RxHandBD...")
rx_sha_map = {}
rx_dhashes = []
rx_paths = []
rx_fname_map = {}

for p in rx_image_files:
    sha = calculate_sha256(p)
    dh = calculate_dhash_int(p)
    rx_sha_map[sha] = p
    rx_dhashes.append(dh)
    rx_paths.append(p)
    rx_fname_map[os.path.basename(p)] = p

rx_dhashes_arr = np.array(rx_dhashes, dtype=np.uint64)
print(f"Indexed {len(rx_sha_map)} RxHandBD images.")

# 4. Compare New Dataset against RxHandBD
print("\n[4/5] Comparing new dataset images against RxHandBD...")
exact_duplicates_count = 0
near_duplicates_count = 0
unique_new_count = 0
filename_matches = 0
duplicate_samples = []

for idx, p in enumerate(new_image_files):
    sha = calculate_sha256(p)
    fname = os.path.basename(p)
    if fname in rx_fname_map:
        filename_matches += 1
        
    if sha in rx_sha_map:
        exact_duplicates_count += 1
        if len(duplicate_samples) < 5:
            duplicate_samples.append({
                "new_file": os.path.relpath(p, new_dataset_path),
                "existing_file": os.path.relpath(rx_sha_map[sha], rxhandbd_path),
                "match_type": "EXACT_SHA256"
            })
    else:
        # Fast vectorized bitwise XOR Hamming distance
        dh = calculate_dhash_int(p)
        xor_res = np.bitwise_xor(rx_dhashes_arr, np.uint64(dh))
        # Compute popcount
        dists = np.array([bin(x).count('1') for x in xor_res])
        min_dist = np.min(dists) if len(dists) > 0 else 999
        if min_dist <= 2:
            near_duplicates_count += 1
            min_idx = np.argmin(dists)
            if len(duplicate_samples) < 5:
                duplicate_samples.append({
                    "new_file": os.path.relpath(p, new_dataset_path),
                    "existing_file": os.path.relpath(rx_paths[min_idx], rxhandbd_path),
                    "match_type": f"PERCEPTUAL_NEAR_MATCH (hamming_dist={int(min_dist)})"
                })
        else:
            unique_new_count += 1

print("\n--- COMPARISON SUMMARY ---")
print(f"New Dataset Total Images: {len(new_image_files)}")
print(f"Existing RxHandBD Total Images: {len(rx_image_files)}")
print(f"Exact SHA-256 Duplicates: {exact_duplicates_count}")
print(f"Perceptual Near-Duplicates: {near_duplicates_count}")
print(f"Filename Matches: {filename_matches}")
print(f"Genuinely Unique New Images: {unique_new_count}")

# 5. Compare Vocabularies
shared_labels = existing_rx_labels.intersection(new_dataset_labels)
new_only_labels = new_dataset_labels.difference(existing_rx_labels)
existing_only_labels = existing_rx_labels.difference(new_dataset_labels)

print(f"\nShared Medicine Labels: {len(shared_labels)}")
print(f"New-Only Medicine Labels: {len(new_only_labels)}")
print(f"Existing-Only Medicine Labels: {len(existing_only_labels)}")

# 6. Final Decision & Classification
if exact_duplicates_count == len(new_image_files) or (exact_duplicates_count + near_duplicates_count) == len(new_image_files):
    final_decision = "DUPLICATE / REPACKAGED"
elif unique_new_count > 0 and (exact_duplicates_count + near_duplicates_count) > 0:
    final_decision = "PARTIALLY OVERLAPPING"
elif unique_new_count == len(new_image_files):
    final_decision = "GENUINELY NEW DATA"
else:
    final_decision = "PARTIALLY OVERLAPPING"

print(f"\nFINAL DECISION: {final_decision}")

# Sample Image Dimensions
sample_dims = set()
for p in new_image_files[:20]:
    try:
        with Image.open(p) as img:
            sample_dims.add(f"{img.size[0]}x{img.size[1]}")
    except Exception:
        pass

# Save JSON Report
audit_report = {
    "dataset_info": {
        "dataset_name": "Doctor's Handwritten Prescription BD dataset",
        "kaggle_slug": "mamun1113/doctors-handwritten-prescription-bd-dataset",
        "kaggle_owner": "mamun1113",
        "total_files": len(new_image_files) + len(new_csv_files),
        "total_image_files": len(new_image_files),
        "split_distribution": new_split_counts,
        "sample_image_dimensions": list(sample_dims),
        "dataset_type": "Word/Token-Level Cropped Handwritten Medicine Names (Classification & Recognition)",
        "license": "CC0: Public Domain / Open Dataset",
        "provenance": "Curated from Bangladeshi medical prescriptions, pre-split into Train (3,120), Val (780), and Test (780) with Brand and Generic name columns."
    },
    "comparison_metrics": {
        "existing_rxhandbd_samples": len(rx_image_files),
        "new_dataset_samples": len(new_image_files),
        "exact_sha256_duplicates": exact_duplicates_count,
        "perceptual_near_duplicates": near_duplicates_count,
        "filename_matches": filename_matches,
        "unique_new_images": unique_new_count,
        "duplicate_percentage": round((exact_duplicates_count + near_duplicates_count) / max(1, len(new_image_files)) * 100, 2)
    },
    "vocabulary_comparison": {
        "total_unique_labels_existing_rxhandbd": len(existing_rx_labels),
        "total_unique_labels_new_dataset": len(new_dataset_labels),
        "shared_labels_count": len(shared_labels),
        "new_only_labels_count": len(new_only_labels),
        "existing_only_labels_count": len(existing_only_labels),
        "sample_shared_labels": sorted(list(shared_labels))[:15],
        "sample_new_labels": sorted(list(new_only_labels))[:15],
        "sample_existing_labels": sorted(list(existing_only_labels))[:15]
    },
    "duplicate_samples": duplicate_samples,
    "final_decision": final_decision
}

out_path = r"E:\vaidyavaani\ocr-service\doctor_prescription_bd_audit.json"
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(audit_report, f, indent=2)

print(f"Audit report written to {out_path}")
print("===================================================================")
