# Terra da Esperança

Sistema acadêmico desenvolvido para a disciplina **Laboratório de Engenharia de Software** da **FATEC Ribeirão Preto**, representando a transição entre as etapas de **levantamento de requisitos**, **design** e **desenvolvimento** do projeto da instituição **Terra da Esperança**.

## Visão geral

O sistema foi pensado para apoiar a rotina institucional da Terra da Esperança, com foco em:

- controle de acolhidos
- prontuário técnico
- triagem inicial
- gestão de estoque e doações
- escalas e rotina operacional
- auditoria e governança
- controle de acesso de usuários

O projeto está dividido em:

- **frontend** em React + Vite
- **backend** em FastAPI
- **banco e storage** em Supabase

## Módulos representados

- **Identity & Access**
  - autenticação, perfis e controle de usuários
- **Assistance Core**
  - triagem, cadastro de acolhidos e prontuário técnico
- **Daily Operations**
  - escalas de voluntários e atividades do cotidiano
- **Logistics & Inventory**
  - estoque, doadores e doações
- **Governance & BI**
  - auditoria, relatórios e indicadores

## Funcionalidades implementadas

- login com perfil técnico e administrador
- dashboard com indicadores de acolhidos, vagas e estoque
- triagem inicial de candidatos
- cadastro e listagem de acolhidos
- prontuário técnico com abas
- controle inicial da situação documental do acolhido
- gerenciamento de estoque com filtros e alertas
- cadastro de doadores e registro de doações
- escalas e atividades operacionais
- auditoria e relatórios
- gerenciamento de usuários
- integração com API FastAPI
- integração com banco online no Supabase
- integração com Supabase Storage para arquivos de perfil
- busca de CEP via ViaCEP

## Arquitetura

```mermaid
flowchart LR
    U["Usuário"] --> F["Frontend React"]
    F --> A["API FastAPI"]
    A --> D["Supabase PostgreSQL"]
    A --> S["Supabase Storage"]
```

## Stack utilizada

### Frontend

- React
- Vite
- Lucide React
- CSS

### Backend

- FastAPI
- SQLAlchemy
- Pydantic Settings
- Psycopg
- Python-JOSE
- Passlib

### Infraestrutura

- Supabase PostgreSQL
- Supabase Storage
- ViaCEP

## Estrutura do projeto

```text
Projeto/
|-- backend/
|   |-- .env.example
|   |-- requirements.txt
|   |-- app/
|   |   |-- api/
|   |   |   |-- routes/
|   |   |   |-- deps.py
|   |   |   |-- router.py
|   |   |-- core/
|   |   |-- db/
|   |   |-- models/
|   |   |-- schemas/
|   |   |-- services/
|   |   |-- main.py
|-- public/
|   |-- logo-full.svg
|   |-- logo-mark.svg
|-- src/
|   |-- app/
|   |   |-- persistence.js
|   |   |-- viewConfig.js
|   |-- components/
|   |-- data/
|   |-- services/
|   |-- styles/
|   |-- utils/
|   |-- views/
|   |   |-- shared/
|   |   |-- LoginView.jsx
|   |   |-- DashboardView.jsx
|   |   |-- CadastroView.jsx
|   |   |-- ProntuarioView.jsx
|   |   |-- EstoqueView.jsx
|   |   |-- AcessoView.jsx
|   |   |-- index.js
|   |-- App.jsx
|   |-- main.jsx
|-- .env.example
|-- .gitignore
|-- index.html
|-- package.json
|-- package-lock.json
|-- vite.config.js
|-- README.md
```

## Como a estrutura está organizada

### Frontend

- `src/App.jsx`
  - orquestra o estado principal, navegação, autenticação, modais e ações globais
- `src/app/`
  - concentra persistência local e configuração estrutural das telas
- `src/views/`
  - separa o sistema por telas e módulos, facilitando manutenção e apresentação
- `src/views/shared/`
  - componentes pequenos reutilizados entre telas
- `src/components/`
  - peças globais de interface
- `src/services/`
  - integração com API e storage
- `src/utils/`
  - funções utilitárias puras

### Backend

- `backend/app/api/`
  - rotas da API e dependências
- `backend/app/models/`
  - modelagem ORM
- `backend/app/schemas/`
  - contratos de entrada e saída da API
- `backend/app/db/`
  - conexão, inicialização e seed
- `backend/app/services/`
  - regras de apoio e agregações do backend

## Pré-requisitos

- Node.js 20+
- Python 3.11+
- conta/configuração do Supabase

## Configuração de ambiente

### Frontend

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_API_URL=http://127.0.0.1:8000/api/v1
VITE_SUPABASE_URL=SEU_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_STORAGE_BUCKET=terra-esperanca-arquivos
```

### Backend

Crie ou ajuste `backend/.env`:

```env
APP_NAME=Terra da Esperança API
API_V1_PREFIX=/api/v1
SECRET_KEY=troque-esta-chave-em-producao
ACCESS_TOKEN_EXPIRE_MINUTES=720
BACKEND_CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require
```

## Como executar

### 1. Frontend

```bash
cd "/Users/kauan/Documents/Fatec/Eng Software/Projeto"
npm install
npm run dev
```

Endereço padrão:

- [http://127.0.0.1:4173](http://127.0.0.1:4173)

### 2. Backend

```bash
cd "/Users/kauan/Documents/Fatec/Eng Software/Projeto"
npm run api:install
npm run api:init
npm run api:dev
```

Endpoints úteis:

- API root: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Swagger: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Healthcheck: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)

## Scripts disponíveis

```bash
npm run dev
npm run build
npm run preview
npm run api:install
npm run api:init
npm run api:dev
```

## Acessos de demonstração

### Técnico

- e-mail: `tecnico@terra.org`
- senha: `1234`

### Administrador

- e-mail: `admin@terra.org`
- senha: `1234`

## Situação atual do projeto

O projeto já está em um ponto bom para:

- apresentação acadêmica
- demonstração funcional
- evidência da passagem de design para desenvolvimento

Ele ainda não pretende ser um produto final pronto para produção, mas já demonstra:

- arquitetura separada entre frontend e backend
- persistência em banco online
- integração com storage
- módulos organizados
- fluxos principais implementados

## Integrantes

- Caio Sanchez da Silva
- Kauan Rafael Silva Sena
- Yago Mestrinel Hoeppner
