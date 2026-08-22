import os
from typing import List, Dict, Any, Optional, Tuple
import pandas as pd
from PIL import Image
import torch
from torch.utils.data import Dataset
import kagglehub

class RxHandBDDataset(Dataset):
    """
    PyTorch / HuggingFace Dataset for RxHandBD handwritten medical prescription word recognition.
    Loads cropped word images and corresponding ground-truth text transcriptions.
    """
    def __init__(
        self,
        split: str = "train",
        processor = None,
        max_target_length: int = 32,
        val_ratio: float = 0.1,
        seed: int = 42,
        max_samples: Optional[int] = None
    ):
        self.split = split
        self.processor = processor
        self.max_target_length = max_target_length
        self.samples: List[Dict[str, Any]] = []
        
        self._load_dataset(val_ratio=val_ratio, seed=seed, max_samples=max_samples)

    def _get_dataset_dir(self) -> str:
        base_path = kagglehub.dataset_download("roronaozoro007/rxhandbd")
        rx_dir = os.path.join(base_path, "RxHandBD")
        return rx_dir if os.path.exists(rx_dir) else base_path

    def _load_dataset(self, val_ratio: float, seed: int, max_samples: Optional[int]):
        rx_dir = self._get_dataset_dir()
        
        if self.split in ["train", "val"]:
            sub_dir = os.path.join(rx_dir, "train")
            csv_path = os.path.join(sub_dir, "labels.csv")
            img_dir = os.path.join(sub_dir, "images")
            
            df = pd.read_csv(csv_path)
            # Deterministic train / val split of official training portion
            import random
            rng = random.Random(seed)
            indices = list(range(len(df)))
            rng.shuffle(indices)
            
            n_val = int(len(df) * val_ratio)
            val_indices = set(indices[:n_val])
            train_indices = set(indices[n_val:])
            
            target_indices = train_indices if self.split == "train" else val_indices
            target_df = df.iloc[list(target_indices)].reset_index(drop=True)
        elif self.split == "test":
            sub_dir = os.path.join(rx_dir, "test")
            csv_path = os.path.join(sub_dir, "labels.csv")
            img_dir = os.path.join(sub_dir, "images")
            target_df = pd.read_csv(csv_path)
        else:
            raise ValueError(f"Unknown split: {self.split}")
            
        for _, row in target_df.iterrows():
            img_name = str(row["image"])
            label = str(row["label"]).strip() if pd.notna(row["label"]) else ""
            if not label:
                continue
                
            img_path = os.path.join(img_dir, img_name)
            if os.path.exists(img_path):
                self.samples.append({
                    "image_path": img_path,
                    "filename": img_name,
                    "text": label,
                    "sample_id": os.path.splitext(img_name)[0]
                })
                
        if max_samples and max_samples > 0:
            self.samples = self.samples[:max_samples]
            
        print(f"[RxHandBDDataset] Loaded {len(self.samples)} samples for split '{self.split}'.")

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int) -> Dict[str, Any]:
        item = self.samples[idx]
        img_path = item["image_path"]
        text = item["text"]
        
        # Load and convert image safely to 3-channel RGB
        try:
            with Image.open(img_path) as img:
                image = img.convert("RGB")
        except Exception:
            # Fallback 128x128 white square
            image = Image.new("RGB", (128, 128), (255, 255, 255))
            
        # If processor is provided, format tensors for DataLoader
        if self.processor is not None:
            pixel_values = self.processor(image, return_tensors="pt").pixel_values.squeeze(0)
            labels = self.processor.tokenizer(
                text,
                padding="max_length",
                max_length=self.max_target_length,
                truncation=True,
                return_tensors="pt"
            ).input_ids.squeeze(0)
            
            # Replace pad_token_id with -100 to ignore padding in CrossEntropy loss
            labels[labels == self.processor.tokenizer.pad_token_id] = -100
            
            return {
                "pixel_values": pixel_values,
                "labels": labels,
                "text": text,
                "sample_id": item["sample_id"]
            }
            
        return {
            "image": image,
            "text": text,
            "sample_id": item["sample_id"],
            "image_path": img_path
        }
