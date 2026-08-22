import os
import glob
from typing import List, Dict, Any, Optional, Tuple
from PIL import Image

try:
    import kagglehub
except ImportError:
    kagglehub = None

KAGGLE_DATASET_ID = "mehaksingal/illegible-medical-prescription-images-dataset"

class KagglePrescriptionDataset:
    """
    Dataset loader for Kaggle 'illegible-medical-prescription-images-dataset'.
    Handles automatic download, discovery, validation, and train/val/test splits.
    """
    def __init__(self, dataset_path: Optional[str] = None):
        self.dataset_path = dataset_path or self._resolve_dataset_path()
        self.images: List[str] = []
        self._load_images()

    def _resolve_dataset_path(self) -> str:
        # Check standard cache path first
        default_cache = os.path.expanduser(
            r"~/.cache/kagglehub/datasets/mehaksingal/illegible-medical-prescription-images-dataset/versions/1/data"
        )
        if os.path.exists(default_cache):
            return default_cache
            
        # Download via kagglehub if not found
        if kagglehub is not None:
            try:
                base_path = kagglehub.dataset_download(KAGGLE_DATASET_ID)
                data_sub = os.path.join(base_path, "data")
                return data_sub if os.path.exists(data_sub) else base_path
            except Exception as e:
                print(f"[DatasetLoader] Kagglehub download failed: {e}")
                
        return default_cache

    def _load_images(self):
        if not os.path.exists(self.dataset_path):
            print(f"[DatasetLoader] Path does not exist: {self.dataset_path}")
            return
            
        pattern = os.path.join(self.dataset_path, "*.jpg")
        self.images = sorted(glob.glob(pattern), key=lambda x: int(os.path.splitext(os.path.basename(x))[0]) if os.path.splitext(os.path.basename(x))[0].isdigit() else x)
        print(f"[DatasetLoader] Discovered {len(self.images)} prescription images in {self.dataset_path}")

    def __len__(self) -> int:
        return len(self.images)

    def __getitem__(self, idx: int) -> Dict[str, Any]:
        img_path = self.images[idx]
        filename = os.path.basename(img_path)
        return {
            "index": idx,
            "filename": filename,
            "file_path": img_path
        }

    def get_splits(self, train_ratio: float = 0.8, val_ratio: float = 0.1, seed: int = 42) -> Tuple[List[str], List[str], List[str]]:
        """
        Creates deterministic train, validation, and test splits.
        """
        import random
        rng = random.Random(seed)
        shuffled = list(self.images)
        rng.shuffle(shuffled)
        
        n_total = len(shuffled)
        n_train = int(n_total * train_ratio)
        n_val = int(n_total * val_ratio)
        
        train_set = shuffled[:n_train]
        val_set = shuffled[n_train:n_train + n_val]
        test_set = shuffled[n_train + n_val:]
        
        return train_set, val_set, test_set
