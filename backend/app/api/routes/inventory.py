from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_user, get_db
from app.models import AuditLog, Doador, Insumo, MovimentacaoEstoque, Usuario
from app.schemas import (
    DonationCreate,
    DonationRead,
    DonorCreate,
    DonorRead,
    InventoryCreate,
    InventoryItemRead,
    MovementRead,
    StockAdjustmentCreate,
)
from app.services.dashboard import resolve_inventory_status

router = APIRouter()


def _serialize_inventory(item: Insumo) -> InventoryItemRead:
    return InventoryItemRead(
        id_insumo=item.id_insumo,
        nome_item=item.nome_item,
        categoria=item.categoria,
        imagem_ref=item.imagem_ref,
        unidade=item.unidade,
        estoque_atual=item.estoque_atual,
        estoque_minimo=item.estoque_minimo,
        valor_unitario=item.valor_unitario,
        status=resolve_inventory_status(float(item.estoque_atual), float(item.estoque_minimo)),
    )


@router.get("", response_model=list[InventoryItemRead])
def list_inventory(
    search: str | None = Query(default=None),
    categoria: str | None = Query(default=None),
    status_filter: str | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
) -> list[InventoryItemRead]:
    items = db.scalars(select(Insumo)).all()
    results = [_serialize_inventory(item) for item in items]

    if search:
        search_lower = search.lower()
        results = [
            item for item in results
            if search_lower in item.nome_item.lower() or search_lower in item.categoria.lower()
        ]
    if categoria:
        results = [item for item in results if item.categoria == categoria]
    if status_filter:
        results = [item for item in results if item.status == status_filter]
    return results


@router.post("", response_model=InventoryItemRead, status_code=status.HTTP_201_CREATED)
def create_inventory_item(
    payload: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
) -> InventoryItemRead:
    item = Insumo(**payload.model_dump())
    db.add(item)
    db.add(AuditLog(acao="Item de estoque cadastrado", modulo="Rotina e logistica", usuario_nome=current_user.nome_completo))
    db.commit()
    db.refresh(item)
    return _serialize_inventory(item)


@router.post("/{item_id}/adjustments", response_model=MovementRead, status_code=status.HTTP_201_CREATED)
def adjust_inventory(
    item_id: UUID,
    payload: StockAdjustmentCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
) -> MovementRead:
    item = db.scalar(select(Insumo).where(Insumo.id_insumo == item_id))
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item nao encontrado.")

    quantity = Decimal(payload.quantidade)
    if payload.tipo == "Saida" and item.estoque_atual < quantity:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Estoque insuficiente para a saida.")

    if payload.tipo == "Saida":
        item.estoque_atual -= quantity
    else:
        item.estoque_atual += quantity

    movement = MovimentacaoEstoque(
        id_insumo=item.id_insumo,
        id_voluntario=current_user.id_voluntario,
        tipo=payload.tipo,
        quantidade=quantity,
        observacao=payload.observacao,
        destino=payload.destino,
        id_doador=payload.id_doador,
    )
    db.add(movement)
    db.add(
        AuditLog(
            acao=f"Movimentacao de estoque ({payload.tipo})",
            modulo="Rotina e logistica",
            usuario_nome=current_user.nome_completo,
        )
    )
    db.commit()
    db.refresh(movement)
    donor_name = db.scalar(select(Doador.nome_doador).where(Doador.id_doador == movement.id_doador)) if movement.id_doador else None
    return MovementRead(
        id_mov=movement.id_mov,
        tipo=movement.tipo,
        quantidade=movement.quantidade,
        observacao=movement.observacao,
        destino=movement.destino,
        criado_em=movement.criado_em,
        item=item.nome_item,
        unidade=item.unidade,
        usuario=current_user.nome_completo,
        doador=donor_name,
    )


@router.get("/movements", response_model=list[MovementRead])
def list_movements(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
) -> list[MovementRead]:
    movements = db.scalars(
        select(MovimentacaoEstoque)
        .options(
            selectinload(MovimentacaoEstoque.insumo),
            selectinload(MovimentacaoEstoque.voluntario),
            selectinload(MovimentacaoEstoque.doador),
        )
        .order_by(desc(MovimentacaoEstoque.criado_em))
    ).all()
    return [
        MovementRead(
            id_mov=item.id_mov,
            tipo=item.tipo,
            quantidade=item.quantidade,
            observacao=item.observacao,
            destino=item.destino,
            criado_em=item.criado_em,
            item=item.insumo.nome_item,
            unidade=item.insumo.unidade,
            usuario=item.voluntario.nome_completo,
            doador=item.doador.nome_doador if item.doador else None,
        )
        for item in movements
    ]


