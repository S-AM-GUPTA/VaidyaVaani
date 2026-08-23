import os
import json
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime

from .schema import (
    PrescriptionAnnotation, 
    RegionGroundTruth, 
    MedicineGroundTruth, 
    OCREngineProposal, 
    VerificationStatus,
    AnnotationPriority,
    ReviewerConfidence
)
from .prioritization import calculate_region_priority, enrich_annotations_with_priorities
from .exporter import export_verified_ground_truth
from evaluation.dataset_loader import KagglePrescriptionDataset

ANNOTATIONS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'annotations'))
DB_FILE = os.path.join(ANNOTATIONS_DIR, 'annotations_db.json')

class AnnotationManager:
    """
    Manages human-verified ground-truth annotations for Kaggle prescription images.
    Ensures strict separation between machine proposals and human-verified training data.
    """
    def __init__(self):
        os.makedirs(ANNOTATIONS_DIR, exist_ok=True)
        self.dataset = KagglePrescriptionDataset()
        self.annotations: Dict[str, Dict[str, Any]] = self._load_db()
        self._sync_with_dataset()
        self._enrich_and_save()

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

    def _enrich_and_save(self):
        """
        Calculates annotation priorities across all regions without changing unreviewed status.
        """
        self.annotations = enrich_annotations_with_priorities(self.annotations)
        self._save_db()

    def get_all_items(self, priority_filter: Optional[str] = None, status_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Returns list of all images with review status, region counts, and priority tags for UI filters.
        """
        items = []
        for img_id in sorted(self.annotations.keys(), key=lambda x: int(x) if x.isdigit() else x):
            record = self.annotations[img_id]
            regions = record.get("regions", [])
            verified_regions = sum(1 for r in regions if r.get("status") == VerificationStatus.VERIFIED.value)
            
            priorities = [r.get("annotation_priority", "DISAGREEMENT") for r in regions]
            
            # Filter checks if provided
            if priority_filter and priority_filter != "ALL":
                if priority_filter not in priorities:
                    continue
                    
            if status_filter and status_filter != "ALL":
                if status_filter == "UNREVIEWED" and record.get("overall_status") != "UNREVIEWED":
                    continue
                elif status_filter != "UNREVIEWED" and record.get("overall_status") != status_filter:
                    continue

            items.append({
                "image_id": img_id,
                "filename": record.get("filename"),
                "file_path": record.get("image_path"),
                "overall_status": record.get("overall_status", VerificationStatus.UNREVIEWED.value),
                "annotator": record.get("annotator"),
                "reviewed_at": record.get("reviewed_at"),
                "total_regions": len(regions),
                "verified_regions": verified_regions,
                "priorities": priorities
            })
        return items

    def get_item(self, image_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves full annotation record for a specific image.
        """
        return self.annotations.get(image_id)

    def save_item(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Saves human-reviewed ground truth annotation.
        Preserves distinction between visual transcription and normalized medicine.
        """
        img_id = str(data.get("image_id"))
        if not img_id:
            raise ValueError("Missing image_id")
            
        data["reviewed_at"] = datetime.now().isoformat()
        
        # Calculate overall status if not explicitly set
        regions = data.get("regions", [])
        statuses = [r.get("status", VerificationStatus.UNREVIEWED.value) for r in regions]
        
        if all(s == VerificationStatus.VERIFIED.value for s in statuses) and len(statuses) > 0:
            data["overall_status"] = VerificationStatus.VERIFIED.value
        elif any(s == VerificationStatus.VERIFIED.value for s in statuses):
            data["overall_status"] = VerificationStatus.IN_REVIEW.value
        elif all(s == VerificationStatus.ILLEGIBLE.value for s in statuses) and len(statuses) > 0:
            data["overall_status"] = VerificationStatus.ILLEGIBLE.value
        elif all(s == VerificationStatus.REJECTED.value for s in statuses) and len(statuses) > 0:
            data["overall_status"] = VerificationStatus.REJECTED.value
            
        # Re-calculate priorities on any added/updated regions
        for reg in regions:
            proposals = reg.get("raw_ocr", [])
            reg["annotation_priority"] = calculate_region_priority(proposals).value
            
        self.annotations[img_id] = data
        self._save_db()
        print(f"[AnnotationManager] Saved human annotation for image {img_id} (Status: {data.get('overall_status')})")
        return self.annotations[img_id]

    def get_next_difficult_item(self, current_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Finds the next unreviewed prescription with unresolved difficult regions.
        Priority hierarchy: DISAGREEMENT -> PARTIAL_AGREEMENT -> NO_USEFUL_OUTPUT -> HIGH_AGREEMENT.
        """
        curr_num = int(current_id) if (current_id and current_id.isdigit()) else 0
        
        priority_order = [
            AnnotationPriority.DISAGREEMENT.value,
            AnnotationPriority.PARTIAL_AGREEMENT.value,
            AnnotationPriority.NO_USEFUL_OUTPUT.value,
            AnnotationPriority.HIGH_AGREEMENT.value
        ]
        
        for prio in priority_order:
            # 1. Search after currentId
            for img_id in sorted(self.annotations.keys(), key=lambda x: int(x) if x.isdigit() else x):
                if int(img_id) <= curr_num:
                    continue
                record = self.annotations[img_id]
                if record.get("overall_status") in [VerificationStatus.UNREVIEWED.value, VerificationStatus.IN_REVIEW.value]:
                    for r in record.get("regions", []):
                        if r.get("status") == VerificationStatus.UNREVIEWED.value and r.get("annotation_priority") == prio:
                            return record
                            
            # 2. Search wrapped around from beginning
            for img_id in sorted(self.annotations.keys(), key=lambda x: int(x) if x.isdigit() else x):
                record = self.annotations[img_id]
                if record.get("overall_status") in [VerificationStatus.UNREVIEWED.value, VerificationStatus.IN_REVIEW.value]:
                    for r in record.get("regions", []):
                        if r.get("status") == VerificationStatus.UNREVIEWED.value and r.get("annotation_priority") == prio:
                            return record
                            
        # Fallback: any unreviewed
        for img_id in sorted(self.annotations.keys(), key=lambda x: int(x) if x.isdigit() else x):
            record = self.annotations[img_id]
            if record.get("overall_status") == VerificationStatus.UNREVIEWED.value:
                return record
                
        return None

    def export_dataset(self) -> Dict[str, Any]:
        """
        Exports only verified annotations into the ground truth dataset directory.
        """
        return export_verified_ground_truth(self.annotations)

    def get_quality_report(self) -> Dict[str, Any]:
        """
        Computes dynamic dataset statistics directly from annotations DB.
        """
        total_prescriptions = len(self.annotations)
        total_regions = 0
        
        region_status_counts = {
            VerificationStatus.VERIFIED.value: 0,
            VerificationStatus.UNCERTAIN.value: 0,
            VerificationStatus.ILLEGIBLE.value: 0,
            VerificationStatus.REJECTED.value: 0,
            VerificationStatus.UNREVIEWED.value: 0
        }
        
        priority_counts = {
            AnnotationPriority.HIGH_AGREEMENT.value: 0,
            AnnotationPriority.PARTIAL_AGREEMENT.value: 0,
            AnnotationPriority.DISAGREEMENT.value: 0,
            AnnotationPriority.NO_USEFUL_OUTPUT.value: 0
        }
        
        reviewer_confidence_counts = {
            ReviewerConfidence.HIGH.value: 0,
            ReviewerConfidence.MEDIUM.value: 0,
            ReviewerConfidence.LOW.value: 0
        }
        
        medicine_labels_available = 0
        structured_regimen_labels_available = 0
        context_used_count = 0
        
        for record in self.annotations.values():
            for reg in record.get("regions", []):
                total_regions += 1
                st = reg.get("status", VerificationStatus.UNREVIEWED.value)
                region_status_counts[st] = region_status_counts.get(st, 0) + 1
                
                prio = reg.get("annotation_priority", AnnotationPriority.DISAGREEMENT.value)
                priority_counts[prio] = priority_counts.get(prio, 0) + 1
                
                if st == VerificationStatus.VERIFIED.value:
                    if reg.get("normalized_medicine") or (reg.get("medicine") and reg.get("medicine", {}).get("name")):
                        medicine_labels_available += 1
                    
                    has_regimen = any([
                        reg.get("strength"),
                        reg.get("dosage_form"),
                        reg.get("frequency"),
                        reg.get("timing"),
                        reg.get("duration")
                    ])
                    if has_regimen:
                        structured_regimen_labels_available += 1
                        
                    if reg.get("context_used"):
                        context_used_count += 1
                        
                    conf = reg.get("reviewer_confidence", "HIGH")
                    reviewer_confidence_counts[conf] = reviewer_confidence_counts.get(conf, 0) + 1
                    
        verified_count = region_status_counts[VerificationStatus.VERIFIED.value]
        reviewed_regions = total_regions - region_status_counts[VerificationStatus.UNREVIEWED.value]
        verification_rate = round(verified_count / max(1, total_regions) * 100, 2)
        context_used_pct = round(context_used_count / max(1, verified_count) * 100, 2) if verified_count > 0 else 0.0
        
        return {
            "total_prescriptions": total_prescriptions,
            "total_regions": total_regions,
            "reviewed_regions": reviewed_regions,
            "verified": verified_count,
            "uncertain": region_status_counts[VerificationStatus.UNCERTAIN.value],
            "illegible": region_status_counts[VerificationStatus.ILLEGIBLE.value],
            "rejected": region_status_counts[VerificationStatus.REJECTED.value],
            "remaining_unreviewed": region_status_counts[VerificationStatus.UNREVIEWED.value],
            "priority_breakdown": {
                "high_agreement": priority_counts[AnnotationPriority.HIGH_AGREEMENT.value],
                "partial_agreement": priority_counts[AnnotationPriority.PARTIAL_AGREEMENT.value],
                "disagreement": priority_counts[AnnotationPriority.DISAGREEMENT.value],
                "no_useful_output": priority_counts[AnnotationPriority.NO_USEFUL_OUTPUT.value]
            },
            "verification_rate_percent": verification_rate,
            "medicine_labels_available": medicine_labels_available,
            "structured_regimen_labels_available": structured_regimen_labels_available,
            "context_used_percentage": context_used_pct,
            "reviewer_confidence_distribution": reviewer_confidence_counts,
            "training_gate": {
                "training_eligible": verified_count >= 20,
                "min_required_verified_regions": 20,
                "verified_count": verified_count,
                "message": "Only human-verified VaidyaVaani annotations count toward unlocking domain adaptation."
            }
        }

_manager_instance: Optional[AnnotationManager] = None

def get_annotation_manager() -> AnnotationManager:
    global _manager_instance
    if _manager_instance is None:
        _manager_instance = AnnotationManager()
    return _manager_instance
