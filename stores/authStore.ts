import { create } from "zustand";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;

  // Simpan data user dan token setelah login
  setAuth: (user: User, token: string) => void;

  // Hapus semua data session saat logout
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },

  clearAuth: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));