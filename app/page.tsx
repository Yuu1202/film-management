"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFilms } from "@/hooks/useFilms";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import FilmPoster from "@/components/film/FilmPoster";
import api from "@/lib/api";
import WaifuIllustration from "@/components/layout/WaifuIllustration";



export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filmDetails, setFilmDetails] = useState<Record<string, any>>({});
  const debouncedSearch = useDebounce(search, 500);

  const { data: filmsData, isLoading: filmsLoading } = useFilms(1, debouncedSearch);
  const films = filmsData?.data ?? [];

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
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "var(--color-bg)", fontFamily: "'Nunito', sans-serif" }}
    >

      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Nunito:wght@400;600;700&display=swap');`}</style>

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 400,
            height: 400,
            top: -100,
            right: -80,
            background: "var(--color-accent)",
            filter: "blur(90px)",
            opacity: 0.12,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 300,
            height: 300,
            bottom: 0,
            left: -100,
            background: "var(--color-second)",
            filter: "blur(80px)",
            opacity: 0.12,
          }}
        />
        {/* Top border glow line */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: 2,
            background:
              "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
            opacity: 0.5,
          }}
        />
        {/* Diamond dots pattern */}
        <div
          className="absolute"
          style={{ top: 24, right: 24, display: "grid", gridTemplateColumns: "repeat(5, 8px)", gap: 6, opacity: 0.15 }}
        >
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 4,
                background: "var(--color-accent)",
                transform: "rotate(45deg)",
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* ── HERO ── */}
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1 rounded-full"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-accent)",
              fontSize: 11,
              color: "var(--color-accent)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--color-accent)",
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
            Database Film
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 52,
              fontWeight: 700,
              color: "var(--color-text)",
              lineHeight: 1.1,
              letterSpacing: "0.04em",
              marginBottom: 8,
            }}
          >
            Rice
            <span style={{ color: "var(--color-accent)", position: "relative" }}>
              FILM
              <span
                style={{
                  position: "absolute",
                  bottom: -4,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "var(--color-accent)",
                  borderRadius: 2,
                  display: "block",
                }}
              />
            </span>
          </h1>

          <p style={{ color: "var(--color-text-muted)", fontSize: 14, marginBottom: 28, letterSpacing: "0.03em" }}>
            Temukan, ulas, dan simpan film favoritmu.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex max-w-lg mx-auto overflow-hidden"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-main)",
              borderRadius: 12,
            }}
          >
            <input
              type="text"
              placeholder="Cari film..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                padding: "13px 16px",
                fontSize: 14,
                color: "var(--color-text)",
                fontFamily: "'Nunito', sans-serif",
              }}
            />
            <button
              type="submit"
              style={{
                background: "var(--color-accent)",
                border: "none",
                color: "#fff",
                padding: "0 24px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              Cari
            </button>
          </form>
        </div>

        {/* ── ORNAMENT DIVIDER ── */}
        <div className="flex items-center gap-3 mb-6">
          <div
            style={{
              flex: 1,
              height: 1,
              background: "linear-gradient(90deg, transparent, var(--color-main))",
            }}
          />
          <div
            style={{
              width: 6,
              height: 6,
              background: "var(--color-accent)",
              transform: "rotate(45deg)",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              flex: 1,
              height: 1,
              background: "linear-gradient(90deg, var(--color-main), transparent)",
            }}
          />
        </div>

        {/* ── SECTION HEADER ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 3,
                height: 20,
                background: "var(--color-accent)",
                borderRadius: 2,
                flexShrink: 0,
              }}
            />
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "var(--color-text)",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              {search ? `Hasil: "${search}"` : "Film Terbaru"}
            </h2>
            {!search && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--color-accent)",
                  background: "color-mix(in srgb, var(--color-accent) 18%, transparent)",
                  borderRadius: 6,
                  padding: "2px 8px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                HOT
              </span>
            )}
          </div>
          <Link
            href="/films"
            style={{
              fontSize: 12,
              color: "var(--color-accent)",
              textDecoration: "none",
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            Lihat Semua →
          </Link>
        </div>

        {/* ── STATES ── */}
        {filmsLoading && (
          <div className="flex items-center gap-2" style={{ color: "var(--color-text-muted)", fontSize: 13 }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--color-accent)",
                  display: "inline-block",
                  animation: `pulse 1.2s ${i * 0.2}s infinite`,
                }}
              />
            ))}
            <span>Memuat film...</span>
          </div>
        )}

        {!filmsLoading && films.length === 0 && (
          <p style={{ color: "var(--color-text-muted)", fontSize: 13 }}>
            Tidak ada film ditemukan.
          </p>
        )}

        {/* ── FILM GRID ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {films.slice(0, 12).map((film: any) => {
            const detail = filmDetails[film.id];
            return (
              <Link key={film.id} href={`/films/${film.id}`} style={{ textDecoration: "none" }}>
                <div
                  className="group relative overflow-hidden cursor-pointer"
                  style={{
                    background: "var(--color-surface)",
                    borderRadius: 10,
                    border: "1px solid transparent",
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
                  {/* Poster */}
                  <div className="w-full relative" style={{ aspectRatio: "2/3" }}>
                    <FilmPoster images={detail?.images ?? null} title={film.title} />
                  </div>

                  {/* Info */}
                  <div style={{ padding: "8px 10px 10px" }}>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--color-text)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginBottom: 3,
                        fontFamily: "'Nunito', sans-serif",
                      }}
                    >
                      {film.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                        {film.release_date?.slice(0, 4)}
                      </span>
                      {film.average_rating > 0 && (
                        <span style={{ fontSize: 11, color: "#f4b942", fontWeight: 700 }}>
                          ★ {film.average_rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
      `}</style>
      <WaifuIllustration page="1" />
    </div>
  );
}