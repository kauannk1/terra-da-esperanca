import uuid

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base, TimestampMixin


class Usuario(TimestampMixin, Base):
    __tablename__ = "usuarios"

    id_voluntario: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    nome_completo: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False, unique=True, index=True)
    cpf: Mapped[str] = mapped_column(String(11), nullable=False, unique=True, index=True)
    senha_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    perfil: Mapped[str] = mapped_column(String(30), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="Ativo")
    telefone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    foto_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    escalas = relationship("GerenciamentoEscala", back_populates="voluntario")
    acolhidos_cadastrados = relationship("Acolhido", back_populates="responsavel_cadastro")
    prontuarios = relationship("ProntuarioTecnico", back_populates="profissional")
    movimentacoes_estoque = relationship("MovimentacaoEstoque", back_populates="voluntario")
    solicitacoes_senha = relationship("PasswordRequest", back_populates="usuario")
