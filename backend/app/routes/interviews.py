from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, InterviewSession, InterviewExchange
from app.schemas import (
    InterviewStartRequest,
    InterviewAnswerRequest,
    InterviewExchangeResponse,
    InterviewSessionResponse,
)
from app.core.security import get_current_user
from app.core.sanitizer import sanitize_text
from app.services.interview_service import (
    generate_interview_question,
    evaluate_interview_answer,
)

router = APIRouter(prefix="/interviews", tags=["AI Technical Mock Interviewer"])


@router.post("/start", response_model=InterviewSessionResponse)
def start_interview(
    req: InterviewStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Starts a new AI mock technical interview session tailored to the candidate's career and difficulty.
    Generates the initial scenario question.
    """
    clean_career = sanitize_text(req.career or "Machine Learning Engineer")
    clean_diff = sanitize_text(req.difficulty or "Mid-Level")

    # Create session
    session = InterviewSession(
        user_id=current_user.id,
        career=clean_career,
        difficulty=clean_diff,
        status="active",
        total_score=0.0,
        questions_answered=0
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    # Generate initial question
    first_q = generate_interview_question(clean_career, clean_diff, history=[])
    exchange = InterviewExchange(
        session_id=session.id,
        question=first_q
    )
    db.add(exchange)
    db.commit()
    db.refresh(session)

    return session


@router.post("/evaluate")
def submit_and_evaluate_answer(
    req: InterviewAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Evaluates candidate's answer with Google Gemini on a 1–10 scale:
    - Technical Depth & Framework Accuracy
    - STAR Communication Clarity
    - Constructive Feedback
    - Ideal Model STAR Answer
    Then automatically generates the next question or completes the interview after 5 questions.
    """
    session = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == req.session_id, InterviewSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    exchange = (
        db.query(InterviewExchange)
        .filter(InterviewExchange.id == req.exchange_id, InterviewExchange.session_id == session.id)
        .first()
    )
    if not exchange:
        raise HTTPException(status_code=404, detail="Interview exchange not found.")

    clean_answer = sanitize_text(req.answer)
    evaluation = evaluate_interview_answer(
        career=session.career,
        difficulty=session.difficulty,
        question=exchange.question,
        user_answer=clean_answer
    )

    exchange.user_answer = clean_answer
    exchange.score = evaluation["score"]
    exchange.technical_accuracy = evaluation["technical_accuracy"]
    exchange.communication_clarity = evaluation["communication_clarity"]
    exchange.feedback = evaluation["feedback"]
    exchange.model_answer = evaluation["model_answer"]

    # Update session aggregate stats
    session.questions_answered += 1
    # Running average score
    all_scored = [
        ex.score for ex in session.exchanges if ex.score is not None
    ] + [evaluation["score"]]
    session.total_score = round(sum(all_scored) / len(all_scored), 1)

    next_exchange_data = None
    if session.questions_answered >= 5:
        session.status = "completed"
    else:
        # Generate next question
        past_history = [{"question": ex.question} for ex in session.exchanges]
        next_q = generate_interview_question(
            career=session.career,
            difficulty=session.difficulty,
            history=past_history
        )
        new_ex = InterviewExchange(
            session_id=session.id,
            question=next_q
        )
        db.add(new_ex)
        db.commit()
        db.refresh(new_ex)
        next_exchange_data = {
            "id": new_ex.id,
            "session_id": new_ex.session_id,
            "question": new_ex.question,
            "created_at": new_ex.created_at
        }

    db.commit()
    db.refresh(session)
    db.refresh(exchange)

    return {
        "evaluation": {
            "exchange_id": exchange.id,
            "question": exchange.question,
            "user_answer": exchange.user_answer,
            "score": exchange.score,
            "technical_accuracy": exchange.technical_accuracy,
            "communication_clarity": exchange.communication_clarity,
            "feedback": exchange.feedback,
            "model_answer": exchange.model_answer,
        },
        "session": {
            "id": session.id,
            "status": session.status,
            "total_score": session.total_score,
            "questions_answered": session.questions_answered,
        },
        "next_exchange": next_exchange_data
    }


@router.get("/history", response_model=List[InterviewSessionResponse])
def get_interview_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves all past interview sessions for the current user."""
    sessions = (
        db.query(InterviewSession)
        .filter(InterviewSession.user_id == current_user.id)
        .order_by(InterviewSession.created_at.desc())
        .all()
    )
    return sessions


@router.get("/{session_id}", response_model=InterviewSessionResponse)
def get_interview_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves complete details and transcript of a single interview session."""
    session = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id, InterviewSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    return session
