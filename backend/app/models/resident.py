import uuid
from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base, TimestampMixin


class Acolhido(TimestampMixin, Base):
    __tablename__ = "acolhidos"

    id_acolhido: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    cpf: Mapped[str] = mapped_column(String(11), nullable=False, unique=True, index=True)
    nome_completo: Mapped[str] = mapped_column(String(255), nullable=False)
    nome_social: Mapped[str | None] = mapped_column(String(255), nullable=True)
    genero: Mapped[str] = mapped_column(String(1), nullable=False)
    score_inicial: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="Ativo")
    data_nascimento: Mapped[date | None] = mapped_column(Date, nullable=True)
    telefone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    email: Mapped[str | None] = mapped_column(String(150), nullable=True)
    nacionalidade: Mapped[str | None] = mapped_column(String(80), nullable=True)
    etnia_cor: Mapped[str | None] = mapped_column(String(80), nullable=True)
    naturalidade: Mapped[str | None] = mapped_column(String(120), nullable=True)
    estado_civil: Mapped[str | None] = mapped_column(String(50), nullable=True)
    origem_encaminhamento: Mapped[str | None] = mapped_column(String(150), nullable=True)
    vinculo: Mapped[str | None] = mapped_column(String(120), nullable=True)
    responsavel_legal: Mapped[str | None] = mapped_column(String(150), nullable=True)
    id_responsavel_cadastro: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("usuarios.id_voluntario"),
        nullable=True,
    )
    data_acolhimento: Mapped[date | None] = mapped_column(Date, nullable=True)
    observacoes_gerais: Mapped[str | None] = mapped_column(Text, nullable=True)
    condicao_saude: Mapped[str | None] = mapped_column(String(80), nullable=True)
    situacao_escolar: Mapped[str | None] = mapped_column(String(80), nullable=True)
    comportamento: Mapped[str | None] = mapped_column(String(80), nullable=True)
    rede_apoio: Mapped[str | None] = mapped_column(String(120), nullable=True)
    acompanhamento_psicologico: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    acompanhamento_social: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    objetivo_plano: Mapped[str | None] = mapped_column(Text, nullable=True)
    revisao_prevista: Mapped[date | None] = mapped_column(Date, nullable=True)
    plano_status: Mapped[str | None] = mapped_column(String(50), nullable=True)
    responsavel_plano: Mapped[str | None] = mapped_column(String(150), nullable=True)
    cep: Mapped[str | None] = mapped_column(String(9), nullable=True)
    logradouro: Mapped[str | None] = mapped_column(String(150), nullable=True)
    numero: Mapped[str | None] = mapped_column(String(20), nullable=True)
    complemento: Mapped[str | None] = mapped_column(String(120), nullable=True)
    bairro: Mapped[str | None] = mapped_column(String(120), nullable=True)
    cidade: Mapped[str | None] = mapped_column(String(120), nullable=True)
    estado: Mapped[str | None] = mapped_column(String(2), nullable=True)

    responsavel_cadastro = relationship("Usuario", back_populates="acolhidos_cadastrados")
    documentos = relationship("DocumentoAcolhido", back_populates="acolhido", cascade="all, delete-orphan")
    prontuarios = relationship("ProntuarioTecnico", back_populates="acolhido", cascade="all, delete-orphan")
    alertas = relationship("AlertaAcolhido", back_populates="acolhido", cascade="all, delete-orphan")
    atividades = relationship("AtividadeCotidiano", back_populates="acolhido", cascade="all, delete-orphan")
    historico_saude = relationship("HistoricoSaudeAutonomia", back_populates="acolhido", cascade="all, delete-orphan")
    insercao_trabalho = relationship("InsercaoMercadoTrabalho", back_populates="acolhido", cascade="all, delete-orphan")


class DocumentoAcolhido(TimestampMixin, Base):
    __tablename__ = "documentos_acolhido"

    id_documento: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    id_acolhido: Mapped[uuid.UUID] = mapped_column(ForeignKey("acolhidos.id_acolhido"), nullable=False)
    tipo_documento: Mapped[str] = mapped_column(String(120), nullable=False)
    nome_arquivo: Mapped[str | None] = mapped_column(String(255), nullable=True)
    storage_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status_documento: Mapped[str] = mapped_column(String(30), nullable=False, default="Pendente")

    acolhido = relationship("Acolhido", back_populates="documentos")


class ProntuarioTecnico(TimestampMixin, Base):
    __tablename__ = "prontuarios_tecnicos"

    id_prontuario: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    id_acolhido: Mapped[uuid.UUID] = mapped_column(ForeignKey("acolhidos.id_acolhido"), nullable=False)
    id_profissional: Mapped[uuid.UUID] = mapped_column(ForeignKey("usuarios.id_voluntario"), nullable=False)
    titulo: Mapped[str] = mapped_column(String(150), nullable=False)
    conteudo: Mapped[str] = mapped_column(Text, nullable=False)
    is_sigiloso: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    data_registro: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    acolhido = relationship("Acolhido", back_populates="prontuarios")
    profissional = relationship("Usuario", back_populates="prontuarios")


class InsercaoMercadoTrabalho(TimestampMixin, Base):
    __tablename__ = "insercao_mercado_trabalho"

    id_trabalho: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    id_acolhido: Mapped[uuid.UUID] = mapped_column(ForeignKey("acolhidos.id_acolhido"), nullable=False)
    status_processo: Mapped[str] = mapped_column(String(30), nullable=False)
    curriculo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    empresa_curso: Mapped[str | None] = mapped_column(String(150), nullable=True)

    acolhido = relationship("Acolhido", back_populates="insercao_trabalho")


class HistoricoSaudeAutonomia(TimestampMixin, Base):
    __tablename__ = "historico_saude_autonomia"

    id_saude: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    id_acolhido: Mapped[uuid.UUID] = mapped_column(ForeignKey("acolhidos.id_acolhido"), nullable=False)
    especialidade: Mapped[str] = mapped_column(String(100), nullable=False)
    receituario_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    observacoes: Mapped[str | None] = mapped_column(Text, nullable=True)

    acolhido = relationship("Acolhido", back_populates="historico_saude")


class AtividadeCotidiano(TimestampMixin, Base):
    __tablename__ = "atividades_cotidiano"

    id_atividade: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    id_acolhido: Mapped[uuid.UUID] = mapped_column(ForeignKey("acolhidos.id_acolhido"), nullable=False)
    tarefa: Mapped[str] = mapped_column(String(150), nullable=False)
    status: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    acolhido = relationship("Acolhido", back_populates="atividades")


class AlertaAcolhido(TimestampMixin, Base):
    __tablename__ = "alertas_acolhido"

    id_alerta: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    id_acolhido: Mapped[uuid.UUID] = mapped_column(ForeignKey("acolhidos.id_acolhido"), nullable=False)
    tipo: Mapped[str] = mapped_column(String(30), nullable=False)
    texto: Mapped[str] = mapped_column(Text, nullable=False)
    data_alerta: Mapped[date] = mapped_column(Date, nullable=False)

    acolhido = relationship("Acolhido", back_populates="alertas")
