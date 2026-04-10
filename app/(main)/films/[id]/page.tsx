"use client";

import { useFilm } from "@/hooks/useFilms";
import { useAuthStore } from "@/stores/authStore";
import { useParams } from "next/navigation";
import FilmListButton from "@/components/film-list/FilmListButton";
import ReviewSection from "@/components/review/ReviewSection";

export default function FilmDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: film, isLoading, isError } = useFilm(id);
  const { user } = useAuthStore();

  if (isLoading) return (
    <div className="text-gray-400 text-center py-20">Memuat detail film...</div>
  );

  if (isError || !film) return (
    <div className="text-red-400 text-center py-20">Film tidak ditemukan.</div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Poster — fallback ke placeholder kalau images kosong */}
        <img
          src={film.images?.[0] ?? "/placeholder.png"}
          alt={film.title}
          className="w-full md:w-64 aspect-[2/3] object-cover rounded-xl"
          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-2">{film.title}</h1>
          <p className="text-gray-400 text-sm mb-2">{film.release_date?.slice(0, 4)}</p>
          <p className="text-gray-400 text-sm mb-4 capitalize">
            {film.airing_status?.replace(/_/g, " ")} · {film.total_episodes} episode
          </p>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {film.genres?.map((genre: { id: string; name: string }) => (
              <span
                key={genre.id}
                className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <p className="text-gray-300 leading-relaxed mb-4">{film.synopsis}</p>

          {film.average_rating > 0 && (
            <p className="text-yellow-400 text-sm mb-6">
              ⭐ Rating: {film.average_rating?.toFixed(2)} / 10
            </p>
          )}

          {user && <FilmListButton filmId={film.id} />}
        </div>
      </div>

      {/* Review section — POST review tetap bisa, tampilan list tidak ada karena API tidak support GET reviews */}
      <ReviewSection filmId={film.id} />
    </div>
  );
}