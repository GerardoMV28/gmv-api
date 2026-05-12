export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

/** Al invalidarse la cookie/JWT (401), limpia cookie httpOnly en el servidor (logout público). */
export async function clearServerSessionCookie(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    /* red o CORS; la sesión local igual se borra en el cliente */
  }
}

let onUnauthorized: (() => void) | null = null;

/** AuthProvider registra esto para cerrar sesión ante token inválido/expirado (401). */
export function setUnauthorizedCallback(cb: (() => void) | null): void {
  onUnauthorized = cb;
}

function shouldTriggerSessionExpire(path: string, method: string | undefined): boolean {
  const clean = path.split('?')[0];
  const m = (method ?? 'GET').toUpperCase();
  if (clean === '/auth/login' && m === 'POST') return false;
  if (clean === '/auth/register' && m === 'POST') return false;
  return true;
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  if (res.status === 204) {
    return undefined as T;
  }

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = { message: text };
    }
  }

  if (!res.ok) {
    if (res.status === 401 && shouldTriggerSessionExpire(path, options.method)) {
      onUnauthorized?.();
    }
    const msg =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
        ? (data as { message: string }).message
        : res.statusText;
    throw new ApiError(msg, res.status, data);
  }

  return data as T;
}
