import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'SERVICE_PROVIDER' | 'CLEANER' | 'CUSTOMER' | 'ADMIN';

interface User {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
  serviceProviderId?: number;
  customerId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: (user, token) => set({ user, token, isAuthenticated: true, error: null }),
      logout: () => set({ user: null, token: null, isAuthenticated: false, error: null }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
