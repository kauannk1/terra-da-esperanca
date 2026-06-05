import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class InventoryItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_insumo: uuid.UUID
    nome_item: str
    categoria: str
    imagem_ref: str | None = None
    unidade: str
    estoque_atual: Decimal
    estoque_minimo: Decimal
    valor_unitario: Decimal
    status: str


class InventoryCreate(BaseModel):
    nome_item: str
    categoria: str
    imagem_ref: str | None = None
    unidade: str = "un"
    estoque_atual: Decimal
    estoque_minimo: Decimal
    valor_unitario: Decimal


class StockAdjustmentCreate(BaseModel):
    tipo: str
    quantidade: Decimal
    observacao: str | None = None
    destino: str | None = None
    id_doador: uuid.UUID | None = None


class DonorRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_doador: uuid.UUID
    nome_doador: str
    tipo_doador: str
    ultima_doacao: str | None = None


class DonorCreate(BaseModel):
    nome_doador: str
    tipo_doador: str
    ultima_doacao: str | None = None


class MovementRead(BaseModel):
    id_mov: uuid.UUID
    tipo: str
    quantidade: Decimal
    observacao: str | None = None
    destino: str | None = None
    criado_em: datetime
    item: str
    unidade: str
    usuario: str
    doador: str | None = None


class DonationRead(BaseModel):
    id_mov: uuid.UUID
    data: datetime
    doador: str
    tipo_doador: str
    item: str
    quantidade: str
    destino: str | None = None


class DonationCreate(BaseModel):
    doador: str
    tipo_doador: str
    item: str
    categoria: str
    quantidade: Decimal
    unidade: str = "un"
    destino: str | None = None
