import os
import json
import glob
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime

from .schema import (
    PrescriptionAnnotation, 
    RegionGroundTruth, 
    MedicineGroundTruth, 
    OCREngineProposal, 
    VerificationStatus
)
from evaluation.dataset_loader import KagglePrescriptionDataset
from preprocessing.image_processor import load_image

ANNOTATIONS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'annotations'))
DB_FILE = os.path.join(ANNOTATIONS_DIR, 'annotations_db.json')

class AnnotationManager:
    """
    Manages human-verified ground-truth annotations for Kaggle prescription images.
    Ensures strict separation between raw pseudo-labels and human-verified training data.
    """
    def __init__(self):
        os.makedirs(ANNOTATIONS_DIR, exist_ok=True)
        self.dataset = KagglePrescriptionDataset()
        self.annotations: Dict[str, Dict[str, Any]] = self._load_db()
        self._sync_with_dataset()

    def _load_db(self) -> Dict[str, Dict[str, Any]]:
        if os.path.exists(DB_FILE):
            try:
                with open(DB_FILE, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"[AnnotationManager] Error reading annotations DB: {e}")
        return {}

    def _save_db(self):
        try:
            with open(DB_FILE, 'w', encoding='utf-8') as f:
                json.dump(self.annotations, f, indent=2)
        except Exception as e:
            print(f"[AnnotationManager] Error saving annotations DB: {e}")

    def _sync_with_dataset(self):
        """
        Ensures all 129 dataset images have an initial entry in the database.
        """
        updated = False
        for item in self.dataset:
            img_id = str(item["index"] + 1)
            filename = item["filename"]
            file_path = item["file_path"]
            
            if img_id not in self.annotations:
                self.annotations[img_id] = {
                    "image_id": img_id,
                    "filename": filename,
                    "image_path": file_path,
                    "overall_status": VerificationStatus.UNREVIEWED.value,
                    "annotator": None,
                    "reviewed_at": None,
                    "regions": [],
                    "general_notes": None
                }
                updated = True
                
        if updated:
            self._save_db()

    def get_all_items(self) -> List[Dict[str, Any]]:
        """
        Returns list of all images with review status for UI list / selector.
        """
        items = []
        for img_id in sorted(self.annotations.keys(), key=lambda x: int(x) if x.isdigit() else x):
            record = self.annotations[img_id]
            regions = record.get("regions", [])
            verified_regions = sum(1 for r in regions if r.get("status") == VerificationStatus.VERIFIED.value)
            
            items.append({
                "image_id": img_id,
                "filename": record.get("filename"),
                "file_path": record.get("image_path"),
                "overall_status": record.get("overall_status", VerificationStatus.UNREVIEWED.value),
                "annotator": record.get("annotator"),
                "reviewed_at": record.get("reviewed_at"),
                "total_regions": len(regions),
                "verified_regions": verified_regions
            })
        return items

    def get_item(self, image_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves annotation record for a specific image.
        If regions are empty and unreviewed, generates initial OCR proposals.
        """
        if image_id not in self.annotations:
            return None
            
        record = self.annotations[image_id]
        
        # If no regions yet generated, run lightweight candidate extraction for reviewer guidance
        if not record.get("regions") and record.get("overall_status") == VerificationStatus.UNREVIEWED.value:
            try:
                from main import process_prescription_pipeline
                file_path = record.get("image_path")
                if file_path and os.path.exists(file_path):
                    ocr_res = process_prescription_pipeline(file_path, is_pdf=False)
                    extracted_lines = ocr_res.get("extracted_lines", [])
                    medicines = ocr_res.get("prescription", {}).get("medicines", [])
                    
                    regions = []
                    for idx, line in enumerate(extracted_lines):
                        text = line.get("text", "")
                        engine = line.get("engine", "ocr")
                        conf = float(line.get("confidence", 0.8))
                        box = line.get("box")
                        
                        # Find corresponding candidate medicine if any
                        matched_med = next((m for m in medicines if m.get("name", "").lower() in text.lower() or text.lower() in m.get("name", "").lower()), None)
                        
                        med_gt = None
                        if matched_med:
                            med_gt = {
                                "name": matched_med.get("name"),
                                "generic_name": matched_med.get("generic_name"),
                                "strength": matched_med.get("strength"),
                                "dosage": matched_med.get("dosage"),
                                "frequency": matched_med.get("frequency"),
                                "timing": matched_med.get("timing"),
                                "duration": matched_med.get("duration"),
                                "verification_status": VerificationStatus.UNREVIEWED.value
                            }
                            
                        regions.append({
                            "region_id": f"reg_{idx+1}",
                            "bbox": box,
                            "raw_ocr": [
                                {
                                    "engine": engine,
                                    "text": text,
                                    "confidence": conf
                                }
                            ],
                            "visual_transcription": text,  # Initial proposal
                            "medicine": med_gt,
                            "context_used": "Pre-populated from initial OCR proposal",
                            "status": VerificationStatus.UNREVIEWED.value,
                            "notes": None
                        })
                        
                    record["regions"] = regions
                    self._save_db()
            except Exception as e:
                print(f"[AnnotationManager] Could not generate initial proposals for image {image_id}: {e}")
                
        return record

    def save_item(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Saves human-reviewed ground truth annotation.
        """
        img_id = str(data.get("image_id"))
        if not img_id:
            raise ValueError("Missing image_id")
            
        data["reviewed_at"] = datetime.now().isoformat()
        self.annotations[img_id] = data
        self._save_db()
        print(f"[AnnotationManager] Saved verified ground truth for image {img_id} (Status: {data.get('overall_status')})")
        return self.annotations[img_id]

    def get_quality_report(self) -> Dict[str, Any]:
        """
        Computes exact ground-truth quality metrics directly from annotations DB.
        """
        total_images = len(self.annotations)
        status_counts = {
            VerificationStatus.VERIFIED.value: 0,
            VerificationStatus.UNCERTAIN.value: 0,
            VerificationStatus.ILLEGIBLE.value: 0,
            VerificationStatus.REJECTED.value: 0,
            VerificationStatus.IN_REVIEW.value: 0,
            VerificationStatus.UNREVIEWED.value: 0
        }
        
        total_visual_transcriptions = 0
        total_medicine_labels = 0
        confidences = []
        
        for record in self.annotations.values():
            st = record.get("overall_status", VerificationStatus.UNREVIEWED.value)
            status_counts[st] = status_counts.get(st, 0) + 1
            
            for reg in record.get("regions", []):
                if reg.get("visual_transcription") and reg.get("status") == VerificationStatus.VERIFIED.value:
                    total_visual_transcriptions += 1
                if reg.get("medicine") and reg.get("medicine", {}).get("name") and reg.get("status") == VerificationStatus.VERIFIED.value:
                    total_medicine_labels += 1
                for ocr in reg.get("raw_ocr", []):
                    confidences.append(float(ocr.get("confidence", 0.8)))
                    
        avg_confidence = round(sum(confidences) / len(confidences) * 100, 2) if confidences else 0.0
        
        verified_count = status_counts[VerificationStatus.VERIFIED.value]
        
        return {
            "total_images": total_images,
            "verified": verified_count,
            "uncertain": status_counts[VerificationStatus.UNCERTAIN.value],
            "illegible": status_counts[VerificationStatus.ILLEGIBLE.value],
            "rejected": status_counts[VerificationStatus.REJECTED.value],
            "in_review": status_counts[VerificationStatus.IN_REVIEW.value],
            "unreviewed": status_counts[VerificationStatus.UNREVIEWED.value],
            "verified_visual_transcriptions": total_visual_transcriptions,
            "verified_medicine_labels": total_medicine_labels,
            "average_annotation_confidence": avg_confidence,
            "training_eligible": verified_count >= 20,
            "min_required_for_training": 20
        }

    def get_training_splits(self, train_ratio: float = 0.8, val_ratio: float = 0.1, min_verified: int = 20) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], List[Dict[str, Any]]]:
        """
        Returns verified ground truth splits without prescription leakage.
        Blocks training if fewer than min_verified verified samples exist.
        """
        verified_records = [
            r for r in self.annotations.values() 
            if r.get("overall_status") == VerificationStatus.VERIFIED.value
        ]
        
        if len(verified_records) < min_verified:
            raise ValueError(
                "Insufficient verified training data. Continue annotation before production fine-tuning."
            )
            
        import random
        rng = random.Random(42)
        shuffled = list(verified_records)
        rng.shuffle(shuffled)
        
        n_total = len(shuffled)
        n_train = int(n_total * train_ratio)
        n_val = int(n_total * val_ratio)
        
        train_split = shuffled[:n_train]
        val_split = shuffled[n_train:n_train + n_val]
        test_split = shuffled[n_train + n_val:]
        
        return train_split, val_split, test_split

_manager_instance: Optional[AnnotationManager] = None

def get_annotation_manager() -> AnnotationManager:
    global _manager_instance
    if _manager_instance is None:
        _manager_instance = AnnotationManager()
    return _manager_instance