@router.get("/donors", response_model=list[DonorRead])
def list_donors(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
) -> list[DonorRead]:
    donors = db.scalars(select(Doador)).all()
    return [DonorRead.model_validate(donor) for donor in donors]


@router.post("/donors", response_model=DonorRead, status_code=status.HTTP_201_CREATED)
def create_donor(
    payload: DonorCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
) -> DonorRead:
    donor = Doador(**payload.model_dump())
    db.add(donor)
    db.add(AuditLog(acao="Doador cadastrado", modulo="Rotina e logistica", usuario_nome=current_user.nome_completo))
    db.commit()
    db.refresh(donor)
    return DonorRead.model_validate(donor)


@router.post("/donations", response_model=DonationRead, status_code=status.HTTP_201_CREATED)
def create_donation(
    payload: DonationCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
) -> DonationRead:
    donor = db.scalar(
        select(Doador).where(func.lower(Doador.nome_doador) == payload.doador.strip().lower())
    )
    if not donor:
        donor = Doador(
            nome_doador=payload.doador.strip(),
            tipo_doador=payload.tipo_doador,
            ultima_doacao=payload.item,
        )
        db.add(donor)
        db.flush()
    else:
        donor.tipo_doador = payload.tipo_doador
        donor.ultima_doacao = payload.item

    item = db.scalar(
        select(Insumo).where(
            func.lower(Insumo.nome_item) == payload.item.strip().lower(),
            func.lower(Insumo.unidade) == payload.unidade.strip().lower(),
        )
    )
    if not item:
        minimum = payload.quantidade / Decimal("4")
        item = Insumo(
            nome_item=payload.item.strip(),
            categoria=payload.categoria,
            imagem_ref=payload.item.strip()[:2].upper(),
            unidade=payload.unidade.strip(),
            estoque_atual=Decimal("0"),
            estoque_minimo=max(Decimal("1"), minimum),
            valor_unitario=Decimal("0"),
        )
        db.add(item)
        db.flush()

    item.estoque_atual += payload.quantidade

    movement = MovimentacaoEstoque(
        id_insumo=item.id_insumo,
        id_voluntario=current_user.id_voluntario,
        tipo="Entrada",
        quantidade=payload.quantidade,
        observacao="Doacao registrada",
        destino=payload.destino,
        id_doador=donor.id_doador,
    )
    db.add(movement)
    db.add(
        AuditLog(
            acao="Doacao registrada",
            modulo="Rotina e logistica",
            usuario_nome=current_user.nome_completo,
        )
    )
    db.commit()
    db.refresh(movement)
    db.refresh(item)
    db.refresh(donor)

    return DonationRead(
        id_mov=movement.id_mov,
        data=movement.criado_em,
        doador=donor.nome_doador,
        tipo_doador=donor.tipo_doador,
        item=item.nome_item,
        quantidade=f"{movement.quantidade} {item.unidade}",
        destino=movement.destino,
    )


@router.get("/donations", response_model=list[DonationRead])
def list_donations(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
) -> list[DonationRead]:
    donations = db.scalars(
        select(MovimentacaoEstoque)
        .where(MovimentacaoEstoque.tipo == "Entrada", MovimentacaoEstoque.id_doador.is_not(None))
        .options(
            selectinload(MovimentacaoEstoque.insumo),
            selectinload(MovimentacaoEstoque.doador),
        )
        .order_by(desc(MovimentacaoEstoque.criado_em))
    ).all()
    return [
        DonationRead(
            id_mov=item.id_mov,
            data=item.criado_em,
            doador=item.doador.nome_doador if item.doador else "Sem identificacao",
            tipo_doador=item.doador.tipo_doador if item.doador else "-",
            item=item.insumo.nome_item,
            quantidade=f"{item.quantidade} {item.insumo.unidade}",
            destino=item.destino,
        )
        for item in donations
    ]
