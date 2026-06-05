import { startTransition, useEffect, useRef, useState } from "react";
import { Modal } from "./components/Modal";
import { NotificationsPanel } from "./components/NotificationsPanel";
import { Sidebar } from "./components/Sidebar";
import { Toast } from "./components/Toast";
import { Topbar } from "./components/Topbar";
import { ErrorBoundary } from "./components/ErrorBoundary";
import {
  baseUser,
  initialState,
  storageKey,
  supportContacts
} from "./data/initialState";
import { buildResidentDocuments, loadState } from "./app/persistence";
import { titleMap } from "./app/viewConfig";
import {
  AcessoView,
  AcolhidosView,
  AuditoriaView,
  CadastroView,
  DashboardView,
  DoacoesView,
  DoadoresView,
  EscalasView,
  EstoqueCategoriasView,
  EstoqueMovimentacoesView,
  EstoqueView,
  LoginView,
  ProntuarioView,
  RelatoriosView,
  TriagensView
} from "./views";
import {
  buildStockAlerts,
  calculateAge,
  clone,
  downloadCsv,
  formatCep,
  formatCpf,
  getCounts,
  getInitials,
  getInventoryMetrics,
  getNowLabel,
  getResidentById,
  isValidCpf,
  normalizeCurrencyInput,
  onlyDigits,
  parseCurrency,
  readFileAsDataUrl,
  sameId,
  slugify,
  withInventoryStatus
} from "./utils/helpers";
import { api, isApiConfigured } from "./services/api";
import { isStorageConfigured, uploadUserPhoto } from "./services/storage";
import {
  buildActivitiesFromAuditLogs,
  flattenResidentAlerts,
  flattenResidentTimeline,
  mapApiAuditLog,
  mapApiDailyActivity,
  mapApiDonation,
  mapApiDonor,
  mapApiInventoryItem,
  mapApiMovement,
  mapApiPasswordRequest,
  mapApiResident,
  mapApiScale,
  mapApiUser
} from "./services/remoteState";

