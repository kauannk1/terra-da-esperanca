from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_user, get_db
from app.models import AtividadeCotidiano, GerenciamentoEscala, Usuario
from app.schemas import DailyActivityRead, ScaleRead

router = APIRouter()


@router.get("/scales", response_model=list[ScaleRead])
def list_scales(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
) -> list[ScaleRead]:
    scales = db.scalars(
        select(GerenciamentoEscala).options(selectinload(GerenciamentoEscala.voluntario))
    ).all()
    return [
        ScaleRead(
            id_escala=item.id_escala,
            especialidade=item.especialidade,
            inicio_plantao=item.inicio_plantao,
            fim_plantao=item.fim_plantao,
            voluntario_nome=item.voluntario.nome_completo,
            perfil=item.voluntario.perfil,
        )
        for item in scales
    ]


@router.get("/daily-activities", response_model=list[DailyActivityRead])
def list_daily_activities(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
) -> list[DailyActivityRead]:
    activities = db.scalars(
        select(AtividadeCotidiano).options(selectinload(AtividadeCotidiano.acolhido))
    ).all()
    return [
        DailyActivityRead(
            id_atividade=item.id_atividade,
            acolhido_nome=item.acolhido.nome_completo,
            tarefa=item.tarefa,
            status=item.status,
        )
        for item in activities
    ]
