import os
import json
from typing import Dict, Any, List, Optional
from .dataset_loader import KagglePrescriptionDataset
from main import process_prescription_pipeline

def generate_pseudo_annotations(
    dataset: Optional[KagglePrescriptionDataset] = None,
    max_images: int = 50,
    output_path: str = "kaggle_annotations.json"
) -> Dict[str, Any]:
    """
    Generates structured pseudo-labels from real Kaggle prescription slips
    for semi-supervised fine-tuning dataset preparation.
    """
    ds = dataset or KagglePrescriptionDataset()
    count = min(len(ds), max_images) if max_images > 0 else len(ds)
    
    print(f"[PseudoLabeler] Generating pseudo-annotations for {count} prescriptions...")
    
    annotations = []
    
    for i in range(count):
        item = ds[i]
        file_path = item["file_path"]
        filename = item["filename"]
        
        try:
            rx_res = process_prescription_pipeline(file_path, is_pdf=False)
            lines = rx_res.get("extracted_lines", [])
            meds = rx_res.get("prescription", {}).get("medicines", [])
            
            annotation_record = {
                "id": f"kaggle_rx_{i+1}",
                "filename": filename,
                "file_path": file_path,
                "overall_confidence": rx_res.get("overall_confidence", 0.0),
                "needs_verification": rx_res.get("needs_verification", True),
                "lines": [
                    {
                        "text": l.get("text"),
                        "confidence": l.get("confidence"),
                        "box": l.get("box"),
                        "engine": l.get("engine")
                    }
                    for l in lines
                ],
                "medicines": meds
            }
            annotations.append(annotation_record)
        except Exception as e:
            print(f"[PseudoLabeler] Failed on {filename}: {e}")
            
    result = {
        "dataset": "mehaksingal/illegible-medical-prescription-images-dataset",
        "total_annotated": len(annotations),
        "annotations": annotations
    }
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)
        
    print(f"[PseudoLabeler] Successfully exported {len(annotations)} annotations to {output_path}")
    return result
