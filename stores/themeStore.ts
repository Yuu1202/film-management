import { create } from "zustand";

export type Theme = "purple" | "dark" | "light";

interface ThemeState {
  theme: Theme;
  // Ganti tema dan simpan ke localStorage
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme:
    (typeof window !== "undefined"
      ? (localStorage.getItem("theme") as Theme)
      : null) ?? "purple",

  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme });
    // Terapkan class tema ke element html
    document.documentElement.setAttribute("data-theme", theme);
  },
}));