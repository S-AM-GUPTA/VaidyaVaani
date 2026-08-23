import os
import sys
import json
import unittest
import tempfile
from pathlib import Path

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from annotation.schema import (
    AnnotationPriority,
    ReviewerConfidence,
    VerificationStatus,
    RegionGroundTruth,
    PrescriptionAnnotation,
    OCREngineProposal
)
from annotation.prioritization import clean_ocr_text, calculate_region_priority, enrich_annotations_with_priorities
from annotation.exporter import export_verified_ground_truth

class TestAnnotationPrioritization(unittest.TestCase):
    def test_clean_ocr_text(self):
        self.assertEqual(clean_ocr_text("  Paracetamol 500mg... "), "paracetamol 500mg")
        self.assertEqual(clean_ocr_text("Amoxi 500 ;"), "amoxi 500")
        self.assertEqual(clean_ocr_text(None), "")

    def test_high_agreement_priority(self):
        proposals = [
            {"engine": "paddleocr", "text": "Paracetamol 500mg"},
            {"engine": "pretrained_trocr", "text": "Paracetamol 500mg ."},
            {"engine": "rxhandbd_v1", "text": "Paracetamol 500mg"}
        ]
        prio = calculate_region_priority(proposals)
        self.assertEqual(prio, AnnotationPriority.HIGH_AGREEMENT)

    def test_partial_agreement_priority(self):
        proposals = [
            {"engine": "paddleocr", "text": "Amox 500"},
            {"engine": "pretrained_trocr", "text": "Amoxi 500"},
            {"engine": "rxhandbd_v1", "text": "Ciprofloxacin 500"}
        ]
        prio = calculate_region_priority(proposals)
        self.assertEqual(prio, AnnotationPriority.PARTIAL_AGREEMENT)

    def test_disagreement_priority(self):
        proposals = [
            {"engine": "paddleocr", "text": "Azithromycin 250"},
            {"engine": "pretrained_trocr", "text": "Pantoprazole 40"},
            {"engine": "rxhandbd_v1", "text": "Metformin 500"}
        ]
        prio = calculate_region_priority(proposals)
        self.assertEqual(prio, AnnotationPriority.DISAGREEMENT)

    def test_no_useful_output_priority(self):
        proposals = [
            {"engine": "paddleocr", "text": "."},
            {"engine": "pretrained_trocr", "text": " "},
            {"engine": "rxhandbd_v1", "text": ""}
        ]
        prio = calculate_region_priority(proposals)
        self.assertEqual(prio, AnnotationPriority.NO_USEFUL_OUTPUT)

    def test_export_filters_only_verified(self):
        mock_db = {
            "1": {
                "image_id": "1",
                "filename": "1.jpg",
                "image_path": "dummy.jpg",
                "overall_status": "IN_REVIEW",
                "reviewed_at": "2026-08-23T10:00:00",
                "regions": [
                    {
                        "region_id": "reg_1",
                        "status": "VERIFIED",
                        "visual_transcription": "Amoxi 500",
                        "normalized_medicine": "Amoxicillin",
                        "strength": "500mg",
                        "dosage_form": "Cap",
                        "frequency": "1-0-1",
                        "timing": "After food",
                        "duration": "5 days",
                        "context_used": False,
                        "reviewer_confidence": "HIGH",
                        "bbox": [10, 10, 100, 100]
                    },
                    {
                        "region_id": "reg_2",
                        "status": "UNREVIEWED",
                        "visual_transcription": "Unreviewed text",
                        "normalized_medicine": "Unreviewed",
                        "bbox": [20, 20, 100, 100]
                    },
                    {
                        "region_id": "reg_3",
                        "status": "ILLEGIBLE",
                        "visual_transcription": None,
                        "bbox": [30, 30, 100, 100]
                    }
                ]
            }
        }
        
        with tempfile.TemporaryDirectory() as tmp_dir:
            res = export_verified_ground_truth(mock_db, export_dir=tmp_dir)
            
            self.assertTrue(res["success"])
            self.assertEqual(res["total_verified_exported"], 1)
            
            jsonl_path = res["jsonl_path"]
            self.assertTrue(os.path.exists(jsonl_path))
            
            with open(jsonl_path, 'r', encoding='utf-8') as f:
                lines = [json.loads(line) for line in f]
                
            self.assertEqual(len(lines), 1)
            sample = lines[0]
            self.assertEqual(sample["image_id"], "1")
            self.assertEqual(sample["region_id"], "reg_1")
            self.assertEqual(sample["visual_transcription"], "Amoxi 500")
            self.assertEqual(sample["normalized_medicine"], "Amoxicillin")
            self.assertFalse(sample["context_used"])
            self.assertEqual(sample["reviewer_confidence"], "HIGH")

if __name__ == "__main__":
    unittest.main()
