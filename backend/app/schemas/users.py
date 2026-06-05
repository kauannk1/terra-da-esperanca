import uuid

from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    nome_completo: str
    email: EmailStr
    cpf: str
    perfil: str
    telefone: str | None = None
    foto_url: str | None = None


class UserCreate(UserBase):
    senha: str


class UserUpdate(BaseModel):
    nome_completo: str | None = None
    email: EmailStr | None = None
    cpf: str | None = None
    perfil: str | None = None
    telefone: str | None = None
    foto_url: str | None = None
    senha: str | None = None
    status: str | None = None


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id_voluntario: uuid.UUID
    status: str


class PasswordRequestCreate(BaseModel):
    login: str


class PasswordRequestRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_request: uuid.UUID
    user_id: uuid.UUID
    contato: str
    status: str
