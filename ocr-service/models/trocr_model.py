import os
import torch
from PIL import Image
import numpy as np
from typing import Optional, Tuple, Union

_trocr_processor = None
_trocr_model = None
_device = None
_initialization_error = None

def get_device() -> str:
    global _device
    if _device is not None:
        return _device
        
    requested_device = os.getenv("OCR_DEVICE", "auto").lower()
    if requested_device == "cuda" and torch.cuda.is_available():
        _device = "cuda"
    elif requested_device == "cpu":
        _device = "cpu"
    else:
        _device = "cuda" if torch.cuda.is_available() else "cpu"
        
    print(f"[TrOCR Model] Selected compute device: {_device.upper()}")
    return _device

def get_trocr_model():
    """
    Lazy-loads TrOCR processor and model once.
    Supports selecting between 'pretrained' and 'rxhandbd-v1' checkpoints.
    """
    global _trocr_processor, _trocr_model, _initialization_error
    
    if _trocr_model is not None:
        return _trocr_processor, _trocr_model
        
    if _initialization_error is not None:
        return None, None

    model_choice = os.getenv("TROCR_MODEL", "pretrained").lower()
    custom_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models', 'rxhandbd', 'best'))
    
    if model_choice in ["rxhandbd", "rxhandbd-v1"] and os.path.exists(custom_dir):
        model_name_or_path = custom_dir
        version_label = "trocr-rxhandbd-v1"
    else:
        model_name_or_path = os.getenv("OCR_MODEL_NAME", "microsoft/trocr-base-handwritten")
        version_label = "trocr-pretrained"
        
    device = get_device()
    
    try:
        from transformers import TrOCRProcessor, VisionEncoderDecoderModel
        print(f"[TrOCR Model] Loading handwriting model [{version_label}]: {model_name_or_path} on {device}...")
        
        _trocr_processor = TrOCRProcessor.from_pretrained(model_name_or_path)
        _trocr_model = VisionEncoderDecoderModel.from_pretrained(model_name_or_path)
        _trocr_model.to(device)
        _trocr_model.eval()
        
        print(f"[TrOCR Model] Successfully initialized TrOCR [{version_label}].")
        return _trocr_processor, _trocr_model
    except Exception as e:
        _initialization_error = str(e)
        print(f"[TrOCR Model] Failed to initialize TrOCR: {e}")
        return None, None

def is_trocr_available() -> bool:
    processor, model = get_trocr_model()
    return processor is not None and model is not None

def recognize_handwriting(image_input: Union[Image.Image, np.ndarray]) -> Tuple[str, float]:
    """
    Runs TrOCR inference on a cropped word or line image.
    Returns (text, estimated_confidence).
    """
    processor, model = get_trocr_model()
    if processor is None or model is None:
        return "", 0.0

    try:
        if isinstance(image_input, np.ndarray):
            # Convert BGR to RGB
            if len(image_input.shape) == 3 and image_input.shape[2] == 3:
                image_input = Image.fromarray(image_input[:, :, ::-1])
            else:
                image_input = Image.fromarray(image_input)
                
        # Ensure RGB mode
        if image_input.mode != "RGB":
            image_input = image_input.convert("RGB")
            
        device = get_device()
        pixel_values = processor(images=image_input, return_tensors="pt").pixel_values.to(device)
        
        with torch.no_grad():
            generated_ids = model.generate(pixel_values, max_new_tokens=32, return_dict_in_generate=True, output_scores=True)
            
        generated_text = processor.batch_decode(generated_ids.sequences, skip_special_tokens=True)[0].strip()
        
        # Calculate generation confidence approximation from token logits
        confidence = 0.85
        if hasattr(generated_ids, 'scores') and generated_ids.scores:
            try:
                probs = [torch.softmax(score, dim=-1).max().item() for score in generated_ids.scores]
                if probs:
                    confidence = float(np.mean(probs))
            except Exception:
                confidence = 0.85
                
        return generated_text, round(confidence, 4)
    except Exception as e:
        print(f"[TrOCR Inference Error] {e}")
        return "", 0.0
