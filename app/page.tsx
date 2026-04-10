"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFilms } from "@/hooks/useFilms";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import FilmPoster from "@/components/film/FilmPoster";
import api from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filmDetails, setFilmDetails] = useState<Record<string, any>>({});
  const debouncedSearch = useDebounce(search, 500);

  const { data: filmsData, isLoading: filmsLoading } = useFilms(1, debouncedSearch);
  const films = filmsData?.data ?? [];

  // Fetch detail tiap film untuk dapat field images
  useEffect(() => {
    if (films.length === 0) return;
    films.forEach((film: any) => {
      if (filmDetails[film.id]) return;
      api.get(`/films/${film.id}`).then((res) => {
        setFilmDetails((prev) => ({
          ...prev,
          [film.id]: res.data.data,
        }));
      });
    });
  }, [films]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/films?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">🎬 FilmApp</h1>
        <p className="text-gray-400 mb-6">Temukan, ulas, dan simpan film favoritmu.</p>

        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Cari film..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition font-semibold"
          >
            Cari
          </button>
        </form>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {search ? `Hasil: "${search}"` : "🔥 Film Terbaru"}
          </h2>
          <Link href="/films" className="text-blue-400 hover:underline text-sm">
            Lihat Semua →
          </Link>
        </div>

        {filmsLoading && <p className="text-gray-400 text-sm">Memuat film...</p>}

        {!filmsLoading && films.length === 0 && (
          <p className="text-gray-500 text-sm">Tidak ada film ditemukan.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {films.slice(0, 12).map((film: any) => {
            const detail = filmDetails[film.id];
            return (
              <Link key={film.id} href={`/films/${film.id}`}>
                <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition cursor-pointer">
                  <div className="w-full aspect-[2/3]">
                    <FilmPoster
                      images={detail?.images ?? null}
                      title={film.title}
                    />
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
            );
          })}
        </div>
      </div>
    </div>
  );
}