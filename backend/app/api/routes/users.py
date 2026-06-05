from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user, require_admin
from app.core.security import get_password_hash
from app.models import AuditLog, PasswordRequest, Usuario
from app.schemas import PasswordRequestRead, UserCreate, UserRead, UserUpdate

router = APIRouter()


@router.get("", response_model=list[UserRead])
def list_users(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
) -> list[UserRead]:
    users = db.scalars(select(Usuario).order_by(Usuario.nome_completo)).all()
    return [UserRead.model_validate(user) for user in users]


@router.post("", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_admin),
) -> UserRead:
    digits = "".join(filter(str.isdigit, payload.cpf))
    if db.scalar(select(Usuario).where(Usuario.email == str(payload.email).lower())):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="E-mail ja cadastrado.")
    if db.scalar(select(Usuario).where(Usuario.cpf == digits)):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="CPF ja cadastrado.")

    user = Usuario(
        nome_completo=payload.nome_completo,
        email=str(payload.email).lower(),
        cpf=digits,
        senha_hash=get_password_hash(payload.senha),
        perfil=payload.perfil,
        telefone=payload.telefone,
        foto_url=payload.foto_url,
        status="Ativo",
    )
    db.add(user)
    db.add(AuditLog(acao="Usuario cadastrado", modulo="Acesso e usuarios", usuario_nome=current_user.nome_completo))
    db.commit()
    db.refresh(user)
    return UserRead.model_validate(user)


@router.patch("/{user_id}", response_model=UserRead)
def update_user(
    user_id: UUID,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_admin),
) -> UserRead:
    user = db.scalar(select(Usuario).where(Usuario.id_voluntario == user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario nao encontrado.")

    data = payload.model_dump(exclude_unset=True)
    if "email" in data:
        data["email"] = str(data["email"]).lower()
    if "cpf" in data:
        data["cpf"] = "".join(filter(str.isdigit, str(data["cpf"])))
    if "senha" in data:
        data["senha_hash"] = get_password_hash(data.pop("senha"))
    if "status" in data and data["status"] not in {"Ativo", "Inativo"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Status invalido.")

    for key, value in data.items():
        setattr(user, key, value)

    db.add(AuditLog(acao="Usuario atualizado", modulo="Acesso e usuarios", usuario_nome=current_user.nome_completo))
    db.commit()
    db.refresh(user)
    return UserRead.model_validate(user)


@router.post("/{user_id}/reset-password", response_model=UserRead)
def reset_password(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_admin),
) -> UserRead:
    user = db.scalar(select(Usuario).where(Usuario.id_voluntario == user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario nao encontrado.")

    user.senha_hash = get_password_hash("1234")
    db.add(AuditLog(acao="Senha redefinida", modulo="Acesso e usuarios", usuario_nome=current_user.nome_completo))
    db.commit()
    db.refresh(user)
    return UserRead.model_validate(user)


@router.get("/password-requests", response_model=list[PasswordRequestRead])
def list_password_requests(
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
) -> list[PasswordRequestRead]:
    requests = db.scalars(select(PasswordRequest).order_by(PasswordRequest.requested_at.desc())).all()
    return [PasswordRequestRead.model_validate(item) for item in requests]


@router.post("/password-requests/{request_id}/resolve", response_model=PasswordRequestRead)
def resolve_password_request(
    request_id: UUID,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_admin),
) -> PasswordRequestRead:
    request = db.scalar(select(PasswordRequest).where(PasswordRequest.id_request == request_id))
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Solicitacao nao encontrada.")

    request.status = "Atendido"
    db.add(AuditLog(acao="Solicitacao de senha atendida", modulo="Acesso e usuarios", usuario_nome=current_user.nome_completo))
    db.commit()
    db.refresh(request)
    return PasswordRequestRead.model_validate(request)
