import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  api,
  clearServerSessionCookie,
  setUnauthorizedCallback,
} from '../lib/api';
import type { UserMe } from '../types';

type AuthState = {
  user: UserMe | null;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  register: (body: {
    name: string;
    lastname: string;
    username: string;
    email?: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserMe | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const me = await api<UserMe>('/auth/me');
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setUnauthorizedCallback(() => {
      void clearServerSessionCookie();
      setUser(null);
    });
    return () => setUnauthorizedCallback(null);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  /** Si la cookie/JWT se altera o caduca con la pestaña abierta, volver a validar sin esperar a otra acción. */
  useEffect(() => {
    if (!user) return;

    let debounceTimer: number | undefined;

    const recheck = () => {
      void refresh();
    };

    const scheduleRecheck = () => {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(recheck, 300);
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible') scheduleRecheck();
    };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', scheduleRecheck);

    const intervalMs = 2000;
    const intervalId = window.setInterval(recheck, intervalMs);

    return () => {
      window.clearTimeout(debounceTimer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', scheduleRecheck);
      window.clearInterval(intervalId);
    };
  }, [user, refresh]);

  const login = useCallback(async (username: string, password: string) => {
    await api<UserMe>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    await refresh();
  }, [refresh]);

  const register = useCallback(
    async (body: {
      name: string;
      lastname: string;
      username: string;
      email?: string;
      password: string;
    }) => {
      await api<UserMe>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      await refresh();
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    await clearServerSessionCookie();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, refresh, login, register, logout }),
    [user, loading, refresh, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}
