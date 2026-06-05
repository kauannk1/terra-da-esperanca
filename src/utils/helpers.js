import { initialState } from "../data/initialState";

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

export function sameId(left, right) {
  if (left === null || left === undefined || right === null || right === undefined) return false;
  return String(left) === String(right);
}

export function getInitials(name) {
  return String(name || "")
    .trim()
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function mergeLoadedState(savedState) {
  const merged = {
    ...clone(initialState),
    ...savedState,
    ui: {
      ...clone(initialState.ui),
      ...(savedState?.ui || {}),
      stockFilters: {
        ...clone(initialState.ui.stockFilters),
        ...(savedState?.ui?.stockFilters || {})
      }
    }
  };

  merged.users = Array.isArray(savedState?.users) && savedState.users.length
    ? savedState.users.map((user) => ({
        ativo: true,
        foto: null,
        telefone: "",
        avatar: getInitials(user.nome),
        ...user
      }))
    : clone(initialState.users);

  merged.currentUser = savedState?.currentUser
    ? merged.users.find((user) => sameId(user.id, savedState.currentUser.id)) || null
    : null;

  merged.residents = Array.isArray(savedState?.residents) && savedState.residents.length
    ? savedState.residents.map((resident) => ({
        documentos: [],
        endereco: {
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: ""
        },
        ...resident,
        documentos: Array.isArray(resident.documentos) ? resident.documentos : [],
        endereco: {
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
          ...(resident.endereco || {})
        }
      }))
    : clone(initialState.residents);

  merged.passwordRequests = Array.isArray(savedState?.passwordRequests)
    ? savedState.passwordRequests
    : [];

  merged.selectedResidentId = merged.selectedResidentId || initialState.selectedResidentId;
  return merged;
}

export function formatDate(dateString) {
  if (!dateString) return "-";
  const date = parseDateValue(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("pt-BR");
}

export function getDateLabel() {
  const label = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function calculateAge(dateString) {
  const birthDate = parseDateValue(dateString);
  if (Number.isNaN(birthDate.getTime())) return 0;
  return Math.max(0, Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)));
}

export function parseDateValue(dateString) {
  if (dateString instanceof Date) return dateString;
  const raw = String(dateString || "").trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
  }
  return new Date(raw);
}

export function formatCep(value) {
  const digits = onlyDigits(value).slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export function formatCpf(value) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatPhone(value) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function isValidCpf(value) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const digits = cpf.split("").map(Number);
  let sum = 0;
  for (let index = 0; index < 9; index += 1) {
    sum += digits[index] * (10 - index);
  }
  let firstDigit = 11 - (sum % 11);
  if (firstDigit >= 10) firstDigit = 0;
  if (firstDigit !== digits[9]) return false;

  sum = 0;
  for (let index = 0; index < 10; index += 1) {
    sum += digits[index] * (11 - index);
  }
  let secondDigit = 11 - (sum % 11);
  if (secondDigit >= 10) secondDigit = 0;
  return secondDigit === digits[10];
}

export function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function parseCurrency(value) {
  return Number(String(value || "0").replace(/[^\d,]/g, "").replace(".", "").replace(",", ".")) || 0;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function normalizeCurrencyInput(value) {
  return formatCurrency(parseCurrency(value));
}

export function deriveStatus(item) {
  const current = Number(item.estoqueAtual || 0);
  const minimum = Number(item.estoqueMinimo || 0);
  if (current <= minimum * 0.5) return "Critico";
  if (current <= minimum) return "Baixo";
  return "Adequado";
}

export function withInventoryStatus(inventory) {
  return inventory.map((item) => ({ ...item, status: deriveStatus(item) }));
}

export function buildStockAlerts(inventory) {
  const weight = { Critico: 0, Baixo: 1, Adequado: 2 };
  return withInventoryStatus(inventory)
    .filter((item) => item.status !== "Adequado")
    .sort((a, b) => weight[a.status] - weight[b.status])
    .slice(0, 6)
    .map((item) => ({
      item: item.item,
      descricao: item.status === "Critico"
        ? `Estoque critico (${item.estoqueAtual} ${item.unidade})`
        : `Estoque baixo (${item.estoqueAtual} ${item.unidade})`,
      nivel: item.status
    }));
}

export function getCounts(residents) {
  const ativos = residents.filter((resident) => resident.status === "Ativo");
  const masculino = ativos.filter((resident) => resident.genero === "Masculino").length;
  const feminino = ativos.filter((resident) => resident.genero === "Feminino").length;
  return { total: ativos.length, masculino, feminino };
}

export function getInventoryMetrics(inventory) {
  const computed = withInventoryStatus(inventory);
  const totalUnits = computed.reduce((sum, item) => sum + Number(item.estoqueAtual || 0), 0);
  const low = computed.filter((item) => item.status === "Baixo").length;
  const critical = computed.filter((item) => item.status === "Critico").length;
  const totalValue = computed.reduce((sum, item) => sum + parseCurrency(item.valor) * Number(item.estoqueAtual || 0), 0);
  return {
    totalItems: computed.length,
    totalUnits,
    low,
    critical,
    totalValue
  };
}

export function getResidentById(residents, id) {
  return residents.find((resident) => sameId(resident.id, id)) || residents[0];
}

export function paginateItems(items, page, size = 5) {
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const currentPage = Math.min(Math.max(1, page || 1), totalPages);
  const start = (currentPage - 1) * size;
  return {
    items: items.slice(start, start + size),
    page: currentPage,
    totalPages,
    totalItems: items.length,
    start: items.length ? start + 1 : 0,
    end: Math.min(start + size, items.length)
  };
}

export function downloadCsv(filename, headers, rows) {
  const csv = [headers.join(";")]
    .concat(rows.map((row) => row.join(";")))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function getNowLabel() {
  return `${new Date().toLocaleDateString("pt-BR")} ${new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  })}`;
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.size) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Falha ao carregar arquivo."));
    reader.readAsDataURL(file);
  });
}
