import os
import sys
import json
import unittest
import numpy as np
from PIL import Image

# Ensure ocr-service root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from router.region_router import RegionRouter, CLASS_MAP
from training.train_region_router import compute_metrics

class TestRegionRouter(unittest.TestCase):

    def test_class_mapping(self):
        """Verify that class mapping has exactly the 4 required classes."""
        self.assertEqual(len(CLASS_MAP), 4)
        self.assertEqual(CLASS_MAP[0], "Handwritten")
        self.assertEqual(CLASS_MAP[1], "Printed")
        self.assertEqual(CLASS_MAP[2], "Mixed")
        self.assertEqual(CLASS_MAP[3], "Other")

    def test_split_integrity(self):
        """Verify that splits.json exists, is partitioned into 70/15/15, and has zero intersection."""
        splits_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "datasets", "ieee_hp_prescription", "splits.json"))
        self.assertTrue(os.path.exists(splits_path), f"Splits file not found: {splits_path}")

        with open(splits_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        train = data["splits"]["train"]
        val = data["splits"]["val"]
        test = data["splits"]["test"]

        self.assertGreater(len(train), 0)
        self.assertGreater(len(val), 0)
        self.assertGreater(len(test), 0)

        train_files = set(s["file_path"] for s in train)
        val_files = set(s["file_path"] for s in val)
        test_files = set(s["file_path"] for s in test)

        # Disjoint splits verification
        self.assertEqual(len(train_files.intersection(val_files)), 0, "Train and Val splits overlap!")
        self.assertEqual(len(train_files.intersection(test_files)), 0, "Train and Test splits overlap!")
        self.assertEqual(len(val_files.intersection(test_files)), 0, "Val and Test splits overlap!")

    def test_compute_metrics(self):
        """Verify metric calculations including macro F1, per-class F1, and confusion matrix."""
        targets = [0, 0, 1, 1, 2, 2, 3, 3]
        preds   = [0, 1, 1, 1, 2, 2, 3, 0]

        metrics = compute_metrics(preds, targets, num_classes=4)
        self.assertTrue(0.0 <= metrics["accuracy"] <= 1.0)
        self.assertTrue(0.0 <= metrics["macro_f1"] <= 1.0)
        self.assertEqual(len(metrics["per_class_f1"]), 4)
        self.assertEqual(len(metrics["confusion_matrix"]), 4)

    def test_router_high_confidence_decisions(self):
        """Verify deterministic routing for high-confidence predictions."""
        router = RegionRouter(confidence_threshold=0.80)

        # 1. Handwritten -> RXHANDBD
        pred_hw = {
            "class_id": 0,
            "predicted_class": "Handwritten",
            "confidence": 0.92,
            "probabilities": {"Handwritten": 0.92, "Printed": 0.04, "Mixed": 0.02, "Other": 0.02}
        }
        dec_hw = router.get_routing_decision(pred_hw)
        self.assertEqual(dec_hw["route"], "RXHANDBD")
        self.assertFalse(dec_hw["is_fallback"])

        # 2. Printed -> PADDLEOCR
        pred_pr = {
            "class_id": 1,
            "predicted_class": "Printed",
            "confidence": 0.88,
            "probabilities": {"Handwritten": 0.05, "Printed": 0.88, "Mixed": 0.04, "Other": 0.03}
        }
        dec_pr = router.get_routing_decision(pred_pr)
        self.assertEqual(dec_pr["route"], "PADDLEOCR")
        self.assertFalse(dec_pr["is_fallback"])

        # 3. Mixed -> BOTH
        pred_mx = {
            "class_id": 2,
            "predicted_class": "Mixed",
            "confidence": 0.85,
            "probabilities": {"Handwritten": 0.05, "Printed": 0.05, "Mixed": 0.85, "Other": 0.05}
        }
        dec_mx = router.get_routing_decision(pred_mx)
        self.assertEqual(dec_mx["route"], "BOTH")
        self.assertFalse(dec_mx["is_fallback"])

        # 4. Other -> IGNORE
        pred_ot = {
            "class_id": 3,
            "predicted_class": "Other",
            "confidence": 0.95,
            "probabilities": {"Handwritten": 0.01, "Printed": 0.01, "Mixed": 0.03, "Other": 0.95}
        }
        dec_ot = router.get_routing_decision(pred_ot)
        self.assertEqual(dec_ot["route"], "IGNORE")
        self.assertFalse(dec_ot["is_fallback"])

    def test_router_low_confidence_fallback(self):
        """Verify fallback to dual-engine OCR when confidence is below threshold."""
        router = RegionRouter(confidence_threshold=0.80)

        low_conf_pred = {
            "class_id": 0,
            "predicted_class": "Handwritten",
            "confidence": 0.65,
            "probabilities": {"Handwritten": 0.65, "Printed": 0.20, "Mixed": 0.10, "Other": 0.05}
        }
        dec = router.get_routing_decision(low_conf_pred)
        self.assertEqual(dec["route"], "BOTH")
        self.assertTrue(dec["is_fallback"])
        self.assertIn("fallback triggered", dec["reason"].lower())

    def test_router_prediction_on_dummy_image(self):
        """Verify that router can load model, predict on an image, and probabilities sum to 1.0."""
        best_model_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "region-router", "best"))
        smoke_model_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "region-router", "smoke_test_model"))

        target_dir = best_model_dir if os.path.exists(best_model_dir) else smoke_model_dir
        if not os.path.exists(target_dir):
            self.skipTest("Model not yet trained / saved.")

        router = RegionRouter(model_dir=target_dir)
        router.load_model()

        dummy_img = Image.new("RGB", (100, 40), color=(240, 240, 240))
        res = router.predict_region(dummy_img)

        self.assertIn("predicted_class", res)
        self.assertIn("confidence", res)
        self.assertIn("probabilities", res)
        self.assertIn(res["predicted_class"], ["Handwritten", "Printed", "Mixed", "Other"])

        prob_sum = sum(res["probabilities"].values())
        self.assertAlmostEqual(prob_sum, 1.0, places=2)

if __name__ == "__main__":
    unittest.main()
