import { Theme } from "@/stores/themeStore";

interface WaifuConfig {
  src: string;
  style: React.CSSProperties;
}

// Tambah mapping page + theme sesuai kebutuhan
// Key format: "namahalaman-tema"
export const waifuConfig: Record<string, WaifuConfig> = {
  // Home
  "1-purple": { src: "/waifu/purple/1.png", style: { position: "absolute", bottom: 800, right: 550, height: 200, zIndex: 0, pointerEvents: "none" } },
  "1-dark":   { src: "/waifu/dark/1.png",   style: { position: "fixed", bottom: 0, right: 0, height: 300, zIndex: 40, pointerEvents: "none" } },
  "1-light":  { src: "/waifu/light/1.png",  style: { position: "fixed", bottom: 0, right: 0, height: 300, zIndex: 40, pointerEvents: "none" } },


};

// Ambil config waifu berdasarkan halaman dan tema
export const getWaifuConfig = (page: string, theme: Theme): WaifuConfig | null => {
  return waifuConfig[`${page}-${theme}`] ?? null;
};