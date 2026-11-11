from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime
import uuid

from app.database import get_db
from app.models import User, StudentProfile, ChatMessage, Assessment
from app.schemas import ChatMessageRequest, ChatMessageResponse
from app.core.security import get_current_user
from app.services.chatbot_service import get_chatbot_response

router = APIRouter(prefix="/chatbot", tags=["AI Career Assistant"])


@router.post("", response_model=ChatMessageResponse)
@router.post("/", response_model=ChatMessageResponse)
@router.post("/message", response_model=ChatMessageResponse)
def send_chat_message(
    msg_data: ChatMessageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Store user message
    user_msg = ChatMessage(
        user_id=current_user.id,
        sender="user",
        content=msg_data.message
    )
    db.add(user_msg)

    # Get student profile context and latest assessment
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    latest_assessment = (
        db.query(Assessment)
        .filter(Assessment.user_id == current_user.id)
        .order_by(Assessment.created_at.desc())
        .first()
    )
    profile_dict = {
        "full_name": current_user.full_name or "Student",
        "email": current_user.email,
        "highest_qualification": profile.highest_qualification if profile else "B.Tech",
        "stream": profile.stream if profile else "CSE",
        "grade_cgpa_percentage": profile.grade_cgpa_percentage if profile else 85.0,
        "technical_skills": profile.technical_skills if profile else "Python, SQL",
        "soft_skills": profile.soft_skills if profile else "Problem Solving, Communication",
        "certifications": profile.certifications if profile else "",
        "fields_of_interest": profile.fields_of_interest if profile else "AI/ML",
        "preferred_work_style": profile.preferred_work_style if profile else "Hybrid",
        "latest_top_career": latest_assessment.top_career if latest_assessment else "Machine Learning Engineer",
        "latest_top_score": latest_assessment.top_score if latest_assessment else 95.0,
    }

    # Generate grounded response
    bot_reply_text = get_chatbot_response(msg_data.message, profile_dict)

    # Store assistant message
    bot_msg = ChatMessage(
        user_id=current_user.id,
        sender="assistant",
        content=bot_reply_text
    )
    db.add(bot_msg)
    db.commit()

    return {
        "id": str(uuid.uuid4()),
        "sender": "assistant",
        "content": bot_reply_text,
        "timestamp": datetime.utcnow()
    }


@router.delete("/history")
def clear_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Chat history cleared successfully"}


@router.get("/history", response_model=List[Dict[str, Any]])
def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.user_id == current_user.id)
        .order_by(ChatMessage.created_at.asc())
        .limit(50)
        .all()
    )
    return [
        {
            "id": str(m.id),
            "sender": m.sender,
            "content": m.content,
            "timestamp": m.created_at.isoformat()
        }
        for m in messages
    ]

