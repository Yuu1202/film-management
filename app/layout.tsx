import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import Navbar from "@/components/layout/Navbar";
import AuthInitializer from "@/components/layout/AuthInitializer";

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
    <html lang="en">
      <body>
        <Providers>
          {/* Auto-restore session saat app dibuka */}
          <AuthInitializer />
          <Navbar />
          <main className="min-h-screen bg-gray-950 text-white">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}