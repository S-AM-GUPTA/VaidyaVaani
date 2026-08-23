import os
import sys
import json
import time
import argparse
import random
import numpy as np
from PIL import Image
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from transformers import AutoImageProcessor, AutoModelForImageClassification

CLASS_MAP = {
    0: "Handwritten",
    1: "Printed",
    2: "Mixed",
    3: "Other"
}

class PrescriptionRegionDataset(Dataset):
    def __init__(self, samples, processor, is_train=False):
        self.samples = samples
        self.processor = processor
        self.is_train = is_train

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        item = self.samples[idx]
        image_path = item["file_path"]
        class_id = item["class_id"]

        try:
            image = Image.open(image_path).convert("RGB")
        except Exception:
            # Fallback for any unexpected read failure
            image = Image.new("RGB", (224, 224), color=(255, 255, 255))

        # Conservative augmentations on PIL image if training
        if self.is_train:
            # Mild random rotation (+/- 5 deg)
            if random.random() > 0.5:
                angle = random.uniform(-5, 5)
                image = image.rotate(angle, resample=Image.Resampling.BILINEAR, fillcolor=(255, 255, 255))
            # Mild horizontal flip is BANNED for text readability; we preserve strict text orientation

        # Preprocess using AutoImageProcessor (resizes, scales to [-1, 1], converts to tensor)
        inputs = self.processor(images=image, return_tensors="pt")
        pixel_values = inputs["pixel_values"].squeeze(0)

        return {
            "pixel_values": pixel_values,
            "label": torch.tensor(class_id, dtype=torch.long),
            "filename": item.get("filename", "")
        }

def compute_metrics(predictions, targets, num_classes=4):
    preds = np.array(predictions)
    targs = np.array(targets)
    
    acc = np.mean(preds == targs)
    
    per_class_precision = []
    per_class_recall = []
    per_class_f1 = []
    
    for c in range(num_classes):
        tp = np.sum((preds == c) & (targs == c))
        fp = np.sum((preds == c) & (targs != c))
        fn = np.sum((preds != c) & (targs == c))
        
        prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = (2 * prec * rec) / (prec + rec) if (prec + rec) > 0 else 0.0
        
        per_class_precision.append(prec)
        per_class_recall.append(rec)
        per_class_f1.append(f1)
        
    macro_prec = np.mean(per_class_precision)
    macro_rec = np.mean(per_class_recall)
    macro_f1 = np.mean(per_class_f1)
    
    # Compute confusion matrix
    cm = np.zeros((num_classes, num_classes), dtype=int)
    for t, p in zip(targs, preds):
        cm[t, p] += 1
        
    return {
        "accuracy": float(acc),
        "macro_precision": float(macro_prec),
        "macro_recall": float(macro_rec),
        "macro_f1": float(macro_f1),
        "per_class_precision": [float(p) for p in per_class_precision],
        "per_class_recall": [float(r) for r in per_class_recall],
        "per_class_f1": [float(f) for f in per_class_f1],
        "confusion_matrix": cm.tolist()
    }

