"use client";


import { useState, useEffect } from "react";
import { useFilms } from "@/hooks/useFilms";
import { useGenres } from "@/hooks/useGenres";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import FilmPoster from "@/components/film/FilmPoster";
import api from "@/lib/api";
import { useSearchParams } from "next/navigation";

export default function FilmsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [genreSearch, setGenreSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [filmDetails, setFilmDetails] = useState<Record<string, any>>({});

  const debouncedSearch = useDebounce(search, 500);
  const debouncedGenreSearch = useDebounce(genreSearch, 300);

  const { data, isLoading, isError } = useFilms(page, debouncedSearch);
  const { data: genres } = useGenres();

  const films = data?.data ?? [];
  const meta = data?.meta?.[0];

  const searchParams = useSearchParams();

  // Baca genre dari URL query param kalau ada
  useEffect(() => {
    const genreFromUrl = searchParams.get("genre");
    if (genreFromUrl) setSelectedGenre(genreFromUrl);
  }, []);

  // Fetch detail tiap film untuk dapat genres dan images
  useEffect(() => {
    if (films.length === 0) return;
    films.forEach((film: any) => {
      if (filmDetails[film.id]) return;
      api.get(`/films/${film.id}`).then((res) => {
        setFilmDetails((prev) => ({ ...prev, [film.id]: res.data.data }));
      });
    });
  }, [films]);

  // Filter film berdasarkan genre yang dipilih
  const filteredFilms = selectedGenre
    ? films.filter((film: any) => {
      const detail = filmDetails[film.id];
      return detail?.genres?.some((g: any) => g.id === selectedGenre);
    })
    : films;

  // Filter genre berdasarkan search genre
  const filteredGenres = genres?.filter((g: any) =>
    g.name.toLowerCase().includes(debouncedGenreSearch.toLowerCase())
  );

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "var(--color-bg)", fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Nunito:wght@400;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }
      `}</style>

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 400, height: 400, top: -100, right: -80, background: "var(--color-accent)", filter: "blur(90px)", opacity: 0.1 }} />
        <div className="absolute rounded-full" style={{ width: 300, height: 300, bottom: -80, left: -100, background: "var(--color-second)", filter: "blur(80px)", opacity: 0.1 }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)", opacity: 0.4 }} />
        <div style={{ position: "absolute", top: 24, right: 24, display: "grid", gridTemplateColumns: "repeat(5, 8px)", gap: 6, opacity: 0.1 }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} style={{ width: 4, height: 4, background: "var(--color-accent)", transform: "rotate(45deg)" }} />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* ── HEADER ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div style={{ width: 3, height: 28, background: "var(--color-accent)", borderRadius: 2 }} />
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 28, fontWeight: 700, color: "var(--color-text)", letterSpacing: "0.04em" }}>
              Daftar Film
            </h1>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-accent)", background: "color-mix(in srgb, var(--color-accent) 18%, transparent)", borderRadius: 6, padding: "2px 8px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {selectedGenre ? filteredFilms.length : meta?.total_data ?? "ALL"}
            </span>
          </div>
          <div className="flex items-center gap-3 my-5">
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--color-main))" }} />
            <div style={{ width: 6, height: 6, background: "var(--color-accent)", transform: "rotate(45deg)", flexShrink: 0 }} />
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--color-main), transparent)" }} />
          </div>
        </div>

        {/* ── MAIN LAYOUT: Genre kiri, Film kanan ── */}
        <div className="flex gap-6">

          {/* ── GENRE PANEL (kiri) ── */}
          <div style={{ width: 200, flexShrink: 0 }}>
            {/* Search genre */}
            <div
              className="flex overflow-hidden mb-4"
              style={{
                background: "var(--color-surface)",
                border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)",
                borderRadius: 12,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", paddingLeft: 10, color: "var(--color-text-muted)", fontSize: 12 }}>🔍</span>
              <input
                type="text"
                placeholder="Cari genre..."
                value={genreSearch}
                onChange={(e) => setGenreSearch(e.target.value)}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "9px 10px", fontSize: 12, color: "var(--color-text)", fontFamily: "'Nunito', sans-serif" }}
              />
            </div>

            {/* List genre vertikal scrollable */}
            <div
              style={{
                background: "var(--color-surface)",
                border: "1px solid color-mix(in srgb, var(--color-accent) 20%, transparent)",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              {/* Tombol "Semua" */}
              <button
                onClick={() => setSelectedGenre(null)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  textAlign: "left",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "'Nunito', sans-serif",
                  cursor: "pointer",
                  border: "none",
                  borderBottom: "1px solid color-mix(in srgb, var(--color-accent) 15%, transparent)",
                  background: selectedGenre === null ? "color-mix(in srgb, var(--color-accent) 20%, transparent)" : "transparent",
                  color: selectedGenre === null ? "var(--color-accent)" : "var(--color-text-muted)",
                  transition: "background 0.15s",
                }}
              >
                ✦ Semua Film
              </button>

              {/* Genre list */}
              <div style={{ maxHeight: 420, overflowY: "auto" }}>
                {filteredGenres?.map((genre: any) => (
                  <button
                    key={genre.id}
                    onClick={() => {
                      setSelectedGenre(genre.id === selectedGenre ? null : genre.id);
                      setPage(1);
                    }}
                    style={{
                      width: "100%",
                      padding: "9px 14px",
                      textAlign: "left",
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "'Nunito', sans-serif",
                      cursor: "pointer",
                      border: "none",
                      borderBottom: "1px solid color-mix(in srgb, var(--color-accent) 10%, transparent)",
                      background: selectedGenre === genre.id ? "color-mix(in srgb, var(--color-accent) 20%, transparent)" : "transparent",
                      color: selectedGenre === genre.id ? "var(--color-accent)" : "var(--color-text-muted)",
                      transition: "background 0.15s, color 0.15s",
                      textTransform: "capitalize",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedGenre !== genre.id)
                        (e.currentTarget as HTMLButtonElement).style.background = "color-mix(in srgb, var(--color-accent) 10%, transparent)";
                    }}
                    onMouseLeave={(e) => {
                      if (selectedGenre !== genre.id)
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── FILM PANEL (kanan) ── */}
          <div className="flex-1 min-w-0">
            {/* Search film */}
            <div
              className="flex overflow-hidden mb-6"
              style={{
                maxWidth: 440,
                background: "var(--color-surface)",
                border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)",
                borderRadius: 12,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", paddingLeft: 14, color: "var(--color-text-muted)", fontSize: 14 }}>🔍</span>
              <input
                type="text"
                placeholder="Cari film..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "11px 14px", fontSize: 14, color: "var(--color-text)", fontFamily: "'Nunito', sans-serif" }}
              />
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center gap-3 py-20" style={{ color: "var(--color-text-muted)", fontSize: 14 }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-accent)", display: "inline-block", animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
                ))}
                Memuat film...
              </div>
            )}

            {/* Error */}
            {isError && (
              <p className="text-center py-20" style={{ color: "var(--color-second)", fontSize: 14 }}>
                Gagal memuat film. Coba lagi.
              </p>
            )}

            {!isLoading && !isError && (
              <>
                {filteredFilms.length === 0 && (
                  <p className="text-center py-20" style={{ color: "var(--color-text-muted)", fontSize: 14 }}>
                    Tidak ada film ditemukan.
                  </p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredFilms.map((film: any) => {
                    const detail = filmDetails[film.id];
                    return (
                      <Link key={film.id} href={`/films/${film.id}`} style={{ textDecoration: "none" }}>
                        <div
                          style={{
                            background: "var(--color-surface)",
                            borderRadius: 10,
                            overflow: "hidden",
                            border: "1px solid transparent",
                            cursor: "pointer",
                            transition: "transform 0.22s cubic-bezier(.34,1.56,.64,1), border-color 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px) scale(1.03)";
                            (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-accent)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.transform = "";
                            (e.currentTarget as HTMLDivElement).style.borderColor = "transparent";
                          }}
                        >
                          <div className="w-full" style={{ aspectRatio: "2/3" }}>
                            <FilmPoster images={detail?.images ?? null} title={film.title} />
                          </div>
                          <div style={{ padding: "8px 10px 10px" }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 3 }}>
                              {film.title}
                            </p>
                            <div className="flex items-center justify-between">
                              <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{film.release_date?.slice(0, 4)}</span>
                              {film.average_rating > 0 && (
                                <span style={{ fontSize: 11, color: "#f4b942", fontWeight: 700 }}>★ {film.average_rating}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination — hanya tampil kalau tidak ada genre filter */}
                {!selectedGenre && (
                  <div className="flex items-center justify-center gap-4 mt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      style={{
                        background: "var(--color-surface)",
                        border: "1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)",
                        color: "var(--color-text)",
                        padding: "8px 18px",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: page === 1 ? "not-allowed" : "pointer",
                        opacity: page === 1 ? 0.4 : 1,
                        fontFamily: "'Nunito', sans-serif",
                        transition: "opacity 0.2s",
                      }}
                    >
                      ← Prev
                    </button>
                    <div className="flex items-center gap-2">
                      <div style={{ width: 5, height: 5, background: "var(--color-accent)", transform: "rotate(45deg)" }} />
                      <span style={{ fontSize: 13, color: "var(--color-text-muted)", fontWeight: 600 }}>
                        Halaman {page} dari {meta?.total_page ?? "?"}
                      </span>
                      <div style={{ width: 5, height: 5, background: "var(--color-accent)", transform: "rotate(45deg)" }} />
                    </div>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!meta || page >= meta.total_page}
                      style={{
                        background: "var(--color-surface)",
                        border: "1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)",
                        color: "var(--color-text)",
                        padding: "8px 18px",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: (!meta || page >= meta.total_page) ? "not-allowed" : "pointer",
                        opacity: (!meta || page >= meta.total_page) ? 0.4 : 1,
                        fontFamily: "'Nunito', sans-serif",
                        transition: "opacity 0.2s",
                      }}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}