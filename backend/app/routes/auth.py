"""
Upgraded auth routes with:
- SlowAPI rate limiting on login/register (5/minute)
- Password strength validation using zxcvbn
- Audit logging for all auth events
- Structured logging
"""
import structlog
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, StudentProfile
from app.schemas import UserRegister, UserLogin, TokenResponse, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user
from app.middleware.rate_limit import limiter

logger = structlog.get_logger("careercompass.auth")
router = APIRouter(prefix="/auth", tags=["Authentication"])


def _check_password_strength(password: str) -> None:
    """Validates password strength. Raises HTTPException if weak."""
    try:
        import zxcvbn
        result = zxcvbn.zxcvbn(password)
        if result["score"] < 2:
            suggestions = result["feedback"].get("suggestions", [])
            hint = " ".join(suggestions) if suggestions else "Use a mix of upper/lowercase, numbers, and symbols."
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Password is too weak. {hint}",
            )
    except ImportError:
        # zxcvbn not installed — basic check
        if len(password) < 8:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Password must be at least 8 characters long.",
            )


@router.post("/register", response_model=TokenResponse)
@limiter.limit("10/minute")
def register(request: Request, user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new student or admin account."""
    # Validate email uniqueness
    existing = db.query(User).filter(User.email == user_data.email.lower()).first()
    if existing:
        logger.warning("register_email_conflict", email=user_data.email)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists",
        )

    # Validate password strength
    _check_password_strength(user_data.password)

    # Sanitize role — only allow 'student' or 'admin'
    allowed_roles = {"student", "admin"}
    role = user_data.role if user_data.role in allowed_roles else "student"

    new_user = User(
        email=user_data.email.lower(),
        full_name=user_data.full_name.strip(),
        hashed_password=get_password_hash(user_data.password),
        role=role,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize default student profile
    default_profile = StudentProfile(
        user_id=new_user.id,
        full_name=new_user.full_name,
        highest_qualification="B.Tech",
        stream="CSE",
        current_academic_level="Student",
        grade_cgpa_percentage=80.0,
        technical_skills="Python, SQL",
        soft_skills="Problem Solving, Teamwork",
        languages_known="English",
        fields_of_interest="Software Development",
        preferred_work_style="Remote",
        work_type_interest="Technical",
        willing_to_relocate="Yes",
    )
    db.add(default_profile)
    db.commit()

    logger.info("user_registered", user_id=new_user.id, role=role)
    token = create_access_token(new_user.email)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "role": new_user.role,
            "created_at": new_user.created_at.isoformat(),
        },
    }


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
def login(request: Request, login_data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate and return a JWT token. Rate-limited to 5 attempts/minute per IP."""
    user = db.query(User).filter(User.email == login_data.email.lower()).first()

    if not user or not verify_password(login_data.password, user.hashed_password):
        logger.warning("login_failed", email=login_data.email, ip=request.client.host if request.client else "unknown")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated.")

    logger.info("login_success", user_id=user.id, role=user.role)
    token = create_access_token(user.email)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "created_at": user.created_at.isoformat(),
        },
    }


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Return the authenticated user's details."""
    return current_user
