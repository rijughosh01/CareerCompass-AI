"""
Asynchronous Database Engine configuration for high-concurrency production deployments.
Uses SQLAlchemy 2.0 async engine with asyncpg (PostgreSQL) or aiosqlite (SQLite).
"""
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.core.config import settings

# Construct async connection string
raw_db_url = settings.DATABASE_URL
if raw_db_url.startswith("sqlite:///"):
    ASYNC_DATABASE_URL = raw_db_url.replace("sqlite:///", "sqlite+aiosqlite:///")
elif raw_db_url.startswith("postgresql://"):
    ASYNC_DATABASE_URL = raw_db_url.replace("postgresql://", "postgresql+asyncpg://")
else:
    ASYNC_DATABASE_URL = raw_db_url

# Create Async Engine
async_engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=False,
    future=True,
    pool_pre_ping=True,
)

# Async Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_async_db():
    """FastAPI dependency for obtaining an asynchronous database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