def train_region_router(args):
    # Set seeds
    random.seed(args.seed)
    np.random.seed(args.seed)
    torch.manual_seed(args.seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(args.seed)

    device = torch.device(args.device if args.device != "auto" else ("cuda" if torch.cuda.is_available() else "cpu"))
    print(f"[Region Router Training] Device: {device} | Model: {args.model}")

    # Load splits manifest
    splits_file = os.path.abspath(args.splits_file)
    if not os.path.exists(splits_file):
        raise FileNotFoundError(f"Splits file not found: {splits_file}. Run prepare_ieee_dataset.py first.")

    with open(splits_file, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    train_samples = manifest["splits"]["train"]
    val_samples = manifest["splits"]["val"]
    test_samples = manifest["splits"]["test"]
    class_weights_list = manifest["dataset_info"].get("class_weights", [1.0, 1.0, 1.0, 1.0])

    print(f"Loaded dataset: Train={len(train_samples)}, Val={len(val_samples)}, Test={len(test_samples)}")

    # Load Image Processor & Pretrained Model
    print(f"Loading processor and pretrained weights from {args.model}...")
    processor = AutoImageProcessor.from_pretrained(args.model)
    model = AutoModelForImageClassification.from_pretrained(
        args.model,
        num_labels=4,
        id2label=CLASS_MAP,
        label2id={v: k for k, v in CLASS_MAP.items()},
        ignore_mismatched_sizes=True
    )
    model.to(device)

    # Class-weighted loss
    class_weights_tensor = torch.tensor(class_weights_list, dtype=torch.float, device=device)
    criterion = nn.CrossEntropyLoss(weight=class_weights_tensor)
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.learning_rate, weight_decay=args.weight_decay)

    # Smoke Test Mode
    if args.smoke_test:
        print("\n=== RUNNING SMOKE TEST MODE ===")
        tiny_train = train_samples[:8]
        tiny_dataset = PrescriptionRegionDataset(tiny_train, processor, is_train=True)
        tiny_loader = DataLoader(tiny_dataset, batch_size=4, shuffle=False)

        model.train()
        batch = next(iter(tiny_loader))
        inputs = batch["pixel_values"].to(device)
        labels = batch["label"].to(device)

        optimizer.zero_grad()
        outputs = model(pixel_values=inputs)
        logits = outputs.logits
        loss = criterion(logits, labels)
        loss.backward()
        optimizer.step()

        print(f"  [Smoke Test Forward/Backward] Batch Loss: {loss.item():.4f}")
        print(f"  [Smoke Test Logits Shape]: {logits.shape} (Expected: (4, 4))")

        # Verify saving
        os.makedirs(args.output_dir, exist_ok=True)
        smoke_save_path = os.path.join(args.output_dir, "smoke_test_model")
        model.save_pretrained(smoke_save_path)
        processor.save_pretrained(smoke_save_path)
        print(f"  [Smoke Test Model Save] Successfully saved to {smoke_save_path}")
        print("=== SMOKE TEST PASSED SUCCESSFULLY ===\n")
        return

    # Full Training Datasets & Loaders
    train_dataset = PrescriptionRegionDataset(train_samples, processor, is_train=True)
    val_dataset = PrescriptionRegionDataset(val_samples, processor, is_train=False)

    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False, num_workers=0)

    best_val_macro_f1 = -1.0
    best_epoch = -1
    best_metrics = None
    output_dir = os.path.abspath(args.output_dir)
    best_dir = os.path.join(output_dir, "best")
    checkpoints_dir = os.path.join(output_dir, "checkpoints")
    os.makedirs(best_dir, exist_ok=True)
    os.makedirs(checkpoints_dir, exist_ok=True)

    print(f"\nStarting training for {args.epochs} epochs (Batch Size: {args.batch_size}, LR: {args.learning_rate})...")
    start_time = time.time()

    for epoch in range(1, args.epochs + 1):
        model.train()
        train_loss = 0.0
        train_preds = []
        train_targets = []

        for step, batch in enumerate(train_loader):
            inputs = batch["pixel_values"].to(device)
            labels = batch["label"].to(device)

            optimizer.zero_grad()
            outputs = model(pixel_values=inputs)
            logits = outputs.logits
            loss = criterion(logits, labels)
            loss.backward()
            optimizer.step()

            train_loss += loss.item() * inputs.size(0)
            preds = torch.argmax(logits, dim=-1).detach().cpu().numpy()
            train_preds.extend(preds)
            train_targets.extend(labels.detach().cpu().numpy())

        epoch_train_loss = train_loss / len(train_dataset)
        train_metrics = compute_metrics(train_preds, train_targets)

        # Validation Loop
        model.eval()
        val_loss = 0.0
        val_preds = []
        val_targets = []

        with torch.no_grad():
            for batch in val_loader:
                inputs = batch["pixel_values"].to(device)
                labels = batch["label"].to(device)

                outputs = model(pixel_values=inputs)
                logits = outputs.logits
                loss = criterion(logits, labels)

                val_loss += loss.item() * inputs.size(0)
                preds = torch.argmax(logits, dim=-1).cpu().numpy()
                val_preds.extend(preds)
                val_targets.extend(labels.cpu().numpy())

        epoch_val_loss = val_loss / len(val_dataset)
        val_metrics = compute_metrics(val_preds, val_targets)

        print(f"Epoch {epoch:02d}/{args.epochs:02d} | "
              f"Train Loss: {epoch_train_loss:.4f} Acc: {train_metrics['accuracy']*100:.2f}% Macro-F1: {train_metrics['macro_f1']*100:.2f}% | "
              f"Val Loss: {epoch_val_loss:.4f} Acc: {val_metrics['accuracy']*100:.2f}% Macro-F1: {val_metrics['macro_f1']*100:.2f}%")

        # Save Best Model by Macro-F1
        if val_metrics["macro_f1"] > best_val_macro_f1:
            best_val_macro_f1 = val_metrics["macro_f1"]
            best_epoch = epoch
            best_metrics = val_metrics
            
            model.save_pretrained(best_dir)
            processor.save_pretrained(best_dir)
            print(f"  --> Saved new best model to {best_dir} (Val Macro F1: {best_val_macro_f1*100:.2f}%)")

        # Save latest checkpoint
        ckpt_path = os.path.join(checkpoints_dir, f"checkpoint_epoch_{epoch}")
        os.makedirs(ckpt_path, exist_ok=True)
        model.save_pretrained(ckpt_path)
        processor.save_pretrained(ckpt_path)

    total_time = time.time() - start_time
    print(f"\nTraining completed in {total_time/60:.2f} minutes.")
    print(f"Best Validation Epoch: {best_epoch} (Macro F1: {best_val_macro_f1*100:.2f}%)")

    # Save training metadata
    meta = {
        "model_version": "region-router-v1",
        "model_architecture": args.model,
        "classes": CLASS_MAP,
        "class_weights": class_weights_list,
        "epochs": args.epochs,
        "batch_size": args.batch_size,
        "learning_rate": args.learning_rate,
        "weight_decay": args.weight_decay,
        "device": str(device),
        "seed": args.seed,
        "training_duration_seconds": round(total_time, 2),
        "best_epoch": best_epoch,
        "best_val_metrics": best_metrics
    }
    
    with open(os.path.join(output_dir, "metadata.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)

    print(f"Saved model metadata to {os.path.join(output_dir, 'metadata.json')}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train VaidyaVaani 4-Class Region Router")
    parser.add_argument("--splits-file", type=str, default="data/datasets/ieee_hp_prescription/splits.json", help="Path to splits manifest")
    parser.add_argument("--model", type=str, default="google/mobilenet_v2_1.0_224", help="Pretrained backbone")
    parser.add_argument("--epochs", type=int, default=5, help="Number of training epochs")
    parser.add_argument("--batch-size", type=int, default=32, help="Training batch size")
    parser.add_argument("--learning-rate", type=float, default=1e-4, help="Learning rate")
    parser.add_argument("--weight-decay", type=float, default=1e-4, help="Weight decay")
    parser.add_argument("--device", type=str, default="auto", help="Device (cpu, cuda, or auto)")
    parser.add_argument("--seed", type=int, default=42, help="Random seed")
    parser.add_argument("--output-dir", type=str, default="models/region-router", help="Output model directory")
    parser.add_argument("--smoke-test", action="store_true", help="Run quick single-batch smoke test")

    args = parser.parse_args()
    train_region_router(args)
