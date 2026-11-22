"""
Rate limiting configuration using SlowAPI (wraps limits library).
Provides reusable limiters for auth and general API endpoints.
"""
from slowapi import Limiter
from slowapi.util import get_remote_address

# Global limiter instance — attach to FastAPI app in main.py
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])
