import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.database import engine, Base, SessionLocal
from app.models import User, StudentProfile, Assessment, PredictionDetail
from app.core.security import get_password_hash
from app.services.ml_service import ml_service

# Routers
from app.routes import (
    auth,
    students,
    assessments,
    careers,
    skills,
    roadmaps,
    resumes,
    chatbot,
    admin
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("careercompass")


def init_db():
    """Initializes tables and seeds default admin & student accounts if not present."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Seed Admin
        admin_user = db.query(User).filter(User.email == "admin@careercompass.ai").first()
        if not admin_user:
            admin_user = User(
                email="admin@careercompass.ai",
                full_name="System Administrator",
                hashed_password=get_password_hash("Admin@123456"),
                role="admin"
            )
            db.add(admin_user)
            db.commit()
            logger.info("Default Admin account seeded: admin@careercompass.ai / Admin@123456")

        # 2. Seed Demo Student
        demo_student = db.query(User).filter(User.email == "student@careercompass.ai").first()
        if not demo_student:
            demo_student = User(
                email="student@careercompass.ai",
                full_name="Alex Morgan",
                hashed_password=get_password_hash("Student@123456"),
                role="student"
            )
            db.add(demo_student)
            db.commit()
            db.refresh(demo_student)

            demo_profile = StudentProfile(
                user_id=demo_student.id,
                full_name="Alex Morgan",
                age=22,
                gender="Male",
                location="San Francisco, CA",
                highest_qualification="B.Tech",
                stream="CSE",
                current_academic_level="Student",
                grade_cgpa_percentage=88.5,
                technical_skills="Python, SQL, Machine Learning, Scikit-Learn",
                soft_skills="Problem Solving, Critical Thinking, Teamwork",
                languages_known="English",
                certifications="Machine Learning, Python",
                fields_of_interest="AI/ML",
                preferred_work_style="Remote",
                work_type_interest="Technical",
                past_jobs_internships="Internship at XYZ",
                achievements="Hackathon Winner",
                skills_gained="Programming, Data Analysis",
                willing_to_relocate="Yes"
            )
            db.add(demo_profile)
            db.commit()

            # Seed an initial baseline assessment
            assessment = Assessment(
                user_id=demo_student.id,
                input_snapshot={
                    "Highest_qualification": "B.Tech",
                    "Stream": "CSE",
                    "Technical_Skills": "Python, SQL, Machine Learning",
                    "Soft_Skills": "Problem Solving",
                    "Fields_of_Interest": "AI/ML",
                    "Grade_CGPA_Percentage": 88.5
                },
                top_career="Machine Learning Engineer",
                top_score=98.4
            )
            db.add(assessment)
            db.commit()
            db.refresh(assessment)

            pred1 = PredictionDetail(
                assessment_id=assessment.id,
                career="Machine Learning Engineer",
                score=98.4,
                rank=1,
                match_explanation="Strong alignment in Python, Machine Learning certifications, and analytical work orientation."
            )
            pred2 = PredictionDetail(
                assessment_id=assessment.id,
                career="Data Scientist",
                score=88.2,
                rank=2,
                match_explanation="Solid statistical modeling and SQL capabilities."
            )
            pred3 = PredictionDetail(
                assessment_id=assessment.id,
                career="AI Researcher",
                score=82.5,
                rank=3,
                match_explanation="Demonstrated mathematical problem-solving aptitude."
            )
            db.add_all([pred1, pred2, pred3])
            db.commit()
            logger.info("Default Demo Student account seeded: student@careercompass.ai / Student@123456")
    except Exception as e:
        logger.error(f"Error during DB initialization: {e}")
        db.rollback()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Powered Career Guidance and Recommendation System API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(students.router, prefix=settings.API_V1_STR)
app.include_router(assessments.router, prefix=settings.API_V1_STR)
app.include_router(careers.router, prefix=settings.API_V1_STR)
app.include_router(skills.router, prefix=settings.API_V1_STR)
app.include_router(roadmaps.router, prefix=settings.API_V1_STR)
app.include_router(resumes.router, prefix=settings.API_V1_STR)
app.include_router(chatbot.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs",
        "ml_model_loaded": ml_service.model_loaded
    }


@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CareerCompass AI Backend",
        "database": "connected",
        "ml_model": {
            "loaded": ml_service.model_loaded,
            "classes_count": len(ml_service.classes) if ml_service.model_loaded else 0
        }
    }
