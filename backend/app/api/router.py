from fastapi import APIRouter

from app.api.routes import auth, dashboard, governance, health, inventory, operations, residents, users

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(residents.router, prefix="/residents", tags=["residents"])
api_router.include_router(operations.router, prefix="/operations", tags=["operations"])
api_router.include_router(inventory.router, prefix="/inventory", tags=["inventory"])
api_router.include_router(governance.router, prefix="/governance", tags=["governance"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
