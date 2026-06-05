import { calculateAge, formatCurrency, formatDate, formatPhone, getInitials, getNowLabel } from "../utils/helpers";

function toGeneroLabel(value) {
  if (value === "M") return "Masculino";
  if (value === "F") return "Feminino";
  return value || "Nao informado";
}

function toBooleanLabel(value) {
  return value ? "Sim" : "Nao";
}

function formatDateTimeLabel(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatRelativeTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const diff = Date.now() - date.getTime();
  const hour = 1000 * 60 * 60;
  const day = hour * 24;
  if (diff < 0) return date.toLocaleDateString("pt-BR");
  if (diff < hour) return "Agora";
  if (diff < day) return `Ha ${Math.max(1, Math.round(diff / hour))} horas`;
  return `Ha ${Math.max(1, Math.round(diff / day))} dias`;
}

function toStaffRoleLabel(specialty, profile) {
  const normalized = (specialty || "").trim().toLowerCase();
  if (normalized === "psicologia") return "Psicologa";
  if (normalized === "servico social") return "Assistente social";
  if (normalized === "monitoria") return "Monitora";
  if (normalized === "acolhimento") return "Tecnico";
  return profile || "Tecnico";
}

export function mapApiUser(user) {
  return {
    id: user.id_voluntario,
    nome: user.nome_completo,
    email: user.email,
    cpf: user.cpf,
    senha: "",
    perfil: user.perfil,
    avatar: getInitials(user.nome_completo),
    foto: user.foto_url || null,
    telefone: user.telefone || "",
    ativo: user.status === "Ativo"
  };
}

export function mapApiResident(detail) {
  return {
    id: detail.id_acolhido,
    nome: detail.nome_completo,
    nomeSocial: detail.nome_social || "",
    cpf: detail.cpf,
    genero: toGeneroLabel(detail.genero),
    dataNascimento: detail.data_nascimento,
    idade: detail.data_nascimento ? calculateAge(detail.data_nascimento) : 0,
    origem: detail.origem_encaminhamento || "Nao informado",
    telefone: detail.telefone ? formatPhone(detail.telefone) : "-",
    email: detail.email || "",
    nacionalidade: detail.nacionalidade || "Brasileira",
    etnia: detail.etnia_cor || "Nao informado",
    naturalidade: detail.naturalidade || "Nao informado",
    estadoCivil: detail.estado_civil || "Nao informado",
    endereco: {
      cep: detail.cep || "",
      logradouro: detail.logradouro || "",
      numero: detail.numero || "",
      complemento: detail.complemento || "",
      bairro: detail.bairro || "",
      cidade: detail.cidade || "",
      estado: detail.estado || ""
    },
    vinculo: detail.vinculo || "Nao informado",
    responsavelLegal: detail.responsavel_legal || "-",
    responsavelCadastro: detail.responsavel_plano || detail.responsavel_legal || "-",
    motivoAcolhimento: detail.origem_encaminhamento || "Nao informado",
    status: detail.status || "Ativo",
    dataAcolhimento: detail.data_acolhimento,
    observacoesGerais: detail.observacoes_gerais || "Sem observacoes registradas.",
    condicaoSaude: detail.condicao_saude || "Nao informado",
    situacaoEscolar: detail.situacao_escolar || "Nao informado",
    comportamento: detail.comportamento || "Nao informado",
    redeApoio: detail.rede_apoio || "Nao informado",
    acompanhamentoPsicologico: toBooleanLabel(detail.acompanhamento_psicologico),
    acompanhamentoSocial: toBooleanLabel(detail.acompanhamento_social),
    objetivoPlano: detail.objetivo_plano || "Sem objetivo definido.",
    revisaoPrevista: detail.revisao_prevista,
    planoStatus: detail.plano_status || "Em andamento",
    responsavelPlano: detail.responsavel_plano || "-",
    documentos: (detail.documentos || []).map((documento) => ({
      tipo: documento.tipo_documento,
      nome: documento.nome_arquivo || "nao_enviado",
      status: documento.status_documento,
      url: documento.storage_url || null
    }))
  };
}

