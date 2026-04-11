"use client";

import { useFilm } from "@/hooks/useFilms";
import { useAuthStore } from "@/stores/authStore";
import { useParams } from "next/navigation";
import FilmListButton from "@/components/film-list/FilmListButton";
import ReviewSection from "@/components/review/ReviewSection";
import FilmPoster from "@/components/film/FilmPoster";

export default function FilmDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: film, isLoading, isError } = useFilm(id);
  const { user } = useAuthStore();

  if (isLoading) return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--color-bg)", fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="flex items-center gap-3" style={{ color: "var(--color-text-muted)", fontSize: 14 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-accent)", display: "inline-block", animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
        ))}
        Memuat detail film...
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>
    </div>
  );

  if (isError || !film) return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--color-bg)", fontFamily: "'Nunito', sans-serif" }}
    >
      <p style={{ color: "var(--color-second)", fontSize: 14 }}>Film tidak ditemukan.</p>
    </div>
  );

  return (
    <div
      className="min-h-screen relative"
      style={{ background: "var(--color-bg)", fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Nunito:wght@400;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }
      `}</style>

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 500, height: 500, top: -150, right: -150, background: "var(--color-accent)", filter: "blur(120px)", opacity: 0.08 }} />
        <div className="absolute rounded-full" style={{ width: 400, height: 400, bottom: -100, left: -100, background: "var(--color-second)", filter: "blur(100px)", opacity: 0.08 }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)", opacity: 0.4 }} />
      </div>

      {/* Container diubah ke max-w-6xl */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

        {/* ── HERO SECTION ── */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Poster */}
          <div
            className="flex-shrink-0 w-full md:w-56"
            style={{
              aspectRatio: "2/3",
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)",
              boxShadow: "0 0 40px color-mix(in srgb, var(--color-accent) 12%, transparent)",
            }}
          >
            <FilmPoster images={film.images} title={film.title} />
          </div>

          {/* Info Utama */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 28, fontWeight: 700, color: "var(--color-text)", letterSpacing: "0.03em", lineHeight: 1.2, marginBottom: 10 }}>
                {film.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div style={{ width: 3, height: 14, background: "var(--color-accent)", borderRadius: 2 }} />
                <span style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                  {film.release_date?.slice(0, 4)}
                </span>
                <span style={{ width: 4, height: 4, background: "var(--color-accent)", transform: "rotate(45deg)", display: "inline-block", opacity: 0.6 }} />
                <span style={{ fontSize: 13, color: "var(--color-text-muted)", textTransform: "capitalize" }}>
                   {film.total_episodes} episode
                </span>
              </div>

              {film.average_rating > 0 && (
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full" style={{ background: "color-mix(in srgb, var(--color-second) 18%, transparent)", border: "1px solid color-mix(in srgb, var(--color-second) 40%, transparent)", fontSize: 13, fontWeight: 700, color: "#f4b942" }}>
                  ★ {film.average_rating?.toFixed(2)} / 10
                </div>
              )}

              <p style={{ color: "var(--color-text-muted)", fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>
                {film.synopsis}
              </p>
            </div>

            {user && (
              <div>
                <FilmListButton filmId={film.id} />
              </div>
            )}
          </div>
        </div>

        {/* ── ORNAMENT DIVIDER ── */}
        <div className="flex items-center gap-3 mb-8">
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--color-main))" }} />
          <div style={{ width: 6, height: 6, background: "var(--color-accent)", transform: "rotate(45deg)", flexShrink: 0 }} />
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--color-main), transparent)" }} />
        </div>

        {/* ── MAIN CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Kolom Kiri: Review Section (col-span-2) */}
          <div className="lg:col-span-2">
            <ReviewSection filmId={film.id} />
          </div>

          {/* Kolom Kanan: Sidebar Info (col-span-1) */}
          <div className="lg:col-span-1">
            <div 
              className="sticky top-6 p-6" 
              style={{ 
                background: "color-mix(in srgb, var(--color-main) 40%, transparent)", 
                borderRadius: 16,
                border: "1px solid color-mix(in srgb, var(--color-text) 10%, transparent)",
                backdropFilter: "blur(10px)"
              }}
            >
              <h3 className="mb-4" style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: "var(--color-text)" }}>Informasi</h3>
              
              <div className="space-y-4">
                <div>
                  <p style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Status Tayang</p>
                  <p style={{ fontSize: 14, color: "var(--color-text)", fontWeight: 600, textTransform: "capitalize" }}>
                    {film.airing_status?.replace(/_/g, " ")}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Total Episode</p>
                  <p style={{ fontSize: 14, color: "var(--color-text)", fontWeight: 600 }}>{film.total_episodes} Episode</p>
                </div>

                <div>
                  <p style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Tanggal Rilis</p>
                  <p style={{ fontSize: 14, color: "var(--color-text)", fontWeight: 600 }}>
                    {film.release_date ? new Date(film.release_date).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "-"}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Genre</p>
                  <div className="flex flex-wrap gap-2">
                    {film.genres?.map((genre: { id: string; name: string }) => (
                      <span
                        key={genre.id}
                        style={{
                          background: "color-mix(in srgb, var(--color-accent) 12%, transparent)",
                          border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)",
                          color: "var(--color-accent)",
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 10px",
                          borderRadius: 6,
                          textTransform: "uppercase",
                        }}
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}