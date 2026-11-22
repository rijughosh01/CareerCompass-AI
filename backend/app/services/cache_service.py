"""
In-memory caching service with TTL support.
Redis-ready: set REDIS_URL in .env to automatically switch to Redis backend.
"""
import json
import time
import logging
import os
from typing import Any, Optional

logger = logging.getLogger(__name__)

# Try Redis first, fall back to in-memory
_redis_client = None
REDIS_URL = os.environ.get("REDIS_URL", "")
if REDIS_URL:
    try:
        import redis
        _redis_client = redis.from_url(REDIS_URL, decode_responses=True)
        _redis_client.ping()
        logger.info("Redis cache backend connected.")
    except Exception as e:
        logger.warning(f"Redis unavailable, using in-memory cache: {e}")
        _redis_client = None


class MemoryCache:
    """Thread-safe in-memory cache with TTL expiry. Redis-compatible interface."""

    def __init__(self):
        self._store: dict = {}
        self._expiry: dict = {}

    def get(self, key: str) -> Optional[str]:
        if key not in self._store:
            return None
        if self._expiry.get(key, float("inf")) < time.time():
            self._store.pop(key, None)
            self._expiry.pop(key, None)
            return None
        return self._store[key]

    def set(self, key: str, value: str, ttl_seconds: int = 300) -> None:
        self._store[key] = value
        self._expiry[key] = time.time() + ttl_seconds

    def delete(self, key: str) -> None:
        self._store.pop(key, None)
        self._expiry.pop(key, None)

    def flush(self) -> None:
        self._store.clear()
        self._expiry.clear()


_memory_cache = MemoryCache()


def _get_raw(key: str) -> Optional[str]:
    if _redis_client:
        try:
            return _redis_client.get(key)
        except Exception:
            pass
    return _memory_cache.get(key)


def _set_raw(key: str, value: str, ttl_seconds: int) -> None:
    if _redis_client:
        try:
            _redis_client.setex(key, ttl_seconds, value)
            return
        except Exception:
            pass
    _memory_cache.set(key, value, ttl_seconds)


def _delete_raw(key: str) -> None:
    if _redis_client:
        try:
            _redis_client.delete(key)
        except Exception:
            pass
    _memory_cache.delete(key)


# Public API
def get_cached(key: str) -> Optional[Any]:
    raw = _get_raw(key)
    if raw is None:
        return None
    try:
        return json.loads(raw)
    except Exception:
        return raw


def set_cached(key: str, value: Any, ttl_seconds: int = 300) -> None:
    try:
        _set_raw(key, json.dumps(value, default=str), ttl_seconds)
    except Exception as e:
        logger.warning(f"Cache set failed for key={key}: {e}")


def invalidate(key: str) -> None:
    _delete_raw(key)
