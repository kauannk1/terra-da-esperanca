from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Acolhido, AuditLog, Insumo, MovimentacaoEstoque
from app.services.dashboard import resolve_inventory_status


def build_executive_summary(db: Session) -> dict[str, int]:
    residents = db.scalars(select(Acolhido)).all()
    inventory = db.scalars(select(Insumo)).all()
    donations = db.scalars(select(MovimentacaoEstoque).where(MovimentacaoEstoque.tipo == "Entrada")).all()
    audit_logs = db.scalars(select(AuditLog)).all()

    active_residents = [resident for resident in residents if resident.status == "Ativo"]

    return {
        "acolhidos_ativos": len(active_residents),
        "vagas_masculinas": sum(1 for resident in active_residents if resident.genero == "M"),
        "vagas_femininas": sum(1 for resident in active_residents if resident.genero == "F"),
        "itens_criticos": sum(
            1
            for item in inventory
            if resolve_inventory_status(float(item.estoque_atual), float(item.estoque_minimo)) == "Critico"
        ),
        "acolhidos_com_apoio_psicologico": sum(
            1 for resident in active_residents if resident.acompanhamento_psicologico
        ),
        "doacoes_registradas": len(donations),
        "logs_auditoria": len(audit_logs),
    }
