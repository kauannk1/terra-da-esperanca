from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_user, get_db
from app.models import Acolhido, AuditLog, DocumentoAcolhido, ProntuarioTecnico, Usuario
from app.schemas import (
    ResidentAlertRead,
    ResidentCreate,
    ResidentDetail,
    ResidentDocumentRead,
    ResidentListItem,
    TimelineEventRead,
)

router = APIRouter()


@router.get("", response_model=list[ResidentListItem])
def list_residents(
    search: str | None = Query(default=None),
    status_filter: str | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
) -> list[ResidentListItem]:
    query = select(Acolhido)
    residents = db.scalars(query).all()

    if search:
        search_lower = search.lower()
        residents = [
            resident
            for resident in residents
            if search_lower in resident.nome_completo.lower()
            or search_lower in resident.cpf
            or search_lower in (resident.origem_encaminhamento or "").lower()
        ]
    if status_filter:
        residents = [resident for resident in residents if resident.status == status_filter]

    return [ResidentListItem.model_validate(resident) for resident in residents]


@router.get("/{resident_id}", response_model=ResidentDetail)
def get_resident(
    resident_id: UUID,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
) -> ResidentDetail:
    resident = db.scalar(
        select(Acolhido)
        .where(Acolhido.id_acolhido == resident_id)
        .options(
            selectinload(Acolhido.documentos),
            selectinload(Acolhido.alertas),
            selectinload(Acolhido.prontuarios).selectinload(ProntuarioTecnico.profissional),
        )
    )
    if not resident:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Acolhido nao encontrado.")

    timeline = [
        TimelineEventRead(
            id_prontuario=item.id_prontuario,
            titulo=item.titulo,
            conteudo=item.conteudo,
            data_registro=item.data_registro,
            profissional=item.profissional.nome_completo,
        )
        for item in sorted(resident.prontuarios, key=lambda note: note.data_registro, reverse=True)
    ]

    payload = ResidentDetail.model_validate(resident).model_dump()
    payload["documentos"] = [ResidentDocumentRead.model_validate(doc) for doc in resident.documentos]
    payload["alertas"] = [ResidentAlertRead.model_validate(alert) for alert in resident.alertas]
    payload["timeline"] = timeline
    return ResidentDetail(**payload)


@router.post("", response_model=ResidentListItem, status_code=status.HTTP_201_CREATED)
def create_resident(
    payload: ResidentCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
) -> ResidentListItem:
    digits = "".join(filter(str.isdigit, payload.cpf))
    existing = db.scalar(select(Acolhido).where(Acolhido.cpf == digits))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="CPF ja cadastrado.")

    active_same_gender = db.scalars(
        select(Acolhido).where(Acolhido.status == "Ativo", Acolhido.genero == payload.genero)
    ).all()
    if payload.status == "Ativo" and len(active_same_gender) >= 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Capacidade maxima atingida para este genero.",
        )

    resident = Acolhido(
        cpf=digits,
        nome_completo=payload.nome_completo,
        nome_social=payload.nome_social,
        genero=payload.genero,
        score_inicial=payload.score_inicial,
        status=payload.status,
        data_nascimento=payload.data_nascimento,
        telefone=payload.telefone,
        email=payload.email,
        nacionalidade=payload.nacionalidade,
        etnia_cor=payload.etnia_cor,
        naturalidade=payload.naturalidade,
        estado_civil=payload.estado_civil,
        origem_encaminhamento=payload.origem_encaminhamento,
        vinculo=payload.vinculo,
        responsavel_legal=payload.responsavel_legal,
        id_responsavel_cadastro=current_user.id_voluntario,
        data_acolhimento=payload.data_acolhimento,
        observacoes_gerais=payload.observacoes_gerais,
        condicao_saude=payload.condicao_saude,
        situacao_escolar=payload.situacao_escolar,
        comportamento=payload.comportamento,
        rede_apoio=payload.rede_apoio,
        acompanhamento_psicologico=payload.acompanhamento_psicologico,
        acompanhamento_social=payload.acompanhamento_social,
        objetivo_plano=payload.objetivo_plano,
        revisao_prevista=payload.revisao_prevista,
        plano_status=payload.plano_status,
        responsavel_plano=payload.responsavel_plano,
        cep=payload.cep,
        logradouro=payload.logradouro,
        numero=payload.numero,
        complemento=payload.complemento,
        bairro=payload.bairro,
        cidade=payload.cidade,
        estado=payload.estado,
    )
    db.add(resident)
    db.flush()

    for document in payload.documentos:
        db.add(
            DocumentoAcolhido(
                id_acolhido=resident.id_acolhido,
                tipo_documento=document.tipo_documento,
                nome_arquivo=document.nome_arquivo,
                storage_url=document.storage_url,
                status_documento=document.status_documento,
            )
        )

    db.add(
        AuditLog(
            acao="Acolhido cadastrado",
            modulo="Gestao de pessoas",
            usuario_nome=current_user.nome_completo,
        )
    )
    db.commit()
    db.refresh(resident)
    return ResidentListItem.model_validate(resident)
