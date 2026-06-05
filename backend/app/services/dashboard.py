from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Acolhido, Insumo, PasswordRequest


def resolve_inventory_status(current: float, minimum: float) -> str:
    if current <= minimum * 0.5:
        return "Critico"
    if current <= minimum:
        return "Baixo"
    return "Adequado"


def build_dashboard_summary(db: Session) -> dict[str, int]:
    residents = db.scalars(select(Acolhido).where(Acolhido.status == "Ativo")).all()
    total_acolhidos = len(residents)
    acolhidos_masculinos = sum(1 for resident in residents if resident.genero == "M")
    acolhidos_femininos = sum(1 for resident in residents if resident.genero == "F")

    inventory = db.scalars(select(Insumo)).all()
    alertas_estoque = sum(
        1
        for item in inventory
        if resolve_inventory_status(float(item.estoque_atual), float(item.estoque_minimo)) != "Adequado"
    )

    solicitacoes_senha_pendentes = db.scalar(
        select(func.count()).select_from(PasswordRequest).where(PasswordRequest.status == "Pendente")
    ) or 0

    return {
        "total_acolhidos": total_acolhidos,
        "acolhidos_masculinos": acolhidos_masculinos,
        "acolhidos_femininos": acolhidos_femininos,
        "alertas_estoque": alertas_estoque,
        "solicitacoes_senha_pendentes": solicitacoes_senha_pendentes,
    }
