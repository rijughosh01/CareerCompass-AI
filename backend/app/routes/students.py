from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, StudentProfile
from app.schemas import StudentProfileResponse, StudentProfileUpdate
from app.core.security import get_current_user

router = APIRouter(prefix="/students", tags=["Student Profiles"])


@router.get("/profile", response_model=StudentProfileResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        # Create profile if not yet created
        profile = StudentProfile(
            user_id=current_user.id,
            full_name=current_user.full_name
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


@router.put("/profile", response_model=StudentProfileResponse)
def update_profile(profile_data: StudentProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id, full_name=current_user.full_name)
        db.add(profile)

    update_dict = profile_data.dict(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(profile, field, value)

    # Sync full name if updated
    if profile_data.full_name and profile_data.full_name != current_user.full_name:
        current_user.full_name = profile_data.full_name

    db.commit()
    db.refresh(profile)
    return profile

