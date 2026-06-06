# Terra da Esperança

## Integrantes

- Kauan Rafael Silva Sena
- Caio Sanchez
- Yago Mestrinel Hoeppner

## Objetivo do sistema

O sistema tem como objetivo apoiar a rotina institucional da Terra da Esperança, com foco no controle de acolhidos, prontuário técnico, estoque, doações, escalas e acesso de usuários.

## Módulo escolhido para o protótipo

O protótipo funcional foi desenvolvido com foco no **núcleo de gestão de acolhidos**, incluindo login, dashboard, cadastro de acolhido, prontuário técnico e controle básico de estoque.

## Requisitos atendidos pelo protótipo

- autenticação de usuários
- cadastro e listagem de acolhidos
- visualização de prontuário técnico
- indicadores em dashboard
- gestão básica de estoque
- cadastro de doadores e doações
- controle de usuários e perfis

## Tecnologias utilizadas

- React
- Vite
- FastAPI
- SQLAlchemy
- PostgreSQL
- Supabase
- CSS

## Estrutura do projeto

```text
Projeto/
|-- .env.example
|-- .env.local
|-- .gitignore
|-- README.md
|-- index.html
|-- package.json
|-- package-lock.json
|-- vite.config.js
|-- backend/
|   |-- .env
|   |-- .env.example
|   |-- requirements.txt
|   |-- app/
|   |   |-- api/
|   |   |   |-- routes/
|   |   |   |-- deps.py
|   |   |   |-- router.py
|   |   |-- core/
|   |   |   |-- config.py
|   |   |   |-- security.py
|   |   |-- db/
|   |   |   |-- base.py
|   |   |   |-- base_class.py
|   |   |   |-- init_db.py
|   |   |   |-- seed.py
|   |   |   |-- session.py
|   |   |   |-- storage.py
|   |   |-- models/
|   |   |   |-- governance.py
|   |   |   |-- logistics.py
|   |   |   |-- resident.py
|   |   |   |-- user.py
|   |   |-- schemas/
|   |   |   |-- auth.py
|   |   |   |-- dashboard.py
|   |   |   |-- governance.py
|   |   |   |-- inventory.py
|   |   |   |-- operations.py
|   |   |   |-- residents.py
|   |   |   |-- users.py
|   |   |-- services/
|   |   |   |-- dashboard.py
|   |   |   |-- reports.py
|   |   |-- main.py
|-- public/
|   |-- logo-full.svg
|   |-- logo-mark.svg
|-- src/
|   |-- app/
|   |   |-- persistence.js
|   |   |-- viewConfig.js
|   |-- components/
|   |   |-- ErrorBoundary.jsx
|   |   |-- MetricCard.jsx
|   |   |-- Modal.jsx
|   |   |-- NotificationsPanel.jsx
|   |   |-- Sidebar.jsx
|   |   |-- Toast.jsx
|   |   |-- Topbar.jsx
|   |-- data/
|   |   |-- initialState.js
|   |-- services/
|   |   |-- api.js
|   |   |-- remoteState.js
|   |   |-- storage.js
|   |-- styles/
|   |   |-- app.css
|   |-- utils/
|   |   |-- helpers.js
|   |-- views/
|   |   |-- shared/
|   |   |-- AcessoView.jsx
|   |   |-- AcolhidosView.jsx
|   |   |-- AuditoriaView.jsx
|   |   |-- CadastroView.jsx
|   |   |-- DashboardView.jsx
|   |   |-- DoacoesView.jsx
|   |   |-- DoadoresView.jsx
|   |   |-- EscalasView.jsx
|   |   |-- EstoqueView.jsx
|   |   |-- LoginView.jsx
|   |   |-- ProntuarioView.jsx
|   |   |-- RelatoriosView.jsx
|   |   |-- TriagensView.jsx
|   |   |-- index.js
|   |-- App.jsx
|   |-- main.jsx
```

## O que foi implementado

- frontend funcional com navegação entre módulos
- backend inicial com API em FastAPI
- integração com banco online no Supabase
- tela de login
- dashboard com indicadores
- cadastro de acolhido
- prontuário técnico com abas
- controle básico de estoque
- cadastro de doadores e registro de doações
- gerenciamento de usuários

## O que ficou apenas planejado

- regras mais avançadas de auditoria
- upload completo de documentos do acolhido
- deploy público da API
- maior cobertura de testes
- refinamento final de permissões por perfil

## Dificuldades encontradas

- adaptação do design para uma estrutura funcional de frontend e backend
- integração entre React, FastAPI e banco online
- ajuste de layout e responsividade das telas
- organização do estado da aplicação

## Próximos passos

- finalizar integrações restantes com a API
- ampliar as regras de negócio no backend
- publicar a API em ambiente online
- revisar permissões e validações
- evoluir o protótipo para uma versão mais próxima de produção

## Como executar

O projeto já está configurado para avaliação, incluindo integração com banco e storage. Não é necessário criar arquivos de ambiente manualmente.

### Frontend

```bash
cd Projeto
npm install
npm run dev
```

### Backend

```bash
cd Projeto
npm run api:install
npm run api:init
npm run api:dev
```

Abra o frontend em `http://127.0.0.1:5173` ou no endereço exibido pelo Vite no terminal.

## Acesso de demonstração

- técnico: `tecnico@terra.org` / `1234`
- administrador: `admin@terra.org` / `1234`
