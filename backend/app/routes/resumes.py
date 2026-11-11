from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from app.database import get_db
from app.models import User, ResumeRecord
from app.schemas import ResumeAnalysisResponse
from app.core.security import get_current_user
from app.services.resume_service import extract_text_from_file, analyze_resume_text

router = APIRouter(prefix="/resumes", tags=["Resume Analysis"])


@router.post("", response_model=ResumeAnalysisResponse)
@router.post("/", response_model=ResumeAnalysisResponse)
@router.post("/analyse", response_model=ResumeAnalysisResponse)
@router.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyse_resume(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None),
    target_career: Optional[str] = Form("Machine Learning Engineer"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    filename = "Pasted_Resume_Text.txt"
    extracted_text = ""

    if file:
        filename = file.filename
        file_bytes = await file.read()
        if len(file_bytes) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size exceeds maximum 10MB limit."
            )
        extracted_text = extract_text_from_file(file_bytes, filename)
    elif raw_text:
        extracted_text = raw_text
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a PDF/DOCX resume file or provide resume text."
        )

    if not extracted_text or len(extracted_text.strip()) < 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract readable text from the provided resume. Please upload a clear PDF or copy text directly."
        )

    # Perform analysis
    analysis_result = analyze_resume_text(extracted_text, target_career or "Machine Learning Engineer")

    # Save to history
    record = ResumeRecord(
        user_id=current_user.id,
        filename=filename,
        extracted_text=extracted_text[:4000],  # store preview
        analysis_data=analysis_result
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "filename": filename,
        "created_at": record.created_at,
        **analysis_result
    }


@router.get("/history", response_model=List[Dict[str, Any]])
def get_resume_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    records = (
        db.query(ResumeRecord)
        .filter(ResumeRecord.user_id == current_user.id)
        .order_by(ResumeRecord.created_at.desc())
        .limit(10)
        .all()
    )
    return [
        {
            "id": r.id,
            "filename": r.filename,
            "created_at": r.created_at.isoformat(),
            **r.analysis_data
        }
        for r in records
    ]
