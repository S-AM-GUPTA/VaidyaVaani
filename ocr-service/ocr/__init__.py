from .paddle_engine import get_paddle_ocr, recognize_paddle, is_paddle_available
from .trocr_engine import recognize_trocr_lines

__all__ = ['get_paddle_ocr', 'recognize_paddle', 'is_paddle_available', 'recognize_trocr_lines']
