import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class ResidentListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_acolhido: uuid.UUID
    nome_completo: str
    cpf: str
    genero: str
    status: str
    origem_encaminhamento: str | None = None
    data_acolhimento: date | None = None


class ResidentDocumentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_documento: uuid.UUID
    tipo_documento: str
    nome_arquivo: str | None = None
    storage_url: str | None = None
    status_documento: str


class ResidentAlertRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_alerta: uuid.UUID
    tipo: str
    texto: str
    data_alerta: date


class TimelineEventRead(BaseModel):
    id_prontuario: uuid.UUID
    titulo: str
    conteudo: str
    data_registro: datetime
    profissional: str


class ResidentDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_acolhido: uuid.UUID
    nome_completo: str
    nome_social: str | None = None
    cpf: str
    genero: str
    status: str
    data_nascimento: date | None = None
    telefone: str | None = None
    email: str | None = None
    nacionalidade: str | None = None
    etnia_cor: str | None = None
    naturalidade: str | None = None
    estado_civil: str | None = None
    origem_encaminhamento: str | None = None
    vinculo: str | None = None
    responsavel_legal: str | None = None
    data_acolhimento: date | None = None
    observacoes_gerais: str | None = None
    condicao_saude: str | None = None
    situacao_escolar: str | None = None
    comportamento: str | None = None
    rede_apoio: str | None = None
    acompanhamento_psicologico: bool
    acompanhamento_social: bool
    objetivo_plano: str | None = None
    revisao_prevista: date | None = None
    plano_status: str | None = None
    responsavel_plano: str | None = None
    cep: str | None = None
    logradouro: str | None = None
    numero: str | None = None
    complemento: str | None = None
    bairro: str | None = None
    cidade: str | None = None
    estado: str | None = None
    documentos: list[ResidentDocumentRead] = Field(default_factory=list)
    alertas: list[ResidentAlertRead] = Field(default_factory=list)
    timeline: list[TimelineEventRead] = Field(default_factory=list)


class ResidentDocumentCreate(BaseModel):
    tipo_documento: str
    nome_arquivo: str | None = None
    storage_url: str | None = None
    status_documento: str = "Pendente"


class ResidentCreate(BaseModel):
    cpf: str
    nome_completo: str
    nome_social: str | None = None
    genero: str
    score_inicial: int = 0
    status: str = "Ativo"
    data_nascimento: date | None = None
    telefone: str | None = None
    email: str | None = None
    nacionalidade: str | None = None
    etnia_cor: str | None = None
    naturalidade: str | None = None
    estado_civil: str | None = None
    origem_encaminhamento: str | None = None
    vinculo: str | None = None
    responsavel_legal: str | None = None
    data_acolhimento: date | None = None
    observacoes_gerais: str | None = None
    condicao_saude: str | None = None
    situacao_escolar: str | None = None
    comportamento: str | None = None
    rede_apoio: str | None = None
    acompanhamento_psicologico: bool = False
    acompanhamento_social: bool = False
    objetivo_plano: str | None = None
    revisao_prevista: date | None = None
    plano_status: str | None = None
    responsavel_plano: str | None = None
    cep: str | None = None
    logradouro: str | None = None
    numero: str | None = None
    complemento: str | None = None
    bairro: str | None = None
    cidade: str | None = None
    estado: str | None = None
    documentos: list[ResidentDocumentCreate] = Field(default_factory=list)
