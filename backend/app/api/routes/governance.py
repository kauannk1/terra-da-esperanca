from fastapi import APIRouter, Depends, Query
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models import AuditLog, Usuario
from app.schemas import AuditLogRead, ExecutiveSummary
from app.services.reports import build_executive_summary

router = APIRouter()


@router.get("/audit-logs", response_model=list[AuditLogRead])
def list_audit_logs(
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
) -> list[AuditLogRead]:
    logs = db.scalars(select(AuditLog).order_by(desc(AuditLog.data_hora))).all()
    if search:
        search_lower = search.lower()
        logs = [
            log
            for log in logs
            if search_lower in log.acao.lower()
            or search_lower in log.modulo.lower()
            or search_lower in log.usuario_nome.lower()
        ]
    return [AuditLogRead.model_validate(log) for log in logs]


@router.get("/reports/executive-summary", response_model=ExecutiveSummary)
def executive_summary(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
) -> ExecutiveSummary:
    return ExecutiveSummary(**build_executive_summary(db))
