"use client";

import { useGenres } from "@/hooks/useGenres";
import Link from "next/link";

export default function GenresPage() {
  const { data: genres, isLoading, isError } = useGenres();

  // Loading state
  if (isLoading) return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--color-bg)", fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="flex items-center gap-3" style={{ color: "var(--color-text-muted)", fontSize: 14 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-accent)", display: "inline-block", animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
        ))}
        Memuat genre...
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>
    </div>
  );

  // Error state
  if (isError) return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--color-bg)", fontFamily: "'Nunito', sans-serif" }}
    >
      <p style={{ color: "var(--color-second)", fontSize: 14 }}>Gagal memuat genre.</p>
    </div>
  );

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "var(--color-bg)", fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Nunito:wght@400;600;700&display=swap');
        .genre-card { transition: transform 0.18s cubic-bezier(.34,1.56,.64,1), border-color 0.2s; }
        .genre-card:hover { transform: translateY(-4px) scale(1.04); border-color: var(--color-accent) !important; }
      `}</style>

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 400, height: 400, top: -100, right: -80, background: "var(--color-accent)", filter: "blur(90px)", opacity: 0.09 }} />
        <div className="absolute rounded-full" style={{ width: 300, height: 300, bottom: -80, left: -100, background: "var(--color-second)", filter: "blur(80px)", opacity: 0.09 }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        {/* ── HEADER ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div style={{ width: 3, height: 28, background: "var(--color-accent)", borderRadius: 2 }} />
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 28, fontWeight: 700, color: "var(--color-text)", letterSpacing: "0.04em" }}>
              Semua Genre
            </h1>
          </div>
        </div>

        {/* ── GRID ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {genres?.map((genre: { id: string; name: string }) => (
            <Link key={genre.id} href="/films" style={{ textDecoration: "none" }}>
              <div
                className="genre-card"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid color-mix(in srgb, var(--color-accent) 20%, transparent)",
                  borderRadius: 12,
                  padding: "18px 20px",
                  textAlign: "center",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 18px 18px 0", borderColor: `transparent color-mix(in srgb, var(--color-accent) 40%, transparent) transparent transparent` }} />
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)", letterSpacing: "0.02em" }}>
                  {genre.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}