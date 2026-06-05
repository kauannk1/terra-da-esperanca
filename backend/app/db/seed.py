import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models import (
    Acolhido,
    AlertaAcolhido,
    AtividadeCotidiano,
    AuditLog,
    DocumentoAcolhido,
    Doador,
    GerenciamentoEscala,
    HistoricoSaudeAutonomia,
    Insumo,
    InsercaoMercadoTrabalho,
    MovimentacaoEstoque,
    PasswordRequest,
    ProntuarioTecnico,
    Usuario,
)


def uid(label: str) -> uuid.UUID:
    return uuid.uuid5(uuid.NAMESPACE_DNS, f"terra-esperanca:{label}")


def dt(value: str) -> datetime:
    return datetime.strptime(value, "%d/%m/%Y %H:%M")


def d(value: str) -> date:
    return datetime.strptime(value, "%d/%m/%Y").date()


def seed_database(db: Session) -> None:
    if db.scalar(select(Usuario.id_voluntario).limit(1)):
        return

    users = [
        Usuario(
            id_voluntario=uid("user-kauan"),
            nome_completo="Kauan Sena",
            email="tecnico@terra.org",
            cpf="52998224725",
            senha_hash=get_password_hash("1234"),
            perfil="Tecnico",
            status="Ativo",
            telefone="(16) 99999-0001",
        ),
        Usuario(
            id_voluntario=uid("user-marina"),
            nome_completo="Marina Costa",
            email="admin@terra.org",
            cpf="11144477735",
            senha_hash=get_password_hash("1234"),
            perfil="Administrador",
            status="Ativo",
            telefone="(16) 99999-0002",
        ),
        Usuario(
            id_voluntario=uid("user-ana"),
            nome_completo="Ana Clara",
            email="ana.clara@terra.org",
            cpf="25836914737",
            senha_hash=get_password_hash("1234"),
            perfil="Tecnico",
            status="Ativo",
            telefone="(16) 97777-3333",
        ),
        Usuario(
            id_voluntario=uid("user-carlos"),
            nome_completo="Carlos Eduardo",
            email="carlos.eduardo@terra.org",
            cpf="74185296354",
            senha_hash=get_password_hash("1234"),
            perfil="Tecnico",
            status="Ativo",
            telefone="(16) 98888-2222",
        ),
        Usuario(
            id_voluntario=uid("user-mariana"),
            nome_completo="Mariana Lima",
            email="mariana.lima@terra.org",
            cpf="36925814711",
            senha_hash=get_password_hash("1234"),
            perfil="Tecnico",
            status="Ativo",
            telefone="(16) 96666-4444",
        ),
    ]
    db.add_all(users)

    residents = [
        Acolhido(
            id_acolhido=uid("resident-lucas"),
            cpf="39053344705",
            nome_completo="Lucas Ferreira Santos",
            genero="M",
            score_inicial=78,
            status="Ativo",
            data_nascimento=date(2012, 5, 15),
            telefone="(16) 99988-4433",
            nacionalidade="Brasileira",
            etnia_cor="Parda",
            naturalidade="Ribeirao Preto",
            estado_civil="Nao se aplica",
            origem_encaminhamento="Conselho Tutelar",
            vinculo="Familiar",
            responsavel_legal="Maria Oliveira (Tia)",
            id_responsavel_cadastro=uid("user-kauan"),
            data_acolhimento=date(2024, 3, 10),
            observacoes_gerais="Acolhido encaminhado pelo Conselho Tutelar devido a situacao de vulnerabilidade familiar.",
            condicao_saude="Boa",
            situacao_escolar="Matriculado",
            comportamento="Estavel",
            rede_apoio="Familiar",
            acompanhamento_psicologico=True,
            acompanhamento_social=True,
            objetivo_plano="Promover o desenvolvimento emocional, escolar e social do acolhido.",
            revisao_prevista=date(2026, 7, 10),
            plano_status="Em andamento",
            responsavel_plano="Kauan Sena (Tecnico)",
            cep="14026-050",
            logradouro="Rua Antonio Carlucci",
            numero="212",
            bairro="Jardim California",
            cidade="Ribeirao Preto",
            estado="SP",
        ),
        Acolhido(
            id_acolhido=uid("resident-maria"),
            cpf="16899535009",
            nome_completo="Maria Oliveira",
            genero="F",
            score_inicial=81,
            status="Ativo",
            data_nascimento=date(1997, 8, 12),
            telefone="(16) 99999-1111",
            email="maria.oliveira@terra.org",
            nacionalidade="Brasileira",
            etnia_cor="Branca",
            naturalidade="Sertaozinho",
            estado_civil="Solteira",
            origem_encaminhamento="Clinica parceira",
            vinculo="Sem vinculo",
            responsavel_legal="-",
            id_responsavel_cadastro=uid("user-ana"),
            data_acolhimento=date(2026, 5, 10),
            observacoes_gerais="Em acompanhamento social e com boa adesao a rotina da casa.",
            condicao_saude="Boa",
            situacao_escolar="Concluido",
            comportamento="Estavel",
            rede_apoio="Equipe tecnica",
            acompanhamento_psicologico=True,
            acompanhamento_social=True,
            objetivo_plano="Promover autonomia e recolocacao no mercado de trabalho.",
            revisao_prevista=date(2026, 7, 10),
            plano_status="Em andamento",
            responsavel_plano="Ana Clara (Psicologa)",
            cep="14055-290",
            logradouro="Rua Carlos Chagas",
            numero="85",
            bairro="Jardim Paulista",
            cidade="Ribeirao Preto",
            estado="SP",
        ),
        Acolhido(
            id_acolhido=uid("resident-carlos"),
            cpf="74185296355",
            nome_completo="Carlos Souza",
            genero="M",
            score_inicial=73,
            status="Ativo",
            data_nascimento=date(1992, 3, 5),
            telefone="(16) 98888-2222",
            email="carlos.souza@terra.org",
            nacionalidade="Brasileira",
            etnia_cor="Parda",
            naturalidade="Barrinha",
            estado_civil="Solteiro",
            origem_encaminhamento="Encaminhamento familiar",
            vinculo="Familia ampliada",
            responsavel_legal="-",
            id_responsavel_cadastro=uid("user-carlos"),
            data_acolhimento=date(2026, 5, 17),
            observacoes_gerais="Busca recolocacao profissional e fortalecimento de autonomia.",
            condicao_saude="Boa",
            situacao_escolar="Ensino medio",
            comportamento="Estavel",
            rede_apoio="Familiar",
            acompanhamento_psicologico=False,
            acompanhamento_social=True,
            objetivo_plano="Fortalecer autonomia e estabilidade emocional.",
            revisao_prevista=date(2026, 7, 2),
            plano_status="Em andamento",
            responsavel_plano="Carlos Eduardo (Assistente Social)",
            cep="14140-000",
            logradouro="Rua Sete de Setembro",
            numero="18",
            bairro="Centro",
            cidade="Barrinha",
            estado="SP",
        ),
        Acolhido(
            id_acolhido=uid("resident-anafernandes"),
            cpf="25836914737",
            nome_completo="Ana Clara Fernandes",
            nome_social="Ana Clara",
            genero="F",
            score_inicial=76,
            status="Ativo",
            data_nascimento=date(2000, 10, 21),
            telefone="(16) 97777-3333",
            email="ana.claraf@terra.org",
            nacionalidade="Brasileira",
            etnia_cor="Preta",
            naturalidade="Pitangueiras",
            estado_civil="Solteira",
            origem_encaminhamento="Assistencia social",
            vinculo="Equipe tecnica",
            responsavel_legal="-",
            id_responsavel_cadastro=uid("user-kauan"),
            data_acolhimento=date(2026, 5, 20),
            observacoes_gerais="Acompanhamento psicologico em andamento e interesse em capacitacao profissional.",
            condicao_saude="Boa",
            situacao_escolar="Curso tecnico",
            comportamento="Estavel",
            rede_apoio="Equipe tecnica",
            acompanhamento_psicologico=True,
            acompanhamento_social=True,
            objetivo_plano="Apoiar capacitacao e autonomia.",
            revisao_prevista=date(2026, 7, 15),
            plano_status="Em andamento",
            responsavel_plano="Ana Clara (Psicologa)",
            cep="14750-000",
            logradouro="Rua da Praca",
            numero="40",
            bairro="Centro",
            cidade="Pitangueiras",
            estado="SP",
        ),
    ]
    db.add_all(residents)

    documents = [
        DocumentoAcolhido(id_acolhido=uid("resident-lucas"), tipo_documento="RG ou outro documento oficial", nome_arquivo="identificacao_lucas.pdf", status_documento="Disponivel"),
        DocumentoAcolhido(id_acolhido=uid("resident-lucas"), tipo_documento="CPF", nome_arquivo="cpf_lucas.pdf", status_documento="Disponivel"),
        DocumentoAcolhido(id_acolhido=uid("resident-lucas"), tipo_documento="Comprovante de endereco", nome_arquivo="nao_enviado", status_documento="Pendente"),
        DocumentoAcolhido(id_acolhido=uid("resident-lucas"), tipo_documento="Documento comprobatorio de idade", nome_arquivo="certidao_lucas.pdf", status_documento="Disponivel"),
        DocumentoAcolhido(id_acolhido=uid("resident-maria"), tipo_documento="RG ou outro documento oficial", nome_arquivo="rg_maria.pdf", status_documento="Disponivel"),
        DocumentoAcolhido(id_acolhido=uid("resident-maria"), tipo_documento="CPF", nome_arquivo="cpf_maria.pdf", status_documento="Disponivel"),
        DocumentoAcolhido(id_acolhido=uid("resident-maria"), tipo_documento="Comprovante de endereco", nome_arquivo="comprovante_maria.pdf", status_documento="Disponivel"),
        DocumentoAcolhido(id_acolhido=uid("resident-carlos"), tipo_documento="RG ou outro documento oficial", nome_arquivo="rg_carlos.pdf", status_documento="Disponivel"),
        DocumentoAcolhido(id_acolhido=uid("resident-carlos"), tipo_documento="CPF", nome_arquivo="cpf_carlos.pdf", status_documento="Disponivel"),
        DocumentoAcolhido(id_acolhido=uid("resident-anafernandes"), tipo_documento="RG ou outro documento oficial", nome_arquivo="rg_ana.pdf", status_documento="Disponivel"),
    ]
    db.add_all(documents)

    prontuarios = [
        ProntuarioTecnico(id_prontuario=uid("note-lucas-1"), id_acolhido=uid("resident-lucas"), id_profissional=uid("user-kauan"), titulo="Plano de acao atualizado", conteudo="Revisao do plano com foco em desenvolvimento escolar e social.", data_registro=dt("13/06/2026 10:30")),
        ProntuarioTecnico(id_prontuario=uid("note-lucas-2"), id_acolhido=uid("resident-lucas"), id_profissional=uid("user-ana"), titulo="Atendimento psicologico registrado", conteudo="Sessao concluida com boa participacao do acolhido.", data_registro=dt("06/06/2026 14:20")),
        ProntuarioTecnico(id_prontuario=uid("note-lucas-3"), id_acolhido=uid("resident-lucas"), id_profissional=uid("user-carlos"), titulo="Visita familiar realizada", conteudo="Contato com familiar mantido e retorno positivo.", data_registro=dt("30/05/2026 09:15")),
        ProntuarioTecnico(id_prontuario=uid("note-lucas-4"), id_acolhido=uid("resident-lucas"), id_profissional=uid("user-kauan"), titulo="Avaliacao inicial", conteudo="Triagem e registro de observacoes iniciais.", data_registro=dt("20/05/2026 11:00")),
        ProntuarioTecnico(id_prontuario=uid("note-maria-1"), id_acolhido=uid("resident-maria"), id_profissional=uid("user-ana"), titulo="Plano de autonomia revisado", conteudo="Meta de recolocacao profissional revisada.", data_registro=dt("12/06/2026 11:10")),
        ProntuarioTecnico(id_prontuario=uid("note-carlos-1"), id_acolhido=uid("resident-carlos"), id_profissional=uid("user-carlos"), titulo="Visita externa autorizada", conteudo="Acolhido liberado para compromisso de capacitacao.", data_registro=dt("08/06/2026 09:25")),
        ProntuarioTecnico(id_prontuario=uid("note-anaf-1"), id_acolhido=uid("resident-anafernandes"), id_profissional=uid("user-ana"), titulo="Acompanhamento psicologico registrado", conteudo="Encaminhamento para continuidade do atendimento.", data_registro=dt("10/06/2026 13:15")),
    ]
    db.add_all(prontuarios)

    alerts = [
        AlertaAcolhido(id_acolhido=uid("resident-lucas"), tipo="Atencao", texto="Acompanhar adaptacao escolar.", data_alerta=d("10/06/2026")),
        AlertaAcolhido(id_acolhido=uid("resident-lucas"), tipo="Informacao", texto="Proxima avaliacao psicologica em 27/06/2026.", data_alerta=d("13/06/2026")),
        AlertaAcolhido(id_acolhido=uid("resident-maria"), tipo="Informacao", texto="Entrevista de emprego agendada para a proxima semana.", data_alerta=d("12/06/2026")),
        AlertaAcolhido(id_acolhido=uid("resident-carlos"), tipo="Atencao", texto="Reforcar acompanhamento da busca ativa por trabalho.", data_alerta=d("11/06/2026")),
    ]
    db.add_all(alerts)

    work_records = [
        InsercaoMercadoTrabalho(id_acolhido=uid("resident-maria"), status_processo="Entrevista", empresa_curso="Rede varejista local"),
        InsercaoMercadoTrabalho(id_acolhido=uid("resident-carlos"), status_processo="Curriculo Enviado", empresa_curso="Curso SENAI"),
    ]
    db.add_all(work_records)

    health_records = [
        HistoricoSaudeAutonomia(id_acolhido=uid("resident-maria"), especialidade="Clinico Geral", observacoes="Retorno sem intercorrencias."),
        HistoricoSaudeAutonomia(id_acolhido=uid("resident-lucas"), especialidade="Psicologia", observacoes="Sessao semanal em andamento."),
    ]
    db.add_all(health_records)

    daily_activities = [
        AtividadeCotidiano(id_acolhido=uid("resident-lucas"), tarefa="Organizacao da sala de estudos", status=True),
        AtividadeCotidiano(id_acolhido=uid("resident-maria"), tarefa="Apoio na limpeza da cozinha", status=True),
        AtividadeCotidiano(id_acolhido=uid("resident-carlos"), tarefa="Controle do almoxarifado", status=False),
    ]
    db.add_all(daily_activities)

    scales = [
        GerenciamentoEscala(id_escala=uid("scale-1"), id_voluntario=uid("user-kauan"), especialidade="Acolhimento", inicio_plantao=dt("13/06/2026 08:00"), fim_plantao=dt("13/06/2026 14:00")),
        GerenciamentoEscala(id_escala=uid("scale-2"), id_voluntario=uid("user-ana"), especialidade="Psicologia", inicio_plantao=dt("13/06/2026 14:00"), fim_plantao=dt("13/06/2026 20:00")),
        GerenciamentoEscala(id_escala=uid("scale-3"), id_voluntario=uid("user-carlos"), especialidade="Servico Social", inicio_plantao=dt("14/06/2026 08:00"), fim_plantao=dt("14/06/2026 14:00")),
        GerenciamentoEscala(id_escala=uid("scale-4"), id_voluntario=uid("user-mariana"), especialidade="Monitoria", inicio_plantao=dt("14/06/2026 14:00"), fim_plantao=dt("14/06/2026 20:00")),
    ]
    db.add_all(scales)

    donors = [
        Doador(id_doador=uid("donor-mercado"), nome_doador="Mercado Bom Preco", tipo_doador="PJ", ultima_doacao="Alimentos nao pereciveis"),
        Doador(id_doador=uid("donor-patricia"), nome_doador="Patricia Gomes", tipo_doador="PF", ultima_doacao="Produtos de higiene"),
        Doador(id_doador=uid("donor-instituto"), nome_doador="Instituto Nova Chance", tipo_doador="PJ", ultima_doacao="Roupas e calcados"),
    ]
    db.add_all(donors)

    inventory = [
        Insumo(id_insumo=uid("insumo-arroz"), imagem_ref="AR", nome_item="Arroz Branco 5kg", categoria="Alimenticios", estoque_atual=Decimal("45"), unidade="un", estoque_minimo=Decimal("20"), valor_unitario=Decimal("23.90")),
        Insumo(id_insumo=uid("insumo-feijao"), imagem_ref="FC", nome_item="Feijao Carioca 1kg", categoria="Alimenticios", estoque_atual=Decimal("12"), unidade="un", estoque_minimo=Decimal("15"), valor_unitario=Decimal("8.50")),
        Insumo(id_insumo=uid("insumo-oleo"), imagem_ref="OS", nome_item="Oleo de Soja 900ml", categoria="Alimenticios", estoque_atual=Decimal("2"), unidade="un", estoque_minimo=Decimal("10"), valor_unitario=Decimal("6.90")),
        Insumo(id_insumo=uid("insumo-sabonete"), imagem_ref="SL", nome_item="Sabonete Liquido 250ml", categoria="Higiene", estoque_atual=Decimal("32"), unidade="un", estoque_minimo=Decimal("15"), valor_unitario=Decimal("4.20")),
        Insumo(id_insumo=uid("insumo-papel"), imagem_ref="PH", nome_item="Papel Higienico 30m", categoria="Higiene", estoque_atual=Decimal("8"), unidade="pct", estoque_minimo=Decimal("10"), valor_unitario=Decimal("12.30")),
        Insumo(id_insumo=uid("insumo-detergente"), imagem_ref="DT", nome_item="Detergente 500ml", categoria="Limpeza", estoque_atual=Decimal("3"), unidade="un", estoque_minimo=Decimal("8"), valor_unitario=Decimal("2.45")),
    ]
    db.add_all(inventory)

    movements = [
        MovimentacaoEstoque(id_mov=uid("mov-1"), id_insumo=uid("insumo-arroz"), id_voluntario=uid("user-kauan"), tipo="Entrada", quantidade=Decimal("50"), destino="Estoque geral", id_doador=uid("donor-mercado"), observacao="Doacao registrada", criado_em=dt("13/06/2026 10:15")),
        MovimentacaoEstoque(id_mov=uid("mov-2"), id_insumo=uid("insumo-sabonete"), id_voluntario=uid("user-kauan"), tipo="Saida", quantidade=Decimal("5"), destino="Higiene", observacao="Consumo diario", criado_em=dt("13/06/2026 09:30")),
        MovimentacaoEstoque(id_mov=uid("mov-3"), id_insumo=uid("insumo-papel"), id_voluntario=uid("user-carlos"), tipo="Entrada", quantidade=Decimal("20"), destino="Higiene", observacao="Compra emergencial", criado_em=dt("12/06/2026 16:45")),
        MovimentacaoEstoque(id_mov=uid("mov-4"), id_insumo=uid("insumo-detergente"), id_voluntario=uid("user-carlos"), tipo="Entrada", quantidade=Decimal("12"), destino="Limpeza", id_doador=uid("donor-patricia"), observacao="Doacao de reposicao", criado_em=dt("12/06/2026 08:10")),
    ]
    db.add_all(movements)

    audit_logs = [
        AuditLog(id_log=uid("audit-1"), data_hora=dt("13/06/2026 10:30"), acao="Cadastro de acolhido", modulo="Gestao de pessoas", usuario_nome="Kauan Sena"),
        AuditLog(id_log=uid("audit-2"), data_hora=dt("13/06/2026 09:30"), acao="Saida de item do estoque", modulo="Rotina e logistica", usuario_nome="Kauan Sena"),
        AuditLog(id_log=uid("audit-3"), data_hora=dt("12/06/2026 16:45"), acao="Atualizacao de prontuario", modulo="Gestao de pessoas", usuario_nome="Ana Clara"),
    ]
    db.add_all(audit_logs)

    password_requests = [
        PasswordRequest(id_request=uid("pwdreq-1"), user_id=uid("user-kauan"), contato="tecnico@terra.org", status="Pendente", requested_at=dt("13/06/2026 07:45")),
    ]
    db.add_all(password_requests)

    db.commit()
