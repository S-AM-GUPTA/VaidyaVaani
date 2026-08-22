import unittest
import os
import sys

# Add parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from medical.abbreviations import normalize_frequency, normalize_timing, extract_duration
from medical.medicine_matcher import match_medicine
from medical.prescription_parser import parse_prescription_line, parse_prescription_document
from confidence.scorer import calculate_overall_confidence

class TestMedicalParser(unittest.TestCase):

    def test_frequency_normalization(self):
        self.assertEqual(normalize_frequency("1-0-1")[0], "twice daily (morning & night)")
        self.assertEqual(normalize_frequency("1-1-1")[0], "three times daily (morning, afternoon & night)")
        self.assertEqual(normalize_frequency("0-0-1")[0], "once daily (night)")
        self.assertEqual(normalize_frequency("BD")[0], "twice daily")
        self.assertEqual(normalize_frequency("TDS")[0], "three times daily")
        self.assertEqual(normalize_frequency("OD")[0], "once daily")
        self.assertEqual(normalize_frequency("SOS")[0], "as needed (when required)")
        self.assertEqual(normalize_frequency("HS")[0], "at bedtime")

    def test_timing_normalization(self):
        self.assertEqual(normalize_timing("Tab Pantocid 40 AC"), "before food (empty stomach)")
        self.assertEqual(normalize_timing("Tab Dolo 650 PC"), "after food")
        self.assertEqual(normalize_timing("Take with meals"), "with meals")

    def test_duration_extraction(self):
        self.assertEqual(extract_duration("Tab Augmentin 625 x 5 days"), "5 days")
        self.assertEqual(extract_duration("x 7d"), "7 days")
        self.assertEqual(extract_duration("for 2 weeks"), "2 weeks")
        self.assertEqual(extract_duration("1 month"), "1 month")

    def test_medicine_fuzzy_matching(self):
        # Exact match
        matches = match_medicine("Dolo 650")
        self.assertTrue(len(matches) > 0)
        self.assertEqual(matches[0]["generic_name"], "Paracetamol")

        # Misspelled brand
        matches_typo = match_medicine("Amoxcillin 500")
        self.assertTrue(len(matches_typo) > 0)
        self.assertEqual(matches_typo[0]["generic_name"], "Amoxicillin")

        # Telema typo for Telma
        matches_telma = match_medicine("Telma 40")
        self.assertTrue(len(matches_telma) > 0)
        self.assertEqual(matches_telma[0]["generic_name"], "Telmisartan")

    def test_parse_prescription_line(self):
        line = "Tab Augmentin 625 1-0-1 x 5 days PC"
        parsed = parse_prescription_line(line, ocr_confidence=0.92)
        
        self.assertIsNotNone(parsed)
        self.assertIn("Augmentin", parsed["name"])
        self.assertEqual(parsed["generic_name"], "Amoxicillin + Clavulanic Acid")
        self.assertEqual(parsed["strength"], "625 mg")
        self.assertEqual(parsed["frequency"], "twice daily (morning & night)")
        self.assertEqual(parsed["duration"], "5 days")
        self.assertEqual(parsed["timing"], "after food")
        self.assertGreaterEqual(parsed["confidence"], 0.85)

    def test_confidence_scorer(self):
        meds = [
            {"name": "Dolo 650", "confidence": 0.95, "needs_verification": False},
            {"name": "Augmentin 625", "confidence": 0.91, "needs_verification": False}
        ]
        conf = calculate_overall_confidence(meds)
        self.assertGreaterEqual(conf["overall_confidence"], 0.90)
        self.assertEqual(conf["confidence_tier"], "HIGH")
        self.assertFalse(conf["needs_verification"])

        # Low confidence case
        uncertain_meds = [
            {"name": "UnknownMed", "confidence": 0.55, "needs_verification": True}
        ]
        conf_low = calculate_overall_confidence(uncertain_meds)
        self.assertTrue(conf_low["needs_verification"])
        self.assertEqual(conf_low["confidence_tier"], "LOW")

if __name__ == '__main__':
    unittest.main()
