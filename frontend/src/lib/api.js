// Simple API client for backend integration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  const token = getAuthToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : null;

  if (!res.ok) {
    const message = data?.error || data?.message || res.statusText;
    throw new Error(message);
  }

  return data;
}

// Auth
export const authApi = {
  async signin(payload) {
    return request("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async signup(payload) {
    return request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  async checkHospitalAdmin(hospital) {
    return request(`/api/auth/check-hospital-admin/${encodeURIComponent(hospital)}`, {
      method: "GET",
    });
  },
  async inviteStaff(payload) {
    return request("/api/auth/invite-staff", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

// Medicines
export const medicinesApi = {
  list() {
    return request("/api/medicines", { method: "GET" });
  },
  create(payload) {
    return request("/api/medicines", { method: "POST", body: JSON.stringify(payload) });
  },
  update(id, payload) {
    return request(`/api/medicines/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  },
  remove(id) {
    return request(`/api/medicines/${id}`, { method: "DELETE" });
  },
};

// Inventory (if needed separately)
export const inventoryApi = {
  list() {
    return request("/api/inventory", { method: "GET" });
  },
  create(payload) {
    return request("/api/inventory", { method: "POST", body: JSON.stringify(payload) });
  },
  update(id, payload) {
    return request(`/api/inventory/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  },
  remove(id) {
    return request(`/api/inventory/${id}`, { method: "DELETE" });
  },
};

// Staff
export const staffApi = {
  list(dateIso) {
    const q = dateIso ? `?date=${encodeURIComponent(dateIso)}` : "";
    return request(`/api/staff${q}`, { method: "GET" });
  },
  create(payload) {
    return request("/api/staff", { method: "POST", body: JSON.stringify(payload) });
  },
  update(id, payload) {
    return request(`/api/staff/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  },
  remove(id) {
    return request(`/api/staff/${id}`, { method: "DELETE" });
  },
};

// Attendance
export const attendanceApi = {
  today(dateIso) {
    const q = dateIso ? `?date=${encodeURIComponent(dateIso)}` : "";
    return request(`/api/attendance/today${q}`, { method: "GET" });
  },
  clockIn(staffId) {
    return request("/api/attendance/clock-in", { method: "POST", body: JSON.stringify({ staffId }) });
  },
  clockOut(staffId) {
    return request("/api/attendance/clock-out", { method: "POST", body: JSON.stringify({ staffId }) });
  },
  setStatus(payload) {
    return request("/api/attendance/set-status", { method: "POST", body: JSON.stringify(payload) });
  },
};

export function saveAuth(token, user) {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_token", token);
  localStorage.setItem("auth_user", JSON.stringify(user));
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
}

export function getAuthUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("auth_user");
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

