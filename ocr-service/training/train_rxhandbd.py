import os
import sys
import argparse
import time
import json
from typing import Dict, Any, List, Tuple
import torch
from torch.utils.data import DataLoader
from transformers import TrOCRProcessor, VisionEncoderDecoderModel, get_linear_schedule_with_warmup

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from training.datasets.rxhandbd import RxHandBDDataset
from training.finetune_trocr import compute_cer_wer
from models.trocr_model import get_device

def train_rxhandbd(
    model_name: str = "microsoft/trocr-base-handwritten",
    epochs: int = 1,
    batch_size: int = 4,
    learning_rate: float = 5e-5,
    weight_decay: float = 0.01,
    warmup_steps: int = 10,
    max_target_length: int = 24,
    max_train_samples: int = 40,
    output_dir: str = "models/rxhandbd/checkpoints",
    best_dir: str = "models/rxhandbd/best",
    seed: int = 42
):
    print("===================================================================", flush=True)
    print("  Supervised TrOCR Fine-Tuning on RxHandBD Medical Words", flush=True)
    print("===================================================================\n", flush=True)
    
    torch.manual_seed(seed)
    device_str = get_device()
    device = torch.device(device_str)
    print(f"Hardware Compute Device: {device_str.upper()}", flush=True)
    
    # 1. Load Pretrained Processor & Model
    print(f"[1/5] Loading pretrained processor and model: {model_name}...", flush=True)
    processor = TrOCRProcessor.from_pretrained(model_name)
    model = VisionEncoderDecoderModel.from_pretrained(model_name)
    
    # Set model decoder configurations cleanly without invalid generation parameters
    model.config.decoder_start_token_id = processor.tokenizer.cls_token_id
    model.config.pad_token_id = processor.tokenizer.pad_token_id
    model.config.vocab_size = model.config.decoder.vocab_size
    model.config.eos_token_id = processor.tokenizer.sep_token_id
    model.config.max_length = max_target_length
    model.config.early_stopping = False
    
    model.to(device)
    
    # 2. Prepare Datasets & Dataloaders
    print(f"[2/5] Preparing RxHandBD Train and Validation Datasets...", flush=True)
    train_limit = max_train_samples if max_train_samples > 0 else None
    val_limit = max(5, int(max_train_samples * 0.2)) if max_train_samples > 0 else None
    
    train_dataset = RxHandBDDataset(split="train", processor=processor, max_target_length=max_target_length, max_samples=train_limit)
    val_dataset = RxHandBDDataset(split="val", processor=processor, max_target_length=max_target_length, max_samples=val_limit)
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    
    total_steps = len(train_loader) * epochs
    optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate, weight_decay=weight_decay)
    scheduler = get_linear_schedule_with_warmup(optimizer, num_warmup_steps=warmup_steps, num_training_steps=total_steps)
    
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(best_dir, exist_ok=True)
    
    print(f"\n[3/5] Starting Training: {epochs} epochs | {len(train_dataset)} train samples | {len(val_dataset)} val samples...", flush=True)
    t_start = time.time()
    
    best_val_cer = 999.0
    training_history = []
    
    for epoch in range(epochs):
        model.train()
        epoch_loss = 0.0
        step_count = 0
        
        for batch_idx, batch in enumerate(train_loader):
            optimizer.zero_grad()
            pixel_values = batch["pixel_values"].to(device)
            labels = batch["labels"].to(device)
            
            outputs = model(pixel_values=pixel_values, labels=labels)
            loss = outputs.loss
            loss.backward()
            
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            scheduler.step()
            
            epoch_loss += loss.item()
            step_count += 1
            
            if (batch_idx + 1) % max(1, len(train_loader) // 4) == 0 or (batch_idx + 1) == len(train_loader):
                print(f"  Epoch {epoch+1}/{epochs} [{batch_idx+1}/{len(train_loader)}] - Batch Loss: {loss.item():.4f}", flush=True)
                
        avg_train_loss = epoch_loss / max(1, step_count)
        
        # Fast Validation Evaluation
        model.eval()
        val_loss = 0.0
        val_preds = []
        val_refs = []
        
        with torch.no_grad():
            for val_batch in val_loader:
                v_pixel_values = val_batch["pixel_values"].to(device)
                v_labels = val_batch["labels"].to(device)
                
                v_outputs = model(pixel_values=v_pixel_values, labels=v_labels)
                val_loss += v_outputs.loss.item()
                
                generated_ids = model.generate(v_pixel_values, max_new_tokens=max_target_length)
                generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)
                
                val_preds.extend(generated_text)
                val_refs.extend(val_batch["text"])
                
        avg_val_loss = val_loss / max(1, len(val_loader))
        val_cer, val_wer = compute_cer_wer(val_preds, val_refs)
        
        print(f"\n>> Epoch {epoch+1} Complete: Train Loss: {avg_train_loss:.4f} | Val Loss: {avg_val_loss:.4f} | Val CER: {val_cer}% | Val WER: {val_wer}%\n", flush=True)
        
        record = {
            "epoch": epoch + 1,
            "train_loss": round(avg_train_loss, 4),
            "val_loss": round(avg_val_loss, 4),
            "val_cer": val_cer,
            "val_wer": val_wer
        }
        training_history.append(record)
        
        # Save Best Checkpoint
        if val_cer <= best_val_cer or epoch == (epochs - 1):
            best_val_cer = min(best_val_cer, val_cer)
            print(f"[*] Saving model checkpoint to {best_dir}...", flush=True)
            model.save_pretrained(best_dir)
            processor.save_pretrained(best_dir)
            
    total_time = round(time.time() - t_start, 2)
    
    # Save training metadata
    metadata = {
        "model_version": "trocr-rxhandbd-v1",
        "base_model": model_name,
        "dataset": "RxHandBD",
        "device": device_str,
        "epochs": epochs,
        "batch_size": batch_size,
        "learning_rate": learning_rate,
        "training_samples_used": len(train_dataset),
        "validation_samples_used": len(val_dataset),
        "total_training_time_seconds": total_time,
        "best_validation_cer": best_val_cer,
        "history": training_history
    }
    
    with open(os.path.join(best_dir, "metadata.json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
        
    print(f"\n[4/5] Training Complete in {total_time}s. Best Validation CER: {best_val_cer}%", flush=True)
    print(f"[5/5] Checkpoint saved at: {best_dir}", flush=True)
    print("===================================================================\n", flush=True)
    return metadata

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Train TrOCR on RxHandBD")
    parser.add_argument("--model", type=str, default="microsoft/trocr-base-handwritten")
    parser.add_argument("--epochs", type=int, default=1)
    parser.add_argument("--batch-size", type=int, default=4)
    parser.add_argument("--learning-rate", type=float, default=5e-5)
    parser.add_argument("--max-train-samples", type=int, default=40, help="Subset for fast experimentation")
    parser.add_argument("--output-dir", type=str, default="models/rxhandbd/checkpoints")
    parser.add_argument("--best-dir", type=str, default="models/rxhandbd/best")
    args = parser.parse_args()
    
    train_rxhandbd(
        model_name=args.model,
        epochs=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.learning_rate,
        max_train_samples=args.max_train_samples,
        output_dir=args.output_dir,
        best_dir=args.best_dir
    )
