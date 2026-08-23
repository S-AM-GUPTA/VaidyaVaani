import os
import json
import cv2
from typing import Dict, Any, List, Optional
from datetime import datetime

from .schema import VerificationStatus
from preprocessing.image_processor import load_image, crop_box

EXPORT_BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'datasets', 'vaidyavaani_verified'))

def export_verified_ground_truth(annotations_db: Dict[str, Dict[str, Any]], export_dir: str = EXPORT_BASE_DIR) -> Dict[str, Any]:
    """
    Exports ONLY human-verified (VERIFIED) annotations to data/datasets/vaidyavaani_verified/
    Strictly filters out UNREVIEWED, UNCERTAIN, ILLEGIBLE, and REJECTED regions.
    """
    images_dir = os.path.join(export_dir, 'images')
    os.makedirs(images_dir, exist_ok=True)
    jsonl_path = os.path.join(export_dir, 'annotations.jsonl')
    
    verified_samples: List[Dict[str, Any]] = []
    
    for item in annotations_db.values():
        img_id = str(item.get("image_id"))
        orig_img_path = item.get("image_path")
        reviewed_at = item.get("reviewed_at") or datetime.now().isoformat()
        
        full_img = None
        if os.path.exists(orig_img_path):
            full_img = load_image(orig_img_path)
            
        for reg in item.get("regions", []):
            status = reg.get("status")
            # STRICT FILTER: Only export VERIFIED annotations
            if status != VerificationStatus.VERIFIED.value:
                continue
                
            region_id = reg.get("region_id")
            bbox = reg.get("bbox")
            visual_transcription = reg.get("visual_transcription", "").strip()
            
            # Legacy fallback if structured fields not on root
            med = reg.get("medicine", {}) or {}
            normalized_medicine = reg.get("normalized_medicine") or med.get("name")
            strength = reg.get("strength") or med.get("strength")
            dosage_form = reg.get("dosage_form") or med.get("dosage")
            frequency = reg.get("frequency") or med.get("frequency")
            timing = reg.get("timing") or med.get("timing")
            duration = reg.get("duration") or med.get("duration")
            
            context_used = bool(reg.get("context_used", False))
            reviewer_confidence = reg.get("reviewer_confidence", "HIGH")
            
            crop_filename = f"crop_img_{img_id}_{region_id}.png"
            crop_path = os.path.join(images_dir, crop_filename)
            
            # Save cropped region image
            if full_img is not None and bbox:
                crop = crop_box(full_img, bbox)
                if crop is not None and crop.size > 0:
                    cv2.imwrite(crop_path, crop)
                    
            sample_record = {
                "image_id": img_id,
                "region_id": region_id,
                "image_path": crop_path if os.path.exists(crop_path) else orig_img_path,
                "original_image_path": orig_img_path,
                "region_bbox": bbox,
                "visual_transcription": visual_transcription,
                "normalized_medicine": normalized_medicine,
                "strength": strength,
                "dosage_form": dosage_form,
                "frequency": frequency,
                "timing": timing,
                "duration": duration,
                "context_used": context_used,
                "reviewer_confidence": reviewer_confidence,
                "verification_timestamp": reviewed_at
            }
            verified_samples.append(sample_record)
            
    # Write jsonl
    with open(jsonl_path, 'w', encoding='utf-8') as f:
        for sample in verified_samples:
            f.write(json.dumps(sample, ensure_ascii=False) + '\n')
            
    return {
        "success": True,
        "export_directory": export_dir,
        "jsonl_path": jsonl_path,
        "images_directory": images_dir,
        "total_verified_exported": len(verified_samples),
        "export_timestamp": datetime.now().isoformat()
    }
