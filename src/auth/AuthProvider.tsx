import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import api, { setAuthHandlers } from '../api/api';

export type Role = 'ADMIN' | 'EVM_STAFF' | 'DEALER_MANAGER' | 'DEALER_STAFF' | 'GUEST';

type AuthContextType = {
  user: { name: string; role: Role } | null;
  login: (name: string, role: Role) => void;
  loginWithCredentials?: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ name: string; role: Role } | null>(() => {
    try {
      const raw = localStorage.getItem('ev_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // access token kept in-memory; refresh handled via HttpOnly cookie
  const tokenRef = useRef<string | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  function login(name: string, role: Role) {
    const u = { name, role };
    setUser(u);
    localStorage.setItem('ev_user', JSON.stringify(u));
    // Simulate an auth token for API calls (in real app this comes from backend)
    const fakeToken = `FAKE-TOKEN-${role}-${Date.now()}`;
    tokenRef.current = fakeToken;
  }

  async function loginWithCredentials(email: string, password: string) {
    // call backend /api/auth/login
    const res = await api.post('/api/auth/login', { email, password });
    const data = res.data;
    // Expecting { token, role, name, email, userId, dealerId }
    const role = (data.role || 'EVM_STAFF') as Role;
    const name = data.name || data.email || 'User';
    const token = data.token || data.token;
    const u = { name, role };
    setUser(u);
    localStorage.setItem('ev_user', JSON.stringify(u));
    // store access token in-memory; backend sets HttpOnly refresh cookie
    if (token) tokenRef.current = token;
  }

  // attempt to refresh token using backend endpoint if available
  async function refreshToken(): Promise<boolean> {
    try {
      // Backend may not provide a refresh endpoint; try /api/auth/refresh
      const res = await api.post('/api/auth/refresh');
      const data = res.data;
      const token = data?.token;
      if (token) {
        tokenRef.current = token;
        return true;
      }
    } catch (e) {
      // refresh not available or failed
    }
    return false;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('ev_user');
    tokenRef.current = null;
  }

  // register handlers for api module
  // register handlers for api module
  setAuthHandlers({
    getToken: () => tokenRef.current,
    logout: () => logout(),
    refreshToken: refreshToken,
  });

  // On mount attempt to refresh using cookie (if user not persisted) to bootstrap session
  useEffect(() => {
    let active = true;
    async function bootstrap() {
      try {
        // If we already have a persisted user, assume session may be valid.
        if (!user) {
          const ok = await refreshToken();
          if (ok) {
            // backend returned token and user info — try to set user from response
            try {
              const r = await api.get('/api/auth/me');
              if (r && r.data) {
                const d = r.data;
                const role = (d.role || 'EVM_STAFF') as Role;
                const name = d.name || d.email || 'User';
                if (active) {
                  setUser({ name, role });
                  localStorage.setItem('ev_user', JSON.stringify({ name, role }));
                }
              }
            } catch (e) {
              // ignore me endpoint failure
            }
          }
        }
      } finally {
        if (active) setBootstrapped(true);
      }
    }
    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, loginWithCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
