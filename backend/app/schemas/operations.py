import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ScaleRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_escala: uuid.UUID
    especialidade: str
    inicio_plantao: datetime
    fim_plantao: datetime
    voluntario_nome: str
    perfil: str


class DailyActivityRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_atividade: uuid.UUID
    acolhido_nome: str
    tarefa: str
    status: bool
