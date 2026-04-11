import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semua warna ini otomatis ikut theme yang aktif
        "theme-bg":      "var(--color-bg)",
        "theme-surface": "var(--color-surface)",
        "theme-main":    "var(--color-main)",
        "theme-second":  "var(--color-second)",
        "theme-accent":  "var(--color-accent)",
        "theme-text":    "var(--color-text)",
        "theme-muted":   "var(--color-text-muted)",
      },
    },
  },
  plugins: [],
};

export default config;