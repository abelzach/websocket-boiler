import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  authName: string;
  updateAuthName: (name: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authName: '',
      updateAuthName: (name: string) => set({ authName: name }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
