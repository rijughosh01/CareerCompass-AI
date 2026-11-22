"""
Upgraded FastAPI main.py with:
- SlowAPI rate limiting
- Structlog structured logging
- Sentry error monitoring (optional)
- Prometheus metrics endpoint
- Security & request logging middleware
- CSP / security response headers
- Improved health endpoint with DB and ML checks
"""
import logging
import structlog
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.database import engine, Base, SessionLocal
from app.models import User, StudentProfile, Assessment, PredictionDetail
from app.core.security import get_password_hash
from app.services.ml_service import ml_service
from app.middleware.security import SecurityHeadersMiddleware, RequestLoggingMiddleware
from app.middleware.rate_limit import limiter

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
    admin,
)

# ---------------------------------------------------------------------------
# Structlog configuration
# ---------------------------------------------------------------------------
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.stdlib.add_log_level,
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.dev.ConsoleRenderer(),
    ],
    wrapper_class=structlog.BoundLogger,
    context_class=dict,
    logger_factory=structlog.PrintLoggerFactory(),
)

logging.basicConfig(level=logging.INFO)
logger = structlog.get_logger("careercompass")

# ---------------------------------------------------------------------------
# Optional Sentry Integration
# ---------------------------------------------------------------------------
SENTRY_DSN = getattr(settings, "SENTRY_DSN", "")
if SENTRY_DSN:
    try:
        import sentry_sdk
        from sentry_sdk.integrations.fastapi import FastApiIntegration
        from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

        sentry_sdk.init(
            dsn=SENTRY_DSN,
            integrations=[FastApiIntegration(), SqlalchemyIntegration()],
            traces_sample_rate=0.1,
            environment=getattr(settings, "ENVIRONMENT", "development"),
        )
        logger.info("sentry_initialized", dsn_configured=True)
    except Exception as e:
        logger.warning("sentry_init_failed", error=str(e))


# ---------------------------------------------------------------------------
# DB Initialization & Seeding
# ---------------------------------------------------------------------------
def init_db():
    """Initialises tables and seeds default admin & student accounts if absent."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == "admin@careercompass.ai").first()
        if not admin_user:
            admin_user = User(
                email="admin@careercompass.ai",
                full_name="System Administrator",
                hashed_password=get_password_hash("Admin@123456"),
                role="admin",
            )
            db.add(admin_user)
            db.commit()
            logger.info("seeded_admin", email="admin@careercompass.ai")

        demo_student = db.query(User).filter(User.email == "student@careercompass.ai").first()
        if not demo_student:
            demo_student = User(
                email="student@careercompass.ai",
                full_name="Alex Morgan",
                hashed_password=get_password_hash("Student@123456"),
                role="student",
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
                willing_to_relocate="Yes",
            )
            db.add(demo_profile)
            db.commit()

            assessment = Assessment(
                user_id=demo_student.id,
                input_snapshot={
                    "Highest_qualification": "B.Tech",
                    "Stream": "CSE",
                    "Technical_Skills": "Python, SQL, Machine Learning",
                    "Soft_Skills": "Problem Solving",
                    "Fields_of_Interest": "AI/ML",
                    "Grade_CGPA_Percentage": 88.5,
                },
                top_career="Machine Learning Engineer",
                top_score=98.4,
            )
            db.add(assessment)
            db.commit()
            logger.info("seeded_demo_student", email="student@careercompass.ai")
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Application Lifespan
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("app_startup", project=settings.PROJECT_NAME)
    init_db()
    logger.info(
        "ml_service_status",
        loaded=ml_service.model_loaded,
        classes=len(ml_service.classes),
    )
    yield
    logger.info("app_shutdown")


# ---------------------------------------------------------------------------
# FastAPI Application
# ---------------------------------------------------------------------------
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=(
        "AI-powered career guidance platform. "
        "Predict suitable career paths using an XGBoost ML pipeline."
    ),
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Rate limiter state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ---------------------------------------------------------------------------
# Middleware (order matters: outermost middleware wraps innermost)
# ---------------------------------------------------------------------------
cors_origins = list(settings.CORS_ORIGINS)
if getattr(settings, "ENVIRONMENT", "development") == "production" and "*" in cors_origins:
    cors_origins = [o for o in cors_origins if o != "*"]

app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Correlation-ID"],
)

# ---------------------------------------------------------------------------
# Optional Prometheus Metrics
# ---------------------------------------------------------------------------
try:
    from prometheus_fastapi_instrumentator import Instrumentator

    Instrumentator().instrument(app).expose(app, endpoint="/metrics", include_in_schema=False)
    logger.info("prometheus_metrics_enabled", endpoint="/metrics")
except ImportError:
    logger.warning("prometheus_not_installed", hint="pip install prometheus-fastapi-instrumentator")


# ---------------------------------------------------------------------------
# API Routers
# ---------------------------------------------------------------------------
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(students.router, prefix=settings.API_V1_STR)
app.include_router(assessments.router, prefix=settings.API_V1_STR)
app.include_router(careers.router, prefix=settings.API_V1_STR)
app.include_router(skills.router, prefix=settings.API_V1_STR)
app.include_router(roadmaps.router, prefix=settings.API_V1_STR)
app.include_router(resumes.router, prefix=settings.API_V1_STR)
app.include_router(chatbot.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)


# ---------------------------------------------------------------------------
# Health Endpoint
# ---------------------------------------------------------------------------
def _check_db() -> bool:
    try:
        db = SessionLocal()
        db.execute(__import__("sqlalchemy").text("SELECT 1"))
        db.close()
        return True
    except Exception:
        return False


@app.get("/health", include_in_schema=False, tags=["Health"])
def health_check():
    db_ok = _check_db()
    return {
        "status": "healthy" if db_ok and ml_service.model_loaded else "degraded",
        "ml_model_loaded": ml_service.model_loaded,
        "db_connected": db_ok,
        "version": "2.0.0",
        "project": settings.PROJECT_NAME,
        "ml_model": {
            "loaded": ml_service.model_loaded,
            "classes": len(ml_service.classes) if ml_service.model_loaded else 0,
            "model_name": getattr(ml_service.model_bundle, "get", lambda k, d=None: d)("model_name", "XGBoost")
            if ml_service.model_bundle
            else None,
        },
        "database": {
            "connected": db_ok,
            "engine": settings.DATABASE_URL.split(":")[0],
        },
    }


@app.get("/", include_in_schema=False)
def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API v2.0",
        "docs": "/docs",
        "health": "/health",
        "metrics": "/metrics",
    }
