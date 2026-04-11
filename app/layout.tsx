import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import Navbar from "@/components/layout/Navbar";
import AuthInitializer from "@/components/layout/AuthInitializer";
import ThemeInitializer from "@/components/layout/ThemeInitializer";

export const metadata: Metadata = {
  title: {
    default: "FilmApp — Temukan Film Favoritmu",
    template: "%s | FilmApp",
  },
  description: "Temukan, ulas, dan simpan film favoritmu. Semua dalam satu tempat.",
  keywords: ["film", "movie", "ulasan film", "watchlist", "katalog film"],
  openGraph: {
    title: "FilmApp — Temukan Film Favoritmu",
    description: "Temukan, ulas, dan simpan film favoritmu.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {/* Initializers untuk menghidupkan Auth State dan Theme State saat pertama kali load */}
          <AuthInitializer />
          <ThemeInitializer />
          
          <Navbar />
          
          {/* Catatan: bg-gray-950 dan text-white di sini adalah fallback. 
            Warna asli akan diatur oleh ThemeInitializer melalui variabel CSS.
          */}
          <main className="min-h-screen bg-gray-950 text-white">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}