"""API v1 routers."""

from fastapi import APIRouter
from .engine import router as engine_router
from .admin import router as admin_router
from .ai import router as ai_router

api_v1_router = APIRouter()
api_v1_router.include_router(engine_router)
api_v1_router.include_router(admin_router)
api_v1_router.include_router(ai_router)

__all__ = ["api_v1_router"]
