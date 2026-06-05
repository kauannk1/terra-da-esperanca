import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AuditLogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_log: uuid.UUID
    data_hora: datetime
    acao: str
    modulo: str
    usuario_nome: str


class ExecutiveSummary(BaseModel):
    acolhidos_ativos: int
    vagas_masculinas: int
    vagas_femininas: int
    itens_criticos: int
    acolhidos_com_apoio_psicologico: int
    doacoes_registradas: int
    logs_auditoria: int
