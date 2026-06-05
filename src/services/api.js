const RAW_API_URL = (import.meta.env.VITE_API_URL || "").trim();

function normalizeApiBase(url) {
  if (!url) return "";
  const trimmed = url.replace(/\/+$/, "");
  return /\/api\/v\d+$/.test(trimmed) ? trimmed : `${trimmed}/api/v1`;
}

export const API_BASE_URL = normalizeApiBase(RAW_API_URL);
export const isApiConfigured = Boolean(API_BASE_URL);

async function apiRequest(path, { method = "GET", token, body } = {}) {
  if (!API_BASE_URL) {
    throw new Error("A API online nao esta configurada. Defina VITE_API_URL.");
  }

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const detail = payload?.detail || "Nao foi possivel concluir a requisicao.";
    throw new Error(detail);
  }

  return payload;
}

export const api = {
  login(login, senha) {
    return apiRequest("/auth/login", {
      method: "POST",
      body: { login, senha }
    });
  },
  me(token) {
    return apiRequest("/auth/me", { token });
  },
  residents(token) {
    return apiRequest("/residents", { token });
  },
  residentDetail(token, residentId) {
    return apiRequest(`/residents/${residentId}`, { token });
  },
  createResident(token, payload) {
    return apiRequest("/residents", {
      method: "POST",
      token,
      body: payload
    });
  },
  users(token) {
    return apiRequest("/users", { token });
  },
  createUser(token, payload) {
    return apiRequest("/users", {
      method: "POST",
      token,
      body: payload
    });
  },
  updateUser(token, userId, payload) {
    return apiRequest(`/users/${userId}`, {
      method: "PATCH",
      token,
      body: payload
    });
  },
  resetUserPassword(token, userId) {
    return apiRequest(`/users/${userId}/reset-password`, {
      method: "POST",
      token
    });
  },
  passwordRequests(token) {
    return apiRequest("/users/password-requests", { token });
  },
  resolvePasswordRequest(token, requestId) {
    return apiRequest(`/users/password-requests/${requestId}/resolve`, {
      method: "POST",
      token
    });
  },
  createPasswordRequest(login) {
    return apiRequest("/auth/password-requests", {
      method: "POST",
      body: { login }
    });
  },
  scales(token) {
    return apiRequest("/operations/scales", { token });
  },
  dailyActivities(token) {
    return apiRequest("/operations/daily-activities", { token });
  },
  inventory(token) {
    return apiRequest("/inventory", { token });
  },
  createInventoryItem(token, payload) {
    return apiRequest("/inventory", {
      method: "POST",
      token,
      body: payload
    });
  },
  adjustInventory(token, itemId, payload) {
    return apiRequest(`/inventory/${itemId}/adjustments`, {
      method: "POST",
      token,
      body: payload
    });
  },
  movements(token) {
    return apiRequest("/inventory/movements", { token });
  },
  donors(token) {
    return apiRequest("/inventory/donors", { token });
  },
  createDonor(token, payload) {
    return apiRequest("/inventory/donors", {
      method: "POST",
      token,
      body: payload
    });
  },
  donations(token) {
    return apiRequest("/inventory/donations", { token });
  },
  createDonation(token, payload) {
    return apiRequest("/inventory/donations", {
      method: "POST",
      token,
      body: payload
    });
  },
  auditLogs(token) {
    return apiRequest("/governance/audit-logs", { token });
  }
};
