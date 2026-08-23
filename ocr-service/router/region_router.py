import os
import sys
import numpy as np
from PIL import Image
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
from typing import Dict, Any, Union, Optional

CLASS_MAP = {
    0: "Handwritten",
    1: "Printed",
    2: "Mixed",
    3: "Other"
}

class RegionRouter:
    """
    VaidyaVaani 4-Class Region Router.
    Routes image patches to the optimal OCR engine or filters noise.
    
    Classes:
      0: Handwritten -> RxHandBD-v1 TrOCR
      1: Printed     -> PaddleOCR
      2: Mixed       -> BOTH (Dual-Engine resolution)
      3: Other       -> IGNORE (Filter out non-text/tables/lines)
    """

    def __init__(self, model_dir: Optional[str] = None, confidence_threshold: Optional[float] = None):
        self.enabled = os.getenv("REGION_ROUTER_ENABLED", "false").lower() in ("true", "1")
        self.confidence_threshold = confidence_threshold or float(os.getenv("ROUTER_CONFIDENCE_THRESHOLD", "0.80"))
        
        if model_dir is None:
            # Default model path
            default_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "region-router", "best"))
            self.model_dir = default_path
        else:
            self.model_dir = os.path.abspath(model_dir)

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = None
        self.processor = None
        self.is_loaded = False

    def load_model(self):
        """Loads the classifier model and processor lazily when needed."""
        if self.is_loaded:
            return

        if not os.path.exists(self.model_dir):
            raise FileNotFoundError(f"Region router model directory not found: {self.model_dir}")

        self.processor = AutoImageProcessor.from_pretrained(self.model_dir)
        self.model = AutoModelForImageClassification.from_pretrained(self.model_dir)
        self.model.to(self.device)
        self.model.eval()
        self.is_loaded = True

    def predict_region(self, image: Union[Image.Image, np.ndarray]) -> Dict[str, Any]:
        """
        Classifies a single image patch into 4 region categories.
        
        Returns:
            Dict containing predicted_class, confidence, and all class probabilities.
        """
        if not self.is_loaded:
            self.load_model()

        # Convert numpy array to PIL Image if necessary
        if isinstance(image, np.ndarray):
            if len(image.shape) == 2:
                image = Image.fromarray(image).convert("RGB")
            else:
                image = Image.fromarray(image)
        elif not isinstance(image, Image.Image):
            raise ValueError(f"Unsupported image type: {type(image)}")

        if image.mode != "RGB":
            image = image.convert("RGB")

        inputs = self.processor(images=image, return_tensors="pt")
        pixel_values = inputs["pixel_values"].to(self.device)

        with torch.no_grad():
            outputs = self.model(pixel_values=pixel_values)
            logits = outputs.logits
            probs = torch.softmax(logits, dim=-1).squeeze(0).cpu().numpy()

        class_id = int(np.argmax(probs))
        confidence = float(probs[class_id])
        predicted_class = CLASS_MAP.get(class_id, "Unknown")

        probabilities = {
            CLASS_MAP[i]: float(probs[i])
            for i in range(len(CLASS_MAP))
        }

        return {
            "class_id": class_id,
            "predicted_class": predicted_class,
            "confidence": round(confidence, 4),
            "probabilities": {k: round(v, 4) for k, v in probabilities.items()}
        }

    def get_routing_decision(self, prediction: Dict[str, Any]) -> Dict[str, Any]:
        """
        Translates a region prediction into a concrete execution instruction.
        
        Routing Instructions:
          - 'RXHANDBD': Run RxHandBD-v1 TrOCR engine
          - 'PADDLEOCR': Run PaddleOCR engine
          - 'BOTH': Run both OCR engines (for Mixed class or low-confidence fallback)
          - 'IGNORE': Skip OCR processing (noise/table/blank line)
        """
        confidence = prediction.get("confidence", 0.0)
        predicted_class = prediction.get("predicted_class", "Unknown")

        # 1. Low-Confidence Fallback Gate
        if confidence < self.confidence_threshold:
            return {
                "route": "BOTH",
                "reason": f"Low confidence ({confidence:.2f} < {self.confidence_threshold:.2f}); dual-engine fallback triggered",
                "is_fallback": True,
                "predicted_class": predicted_class,
                "confidence": confidence,
                "probabilities": prediction.get("probabilities", {})
            }

        # 2. High-Confidence Deterministic Routing
        if predicted_class == "Handwritten":
            return {
                "route": "RXHANDBD",
                "reason": f"High confidence handwritten text ({confidence:.2f})",
                "is_fallback": False,
                "predicted_class": predicted_class,
                "confidence": confidence,
                "probabilities": prediction.get("probabilities", {})
            }
        elif predicted_class == "Printed":
            return {
                "route": "PADDLEOCR",
                "reason": f"High confidence printed text ({confidence:.2f})",
                "is_fallback": False,
                "predicted_class": predicted_class,
                "confidence": confidence,
                "probabilities": prediction.get("probabilities", {})
            }
        elif predicted_class == "Mixed":
            return {
                "route": "BOTH",
                "reason": f"Mixed printed and handwritten region ({confidence:.2f}); dual OCR preserved",
                "is_fallback": False,
                "predicted_class": predicted_class,
                "confidence": confidence,
                "probabilities": prediction.get("probabilities", {})
            }
        elif predicted_class == "Other":
            return {
                "route": "IGNORE",
                "reason": f"Non-text/artifact region filtered ({confidence:.2f})",
                "is_fallback": False,
                "predicted_class": predicted_class,
                "confidence": confidence,
                "probabilities": prediction.get("probabilities", {})
            }
        else:
            return {
                "route": "BOTH",
                "reason": "Unknown region class; safe fallback",
                "is_fallback": True,
                "predicted_class": predicted_class,
                "confidence": confidence,
                "probabilities": prediction.get("probabilities", {})
            }
