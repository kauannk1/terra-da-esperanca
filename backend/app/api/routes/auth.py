from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.security import create_access_token, verify_password
from app.models import PasswordRequest, Usuario
from app.schemas import LoginRequest, PasswordRequestCreate, PasswordRequestRead, TokenResponse, UserRead

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    login_value = payload.login.strip().lower()
    digits = "".join(filter(str.isdigit, payload.login))

    user = db.scalar(
        select(Usuario).where(
            or_(Usuario.email == login_value, Usuario.cpf == digits)
        )
    )
    if not user or user.status != "Ativo" or not verify_password(payload.senha, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais invalidas.",
        )

    token = create_access_token(str(user.id_voluntario))
    return TokenResponse(access_token=token, user=UserRead.model_validate(user))


@router.get("/me", response_model=UserRead)
def me(current_user: Usuario = Depends(get_current_user)) -> UserRead:
    return UserRead.model_validate(current_user)


@router.post("/password-requests", response_model=PasswordRequestRead, status_code=status.HTTP_201_CREATED)
def request_password_reset(
    payload: PasswordRequestCreate,
    db: Session = Depends(get_db),
) -> PasswordRequestRead:
    login_value = payload.login.strip().lower()
    digits = "".join(filter(str.isdigit, payload.login))
    user = db.scalar(select(Usuario).where(or_(Usuario.email == login_value, Usuario.cpf == digits)))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario nao encontrado.")

    request = PasswordRequest(user_id=user.id_voluntario, contato=payload.login.strip(), status="Pendente")
    db.add(request)
    db.commit()
    db.refresh(request)
    return PasswordRequestRead.model_validate(request)
