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

class OCREngineProposal(BaseModel):
    engine: str  # "paddleocr", "trocr", "gemini"
    text: str
    confidence: float = 0.0

class MedicineGroundTruth(BaseModel):
    name: Optional[str] = None  # Level B: Normalized name (e.g. "Amoxicillin")
    generic_name: Optional[str] = None
    strength: Optional[str] = None  # Level C: e.g. "500 mg"
    dosage: Optional[str] = None  # Level C: e.g. "1 tablet"
    frequency: Optional[str] = None  # Level C: e.g. "twice daily"
    timing: Optional[str] = None  # Level C: e.g. "after food"
    duration: Optional[str] = None  # Level C: e.g. "5 days"
    verification_status: VerificationStatus = VerificationStatus.UNREVIEWED

class RegionGroundTruth(BaseModel):
    region_id: str
    bbox: Optional[List[int]] = None  # [xmin, ymin, xmax, ymax]
    raw_ocr: List[OCREngineProposal] = []
    
    # Level A: Visual transcription (what is actually seen on the prescription)
    visual_transcription: Optional[str] = None
    
    # Level B & C: Medical normalization and structured info
    medicine: Optional[MedicineGroundTruth] = None
    
    # Context & Status
    context_used: Optional[str] = None  # e.g. "Prescription context / standard dosage"
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
