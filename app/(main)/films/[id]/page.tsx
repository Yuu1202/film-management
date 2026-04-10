"use client";

import { useFilm } from "@/hooks/useFilms";
import { useAuthStore } from "@/stores/authStore";
import { useParams } from "next/navigation";
import ReviewSection from "@/components/review/ReviewSection";
import FilmListButton from "@/components/film-list/FilmListButton";

export default function FilmDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: film, isLoading, isError } = useFilm(id);
  const { user } = useAuthStore();

  // Loading state
  if (isLoading) return (
    <div className="text-gray-400 text-center py-20">Memuat detail film...</div>
  );

  // Error state
  if (isError || !film) return (
    <div className="text-red-400 text-center py-20">Film tidak ditemukan.</div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Poster Film */}
        <img
          src={film.poster_url || "/placeholder.png"}
          alt={film.title}
          className="w-full md:w-64 aspect-[2/3] object-cover rounded-xl"
        />

        <div className="flex-1">
          {/* Info Film */}
          <h1 className="text-3xl font-bold text-white mb-2">{film.title}</h1>
          <p className="text-gray-400 text-sm mb-4">{film.release_year}</p>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {film.genres?.map((genre) => (
              <span
                key={genre.id}
                className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Deskripsi */}
          <p className="text-gray-300 leading-relaxed mb-6">{film.description}</p>

          {/* Tombol tambah ke watchlist, hanya tampil kalau sudah login */}
          {user && <FilmListButton filmId={film.id} />}
        </div>
      </div>

      {/* Section ulasan film */}
      <ReviewSection filmId={film.id} />
    </div>
  );
}