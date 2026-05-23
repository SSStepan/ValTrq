import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { MOCK_ACCOUNTS } from '@/mock/data';
import type { Account } from '@/types';

interface AuthState {
  token: string | null;
  account: Account | null;
  isPublic: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: () => Promise<void>;
  signOut: () => void;
  setPublic: (v: boolean) => void;
}

const STORAGE_KEY = 'valtrq.auth';
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ token: null, account: null, isPublic: true });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const signIn = async () => {
    await new Promise(r => setTimeout(r, 1500));
    setState(s => ({
      ...s,
      token: 'mock-rso-token-' + Math.random().toString(36).slice(2, 10),
      account: MOCK_ACCOUNTS[1]
    }));
  };

  const signOut = () => setState({ token: null, account: null, isPublic: true });
  const setPublic = (v: boolean) => setState(s => ({ ...s, isPublic: v }));

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, setPublic }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