export function mapApiInventoryItem(item) {
  return {
    id: item.id_insumo,
    imagem: item.imagem_ref || getInitials(item.nome_item),
    item: item.nome_item,
    categoria: item.categoria,
    estoqueAtual: Number(item.estoque_atual),
    unidade: item.unidade,
    estoqueMinimo: Number(item.estoque_minimo),
    valor: formatCurrency(Number(item.valor_unitario))
  };
}

export function mapApiScale(scale, usersByName) {
  const matchedUser = usersByName.get(scale.voluntario_nome);
  return {
    id: scale.id_escala,
    nome: scale.voluntario_nome,
    cargo: toStaffRoleLabel(scale.especialidade, scale.perfil),
    especialidade: scale.especialidade,
    inicio_plantao: formatDateTimeLabel(scale.inicio_plantao),
    fim_plantao: formatDateTimeLabel(scale.fim_plantao),
    foto: matchedUser?.foto || null,
    avatar: matchedUser?.avatar || getInitials(scale.voluntario_nome)
  };
}

export function mapApiDailyActivity(activity) {
  return {
    id_atividade: activity.id_atividade,
    acolhido: activity.acolhido_nome,
    tarefa: activity.tarefa,
    status: activity.status
  };
}

export function mapApiDonation(donation) {
  return {
    data: formatDate(donation.data),
    doador: donation.doador,
    tipo: donation.tipo_doador,
    item: donation.item,
    quantidade: donation.quantidade,
    destino: donation.destino || "-"
  };
}

export function mapApiMovement(movement) {
  return {
    tipo: movement.tipo,
    item: movement.item,
    detalhe: `${formatDateTimeLabel(movement.criado_em)}${movement.observacao ? ` • ${movement.observacao}` : ""}`,
    quantidade: `${movement.quantidade} ${movement.unidade}`
  };
}

export function mapApiDonor(donor) {
  return {
    id_doador: donor.id_doador,
    nome_doador: donor.nome_doador,
    tipo_doador: donor.tipo_doador,
    ultima_doacao: donor.ultima_doacao || "Sem historico"
  };
}

export function mapApiAuditLog(log) {
  return {
    id: log.id_log,
    data: formatDateTimeLabel(log.data_hora),
    dataIso: log.data_hora,
    acao: log.acao,
    modulo: log.modulo,
    usuario: log.usuario_nome
  };
}

export function mapApiPasswordRequest(request, usersById) {
  const matchedUser = usersById.get(request.user_id);
  return {
    id: request.id_request,
    userId: request.user_id,
    nome: matchedUser?.nome || matchedUser?.nome_completo || "Usuario",
    contato: request.contato,
    data: getNowLabel(),
    status: request.status
  };
}

export function buildActivitiesFromAuditLogs(logs) {
  return logs.slice(0, 4).map((log) => ({
    titulo: log.acao,
    detalhe: log.usuario,
    tempo: formatRelativeTime(log.dataIso || log.data)
  }));
}

export function flattenResidentAlerts(residents) {
  return residents.flatMap((resident) => (resident.alertas || []).map((alert) => ({
    residentId: resident.id_acolhido,
    tipo: alert.tipo,
    texto: alert.texto,
    data: formatDate(alert.data_alerta)
  })));
}

export function flattenResidentTimeline(residents) {
  return residents.flatMap((resident) => (resident.timeline || []).map((item) => {
    const date = new Date(item.data_registro);
    return {
      residentId: resident.id_acolhido,
      data: Number.isNaN(date.getTime()) ? item.data_registro : date.toLocaleDateString("pt-BR"),
      hora: Number.isNaN(date.getTime()) ? "" : date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      titulo: item.titulo,
      autor: item.profissional
    };
  }));
}
