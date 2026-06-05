import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base, TimestampMixin


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id_log: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    data_hora: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    acao: Mapped[str] = mapped_column(String(200), nullable=False)
    modulo: Mapped[str] = mapped_column(String(120), nullable=False)
    usuario_nome: Mapped[str] = mapped_column(String(150), nullable=False)


class PasswordRequest(TimestampMixin, Base):
    __tablename__ = "password_requests"

    id_request: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("usuarios.id_voluntario"), nullable=False)
    contato: Mapped[str] = mapped_column(String(150), nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="Pendente")
    requested_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    usuario = relationship("Usuario", back_populates="solicitacoes_senha")