export default function App() {
  const [state, setState] = useState(loadState);
  const toastTimerRef = useRef(null);
  const remoteSyncRef = useRef(false);

  const inventory = withInventoryStatus(state.inventory);
  const counts = getCounts(state.residents);
  const stockAlerts = buildStockAlerts(state.inventory);
  const metrics = getInventoryMetrics(state.inventory);
  const currentResident = getResidentById(state.residents, state.selectedResidentId) || state.residents[0] || null;
  const currentUser = state.currentUser || state.users[0] || baseUser;
  const residentTimeline = state.medicalTimeline.filter((item) => sameId(item.residentId, currentResident?.id));
  const residentAlerts = state.alerts.filter((item) => sameId(item.residentId, currentResident?.id));
  const globalAlerts = state.alerts;
  const pendingPasswordRequests = state.passwordRequests.filter((request) => request.status === "Pendente");
  const notificationsCount = stockAlerts.length + globalAlerts.length + (currentUser.perfil === "Administrador" ? pendingPasswordRequests.length : 0);
  const staffDirectory = state.usersByRole.map((item) => {
    const matchedUser = state.users.find((user) => slugify(user.nome) === slugify(item.nome));
    return {
      ...item,
      foto: matchedUser?.foto || null,
      avatar: matchedUser?.avatar || getInitials(item.nome)
    };
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.localStorage === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Ignore storage failures and keep the in-memory session active.
    }
  }, [state]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.__terraState = state;
  }, [state]);

  useEffect(() => {
    if (!isApiConfigured || !state.currentUser || state.authToken) return;
    setState((current) => ({
      ...current,
      currentUser: null,
      remoteMode: false,
      ui: {
        ...current.ui,
        notificationsOpen: false,
        modal: null
      }
    }));
  }, [state.currentUser, state.authToken]);

  useEffect(() => () => clearTimeout(toastTimerRef.current), []);

  function showToast(message, tone = "info") {
    clearTimeout(toastTimerRef.current);
    setState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        toast: { message, tone }
      }
    }));
    toastTimerRef.current = window.setTimeout(() => {
      setState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          toast: null
        }
      }));
    }, 2800);
  }

  async function syncRemoteState(token, apiUser, options = {}) {
    const userId = apiUser?.id_voluntario || apiUser?.id;
    const isAdminUser = (apiUser?.perfil || apiUser?.role) === "Administrador";

    const [
      residentSummaries,
      scalesResponse,
      dailyActivitiesResponse,
      inventoryResponse,
      movementsResponse,
      donorsResponse,
      donationsResponse,
      auditLogsResponse,
      usersResponse,
      passwordRequestsResponse
    ] = await Promise.all([
      api.residents(token),
      api.scales(token),
      api.dailyActivities(token),
      api.inventory(token),
      api.movements(token),
      api.donors(token),
      api.donations(token),
      api.auditLogs(token),
      api.users(token),
      isAdminUser ? api.passwordRequests(token) : Promise.resolve([])
    ]);

    const residentDetails = await Promise.all(
      residentSummaries.map((resident) => api.residentDetail(token, resident.id_acolhido))
    );

    const mappedUsers = usersResponse.map(mapApiUser);
    const usersByName = new Map(mappedUsers.map((user) => [user.nome, user]));
    const usersById = new Map(usersResponse.map((user) => [user.id_voluntario, user]));
    const mappedResidents = residentDetails.map(mapApiResident);
    const mappedAuditLogs = auditLogsResponse.map(mapApiAuditLog);
    const nextCurrentUser = mappedUsers.find((user) => sameId(user.id, userId)) || mappedUsers[0] || baseUser;
    const selectedResidentId = mappedResidents.find((resident) => sameId(resident.id, options.selectedResidentId || state.selectedResidentId))?.id
      || mappedResidents[0]?.id
      || state.selectedResidentId;

    setState((current) => ({
      ...current,
      authToken: token,
      remoteMode: true,
      users: mappedUsers,
      currentUser: nextCurrentUser,
      usersByRole: scalesResponse.map((scale) => mapApiScale(scale, usersByName)),
      residents: mappedResidents,
      dailyActivities: dailyActivitiesResponse.map(mapApiDailyActivity),
      activities: buildActivitiesFromAuditLogs(mappedAuditLogs).length ? buildActivitiesFromAuditLogs(mappedAuditLogs) : current.activities,
      medicalTimeline: flattenResidentTimeline(residentDetails),
      alerts: flattenResidentAlerts(residentDetails),
      inventory: inventoryResponse.map(mapApiInventoryItem),
      doadores: donorsResponse.map(mapApiDonor),
      donations: donationsResponse.map(mapApiDonation),
      movements: movementsResponse.map(mapApiMovement),
      auditLogs: mappedAuditLogs,
      passwordRequests: passwordRequestsResponse.map((request) => mapApiPasswordRequest(request, usersById)),
      selectedResidentId,
      currentView: options.currentView || current.currentView,
      lastUpdated: getNowLabel(),
      ui: {
        ...current.ui,
        notificationsOpen: false
      }
    }));
  }

  function navigate(nextView, options = {}) {
    startTransition(() => {
      setState((current) => ({
        ...current,
        currentView: nextView,
        currentProntuarioTab: nextView === "prontuario" ? (options.prontuarioTab || current.currentProntuarioTab) : "resumo",
        selectedResidentId: options.residentId ?? current.selectedResidentId,
        ui: {
          ...current.ui,
          notificationsOpen: false
        }
      }));
    });
  }

  function updateWithAudit(updater, successMessage, tone = "success") {
    const timestamp = getNowLabel();
    setState((current) => updater(current, timestamp));
    if (successMessage) showToast(successMessage, tone);
  }

  function openModal(type, payload = null) {
    setState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        modal: { type, payload }
      }
    }));
  }

  function closeModal() {
    setState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        modal: null
      }
    }));
  }

  useEffect(() => {
    if (!isApiConfigured || !state.currentUser || !state.authToken || remoteSyncRef.current) return;
    remoteSyncRef.current = true;
    syncRemoteState(state.authToken, state.currentUser).catch((error) => {
      remoteSyncRef.current = false;
      setState((current) => ({
        ...current,
        authToken: null,
        remoteMode: false
      }));
      showToast(error.message || "Nao foi possivel sincronizar a API configurada.", "info");
    });
  }, [state.authToken, state.currentUser]);

  async function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const login = String(formData.get("email") || "").trim();
    const senha = String(formData.get("senha") || "").trim();
    const loginCpf = onlyDigits(login);

    if (isApiConfigured) {
      try {
        const session = await api.login(login, senha);
        remoteSyncRef.current = true;
        await syncRemoteState(session.access_token, session.user, { currentView: "dashboard" });
        return;
      } catch (error) {
        remoteSyncRef.current = false;
        showToast(error.message || "Nao foi possivel acessar a API configurada.", "info");
        return;
      }
    }

    const matchedUser = state.users.find((user) => (
      user.ativo !== false
      && user.senha === senha
      && (
        user.email.toLowerCase() === login.toLowerCase()
        || onlyDigits(user.cpf) === loginCpf
      )
    ));

    if (!matchedUser) {
      showToast("Credenciais invalidas. Use um e-mail ou CPF cadastrado.", "info");
      return;
    }

    setState((current) => ({
      ...current,
      currentUser: matchedUser,
      currentView: "dashboard",
      ui: {
        ...current.ui,
        notificationsOpen: false
      }
    }));
  }

  function handleLogout() {
    remoteSyncRef.current = false;
    setState((current) => ({
      ...current,
      currentUser: null,
      authToken: null,
      remoteMode: false,
      ui: {
        ...current.ui,
        notificationsOpen: false,
        modal: null
      }
    }));
  }

  async function handleLookupCep(event) {
    const input = event.currentTarget;
    input.value = formatCep(input.value);
    const cep = onlyDigits(input.value);
    if (cep.length !== 8 || input.dataset.lastCepLookup === cep) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error("CEP nao encontrado");
      const data = await response.json();
      if (data.erro) throw new Error("CEP nao encontrado");
      const form = input.form;
      if (!form) return;
      form.elements.logradouro.value = data.logradouro || "";
      form.elements.bairro.value = data.bairro || "";
      form.elements.cidade.value = data.localidade || "";
      form.elements.estado.value = data.uf || "";
      input.dataset.lastCepLookup = cep;
    } catch {
      delete input.dataset.lastCepLookup;
      showToast("Nao foi possivel localizar o CEP informado.", "info");
    }
  }

  async function handleCadastro(formData) {
    const nome = String(formData.get("nome") || "").trim();
    const nomeSocial = String(formData.get("nomeSocial") || "").trim();
    const cpf = formatCpf(formData.get("cpf"));
    const genero = String(formData.get("genero") || "").trim();
    const dataNascimento = String(formData.get("dataNascimento") || "").trim();
    const dataAcolhimento = String(formData.get("dataAcolhimento") || "").trim();
    const motivoAcolhimento = String(formData.get("motivo") || "").trim();
    const origem = String(formData.get("origem") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const telefone = String(formData.get("telefone") || "").trim();

    if (!nome || !cpf || !genero || !dataNascimento || !dataAcolhimento || !motivoAcolhimento || !origem) {
      showToast("Preencha os campos obrigatorios para salvar o acolhido.", "info");
      return false;
    }

    if (!isValidCpf(cpf)) {
      showToast("O CPF informado para o acolhido nao e valido.", "info");
      return false;
    }

    if (new Date(dataNascimento).getTime() > Date.now()) {
      showToast("A data de nascimento nao pode estar no futuro.", "info");
      return false;
    }

    if (new Date(dataAcolhimento).getTime() < new Date(dataNascimento).getTime()) {
      showToast("A data de acolhimento nao pode ser anterior ao nascimento.", "info");
      return false;
    }

    if (state.residents.some((resident) => onlyDigits(resident.cpf) === onlyDigits(cpf))) {
      showToast("Ja existe um acolhido cadastrado com este CPF.", "info");
      return false;
    }

    const sameGenderActiveCount = state.residents.filter((resident) => resident.status === "Ativo" && resident.genero === genero).length;
    if (sameGenderActiveCount >= 10) {
      showToast(`A capacidade maxima para acolhidos do genero ${genero.toLowerCase()} ja foi atingida.`, "info");
      return false;
    }

    if (state.remoteMode && state.authToken) {
      const documentosPayload = buildResidentDocuments().map((documento) => ({
        tipo_documento: documento.tipo,
        nome_arquivo: documento.nome,
        storage_url: null,
        status_documento: documento.status
      }));

      const residentPayload = {
        cpf: onlyDigits(cpf),
        nome_completo: nome,
        nome_social: nomeSocial || null,
        genero: genero === "Feminino" ? "F" : "M",
        score_inicial: 0,
        status: "Ativo",
        data_nascimento: dataNascimento,
        telefone: telefone ? onlyDigits(telefone) : null,
        email: email || null,
        nacionalidade: String(formData.get("nacionalidade") || "").trim() || "Brasileira",
        etnia_cor: String(formData.get("etnia") || "").trim() || "Nao informado",
        naturalidade: String(formData.get("naturalidade") || "").trim() || "Nao informado",
        estado_civil: String(formData.get("estadoCivil") || "").trim() || "Nao informado",
        origem_encaminhamento: origem,
        vinculo: "Em avaliacao",
        responsavel_legal: "-",
        data_acolhimento: dataAcolhimento,
        observacoes_gerais: String(formData.get("observacoes") || "").trim() || "Sem observacoes registradas.",
        condicao_saude: "Em acompanhamento",
        situacao_escolar: "Em avaliacao",
        comportamento: "Monitorado",
        rede_apoio: "Equipe tecnica",
        acompanhamento_psicologico: false,
        acompanhamento_social: true,
        objetivo_plano: "Acompanhar evolucao inicial e estruturar plano individual de desenvolvimento.",
        revisao_prevista: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
        plano_status: "Em andamento",
        responsavel_plano: `${currentUser.nome} (${currentUser.perfil})`,
        cep: String(formData.get("cep") || "").trim() || null,
        logradouro: String(formData.get("logradouro") || "").trim() || null,
        numero: String(formData.get("numero") || "").trim() || null,
        complemento: String(formData.get("complemento") || "").trim() || null,
        bairro: String(formData.get("bairro") || "").trim() || null,
        cidade: String(formData.get("cidade") || "").trim() || null,
        estado: String(formData.get("estado") || "").trim() || null,
        documentos: documentosPayload
      };

      return api.createResident(state.authToken, residentPayload)
        .then(async (createdResident) => {
          await syncRemoteState(state.authToken, currentUser, {
            currentView: "acolhidos",
            selectedResidentId: createdResident.id_acolhido
          });
          showToast("Acolhido cadastrado com sucesso.", "success");
          return true;
        })
        .catch((error) => {
          showToast(error.message || "Nao foi possivel cadastrar o acolhido na API.", "info");
          return false;
        });
    }

    const newResident = {
      id: Date.now(),
      nome,
      nomeSocial,
      cpf,
      genero,
      dataNascimento,
      idade: calculateAge(dataNascimento),
      origem,
      telefone: telefone || "-",
      email,
      nacionalidade: String(formData.get("nacionalidade") || "").trim() || "Brasileira",
      etnia: String(formData.get("etnia") || "").trim() || "Nao informado",
      naturalidade: String(formData.get("naturalidade") || "").trim() || "Nao informado",
      estadoCivil: String(formData.get("estadoCivil") || "").trim() || "Nao informado",
      endereco: {
        cep: String(formData.get("cep") || "").trim(),
        logradouro: String(formData.get("logradouro") || "").trim(),
        numero: String(formData.get("numero") || "").trim(),
        complemento: String(formData.get("complemento") || "").trim(),
        bairro: String(formData.get("bairro") || "").trim(),
        cidade: String(formData.get("cidade") || "").trim(),
        estado: String(formData.get("estado") || "").trim()
      },
      vinculo: "Em avaliacao",
      responsavelLegal: "-",
      responsavelCadastro: currentUser.nome,
      motivoAcolhimento,
      status: "Ativo",
      dataAcolhimento,
      observacoesGerais: String(formData.get("observacoes") || "").trim() || "Sem observacoes registradas.",
      condicaoSaude: "Em acompanhamento",
      situacaoEscolar: "Em avaliacao",
      comportamento: "Monitorado",
      redeApoio: "Equipe tecnica",
      acompanhamentoPsicologico: "Em avaliacao",
      acompanhamentoSocial: "Sim",
      objetivoPlano: "Acompanhar evolucao inicial e estruturar plano individual de desenvolvimento.",
      revisaoPrevista: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
      planoStatus: "Em andamento",
      responsavelPlano: `${currentUser.nome} (${currentUser.perfil})`,
      documentos: buildResidentDocuments()
    };

    updateWithAudit((current, timestamp) => ({
      ...current,
      residents: [newResident, ...current.residents],
      dailyActivities: [
        {
          id_atividade: `ATV-${String(Date.now()).slice(-3)}`,
          acolhido: newResident.nome,
          tarefa: "Integracao inicial",
          status: false
        },
        ...current.dailyActivities
      ],
      medicalTimeline: [
        {
          residentId: newResident.id,
          data: new Date().toLocaleDateString("pt-BR"),
          hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
          titulo: "Cadastro inicial realizado",
          autor: `${current.currentUser?.nome || baseUser.nome} (${current.currentUser?.perfil || baseUser.perfil})`
        },
        ...current.medicalTimeline
      ],
      alerts: [
        {
          residentId: newResident.id,
          tipo: "Informacao",
          texto: "Cadastro inicial concluido. Aguardando avaliacao do plano de acao.",
          data: new Date().toLocaleDateString("pt-BR")
        },
        ...current.alerts
      ],
      activities: [
        { titulo: "Novo acolhido cadastrado", detalhe: newResident.nome, tempo: "Agora" },
        ...current.activities
      ],
      auditLogs: [
        { data: timestamp, acao: "Cadastro de acolhido", modulo: "Gestao de pessoas", usuario: current.currentUser?.nome || baseUser.nome },
        ...current.auditLogs
      ],
      currentView: "acolhidos",
      selectedResidentId: newResident.id,
      lastUpdated: timestamp
    }), "Acolhido cadastrado com sucesso.");

    return true;
  }

  function handleNewTriagem(formData) {
    const nomeCandidato = String(formData.get("nome_candidato") || "").trim();
    const cpf = formatCpf(formData.get("cpf"));
    if (!nomeCandidato || !isValidCpf(cpf)) {
      showToast("Informe um nome e um CPF valido para registrar a triagem.", "info");
      return false;
    }

    const triagem = {
      id_triagem: `TRG-${String(Date.now()).slice(-4)}`,
      nome_candidato: nomeCandidato,
      cpf,
      resultado: String(formData.get("resultado") || "Apto"),
      profissional: String(formData.get("profissional") || currentUser.nome),
      data: new Date().toISOString().slice(0, 10),
      observacao: String(formData.get("observacao") || "").trim()
    };

    updateWithAudit((current, timestamp) => ({
      ...current,
      triagens: [triagem, ...current.triagens],
      activities: [
        { titulo: "Triagem registrada", detalhe: triagem.nome_candidato, tempo: "Agora" },
        ...current.activities
      ],
      auditLogs: [
        { data: timestamp, acao: "Triagem registrada", modulo: "Gestao de pessoas", usuario: current.currentUser?.nome || baseUser.nome },
        ...current.auditLogs
      ],
      lastUpdated: timestamp
    }), "Triagem registrada com sucesso.");

    return true;
  }

  function handleNewItem(formData) {
    const itemName = String(formData.get("item") || "").trim();
    if (!itemName) {
      showToast("Informe o nome do item antes de salvar.", "info");
      return false;
    }

    if (state.remoteMode && state.authToken) {
      return api.createInventoryItem(state.authToken, {
        nome_item: itemName,
        categoria: String(formData.get("categoria") || "Alimenticios"),
        imagem_ref: itemName.slice(0, 2).toUpperCase(),
        unidade: String(formData.get("unidade") || "un").trim() || "un",
        estoque_atual: Number(formData.get("estoqueAtual") || 0),
        estoque_minimo: Number(formData.get("estoqueMinimo") || 0),
        valor_unitario: parseCurrency(formData.get("valor") || "R$ 0,00")
      })
        .then(async () => {
          await syncRemoteState(state.authToken, currentUser);
          showToast("Item cadastrado com sucesso.", "success");
          return true;
        })
        .catch((error) => {
          showToast(error.message || "Nao foi possivel cadastrar o item na API.", "info");
          return false;
        });
    }

    const item = {
      id: Date.now(),
      imagem: itemName.slice(0, 2).toUpperCase(),
      item: itemName,
      categoria: String(formData.get("categoria") || "Alimenticios"),
      estoqueAtual: Number(formData.get("estoqueAtual") || 0),
      unidade: String(formData.get("unidade") || "un").trim() || "un",
      estoqueMinimo: Number(formData.get("estoqueMinimo") || 0),
      valor: normalizeCurrencyInput(formData.get("valor") || "R$ 0,00")
    };

    updateWithAudit((current, timestamp) => ({
      ...current,
      inventory: [item, ...current.inventory],
      movements: [
        { tipo: "Entrada - Cadastro", item: item.item, detalhe: "Agora", quantidade: `${item.estoqueAtual} ${item.unidade}` },
        ...current.movements
      ],
      auditLogs: [
        { data: timestamp, acao: "Novo item cadastrado", modulo: "Rotina e logistica", usuario: current.currentUser?.nome || baseUser.nome },
        ...current.auditLogs
      ],
      lastUpdated: timestamp
    }), "Item cadastrado com sucesso.");

    return true;
  }

  function handleNewDonation(formData) {
    const itemName = String(formData.get("item") || "").trim();
    const quantidade = Number(formData.get("quantidade") || 0);
    const unidade = String(formData.get("unidade") || "un").trim() || "un";
    const doadorNome = String(formData.get("doador") || "").trim();
    if (!itemName || quantidade <= 0 || !doadorNome) {
      showToast("Preencha os dados da doacao corretamente.", "info");
      return false;
    }

    const donation = {
      data: new Date().toLocaleDateString("pt-BR"),
      doador: doadorNome,
      tipo: String(formData.get("tipo") || "PF"),
      item: itemName,
      quantidade: `${quantidade} ${unidade}`,
      destino: String(formData.get("destino") || "").trim()
    };

    if (state.remoteMode && state.authToken) {
      return api.createDonation(state.authToken, {
        doador: doadorNome,
        tipo_doador: donation.tipo,
        item: itemName,
        categoria: String(formData.get("categoria") || "Alimenticios"),
        quantidade,
        unidade,
        destino: donation.destino || null
      })
        .then(async () => {
          await syncRemoteState(state.authToken, currentUser);
          showToast("Doacao registrada com sucesso.", "success");
          return true;
        })
        .catch((error) => {
          showToast(error.message || "Nao foi possivel registrar a doacao na API.", "info");
          return false;
        });
    }

    updateWithAudit((current, timestamp) => {
      const inventoryList = current.inventory.map((item) => ({ ...item }));
      const matched = inventoryList.find((item) => slugify(item.item) === slugify(itemName));

      if (matched) {
        matched.estoqueAtual = Number(matched.estoqueAtual) + quantidade;
      } else {
        inventoryList.unshift({
          id: Date.now(),
          imagem: itemName.slice(0, 2).toUpperCase(),
          item: itemName,
          categoria: String(formData.get("categoria") || "Alimenticios"),
          estoqueAtual: quantidade,
          unidade,
          estoqueMinimo: Math.max(1, Math.floor(quantidade * 0.25)),
          valor: "R$ 0,00"
        });
      }

      const doadores = current.doadores.map((item) => ({ ...item }));
      const matchedDoador = doadores.find((item) => slugify(item.nome_doador) === slugify(doadorNome));
      if (matchedDoador) {
        matchedDoador.ultima_doacao = itemName;
      } else {
        doadores.unshift({
          id_doador: `D-${String(Date.now()).slice(-3)}`,
          nome_doador: doadorNome,
          tipo_doador: donation.tipo,
          ultima_doacao: itemName
        });
      }

      return {
        ...current,
        inventory: inventoryList,
        doadores,
        donations: [donation, ...current.donations],
        movements: [
          { tipo: "Entrada - Doacao", item: itemName, detalhe: `Hoje, ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`, quantidade: `${quantidade} ${unidade}` },
          ...current.movements
        ],
        activities: [
          { titulo: "Doacao recebida", detalhe: itemName, tempo: "Agora" },
          ...current.activities
        ],
        auditLogs: [
          { data: timestamp, acao: "Doacao registrada", modulo: "Rotina e logistica", usuario: current.currentUser?.nome || baseUser.nome },
          ...current.auditLogs
        ],
        lastUpdated: timestamp
      };
    }, "Doacao registrada com sucesso.");

    return true;
  }

  function handleNewDoador(formData) {
    const nomeDoador = String(formData.get("nome_doador") || "").trim();
    if (!nomeDoador) {
      showToast("Informe o nome do doador para continuar.", "info");
      return false;
    }

    if (state.remoteMode && state.authToken) {
      return api.createDonor(state.authToken, {
        nome_doador: nomeDoador,
        tipo_doador: String(formData.get("tipo_doador") || "PF"),
        ultima_doacao: String(formData.get("ultima_doacao") || "").trim() || null
      })
        .then(async () => {
          await syncRemoteState(state.authToken, currentUser);
          showToast("Doador cadastrado com sucesso.", "success");
          return true;
        })
        .catch((error) => {
          showToast(error.message || "Nao foi possivel cadastrar o doador na API.", "info");
          return false;
        });
    }

    const doador = {
      id_doador: `D-${String(Date.now()).slice(-3)}`,
      nome_doador: nomeDoador,
      tipo_doador: String(formData.get("tipo_doador") || "PF"),
      ultima_doacao: String(formData.get("ultima_doacao") || "").trim() || "Sem historico"
    };

    updateWithAudit((current, timestamp) => ({
      ...current,
      doadores: [doador, ...current.doadores],
      auditLogs: [
        { data: timestamp, acao: "Doador cadastrado", modulo: "Rotina e logistica", usuario: current.currentUser?.nome || baseUser.nome },
        ...current.auditLogs
      ],
      lastUpdated: timestamp
    }), "Doador cadastrado com sucesso.");

    return true;
  }

  function handleAdjustStockItem(formData, itemId) {
    const tipo = String(formData.get("tipo") || "Entrada");
    const quantidade = Number(formData.get("quantidade") || 0);
    const observacao = String(formData.get("observacao") || "Ajuste manual").trim();
    if (quantidade <= 0) {
      showToast("Informe uma quantidade valida para o ajuste.", "info");
      return false;
    }

    const target = state.inventory.find((item) => sameId(item.id, itemId));
    if (!target) {
      showToast("Nao foi possivel localizar o item para ajuste.", "info");
      return false;
    }

    if (tipo === "Saida" && Number(target.estoqueAtual) < quantidade) {
      showToast("Quantidade indisponivel para retirada.", "info");
      return false;
    }

    if (state.remoteMode && state.authToken) {
      return api.adjustInventory(state.authToken, itemId, {
        tipo,
        quantidade,
        observacao,
        destino: tipo === "Saida" ? "Consumo interno" : "Reposicao"
      })
        .then(async () => {
          await syncRemoteState(state.authToken, currentUser);
          showToast("Estoque atualizado com sucesso.", "success");
          return true;
        })
        .catch((error) => {
          showToast(error.message || "Nao foi possivel ajustar o estoque na API.", "info");
          return false;
        });
    }

    updateWithAudit((current, timestamp) => ({
      ...current,
      inventory: current.inventory.map((item) => sameId(item.id, itemId)
        ? {
            ...item,
            estoqueAtual: tipo === "Entrada"
              ? Number(item.estoqueAtual) + quantidade
              : Number(item.estoqueAtual) - quantidade
          }
        : item),
      movements: [
        { tipo: `${tipo} - Ajuste`, item: target.item, detalhe: observacao, quantidade: `${quantidade} ${target.unidade}` },
        ...current.movements
      ],
      activities: [
        { titulo: "Movimentacao de estoque", detalhe: target.item, tempo: "Agora" },
        ...current.activities
      ],
      auditLogs: [
        { data: timestamp, acao: `Ajuste de estoque (${tipo})`, modulo: "Rotina e logistica", usuario: current.currentUser?.nome || baseUser.nome },
        ...current.auditLogs
      ],
      lastUpdated: timestamp
    }), "Estoque atualizado com sucesso.");

    return true;
  }

  function handleForgotPassword(formData) {
    const login = String(formData.get("login") || "").trim();
    if (!login) {
      showToast("Informe e-mail ou CPF para solicitar o atendimento.", "info");
      return false;
    }

    if (isApiConfigured) {
      return api.createPasswordRequest(login)
        .then(() => {
          showToast("Solicitacao registrada. A administracao foi notificada.", "success");
          return true;
        })
        .catch((error) => {
          showToast(error.message || "Nao foi possivel registrar a solicitacao na API.", "info");
          return false;
        });
    }

    const matchedUser = state.users.find((user) => (
      user.email.toLowerCase() === login.toLowerCase()
      || onlyDigits(user.cpf) === onlyDigits(login)
    ));

    if (!matchedUser) {
      showToast("Solicitacao recebida. Caso exista um cadastro correspondente, a administracao fara o atendimento.", "success");
      return true;
    }

    updateWithAudit((current, timestamp) => ({
      ...current,
      passwordRequests: [
        {
          id: Date.now(),
          userId: matchedUser.id,
          nome: matchedUser.nome,
          contato: login,
          data: timestamp,
          status: "Pendente"
        },
        ...current.passwordRequests
      ],
      auditLogs: [
        { data: timestamp, acao: "Solicitacao de redefinicao de senha", modulo: "Acesso e usuarios", usuario: matchedUser.nome },
        ...current.auditLogs
      ],
      lastUpdated: timestamp
    }), "Solicitacao registrada. A administracao foi notificada.");

    return true;
  }

  async function handleCreateUser(formData) {
    if (currentUser.perfil !== "Administrador") {
      showToast("Somente a administracao pode cadastrar usuarios.", "info");
      return false;
    }

    const nome = String(formData.get("nome") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const cpf = formatCpf(formData.get("cpf"));
    const telefone = String(formData.get("telefone") || "").trim();
    const perfil = String(formData.get("perfil") || "Tecnico").trim();
    const senha = String(formData.get("senha") || "").trim();
    let foto = await readFileAsDataUrl(formData.get("foto"));

    if (!nome || !email || !cpf || !senha) {
      showToast("Preencha nome, e-mail, CPF e senha provisoria para criar o usuario.", "info");
      return false;
    }

    if (!isValidCpf(cpf)) {
      showToast("O CPF informado para o usuario nao e valido.", "info");
      return false;
    }

    if (state.users.some((user) => user.email.toLowerCase() === email)) {
      showToast("Ja existe um usuario cadastrado com este e-mail.", "info");
      return false;
    }

    if (state.users.some((user) => onlyDigits(user.cpf) === onlyDigits(cpf))) {
      showToast("Ja existe um usuario cadastrado com este CPF.", "info");
      return false;
    }

    if (state.remoteMode && state.authToken) {
      try {
        foto = isStorageConfigured
          ? (await uploadUserPhoto(formData.get("foto"), email || cpf)) || foto
          : foto;
      } catch (error) {
        showToast(error.message || "Nao foi possivel enviar a foto do usuario para o storage.", "info");
        return false;
      }

      return api.createUser(state.authToken, {
        nome_completo: nome,
        email,
        cpf: onlyDigits(cpf),
        perfil,
        telefone,
        foto_url: foto,
        senha
      })
        .then(async () => {
          await syncRemoteState(state.authToken, currentUser);
          showToast("Usuario cadastrado com sucesso.", "success");
          return true;
        })
        .catch((error) => {
          showToast(error.message || "Nao foi possivel cadastrar o usuario na API.", "info");
          return false;
        });
    }

    const newUser = {
      id: Date.now(),
      nome,
      email,
      cpf: onlyDigits(cpf),
      senha,
      perfil,
      avatar: getInitials(nome),
      foto,
      telefone,
      ativo: true
    };

    updateWithAudit((current, timestamp) => ({
      ...current,
      users: [newUser, ...current.users],
      auditLogs: [
        { data: timestamp, acao: "Usuario cadastrado", modulo: "Acesso e usuarios", usuario: current.currentUser?.nome || baseUser.nome },
        ...current.auditLogs
      ],
      lastUpdated: timestamp
    }), "Usuario cadastrado com sucesso.");

    return true;
  }

  async function handleUpdateUser(formData, userId) {
    if (currentUser.perfil !== "Administrador") {
      showToast("Somente a administracao pode editar usuarios.", "info");
      return false;
    }

    const target = state.users.find((user) => sameId(user.id, userId));
    if (!target) {
      showToast("Usuario nao encontrado.", "info");
      return false;
    }

    const nome = String(formData.get("nome") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const cpf = formatCpf(formData.get("cpf"));
    const telefone = String(formData.get("telefone") || "").trim();
    const perfil = String(formData.get("perfil") || target.perfil).trim();
    const senha = String(formData.get("senha") || "").trim();
    const ativo = String(formData.get("ativo") || "true") === "true";
    let foto = await readFileAsDataUrl(formData.get("foto"));

    if (!nome || !email || !cpf) {
      showToast("Nome, e-mail e CPF sao obrigatorios para atualizar o usuario.", "info");
      return false;
    }

    if (!isValidCpf(cpf)) {
      showToast("O CPF informado para o usuario nao e valido.", "info");
      return false;
    }

    if (state.users.some((user) => !sameId(user.id, userId) && user.email.toLowerCase() === email)) {
      showToast("Ja existe outro usuario com este e-mail.", "info");
      return false;
    }

    if (state.users.some((user) => !sameId(user.id, userId) && onlyDigits(user.cpf) === onlyDigits(cpf))) {
      showToast("Ja existe outro usuario com este CPF.", "info");
      return false;
    }

    const activeAdmins = state.users.filter((user) => user.perfil === "Administrador" && user.ativo !== false);
    if ((!ativo || perfil !== "Administrador") && target.perfil === "Administrador" && activeAdmins.length === 1 && activeAdmins[0].id === target.id) {
      showToast("O sistema precisa manter pelo menos um administrador ativo.", "info");
      return false;
    }

    if (state.remoteMode && state.authToken) {
      try {
        foto = isStorageConfigured
          ? (await uploadUserPhoto(formData.get("foto"), email || cpf || userId)) || foto
          : foto;
      } catch (error) {
        showToast(error.message || "Nao foi possivel enviar a foto atualizada para o storage.", "info");
        return false;
      }

      return api.updateUser(state.authToken, userId, {
        nome_completo: nome,
        email,
        cpf: onlyDigits(cpf),
        perfil,
        telefone,
        foto_url: foto || target.foto || null,
        senha: senha || undefined,
        status: ativo ? "Ativo" : "Inativo"
      })
        .then(async () => {
          await syncRemoteState(state.authToken, currentUser);
          showToast("Usuario atualizado com sucesso.", "success");
          return true;
        })
        .catch((error) => {
          showToast(error.message || "Nao foi possivel atualizar o usuario na API.", "info");
          return false;
        });
    }

    updateWithAudit((current, timestamp) => {
      const users = current.users.map((user) => sameId(user.id, userId)
        ? {
            ...user,
            nome,
            email,
            cpf: onlyDigits(cpf),
            telefone,
            perfil,
            ativo,
            avatar: getInitials(nome),
            foto: foto || user.foto,
            senha: senha || user.senha
          }
        : user);

      const updatedCurrentUser = current.currentUser && sameId(current.currentUser.id, userId)
        ? users.find((user) => sameId(user.id, userId)) || current.currentUser
        : current.currentUser;

      return {
        ...current,
        users,
        currentUser: updatedCurrentUser,
        passwordRequests: current.passwordRequests.map((request) => sameId(request.userId, userId) ? { ...request, status: ativo ? request.status : "Cancelado" } : request),
        auditLogs: [
          { data: timestamp, acao: "Usuario atualizado", modulo: "Acesso e usuarios", usuario: current.currentUser?.nome || baseUser.nome },
          ...current.auditLogs
        ],
        lastUpdated: timestamp
      };
    }, "Usuario atualizado com sucesso.");

    return true;
  }

  function handleResetUserPassword(userId) {
    if (currentUser.perfil !== "Administrador") {
      showToast("Somente a administracao pode redefinir senhas.", "info");
      return;
    }

    if (state.remoteMode && state.authToken) {
      api.resetUserPassword(state.authToken, userId)
        .then(async () => {
          await syncRemoteState(state.authToken, currentUser);
          showToast("Senha redefinida para o padrao de demonstracao.", "success");
        })
        .catch((error) => {
          showToast(error.message || "Nao foi possivel redefinir a senha na API.", "info");
        });
      return;
    }

    updateWithAudit((current, timestamp) => ({
      ...current,
      users: current.users.map((user) => sameId(user.id, userId) ? { ...user, senha: "1234" } : user),
      passwordRequests: current.passwordRequests.map((request) => sameId(request.userId, userId) ? { ...request, status: "Atendido" } : request),
      auditLogs: [
        { data: timestamp, acao: "Senha redefinida pela administracao", modulo: "Acesso e usuarios", usuario: current.currentUser?.nome || baseUser.nome },
        ...current.auditLogs
      ],
      lastUpdated: timestamp
    }), "Senha redefinida para o padrao de demonstracao.");
  }

  function handleToggleUserStatus(userId) {
    const target = state.users.find((user) => sameId(user.id, userId));
    if (!target) return;

    if (currentUser.perfil !== "Administrador") {
      showToast("Somente a administracao pode alterar o status de usuarios.", "info");
      return;
    }

    if (sameId(currentUser.id, userId)) {
      showToast("Nao e permitido desativar o usuario logado nesta sessao.", "info");
      return;
    }

    const nextStatus = !(target.ativo !== false);
    const activeAdmins = state.users.filter((user) => user.perfil === "Administrador" && user.ativo !== false);
    if (!nextStatus && target.perfil === "Administrador" && activeAdmins.length === 1) {
      showToast("O sistema precisa manter pelo menos um administrador ativo.", "info");
      return;
    }

    if (state.remoteMode && state.authToken) {
      api.updateUser(state.authToken, userId, {
        status: nextStatus ? "Ativo" : "Inativo"
      })
        .then(async () => {
          await syncRemoteState(state.authToken, currentUser);
          showToast(nextStatus ? "Usuario reativado com sucesso." : "Usuario desativado com sucesso.", "success");
        })
        .catch((error) => {
          showToast(error.message || "Nao foi possivel alterar o status do usuario na API.", "info");
        });
      return;
    }

    updateWithAudit((current, timestamp) => ({
      ...current,
      users: current.users.map((user) => sameId(user.id, userId) ? { ...user, ativo: nextStatus } : user),
      auditLogs: [
        { data: timestamp, acao: nextStatus ? "Usuario reativado" : "Usuario desativado", modulo: "Acesso e usuarios", usuario: current.currentUser?.nome || baseUser.nome },
        ...current.auditLogs
      ],
      lastUpdated: timestamp
    }), nextStatus ? "Usuario reativado com sucesso." : "Usuario desativado com sucesso.");
  }

  function handleUpdatePlan() {
    updateWithAudit((current, timestamp) => ({
      ...current,
      medicalTimeline: [
        {
          residentId: currentResident.id,
          data: new Date().toLocaleDateString("pt-BR"),
          hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
          titulo: "Plano de acao atualizado",
          autor: `${current.currentUser?.nome || baseUser.nome} (${current.currentUser?.perfil || baseUser.perfil})`
        },
        ...current.medicalTimeline
      ],
      activities: [
        { titulo: "Prontuario atualizado", detalhe: currentResident.nome, tempo: "Agora" },
        ...current.activities
      ],
      auditLogs: [
        { data: timestamp, acao: "Plano de acao atualizado", modulo: "Gestao de pessoas", usuario: current.currentUser?.nome || baseUser.nome },
        ...current.auditLogs
      ],
      lastUpdated: timestamp
    }), "Plano de acao atualizado com sucesso.");
  }

  function handleStockFilterChange(key, value) {
    setState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        stockFilters: {
          ...current.ui.stockFilters,
          [key]: value,
          page: key === "page" ? value : 1
        }
      }
    }));
  }

  function handleAction(action, payload) {
    if (action === "go-escalas") return navigate("escalas");
    if (action === "go-auditoria") return navigate("auditoria");
    if (action === "go-estoque") return navigate("estoque");
    if (action === "go-stock-movements") return navigate("estoque-movimentacoes");
    if (action === "go-user-access") return navigate("configuracoes");
    if (action === "new-triagem") return openModal("new-triagem");
    if (action === "new-item") return openModal("new-item");
    if (action === "new-donation") return openModal("new-donation");
    if (action === "new-doador") return openModal("new-doador");
    if (action === "show-full-timeline") return openModal("timeline-view");
    if (action === "show-alerts-panel") return openModal("alerts-view");
    if (action === "edit-user") {
      const targetUser = state.users.find((user) => sameId(user.id, payload));
      if (targetUser) openModal("edit-user", targetUser);
      return;
    }
    if (action === "reset-user-password") {
      handleResetUserPassword(payload);
      return;
    }
    if (action === "toggle-user-status") {
      handleToggleUserStatus(payload);
      return;
    }
    if (action === "publish-schedule") {
      updateWithAudit((current, timestamp) => ({
        ...current,
        activities: [
          { titulo: "Escala publicada", detalhe: "Cobertura semanal atualizada", tempo: "Agora" },
          ...current.activities
        ],
        auditLogs: [
          { data: timestamp, acao: "Escala publicada", modulo: "Rotina e escalas", usuario: current.currentUser?.nome || baseUser.nome },
          ...current.auditLogs
        ],
        lastUpdated: timestamp
      }), "Escala publicada com sucesso.");
      return;
    }
    if (action === "view-stock-item") {
      const item = inventory.find((entry) => sameId(entry.id, payload));
      if (item) openModal("stock-item-info", item);
      return;
    }
    if (action === "adjust-stock-item") {
      const item = inventory.find((entry) => sameId(entry.id, payload));
      if (item) openModal("adjust-stock-item", item);
      return;
    }
    if (action === "clear-stock-filters") {
      setState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          stockFilters: clone(initialState.ui.stockFilters)
        }
      }));
      return;
    }
    if (action === "export-stock-report") {
      const filtered = getFilteredInventory();
      downloadCsv(
        "relatorio-estoque.csv",
        ["Item", "Categoria", "Estoque Atual", "Unidade", "Estoque Minimo", "Status", "Valor"],
        filtered.map((item) => [item.item, item.categoria, item.estoqueAtual, item.unidade, item.estoqueMinimo, item.status, item.valor])
      );
      updateWithAudit((current, timestamp) => ({
        ...current,
        auditLogs: [
          { data: timestamp, acao: "Relatorio de estoque exportado", modulo: "Governanca e relatorios", usuario: current.currentUser?.nome || baseUser.nome },
          ...current.auditLogs
        ],
        lastUpdated: timestamp
      }), "Relatorio exportado com sucesso.");
      return;
    }
    if (action === "export-audit-report") {
      downloadCsv(
        "auditoria-terra-da-esperanca.csv",
        ["Data", "Acao", "Modulo", "Usuario"],
        state.auditLogs.map((log) => [log.data, log.acao, log.modulo, log.usuario])
      );
      updateWithAudit((current, timestamp) => ({
        ...current,
        auditLogs: [
          { data: timestamp, acao: "Relatorio de auditoria exportado", modulo: "Governanca e relatorios", usuario: current.currentUser?.nome || baseUser.nome },
          ...current.auditLogs
        ],
        lastUpdated: timestamp
      }), "Auditoria exportada com sucesso.");
      return;
    }
    if (action === "export-executive-report") {
      downloadCsv(
        "resumo-executivo-terra-da-esperanca.csv",
        ["Indicador", "Valor"],
        [
          ["Acolhidos ativos", counts.total],
          ["Vagas masculinas ocupadas", `${counts.masculino} / 10`],
          ["Vagas femininas ocupadas", `${counts.feminino} / 10`],
          ["Triagens registradas", state.triagens.length],
          ["Doadores ativos", state.doadores.length],
          ["Doacoes registradas", state.donations.length],
          ["Itens criticos de estoque", inventory.filter((item) => item.status === "Critico").length],
          ["Logs de auditoria", state.auditLogs.length]
        ]
      );
      updateWithAudit((current, timestamp) => ({
        ...current,
        auditLogs: [
          { data: timestamp, acao: "Resumo executivo exportado", modulo: "Governanca e relatorios", usuario: current.currentUser?.nome || baseUser.nome },
          ...current.auditLogs
        ],
        lastUpdated: timestamp
      }), "Resumo executivo exportado com sucesso.");
      return;
    }
    if (action === "update-plan") return handleUpdatePlan();
  }

  function getFilteredInventory() {
    const filters = state.ui.stockFilters;
    return inventory.filter((item) => {
      const query = filters.search.trim().toLowerCase();
      const matchesSearch = !query || item.item.toLowerCase().includes(query) || item.categoria.toLowerCase().includes(query);
      const matchesCategory = filters.category === "Todas" || item.categoria === filters.category;
      const matchesStatus = filters.status === "Todos" || item.status === filters.status;
      const matchesStock = filters.estoque === "Todos" || item.status === filters.estoque || (filters.estoque === "Baixo" && item.status === "Critico");
      return matchesSearch && matchesCategory && matchesStatus && matchesStock;
    });
  }

  const titleConfig = titleMap[state.currentView] || titleMap.dashboard;
  const dynamicSubtitle = state.currentView === "prontuario" && currentResident
    ? `Acompanhamento de ${currentResident.nome}`
    : titleConfig.subtitle;
  const dynamicBreadcrumb = state.currentView === "prontuario" && currentResident
    ? `Prontuarios > ${currentResident.nome}`
    : titleConfig.breadcrumb;

  function renderCurrentView() {
    if (state.currentView === "dashboard") return <DashboardView counts={counts} stockAlerts={stockAlerts} inventory={inventory} shifts={staffDirectory} activities={state.activities} onAction={handleAction} />;
    if (state.currentView === "triagem") return <TriagensView triagens={state.triagens} onAction={handleAction} />;
    if (state.currentView === "acolhidos") return <AcolhidosView residents={state.residents} onOpenProntuario={(residentId) => navigate("prontuario", { residentId, prontuarioTab: "resumo" })} />;
    if (state.currentView === "cadastro") return <CadastroView currentUser={currentUser} onSubmit={handleCadastro} onLookupCep={handleLookupCep} />;
    if (state.currentView === "prontuario") {
      if (!currentResident) {
        return (
          <section className="panel-card wide-card">
            <div className="panel-header">
              <div>
                <h3>Nenhum acolhido disponivel</h3>
                <p>Cadastre ou sincronize um acolhido para abrir o prontuario tecnico.</p>
              </div>
            </div>
          </section>
        );
      }

      return (
        <ProntuarioView
          residents={state.residents}
          resident={currentResident}
          currentUser={currentUser}
          currentTab={state.currentProntuarioTab}
          medicalTimeline={residentTimeline}
          alerts={residentAlerts}
          onTabChange={(tab) => setState((current) => ({ ...current, currentProntuarioTab: tab }))}
          onAction={handleAction}
          onSelectResident={(residentId) => navigate("prontuario", { residentId, prontuarioTab: state.currentProntuarioTab })}
        />
      );
    }
    if (state.currentView === "escalas") return <EscalasView volunteers={staffDirectory} dailyActivities={state.dailyActivities} onAction={handleAction} />;
    if (state.currentView === "estoque") return <EstoqueView inventory={inventory} stockAlerts={stockAlerts} metrics={metrics} lastUpdated={state.lastUpdated} filters={state.ui.stockFilters} onFilterChange={handleStockFilterChange} onAction={handleAction} />;
    if (state.currentView === "estoque-categorias") return <EstoqueCategoriasView inventory={inventory} />;
    if (state.currentView === "estoque-movimentacoes") return <EstoqueMovimentacoesView movements={state.movements} />;
    if (state.currentView === "doadores") return <DoadoresView doadores={state.doadores} onAction={handleAction} />;
    if (state.currentView === "doacoes") return <DoacoesView donations={state.donations} onAction={handleAction} />;
    if (state.currentView === "auditoria") return <AuditoriaView auditLogs={state.auditLogs} onAction={handleAction} />;
    if (state.currentView === "relatorios") return <RelatoriosView counts={counts} triagens={state.triagens} doadores={state.doadores} donations={state.donations} auditLogs={state.auditLogs} inventory={inventory} residents={state.residents} onAction={handleAction} />;
    if (state.currentView === "configuracoes") {
      return (
        <AcessoView
          currentUser={currentUser}
          users={state.users}
          passwordRequests={state.passwordRequests}
          supportContacts={supportContacts}
          onCreateUser={handleCreateUser}
          onAction={handleAction}
        />
      );
    }
    return null;
  }

  return (
    <ErrorBoundary>
      {state.currentUser ? (
        <div className={`app-shell ${state.ui.sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
          <Sidebar
            currentView={state.currentView}
            expandedMenus={state.expandedMenus}
            collapsed={state.ui.sidebarCollapsed}
            residents={state.residents}
            onNavigate={navigate}
            onToggleMenu={(menuId) => setState((current) => ({
              ...current,
              ui: menuId === "__expand_sidebar__"
                ? {
                    ...current.ui,
                    sidebarCollapsed: false
                  }
                : current.ui,
              expandedMenus: {
                ...current.expandedMenus,
                ...(menuId === "__expand_sidebar__" ? {} : { [menuId]: !current.expandedMenus[menuId] })
              }
            }))}
            onLogout={handleLogout}
          />
          <main className="app-content">
            <Topbar
              title={titleConfig.title}
              subtitle={dynamicSubtitle}
              breadcrumb={dynamicBreadcrumb}
              currentUser={currentUser}
              notificationsCount={notificationsCount}
              onToggleSidebar={() => setState((current) => ({
                ...current,
                ui: {
                  ...current.ui,
                  sidebarCollapsed: !current.ui.sidebarCollapsed
                }
              }))}
              onToggleNotifications={() => setState((current) => ({
                ...current,
                ui: {
                  ...current.ui,
                  notificationsOpen: !current.ui.notificationsOpen
                }
              }))}
            />
            {renderCurrentView()}
          </main>
          <NotificationsPanel
            open={state.ui.notificationsOpen}
            stockAlerts={stockAlerts}
            alerts={globalAlerts}
            residents={state.residents}
            passwordRequests={pendingPasswordRequests}
            currentUser={currentUser}
            onClose={() => setState((current) => ({
              ...current,
              ui: {
                ...current.ui,
                notificationsOpen: false
              }
            }))}
            onNavigate={(view, residentId = null) => {
              if (view === "prontuario" && residentId) {
                navigate("prontuario", { residentId, prontuarioTab: "resumo" });
                return;
              }
              navigate(view);
            }}
          />
        </div>
      ) : (
        <LoginView onLogin={handleLogin} onOpenModal={openModal} />
      )}

      <Modal
        modal={state.ui.modal}
        currentUser={currentUser}
        medicalTimeline={residentTimeline}
        alerts={residentAlerts}
        supportContacts={supportContacts}
        onClose={closeModal}
        onForgotPassword={handleForgotPassword}
        onNewTriagem={handleNewTriagem}
        onNewItem={handleNewItem}
        onNewDonation={handleNewDonation}
        onNewDoador={handleNewDoador}
        onAdjustStockItem={handleAdjustStockItem}
        onUpdateUser={handleUpdateUser}
      />
      <Toast toast={state.ui.toast} />
    </ErrorBoundary>
  );
}
