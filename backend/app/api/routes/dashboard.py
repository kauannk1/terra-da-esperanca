from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models import Usuario
from app.schemas import DashboardSummary
from app.services.dashboard import build_dashboard_summary

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
def dashboard_summary(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
) -> DashboardSummary:
    return DashboardSummary(**build_dashboard_summary(db))
