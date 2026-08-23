import os
from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class VerificationStatus(str, Enum):
    UNREVIEWED = "UNREVIEWED"
    IN_REVIEW = "IN_REVIEW"
    VERIFIED = "VERIFIED"
    UNCERTAIN = "UNCERTAIN"
    ILLEGIBLE = "ILLEGIBLE"
    REJECTED = "REJECTED"

class AnnotationPriority(str, Enum):
    HIGH_AGREEMENT = "HIGH_AGREEMENT"
    PARTIAL_AGREEMENT = "PARTIAL_AGREEMENT"
    DISAGREEMENT = "DISAGREEMENT"
    NO_USEFUL_OUTPUT = "NO_USEFUL_OUTPUT"

class ReviewerConfidence(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class OCREngineProposal(BaseModel):
    engine: str  # "paddleocr", "pretrained_trocr", "rxhandbd_v1", "gemini"
    text: str
    confidence: float = 0.0

class MedicineGroundTruth(BaseModel):
    name: Optional[str] = None  # Normalized canonical name (e.g. "Amoxicillin")
    generic_name: Optional[str] = None
    strength: Optional[str] = None  # e.g. "500mg"
    dosage: Optional[str] = None  # e.g. "1 tablet"
    frequency: Optional[str] = None  # e.g. "twice daily" / "1-0-1"
    timing: Optional[str] = None  # e.g. "after food"
    duration: Optional[str] = None  # e.g. "5 days"
    verification_status: VerificationStatus = VerificationStatus.UNREVIEWED

class RegionGroundTruth(BaseModel):
    region_id: str
    bbox: Optional[List[int]] = None  # [xmin, ymin, xmax, ymax]
    raw_ocr: List[OCREngineProposal] = []
    
    # Priority calculated from multi-engine agreement
    annotation_priority: Optional[AnnotationPriority] = AnnotationPriority.DISAGREEMENT
    
    # Level A: Literal Visual transcription (what is literally visible on the prescription)
    visual_transcription: Optional[str] = None
    
    # Level B: Normalized canonical medicine name
    normalized_medicine: Optional[str] = None
    
    # Level C: Structured regimen attributes
    strength: Optional[str] = None
    dosage_form: Optional[str] = None
    frequency: Optional[str] = None
    timing: Optional[str] = None
    duration: Optional[str] = None
    
    # Context & Human Annotation Confidence
    context_used: bool = False  # Set true only if reviewer used contextual information
    reviewer_confidence: Optional[ReviewerConfidence] = ReviewerConfidence.HIGH
    
    # Legacy object compatibility
    medicine: Optional[MedicineGroundTruth] = None
    
    # Status & Notes
    status: VerificationStatus = VerificationStatus.UNREVIEWED
    notes: Optional[str] = None

class PrescriptionAnnotation(BaseModel):
    image_id: str  # e.g. "1", "2"
    filename: str  # e.g. "1.jpg"
    image_path: str
    overall_status: VerificationStatus = VerificationStatus.UNREVIEWED
    annotator: Optional[str] = "medical_reviewer_001"
    reviewed_at: Optional[str] = None
    regions: List[RegionGroundTruth] = []
    general_notes: Optional[str] = None
