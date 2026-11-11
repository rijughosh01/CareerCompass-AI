from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, model_validator


# ==========================================
# AUTH SCHEMAS
# ==========================================
class UserRegister(BaseModel):
    email: EmailStr
    full_name: str
    password: str = Field(..., min_length=6)
    role: Optional[str] = "student"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# STUDENT PROFILE SCHEMAS
# ==========================================
class StudentProfileBase(BaseModel):
    full_name: Optional[str] = "Student"
    age: Optional[int] = 22
    gender: Optional[str] = "Prefer not to say"
    location: Optional[str] = ""
    highest_qualification: Optional[str] = "B.Tech"
    stream: Optional[str] = "CSE"
    current_academic_level: Optional[str] = "Student"
    grade_cgpa_percentage: Optional[float] = 75.0
    technical_skills: Optional[str] = "Python, SQL"
    soft_skills: Optional[str] = "Problem Solving, Communication"
    languages_known: Optional[str] = "English"
    certifications: Optional[str] = ""
    fields_of_interest: Optional[str] = "AI/ML"
    preferred_work_style: Optional[str] = "Remote"
    work_type_interest: Optional[str] = "Full-time"
    past_jobs_internships: Optional[str] = ""
    achievements: Optional[str] = ""
    skills_gained: Optional[str] = ""
    willing_to_relocate: Optional[str] = "Yes"

    model_config = {"extra": "allow"}

    @model_validator(mode="before")
    @classmethod
    def normalize_input_keys(cls, data: Any) -> Any:
        if isinstance(data, dict):
            normalized = {}
            for k, v in data.items():
                normalized[k.lower()] = v
            # If full_name missing or blank, provide fallback
            if not normalized.get("full_name"):
                normalized["full_name"] = "Student"
            return normalized
        return data


class StudentProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    highest_qualification: Optional[str] = None
    stream: Optional[str] = None
    current_academic_level: Optional[str] = None
    grade_cgpa_percentage: Optional[float] = None
    technical_skills: Optional[str] = None
    soft_skills: Optional[str] = None
    languages_known: Optional[str] = None
    certifications: Optional[str] = None
    fields_of_interest: Optional[str] = None
    preferred_work_style: Optional[str] = None
    work_type_interest: Optional[str] = None
    past_jobs_internships: Optional[str] = None
    achievements: Optional[str] = None
    skills_gained: Optional[str] = None
    willing_to_relocate: Optional[str] = None

    model_config = {"extra": "allow"}

    @model_validator(mode="before")
    @classmethod
    def normalize_input_keys(cls, data: Any) -> Any:
        if isinstance(data, dict):
            return {k.lower(): v for k, v in data.items()}
        return data


class StudentProfileResponse(StudentProfileBase):
    id: int
    user_id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ==========================================
# CAREER ASSESSMENT & PREDICTION SCHEMAS
# ==========================================
class AssessmentSubmitRequest(StudentProfileBase):
    save_to_profile: Optional[bool] = True


class CareerPredictionItem(BaseModel):
    rank: int
    career: str
    prediction_score: float
    raw_probability: float
    is_top_match: bool
    description: Optional[str] = None
    required_skills: Optional[List[str]] = []
    career_opportunities: Optional[List[str]] = []
    match_explanation: Optional[str] = None


class AssessmentResponse(BaseModel):
    id: int
    user_id: int
    top_career: str
    top_score: float
    created_at: datetime
    predictions: List[Dict[str, Any]]
    profile_snapshot: Dict[str, Any]

    class Config:
        from_attributes = True


# ==========================================
# SKILL GAP SCHEMAS
# ==========================================
class SkillItem(BaseModel):
    skill: str
    status: str  # 'acquired' | 'missing' | 'in_progress'
    importance: str  # 'critical' | 'recommended' | 'optional'
    category: str  # 'technical' | 'soft'


class SkillGapResponse(BaseModel):
    career: str
    coverage_percentage: float
    existing_skills: List[str]
    missing_skills: List[str]
    recommended_skills: List[str]
    breakdown: List[SkillItem]


# ==========================================
# ROADMAP SCHEMAS
# ==========================================
class CourseItem(BaseModel):
    title: str
    platform: str
    description: str
    type: str  # 'free' | 'certification'


class RoadmapMilestone(BaseModel):
    stage: str  # 'Beginner' | 'Intermediate' | 'Advanced'
    duration: str
    objectives: List[str]
    skills: List[str]
    suggested_projects: List[str]
    recommended_courses: List[CourseItem]


class RoadmapResponse(BaseModel):
    career: str
    overview: str
    estimated_timeline: str
    milestones: List[RoadmapMilestone]


# ==========================================
# RESUME & CHATBOT SCHEMAS
# ==========================================
class ResumeAnalysisResponse(BaseModel):
    id: Optional[int] = None
    filename: str
    overall_score: int
    extracted_skills: List[str]
    matching_careers: List[str]
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]
    keywords_found: List[str]
    missing_keywords: List[str]
    created_at: Optional[datetime] = None


class ChatMessageRequest(BaseModel):
    message: str


class ChatMessageResponse(BaseModel):
    id: str
    sender: str
    content: str
    timestamp: datetime


# ==========================================
# ADMIN SCHEMAS
# ==========================================
class AdminStatsResponse(BaseModel):
    total_students: int
    total_assessments: int
    top_careers: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]
    system_health: Dict[str, Any]
