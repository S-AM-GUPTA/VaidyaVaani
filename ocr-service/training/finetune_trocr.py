import os
import sys
import argparse
from typing import List, Dict, Any, Tuple
import torch
from torch.utils.data import Dataset, DataLoader
from PIL import Image

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from annotation.manager import get_annotation_manager
from annotation.schema import VerificationStatus
from models.trocr_model import get_trocr_model, get_device
from preprocessing.image_processor import crop_box

class VerifiedPrescriptionDataset(Dataset):
    """
    PyTorch Dataset reading ONLY human-verified Level A transcriptions and image crops.
    """
    def __init__(self, annotation_records: List[Dict[str, Any]], processor, max_length: int = 64):
        self.samples = []
        self.processor = processor
        self.max_length = max_length
        
        for rec in annotation_records:
            img_path = rec.get("image_path")
            if not img_path or not os.path.exists(img_path):
                continue
                
            try:
                full_img = Image.open(img_path).convert("RGB")
            except Exception:
                continue
                
            for reg in rec.get("regions", []):
                # Strictly only include regions with human-verified transcriptions
                if reg.get("status") == VerificationStatus.VERIFIED.value and reg.get("visual_transcription"):
                    text = reg["visual_transcription"].strip()
                    box = reg.get("bbox")
                    
                    crop = full_img
                    if box and len(box) == 4:
                        xmin, ymin, xmax, ymax = box
                        if xmax > xmin and ymax > ymin:
                            crop = full_img.crop((xmin, ymin, xmax, ymax))
                            
                    self.samples.append({
                        "image": crop,
                        "text": text,
                        "image_id": rec.get("image_id")
                    })
                    
        print(f"[Dataset] Prepared {len(self.samples)} verified crop-transcription pairs.")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        item = self.samples[idx]
        image = item["image"]
        text = item["text"]
        
        pixel_values = self.processor(image, return_tensors="pt").pixel_values.squeeze(0)
        labels = self.processor.tokenizer(
            text, 
            padding="max_length", 
            max_length=self.max_length, 
            truncation=True, 
            return_tensors="pt"
        ).input_ids.squeeze(0)
        
        # Replace padding token id's with -100 so loss ignores them
        labels[labels == self.processor.tokenizer.pad_token_id] = -100
        
        return {
            "pixel_values": pixel_values,
            "labels": labels,
            "ground_truth_text": text
        }

def compute_cer_wer(predictions: List[str], references: List[str]) -> Tuple[float, float]:
    """
    Computes exact Character Error Rate (CER) and Word Error Rate (WER).
    """
    try:
        from rapidfuzz.distance import Levenshtein
    except ImportError:
        return 0.0, 0.0
        
    total_char_dist = 0
    total_chars = 0
    total_word_dist = 0
    total_words = 0
    
    for pred, ref in zip(predictions, references):
        pred_clean = pred.strip()
        ref_clean = ref.strip()
        
        total_char_dist += Levenshtein.distance(pred_clean, ref_clean)
        total_chars += max(len(ref_clean), 1)
        
        pred_words = pred_clean.split()
        ref_words = ref_clean.split()
        total_word_dist += Levenshtein.distance(pred_words, ref_words)
        total_words += max(len(ref_words), 1)
        
    cer = round(total_char_dist / total_chars * 100, 2) if total_chars > 0 else 0.0
    wer = round(total_word_dist / total_words * 100, 2) if total_words > 0 else 0.0
    return cer, wer

def run_fine_tuning(
    min_verified: int = 20, 
    epochs: int = 5, 
    batch_size: int = 2, 
    lr: float = 5e-5,
    output_dir: str = "./checkpoints"
):
    """
    Executes supervised TrOCR fine-tuning with strict verification gating.
    """
    print("\n=======================================================")
    print("  VaidyaVaani Supervised Prescription Fine-Tuning")
    print("=======================================================\n")
    
    mgr = get_annotation_manager()
    report = mgr.get_quality_report()
    
    print(f"Data Quality Audit:")
    print(f" - Total Images in Database: {report['total_images']}")
    print(f" - Human-Verified Images:    {report['verified']}")
    print(f" - Uncertain Images:          {report['uncertain']}")
    print(f" - Illegible Images:          {report['illegible']}")
    print(f" - Rejected Images:           {report['rejected']}")
    print(f" - Unreviewed Images:         {report['unreviewed']}")
    print(f" - Verified Transcriptions:   {report['verified_visual_transcriptions']}")
    print(f" - Verified Medicine Labels:  {report['verified_medicine_labels']}")
    print(f" - Required Minimum for Train: {min_verified}\n")

    # ==================== STRICT GATEKEEPER ====================
    if report['verified'] < min_verified:
        print("----------------------------------------------------------------------")
        print("Insufficient verified training data.")
        print("Continue annotation before production fine-tuning.")
        print("----------------------------------------------------------------------\n")
        return {
            "status": "BLOCKED",
            "message": "Insufficient verified training data. Continue annotation before production fine-tuning.",
            "report": report
        }

    # If verified threshold is satisfied:
    print(f"[Training] Verification gate PASSED ({report['verified']} >= {min_verified}). Splitting dataset...")
    train_recs, val_recs, test_recs = mgr.get_training_splits(min_verified=min_verified)
    
    processor, model = get_trocr_model()
    device = get_device()
    
    train_dataset = VerifiedPrescriptionDataset(train_recs, processor)
    val_dataset = VerifiedPrescriptionDataset(val_recs, processor)
    test_dataset = VerifiedPrescriptionDataset(test_recs, processor)
    
    if len(train_dataset) == 0:
        print("No verified line regions found in verified documents.")
        return {"status": "BLOCKED", "message": "No verified line regions available"}
        
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr)
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"[Training] Beginning {epochs} fine-tuning epochs on {device}...")
    model.train()
    
    for epoch in range(epochs):
        epoch_loss = 0.0
        for batch in train_loader:
            optimizer.zero_grad()
            pixel_values = batch["pixel_values"].to(device)
            labels = batch["labels"].to(device)
            
            outputs = model(pixel_values=pixel_values, labels=labels)
            loss = outputs.loss
            loss.backward()
            optimizer.step()
            
            epoch_loss += loss.item()
            
        avg_loss = epoch_loss / len(train_loader)
        print(f"Epoch {epoch+1}/{epochs} - Loss: {avg_loss:.4f}")
        
    # Save checkpoint
    model.save_pretrained(output_dir)
    processor.save_pretrained(output_dir)
    print(f"[Training] Saved fine-tuned checkpoint to {output_dir}")
    
    return {
        "status": "COMPLETED",
        "checkpoint": output_dir,
        "epochs": epochs,
        "verified_samples_used": len(train_dataset)
    }

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Supervised TrOCR Prescription Fine-Tuning")
    parser.add_argument("--min-verified", type=int, default=20, help="Minimum human-verified samples required")
    parser.add_argument("--epochs", type=int, default=3, help="Training epochs")
    parser.add_argument("--batch-size", type=int, default=2, help="Batch size")
    args = parser.parse_args()
    
    run_fine_tuning(min_verified=args.min_verified, epochs=args.epochs, batch_size=args.batch_size)
