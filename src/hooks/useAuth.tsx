import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getMe, login as loginApi, logout as logoutApi, register as registerApi } from '@/lib/api/auth';
import type { AuthResponse, SafeUser } from '@/lib/api/auth';

interface AuthState {
  user: SafeUser | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMe()
      .then((res: AuthResponse) => {
        if (!cancelled) {
          setUser(res.user);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const doLogin = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginApi(email, password);
      setUser(res.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const doRegister = async (name: string, email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerApi(name, email, password);
      setUser(res.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const doLogout = async (): Promise<void> => {
    setLoading(true);
    try {
      await logoutApi();
      setUser(null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login: doLogin, register: doRegister, logout: doLogout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}
