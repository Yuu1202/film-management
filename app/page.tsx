"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";

export default function HomePage() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      {/* Hero Section */}
      <h1 className="text-5xl font-bold text-white mb-4">
        🎬 FilmApp
      </h1>
      <p className="text-gray-400 text-lg max-w-md mb-8">
        Temukan, ulas, dan simpan film favoritmu. Semua dalam satu tempat.
      </p>

      {/* Tombol CTA berdasarkan status login */}
      <div className="flex gap-4">
        <Link
          href="/films"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          Jelajahi Film
        </Link>

        {!user ? (
          <Link
            href="/register"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Daftar Sekarang
          </Link>
        ) : (
          <Link
            href="/profile"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Lihat Profil
          </Link>
        )}
      </div>

      {/* Quick links admin */}
      {user?.role === "admin" && (
        <div className="mt-8 flex gap-3">
          <Link
            href="/admin/genres"
            className="text-yellow-400 hover:underline text-sm"
          >
            ⚙️ Kelola Genre
          </Link>
          <Link
            href="/admin/films"
            className="text-yellow-400 hover:underline text-sm"
          >
            ➕ Tambah Film
          </Link>
        </div>
      )}
    </div>
  );
}