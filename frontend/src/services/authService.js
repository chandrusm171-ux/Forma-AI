import api from "./api";

const TOKEN_KEY = "forma-ai-session-token";
const USER_KEY = "forma-ai-session-user";

export function getAuthToken() {
  try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function getStoredUser() {
  try {
    const value = sessionStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  } catch { return null; }
}

function saveSession(data) {
  if (!data?.token || !data?.user) throw new Error("The server returned an invalid sign-in response.");
  sessionStorage.setItem(TOKEN_KEY, data.token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.user;
}

export async function registerAccount({ name, email, password }) {
  const response = await api.post("/auth/register", { name, email, password });
  return saveSession(response.data?.data);
}

export async function loginAccount({ email, password }) {
  const response = await api.post("/auth/login", { email, password });
  return saveSession(response.data?.data);
}

export async function loadCurrentUser() {
  if (!getAuthToken()) return null;
  const response = await api.get("/auth/me");
  const user = response.data?.data;
  if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  return user || null;
}

export function logoutAccount() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  } catch { /* Storage can be unavailable in restrictive browser contexts. */ }
}
