"""
Input sanitization utilities using Bleach to prevent XSS and HTML injection attacks.
"""
from typing import Optional, Any, Dict
import bleach

# Allowed HTML tags for rich text fields (empty for strict plain text)
ALLOWED_TAGS = []
ALLOWED_ATTRIBUTES = {}


def sanitize_text(text: Optional[str]) -> str:
    """
    Strips all HTML tags, scripts, and unsafe characters from text inputs.
    Returns cleaned, safe string.
    """
    if not text:
        return ""
    if not isinstance(text, str):
        text = str(text)

    # Strip all HTML tags
    cleaned = bleach.clean(
        text,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        strip=True
    )
    return cleaned.strip()


def sanitize_dict(data: Dict[str, Any]) -> Dict[str, Any]:
    """Recursively sanitizes all string values within a dictionary."""
    sanitized = {}
    for key, value in data.items():
        if isinstance(value, str):
            sanitized[key] = sanitize_text(value)
        elif isinstance(value, dict):
            sanitized[key] = sanitize_dict(value)
        elif isinstance(value, list):
            sanitized[key] = [
                sanitize_text(v) if isinstance(v, str) else v for v in value
            ]
        else:
            sanitized[key] = value
    return sanitized
