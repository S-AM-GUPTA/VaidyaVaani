import unittest
import os
import sys
import numpy as np
import cv2

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import process_prescription_pipeline
from preprocessing.image_processor import generate_variants
from medical.prescription_parser import parse_prescription_line

class TestOCRPipeline(unittest.TestCase):

    def setUp(self):
        # Create a clean test image with simulated prescription lines
        self.test_img_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'temp_test_rx.jpg'))
        img = np.ones((400, 700, 3), dtype=np.uint8) * 255
        cv2.putText(img, "Rx:", (30, 60), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 0), 2)
        cv2.putText(img, "Tab Dolo 650 1-0-1 x 5 days", (30, 130), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2)
        cv2.putText(img, "Tab Pantocid 40 1-0-0 AC", (30, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2)
        cv2.putText(img, "Cap Augmentin 625 1-0-1 PC", (30, 270), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2)
        cv2.imwrite(self.test_img_path, img)

    def tearDown(self):
        if os.path.exists(self.test_img_path):
            try:
                os.remove(self.test_img_path)
            except Exception:
                pass

    def test_image_preprocessing_variants(self):
        img = cv2.imread(self.test_img_path)
        variants = generate_variants(img)
        self.assertIn('original', variants)
        self.assertIn('grayscale', variants)
        self.assertIn('clahe', variants)
        self.assertIn('denoised', variants)
        self.assertIn('threshold', variants)

    def test_pipeline_execution(self):
        result = process_prescription_pipeline(self.test_img_path, is_pdf=False)
        self.assertTrue(result["success"])
        self.assertIn("prescription", result)
        self.assertIn("medicines", result["prescription"])
        
        medicines = result["prescription"]["medicines"]
        self.assertGreaterEqual(len(medicines), 1)
        
        # Verify detected medicine fields
        med_names = [m["name"] for m in medicines]
        generic_names = [m["generic_name"] for m in medicines]
        
        print(f"[Pipeline Test] Detected medicines: {med_names}")
        print(f"[Pipeline Test] Detected generics: {generic_names}")
        
        # Dolo or Pantocid or Augmentin should be present
        has_expected_med = any("Paracetamol" in g or "Pantoprazole" in g or "Amoxicillin" in g for g in generic_names)
        self.assertTrue(has_expected_med)
        self.assertIn("overall_confidence", result)

if __name__ == '__main__':
    unittest.main()
