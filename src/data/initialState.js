export const storageKey = "terra-da-esperanca-react-v2";

export const baseUser = {
  id: 1,
  nome: "Kauan Sena",
  email: "tecnico@terra.org",
  cpf: "52998224725",
  senha: "1234",
  perfil: "Tecnico",
  avatar: "KS",
  foto: null,
  telefone: "(16) 99999-0001",
  ativo: true
};

export const adminUser = {
  id: 2,
  nome: "Marina Costa",
  email: "admin@terra.org",
  cpf: "11144477735",
  senha: "1234",
  perfil: "Administrador",
  avatar: "MC",
  foto: null,
  telefone: "(16) 99999-0002",
  ativo: true
};

export const supportContacts = {
  email: "administracao@terra.org",
  telefone: "(16) 99999-0000",
  horario: "Seg a sex, 08h as 18h"
};

export const initialState = {
  currentUser: null,
  authToken: null,
  remoteMode: false,
  currentView: "dashboard",
  currentProntuarioTab: "resumo",
  selectedResidentId: 24,
  expandedMenus: {
    acolhidos: true,
    operacoes: true,
    estoque: true,
    governance: true
  },
  users: [
    baseUser,
    adminUser
  ],
  usersByRole: [
    { id: 1, nome: "Kauan Sena", cargo: "Tecnico", especialidade: "Acolhimento", inicio_plantao: "13/06/2026 08:00", fim_plantao: "13/06/2026 14:00" },
    { id: 3, nome: "Ana Clara", cargo: "Psicologa", especialidade: "Psicologia", inicio_plantao: "13/06/2026 14:00", fim_plantao: "13/06/2026 20:00" },
    { id: 4, nome: "Carlos Eduardo", cargo: "Assistente Social", especialidade: "Servico Social", inicio_plantao: "14/06/2026 08:00", fim_plantao: "14/06/2026 14:00" },
    { id: 5, nome: "Mariana Lima", cargo: "Monitora", especialidade: "Monitoria", inicio_plantao: "14/06/2026 14:00", fim_plantao: "14/06/2026 20:00" }
  ],
  residents: [
    {
      id: 24,
      nome: "Lucas Ferreira Santos",
      nomeSocial: "",
      cpf: "390.533.447-05",
      genero: "Masculino",
      dataNascimento: "2012-05-15",
      idade: 14,
      origem: "Conselho Tutelar",
      telefone: "(16) 99988-4433",
      email: "",
      nacionalidade: "Brasileira",
      etnia: "Parda",
      naturalidade: "Ribeirao Preto",
      estadoCivil: "Nao se aplica",
      endereco: {
        cep: "14026-050",
        logradouro: "Rua Antonio Carlucci",
        numero: "212",
        complemento: "",
        bairro: "Jardim California",
        cidade: "Ribeirao Preto",
        estado: "SP"
      },
      vinculo: "Familiar",
      responsavelLegal: "Maria Oliveira (Tia)",
      responsavelCadastro: "Kauan Sena",
      motivoAcolhimento: "Vulnerabilidade social",
      status: "Ativo",
      dataAcolhimento: "2024-03-10",
      observacoesGerais: "Acolhido encaminhado pelo Conselho Tutelar devido a situacao de vulnerabilidade familiar.",
      condicaoSaude: "Boa",
      situacaoEscolar: "Matriculado",
      comportamento: "Estavel",
      redeApoio: "Familiar",
      acompanhamentoPsicologico: "Sim",
      acompanhamentoSocial: "Sim",
      objetivoPlano: "Promover o desenvolvimento emocional, escolar e social do acolhido.",
      revisaoPrevista: "2026-07-10",
      planoStatus: "Em andamento",
      responsavelPlano: "Kauan Sena (Tecnico)",
      documentos: [
        { tipo: "RG ou outro documento oficial", nome: "identificacao_lucas.pdf", status: "Disponivel" },
        { tipo: "CPF", nome: "cpf_lucas.pdf", status: "Disponivel" },
        { tipo: "Comprovante de endereco", nome: "nao_enviado", status: "Pendente" },
        { tipo: "Documento comprobatorio de idade", nome: "certidao_lucas.pdf", status: "Disponivel" }
      ]
    },
    {
      id: 25,
      nome: "Maria Oliveira",
      nomeSocial: "",
      cpf: "168.995.350-09",
      genero: "Feminino",
      dataNascimento: "1997-08-12",
      idade: 28,
      origem: "Clinica parceira",
      telefone: "(16) 99999-1111",
      email: "maria.oliveira@terra.org",
      nacionalidade: "Brasileira",
      etnia: "Branca",
      naturalidade: "Sertaozinho",
      estadoCivil: "Solteira",
      endereco: {
        cep: "14055-290",
        logradouro: "Rua Carlos Chagas",
        numero: "85",
        complemento: "",
        bairro: "Jardim Paulista",
        cidade: "Ribeirao Preto",
        estado: "SP"
      },
      vinculo: "Sem vinculo",
      responsavelLegal: "-",
      responsavelCadastro: "Ana Clara",
      motivoAcolhimento: "Pos-tratamento",
      status: "Ativo",
      dataAcolhimento: "2026-05-10",
      observacoesGerais: "Em acompanhamento social e com boa adesao a rotina da casa.",
      condicaoSaude: "Boa",
      situacaoEscolar: "Concluido",
      comportamento: "Estavel",
      redeApoio: "Equipe tecnica",
      acompanhamentoPsicologico: "Sim",
      acompanhamentoSocial: "Sim",
      objetivoPlano: "Promover autonomia e recolocacao no mercado de trabalho.",
      revisaoPrevista: "2026-07-10",
      planoStatus: "Em andamento",
      responsavelPlano: "Ana Clara (Psicologa)",
      documentos: [
        { tipo: "RG ou outro documento oficial", nome: "rg_maria.pdf", status: "Disponivel" },
        { tipo: "CPF", nome: "cpf_maria.pdf", status: "Disponivel" },
        { tipo: "Comprovante de endereco", nome: "comprovante_maria.pdf", status: "Disponivel" },
        { tipo: "Documento comprobatorio de idade", nome: "nao_aplicavel", status: "Dispensado" }
      ]
    },
    {
      id: 26,
      nome: "Carlos Souza",
      nomeSocial: "",
      cpf: "741.852.963-55",
      genero: "Masculino",
      dataNascimento: "1992-03-05",
      idade: 34,
      origem: "Encaminhamento familiar",
      telefone: "(16) 98888-2222",
      email: "carlos.souza@terra.org",
      nacionalidade: "Brasileira",
      etnia: "Parda",
      naturalidade: "Barrinha",
      estadoCivil: "Solteiro",
      endereco: {
        cep: "14140-000",
        logradouro: "Rua Sete de Setembro",
        numero: "18",
        complemento: "",
        bairro: "Centro",
        cidade: "Barrinha",
        estado: "SP"
      },
      vinculo: "Familia ampliada",
      responsavelLegal: "-",
      responsavelCadastro: "Carlos Eduardo",
      motivoAcolhimento: "Encaminhamento institucional",
      status: "Ativo",
      dataAcolhimento: "2026-05-17",
      observacoesGerais: "Busca recolocacao profissional e fortalecimento de autonomia.",
      condicaoSaude: "Boa",
      situacaoEscolar: "Ensino medio",
      comportamento: "Estavel",
      redeApoio: "Familiar",
      acompanhamentoPsicologico: "Nao",
      acompanhamentoSocial: "Sim",
      objetivoPlano: "Fortalecer autonomia e estabilidade emocional.",
      revisaoPrevista: "2026-07-02",
      planoStatus: "Em andamento",
      responsavelPlano: "Carlos Eduardo (Assistente Social)",
      documentos: [
        { tipo: "RG ou outro documento oficial", nome: "rg_carlos.pdf", status: "Disponivel" },
        { tipo: "CPF", nome: "cpf_carlos.pdf", status: "Disponivel" },
        { tipo: "Comprovante de endereco", nome: "comprovante_carlos.pdf", status: "Disponivel" },
        { tipo: "Documento comprobatorio de idade", nome: "nao_aplicavel", status: "Dispensado" }
      ]
    },
    {
      id: 27,
      nome: "Ana Clara Fernandes",
      nomeSocial: "Ana Clara",
      cpf: "258.369.147-37",
      genero: "Feminino",
      dataNascimento: "2000-10-21",
      idade: 25,
      origem: "Assistencia social",
      telefone: "(16) 97777-3333",
      email: "ana.clara@terra.org",
      nacionalidade: "Brasileira",
      etnia: "Preta",
      naturalidade: "Pitangueiras",
      estadoCivil: "Solteira",
      endereco: {
        cep: "14750-000",
        logradouro: "Rua da Praca",
        numero: "40",
        complemento: "",
        bairro: "Centro",
        cidade: "Pitangueiras",
        estado: "SP"
      },
      vinculo: "Equipe tecnica",
      responsavelLegal: "-",
      responsavelCadastro: "Kauan Sena",
      motivoAcolhimento: "Vulnerabilidade social",
      status: "Ativo",
      dataAcolhimento: "2026-05-20",
      observacoesGerais: "Acompanhamento psicologico em andamento e interesse em capacitacao profissional.",
      condicaoSaude: "Boa",
      situacaoEscolar: "Curso tecnico",
      comportamento: "Estavel",
      redeApoio: "Equipe tecnica",
      acompanhamentoPsicologico: "Sim",
      acompanhamentoSocial: "Sim",
      objetivoPlano: "Apoiar capacitacao e autonomia.",
      revisaoPrevista: "2026-07-15",
      planoStatus: "Em andamento",
      responsavelPlano: "Ana Clara (Psicologa)",
      documentos: [
        { tipo: "RG ou outro documento oficial", nome: "rg_ana.pdf", status: "Disponivel" },
        { tipo: "CPF", nome: "cpf_ana.pdf", status: "Disponivel" },
        { tipo: "Comprovante de endereco", nome: "nao_enviado", status: "Pendente" },
        { tipo: "Documento comprobatorio de idade", nome: "nao_aplicavel", status: "Dispensado" }
      ]
    }
  ],
  triagens: [
    {
      id_triagem: "TRG-001",
      nome_candidato: "Rafael Mendes",
      cpf: "314.159.265-90",
      resultado: "Apto",
      profissional: "Ana Clara",
      data: "2026-05-12",
      observacao: "Demonstrou adesao as regras e disponibilidade para reinsercao social."
    },
    {
      id_triagem: "TRG-002",
      nome_candidato: "Luciana Alves",
      cpf: "271.828.182-05",
      resultado: "Inapto",
      profissional: "Carlos Eduardo",
      data: "2026-05-11",
      observacao: "Necessita encaminhamento especializado antes do acolhimento."
    }
  ],
  dailyActivities: [
    { id_atividade: "ATV-001", acolhido: "Lucas Ferreira Santos", tarefa: "Cozinha", status: true },
    { id_atividade: "ATV-002", acolhido: "Maria Oliveira", tarefa: "Limpeza do alojamento", status: true },
    { id_atividade: "ATV-003", acolhido: "Carlos Souza", tarefa: "Organizacao do refeitorio", status: false }
  ],
  activities: [
    { titulo: "Novo acolhido cadastrado", detalhe: "Lucas Ferreira Santos", tempo: "Ha 2 horas" },
    { titulo: "Prontuario atualizado", detalhe: "Maria Oliveira", tempo: "Ha 3 horas" },
    { titulo: "Movimentacao de estoque", detalhe: "Sabonete Liquido", tempo: "Ha 5 horas" },
    { titulo: "Doacao recebida", detalhe: "Alimentos nao pereciveis", tempo: "Ha 1 dia" }
  ],
  medicalTimeline: [
    { residentId: 24, data: "13/06/2026", hora: "10:30", titulo: "Plano de acao atualizado", autor: "Kauan Sena (Tecnico)" },
    { residentId: 24, data: "06/06/2026", hora: "14:20", titulo: "Atendimento psicologico registrado", autor: "Ana Clara (Psicologa)" },
    { residentId: 24, data: "30/05/2026", hora: "09:15", titulo: "Visita familiar realizada", autor: "Carlos Eduardo (Assistente Social)" },
    { residentId: 24, data: "20/05/2026", hora: "11:00", titulo: "Avaliacao inicial", autor: "Kauan Sena (Tecnico)" },
    { residentId: 25, data: "12/06/2026", hora: "11:10", titulo: "Plano de autonomia revisado", autor: "Ana Clara (Psicologa)" },
    { residentId: 25, data: "04/06/2026", hora: "15:40", titulo: "Consulta clinica registrada", autor: "Kauan Sena (Tecnico)" },
    { residentId: 26, data: "08/06/2026", hora: "09:25", titulo: "Visita externa autorizada", autor: "Carlos Eduardo (Assistente Social)" },
    { residentId: 27, data: "10/06/2026", hora: "13:15", titulo: "Acompanhamento psicologico registrado", autor: "Ana Clara (Psicologa)" }
  ],
  alerts: [
    { residentId: 24, tipo: "Atencao", texto: "Acompanhar adaptacao escolar.", data: "10/06/2026" },
    { residentId: 24, tipo: "Informacao", texto: "Proxima avaliacao psicologica em 27/06/2026.", data: "13/06/2026" },
    { residentId: 25, tipo: "Informacao", texto: "Entrevista de emprego agendada para a proxima semana.", data: "12/06/2026" },
    { residentId: 26, tipo: "Atencao", texto: "Reforcar acompanhamento da busca ativa por trabalho.", data: "11/06/2026" },
    { residentId: 27, tipo: "Informacao", texto: "Encaminhamento para curso tecnico registrado.", data: "09/06/2026" }
  ],
  inventory: [
    { id: 1, imagem: "AR", item: "Arroz Branco 5kg", categoria: "Alimenticios", estoqueAtual: 45, unidade: "un", estoqueMinimo: 20, valor: "R$ 23,90" },
    { id: 2, imagem: "FC", item: "Feijao Carioca 1kg", categoria: "Alimenticios", estoqueAtual: 12, unidade: "un", estoqueMinimo: 15, valor: "R$ 8,50" },
    { id: 3, imagem: "OS", item: "Oleo de Soja 900ml", categoria: "Alimenticios", estoqueAtual: 2, unidade: "un", estoqueMinimo: 10, valor: "R$ 6,90" },
    { id: 4, imagem: "SL", item: "Sabonete Liquido 250ml", categoria: "Higiene", estoqueAtual: 32, unidade: "un", estoqueMinimo: 15, valor: "R$ 4,20" },
    { id: 5, imagem: "PH", item: "Papel Higienico 30m", categoria: "Higiene", estoqueAtual: 8, unidade: "pct", estoqueMinimo: 10, valor: "R$ 12,30" },
    { id: 6, imagem: "CD", item: "Creme Dental 90g", categoria: "Higiene", estoqueAtual: 18, unidade: "un", estoqueMinimo: 15, valor: "R$ 3,80" },
    { id: 7, imagem: "DT", item: "Detergente 500ml", categoria: "Limpeza", estoqueAtual: 3, unidade: "un", estoqueMinimo: 8, valor: "R$ 2,45" },
    { id: 8, imagem: "AS", item: "Agua Sanitaria 1L", categoria: "Limpeza", estoqueAtual: 22, unidade: "un", estoqueMinimo: 10, valor: "R$ 3,10" }
  ],
  doadores: [
    { id_doador: "D-001", nome_doador: "Mercado Bom Preco", tipo_doador: "PJ", ultima_doacao: "Alimentos nao pereciveis" },
    { id_doador: "D-002", nome_doador: "Patricia Gomes", tipo_doador: "PF", ultima_doacao: "Produtos de higiene" },
    { id_doador: "D-003", nome_doador: "Instituto Nova Chance", tipo_doador: "PJ", ultima_doacao: "Roupas e calcados" }
  ],
  donations: [
    { data: "13/06/2026", doador: "Mercado Bom Preco", tipo: "PJ", item: "Arroz Branco 5kg", quantidade: "50 un", destino: "Estoque geral" },
    { data: "12/06/2026", doador: "Patricia Gomes", tipo: "PF", item: "Sabonete Liquido 250ml", quantidade: "24 un", destino: "Higiene" },
    { data: "11/06/2026", doador: "Instituto Nova Chance", tipo: "PJ", item: "Roupas e calcados", quantidade: "18 itens", destino: "Acolhimento inicial" }
  ],
  movements: [
    { tipo: "Entrada - Doacao", item: "Arroz Branco 5kg", detalhe: "Hoje, 10:15", quantidade: "50 un" },
    { tipo: "Saida - Consumo", item: "Sabonete Liquido 250ml", detalhe: "Hoje, 09:30", quantidade: "5 un" },
    { tipo: "Entrada - Compra", item: "Papel Higienico 30m", detalhe: "Ontem, 16:45", quantidade: "20 pct" }
  ],
  auditLogs: [
    { data: "13/06/2026 10:30", acao: "Cadastro de acolhido", modulo: "Gestao de pessoas", usuario: "Kauan Sena" },
    { data: "13/06/2026 09:30", acao: "Saida de item do estoque", modulo: "Rotina e logistica", usuario: "Kauan Sena" },
    { data: "12/06/2026 16:45", acao: "Atualizacao de prontuario", modulo: "Gestao de pessoas", usuario: "Ana Clara" }
  ],
  passwordRequests: [],
  lastUpdated: "13/06/2026 14:30",
  ui: {
    notificationsOpen: false,
    sidebarCollapsed: false,
    modal: null,
    toast: null,
    stockFilters: {
      search: "",
      category: "Todas",
      status: "Todos",
      estoque: "Todos",
      page: 1
    }
  }
};
