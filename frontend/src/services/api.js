import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function checkBackendHealth() {
  const response = await api.get("/health");

  return response.data;
}

export default api;

// Bearer tokens are held in sessionStorage for this browser tab/session.
// For production applications handling highly sensitive data, prefer secure
// HttpOnly cookies with CSRF protection and a reviewed session design.
api.interceptors.request.use((config) => {
  try {
    const token = sessionStorage.getItem("forma-ai-session-token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // Continue without a token if browser storage is unavailable.
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        sessionStorage.removeItem("forma-ai-session-token");
        sessionStorage.removeItem("forma-ai-session-user");
      } catch { /* Ignore unavailable browser storage. */ }
    }
    return Promise.reject(error);
  }
);
