"use client";

import { useState } from "react";
import { useFilms } from "@/hooks/useFilms";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import FilmPoster from "@/components/film/FilmPoster";


export default function FilmsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Debounce search agar tidak spam request tiap ketikan
  const debouncedSearch = useDebounce(search, 500);
  const { data, isLoading, isError } = useFilms(page, debouncedSearch);

  // Data film ada di data.data, meta pagination ada di data.meta
  const films = data?.data ?? [];
  const meta = data?.meta?.[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-6">🎬 Daftar Film</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Cari film..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full max-w-md bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 mb-8"
      />

      {/* Loading State */}
      {isLoading && (
        <div className="text-gray-400 text-center py-20">Memuat film...</div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-red-400 text-center py-20">Gagal memuat film. Coba lagi.</div>
      )}

      {/* Grid Film */}
      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {films.map((film: any) => (

              // Setiap card film → link ke halaman detail film
              // Card film sederhana: poster + judul + tahun rilis + rating
              <Link key={film.id} href={`/films/${film.id}`}>
                <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition cursor-pointer">
                  <div className="w-full aspect-[2/3]">
                    <FilmPoster images={film.images} title={film.title} />
                  </div>
                  <div className="p-2">
                    <p className="text-white text-sm font-medium truncate">{film.title}</p>
                    <p className="text-gray-400 text-xs">{film.release_date?.slice(0, 4)}</p>
                    {film.average_rating > 0 && (
                      <p className="text-yellow-400 text-xs">⭐ {film.average_rating}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {films.length === 0 && (
            <p className="text-gray-500 text-center py-20">Tidak ada film ditemukan.</p>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg transition"
            >
              ← Prev
            </button>
            <span className="text-gray-400 text-sm">
              Halaman {page} dari {meta?.total_page ?? "?"}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!meta || page >= meta.total_page}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg transition"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}