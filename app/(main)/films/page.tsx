"use client";

import { useState, useMemo, Suspense } from "react";
import { useFilms } from "@/hooks/useFilms";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import FilmPoster from "@/components/film/FilmPoster";

// ── WRAPPER DENGAN SUSPENSE ──
export default function FilmsPageWrapper() {
  return (
    <Suspense fallback={null}>
      <FilmsPage />
    </Suspense>
  );
}

// ── KOMPONEN UTAMA (DIRENAME AGAR TIDAK DEFAULT EXPORT) ──
function FilmsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Baca query param 'genre'
  const genreId = searchParams.get("genre");

  // --- STATES ---
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // --- DEBOUNCE ---
  const debouncedSearch = useDebounce(search, 500);

  // --- DATA FETCHING ---
  const { data, isLoading, isError } = useFilms(page, debouncedSearch);

  const films = useMemo(() => data?.data ?? [], [data]);
  const meta = data?.meta?.[0];

  // --- HANDLERS ---
  const clearGenreFilter = () => {
    router.push("/films"); 
  };

  // ── RENDER OVERLAY "IN PROGRESS" ──
  if (genreId) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{ background: "var(--color-bg)", fontFamily: "'Nunito', sans-serif" }}
      >
        <div className="relative z-10">
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 42, color: "var(--color-accent)", marginBottom: 16 }}>
            In Progress
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Waiting backend adding filter_by=genre
            <br />
          </p>
          
          <button
            onClick={clearGenreFilter}
            className="px-8 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95"
            style={{ 
              background: "var(--color-accent)", 
              color: "var(--color-bg)",
              boxShadow: "0 0 20px color-mix(in srgb, var(--color-accent) 40%, transparent)"
            }}
          >
            ← Kembali ke Daftar Film
          </button>
        </div>

        <div className="absolute rounded-full" style={{ width: 500, height: 500, background: "var(--color-accent)", filter: "blur(120px)", opacity: 0.05 }} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "var(--color-bg)", fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Nunito:wght@400;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }
      `}</style>

      {/* Ambient Background Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 400, height: 400, top: -100, right: -80, background: "var(--color-accent)", filter: "blur(90px)", opacity: 0.1 }} />
        <div className="absolute rounded-full" style={{ width: 300, height: 300, bottom: -80, left: -100, background: "var(--color-second)", filter: "blur(80px)", opacity: 0.1 }} />
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
              {meta?.total_data ?? "ALL"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <main className="flex-1 min-w-0">
            {/* Search Bar */}
            <div className="mb-8 relative max-w-md">
              <input
                type="text"
                placeholder="Cari judul film..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                style={{ 
                  width: "100%", background: "var(--color-surface)", border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)", 
                  borderRadius: 12, padding: "12px 16px 12px 40px", fontSize: 15, color: "var(--color-text)" 
                }}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50">🔍</span>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-accent)", animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
                <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Menyusun proyektor...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-20">
                <p style={{ color: "var(--color-second)" }}>Gagal memuat data film.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {films.map((film: any) => (
                    <Link key={film.id} href={`/films/${film.id}`} className="group">
                      <div style={{ 
                        background: "var(--color-surface)", borderRadius: 12, overflow: "hidden", 
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", border: "1px solid transparent" 
                      }} className="group-hover:-translate-y-2 group-hover:border-[var(--color-accent)]">
                        <div className="relative aspect-[2/3] overflow-hidden">
                          <FilmPoster images={film.images} title={film.title} />
                        </div>
                        <div className="p-3">
                          <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text)" }} className="line-clamp-1 mb-1">
                            {film.title}
                          </h3>
                          <div className="flex items-center justify-between opacity-70">
                            <span style={{ fontSize: 11 }}>{film.release_date?.slice(0, 4)}</span>
                            {film.average_rating > 0 && (
                              <span style={{ fontSize: 11, color: "#f4b942", fontWeight: 700 }}>★ {film.average_rating}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-6 mt-12">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-6 py-2 rounded-lg font-bold transition-all"
                    style={{ 
                      background: "var(--color-surface)", border: "1px solid var(--color-accent)",
                      opacity: page === 1 ? 0.3 : 1, cursor: page === 1 ? "not-allowed" : "pointer" 
                    }}
                  >
                    ← Prev
                  </button>
                  <span className="text-sm font-semibold opacity-70">
                    Halaman {page} dari {meta?.total_page ?? 1}
                  </span>
                  <button
                    disabled={!meta || page >= meta.total_page}
                    onClick={() => setPage(p => p + 1)}
                    className="px-6 py-2 rounded-lg font-bold transition-all"
                    style={{ 
                      background: "var(--color-surface)", border: "1px solid var(--color-accent)",
                      opacity: (!meta || page >= meta.total_page) ? 0.3 : 1, cursor: (!meta || page >= meta.total_page) ? "not-allowed" : "pointer" 
                    }}
                  >
                    Next →
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}