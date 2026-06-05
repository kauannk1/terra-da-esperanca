import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base, TimestampMixin


class GerenciamentoEscala(TimestampMixin, Base):
    __tablename__ = "gerenciamento_escalas"

    id_escala: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    id_voluntario: Mapped[uuid.UUID] = mapped_column(ForeignKey("usuarios.id_voluntario"), nullable=False)
    especialidade: Mapped[str] = mapped_column(String(50), nullable=False)
    inicio_plantao: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    fim_plantao: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    voluntario = relationship("Usuario", back_populates="escalas")


class Insumo(TimestampMixin, Base):
    __tablename__ = "insumos"

    id_insumo: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    nome_item: Mapped[str] = mapped_column(String(100), nullable=False)
    categoria: Mapped[str] = mapped_column(String(80), nullable=False)
    imagem_ref: Mapped[str | None] = mapped_column(String(10), nullable=True)
    unidade: Mapped[str] = mapped_column(String(20), nullable=False, default="un")
    estoque_atual: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    estoque_minimo: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    valor_unitario: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False, default=0)

    movimentacoes = relationship("MovimentacaoEstoque", back_populates="insumo")


class Doador(TimestampMixin, Base):
    __tablename__ = "doadores"

    id_doador: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    nome_doador: Mapped[str] = mapped_column(String(150), nullable=False)
    tipo_doador: Mapped[str] = mapped_column(String(2), nullable=False)
    ultima_doacao: Mapped[str | None] = mapped_column(String(150), nullable=True)

    movimentacoes = relationship("MovimentacaoEstoque", back_populates="doador")


class MovimentacaoEstoque(TimestampMixin, Base):
    __tablename__ = "movimentacao_estoque"

    id_mov: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    id_insumo: Mapped[uuid.UUID] = mapped_column(ForeignKey("insumos.id_insumo"), nullable=False)
    id_voluntario: Mapped[uuid.UUID] = mapped_column(ForeignKey("usuarios.id_voluntario"), nullable=False)
    tipo: Mapped[str] = mapped_column(String(10), nullable=False)
    quantidade: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    observacao: Mapped[str | None] = mapped_column(String(255), nullable=True)
    destino: Mapped[str | None] = mapped_column(String(150), nullable=True)
    id_doador: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("doadores.id_doador"), nullable=True)
    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    insumo = relationship("Insumo", back_populates="movimentacoes")
    voluntario = relationship("Usuario", back_populates="movimentacoes_estoque")
    doador = relationship("Doador", back_populates="movimentacoes")
