const RAW_API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1"]);

/**
 * Resuelve la URL base del API manteniendo el mismo host loopback (`localhost` o
 * `127.0.0.1`) que la página actual para que las cookies `SameSite=Lax` sean
 * siempre same-site en desarrollo local.
 */
export function getApiBaseUrl(): string {
  if (typeof window === "undefined") return RAW_API_BASE_URL;
  try {
    const parsed = new URL(RAW_API_BASE_URL);
    const pageHost = window.location.hostname;
    if (
      LOOPBACK_HOSTS.has(parsed.hostname) &&
      LOOPBACK_HOSTS.has(pageHost) &&
      parsed.hostname !== pageHost
    ) {
      parsed.hostname = pageHost;
      return parsed.toString().replace(/\/+$/, "");
    }
  } catch {
    // Mantiene el valor configurado si no es una URL absoluta
  }
  return RAW_API_BASE_URL;
}

export const API_BASE_URL = RAW_API_BASE_URL;

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export interface AuthResponse {
  user: AuthUser;
  csrf_token: string;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

let inMemoryCsrfToken = "";

export function setCsrfToken(token: string): void {
  inMemoryCsrfToken = token;
}

export function clearCsrfToken(): void {
  inMemoryCsrfToken = "";
}

export function getCsrfToken(): string {
  if (inMemoryCsrfToken) return inMemoryCsrfToken;
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("wikidev_csrf="));
  return match ? decodeURIComponent(match.split("=")[1] ?? "") : "";
}

export async function extractApiError(
  res: Response,
  fallback: string,
): Promise<ApiError> {
  try {
    const body = await res.json();
    if (typeof body?.detail === "string" && body.detail.trim()) {
      return new ApiError(body.detail, res.status);
    }
    if (Array.isArray(body?.detail) && body.detail[0]?.msg) {
      return new ApiError(String(body.detail[0].msg), res.status);
    }
  } catch {
    // Respuesta no JSON
  }
  return new ApiError(fallback, res.status);
}

export const authApi = {
  me: async (): Promise<AuthResponse | null> => {
    const res = await fetch(`${getApiBaseUrl()}/api/auth/me`, {
      credentials: "include",
    });
    if (res.status === 401) {
      clearCsrfToken();
      return null;
    }
    if (!res.ok) {
      throw await extractApiError(res, "Error verificando sesión");
    }
    const data: AuthResponse = await res.json();
    setCsrfToken(data.csrf_token);
    return data;
  },

  login: async (identifier: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    if (!res.ok) {
      throw await extractApiError(res, "No se pudo iniciar sesión");
    }
    const data: AuthResponse = await res.json();
    setCsrfToken(data.csrf_token);
    return data;
  },

  register: async (
    username: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    const res = await fetch(`${getApiBaseUrl()}/api/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) {
      throw await extractApiError(res, "No se pudo completar el registro");
    }
    const data: AuthResponse = await res.json();
    setCsrfToken(data.csrf_token);
    return data;
  },

  logout: async (): Promise<void> => {
    const csrf = getCsrfToken();
    const res = await fetch(`${getApiBaseUrl()}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: csrf ? { "X-CSRF-Token": csrf } : {},
    });
    clearCsrfToken();
    if (!res.ok && res.status !== 401) {
      throw await extractApiError(res, "No se pudo cerrar la sesión");
    }
  },
};
