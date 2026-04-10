"use client";

import { useGenres } from "@/hooks/useGenres";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Genre",
  description: "Lihat semua kategori genre film yang tersedia.",
};

export default function GenresPage() {
  const { data: genres, isLoading, isError } = useGenres();

  // Loading state
  if (isLoading) return (
    <div className="text-gray-400 text-center py-20">Memuat genre...</div>
  );

  // Error state
  if (isError) return (
    <div className="text-red-400 text-center py-20">Gagal memuat genre.</div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">🎭 Semua Genre</h1>

      {/* Grid semua genre */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {genres?.map((genre) => (
          <div
            key={genre.id}
            className="bg-gray-800 hover:bg-gray-700 rounded-xl px-5 py-4 text-center transition cursor-default"
          >
            <p className="text-white font-medium">{genre.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}