from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="student", nullable=False)  # 'student' | 'admin'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="user", cascade="all, delete-orphan")
    resumes = relationship("ResumeRecord", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")
    interview_sessions = relationship("InterviewSession", back_populates="user", cascade="all, delete-orphan")
    roadmap_progress = relationship("RoadmapProgress", back_populates="user", cascade="all, delete-orphan")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String(50), nullable=True)
    location = Column(String(100), nullable=True)
    highest_qualification = Column(String(100), default="B.Tech")
    stream = Column(String(100), default="CSE")
    current_academic_level = Column(String(100), default="Student")
    grade_cgpa_percentage = Column(Float, default=75.0)
    technical_skills = Column(Text, default="Python, SQL")
    soft_skills = Column(Text, default="Problem Solving, Communication")
    languages_known = Column(String(255), default="English")
    certifications = Column(Text, nullable=True, default="")
    fields_of_interest = Column(String(100), default="Software Development")
    preferred_work_style = Column(String(100), default="Remote")
    work_type_interest = Column(String(100), default="Technical")
    past_jobs_internships = Column(Text, nullable=True, default="")
    achievements = Column(Text, nullable=True, default="")
    skills_gained = Column(Text, nullable=True, default="Programming")
    willing_to_relocate = Column(String(20), default="Yes")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="profile")


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    input_snapshot = Column(JSON, nullable=False)
    top_career = Column(String(100), index=True, nullable=False)
    top_score = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="assessments")
    predictions = relationship("PredictionDetail", back_populates="assessment", cascade="all, delete-orphan")


class PredictionDetail(Base):
    __tablename__ = "prediction_details"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), index=True, nullable=False)
    career = Column(String(100), nullable=False)
    score = Column(Float, nullable=False)
    rank = Column(Integer, nullable=False)
    match_explanation = Column(Text, nullable=True)

    # Relationship
    assessment = relationship("Assessment", back_populates="predictions")


class ResumeRecord(Base):
    __tablename__ = "resume_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    filename = Column(String(255), nullable=False)
    extracted_text = Column(Text, nullable=True)
    analysis_data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="resumes")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    sender = Column(String(20), nullable=False)  # 'user' | 'assistant'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="chat_messages")


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    career = Column(String(100), nullable=False)
    difficulty = Column(String(50), default="Mid-Level")  # 'Junior', 'Mid-Level', 'Senior'
    status = Column(String(50), default="active")         # 'active', 'completed'
    total_score = Column(Float, default=0.0)
    questions_answered = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="interview_sessions")
    exchanges = relationship("InterviewExchange", back_populates="session", cascade="all, delete-orphan")


class InterviewExchange(Base):
    __tablename__ = "interview_exchanges"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id"), index=True, nullable=False)
    question = Column(Text, nullable=False)
    user_answer = Column(Text, nullable=True)
    score = Column(Float, nullable=True)                  # 1 to 10
    technical_accuracy = Column(Float, nullable=True)     # 1 to 10
    communication_clarity = Column(Float, nullable=True)  # 1 to 10
    feedback = Column(Text, nullable=True)
    model_answer = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("InterviewSession", back_populates="exchanges")


class RoadmapProgress(Base):
    __tablename__ = "roadmap_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    career = Column(String(100), index=True, nullable=False)
    stage = Column(String(50), nullable=False)           # 'Beginner', 'Intermediate', 'Advanced'
    item_type = Column(String(50), default="skill")      # 'skill', 'project', 'course'
    item_title = Column(String(255), nullable=False)
    completed = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="roadmap_progress")


