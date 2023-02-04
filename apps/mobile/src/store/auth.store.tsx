import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  onAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  onAuth: () => set({ isAuthenticated: true }),
}));
