"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const BASE_IMAGE_URL = "https://film-management-api.labse.id/api/static/";

function FilmPosterSmall({ filmId }: { filmId: string }) {
  const { data: filmDetail } = useQuery({
    queryKey: ["film-detail", filmId],
    queryFn: async () => {
      const res = await api.get(`/films/${filmId}`);
      return res.data.data;
    },
    enabled: !!filmId,
    staleTime: 1000 * 60 * 5,
  });

  const imagePath = filmDetail?.images?.[0];
  const imageUrl = imagePath ? `${BASE_IMAGE_URL}${imagePath}` : null;

  return (
    <div
      style={{
        width: 48,
        height: 68,
        borderRadius: 6,
        overflow: "hidden",
        flexShrink: 0,
        background: "var(--color-main)",
        border: "1px solid color-mix(in srgb, var(--color-accent) 20%, transparent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="poster"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <span style={{ fontSize: 18, opacity: 0.4 }}>🎬</span>
      )}
    </div>
  );
}

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await api.get(`/users/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)", fontFamily: "'Nunito', sans-serif" }}>
      <div className="flex items-center gap-3" style={{ color: "var(--color-text-muted)", fontSize: 14 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-accent)", display: "inline-block", animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
        ))}
        Memuat profil...
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>
    </div>
  );

  if (isError || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)", fontFamily: "'Nunito', sans-serif" }}>
      <p style={{ color: "var(--color-second)", fontSize: 14 }}>Profil tidak ditemukan.</p>
    </div>
  );

  const publicWatchlist = user.film_lists?.filter((item: any) => item.visibility === "public") ?? [];
  const reviews = user.reviews ?? [];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--color-bg)", fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Nunito:wght@400;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .watchlist-card { transition: border-color 0.2s; }
        .watchlist-card:hover { border-color: color-mix(in srgb, var(--color-accent) 50%, transparent) !important; }
        .review-card { transition: border-color 0.2s; }
        .review-card:hover { border-color: color-mix(in srgb, var(--color-accent) 40%, transparent) !important; }
      `}</style>

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 400, height: 400, top: -100, right: -80, background: "var(--color-accent)", filter: "blur(90px)", opacity: 0.09 }} />
        <div className="absolute rounded-full" style={{ width: 300, height: 300, bottom: -80, left: -100, background: "var(--color-second)", filter: "blur(80px)", opacity: 0.09 }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)", opacity: 0.4 }} />
        <div style={{ position: "absolute", top: 24, right: 24, display: "grid", gridTemplateColumns: "repeat(5, 8px)", gap: 6, opacity: 0.1 }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} style={{ width: 4, height: 4, background: "var(--color-accent)", transform: "rotate(45deg)" }} />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

          {/* ── KOLOM KIRI: Avatar + Info + Ulasan ── */}
          <div>
            {/* Profile Card — sama persis strukturnya dengan /profile */}
            <div
              className="mb-8 relative overflow-hidden"
              style={{
                background: "var(--color-surface)",
                borderRadius: 16,
                border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)",
                padding: "40px 32px 32px",
                boxShadow: "0 0 60px color-mix(in srgb, var(--color-accent) 8%, transparent)",
              }}
            >
              <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 2, background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)" }} />
              <div style={{ position: "absolute", top: 16, left: 16, display: "grid", gridTemplateColumns: "repeat(3, 6px)", gap: 4, opacity: 0.15 }}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} style={{ width: 3, height: 3, background: "var(--color-accent)", transform: "rotate(45deg)" }} />
                ))}
              </div>
              <div style={{ position: "absolute", bottom: 16, right: 16, display: "grid", gridTemplateColumns: "repeat(3, 6px)", gap: 4, opacity: 0.15 }}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} style={{ width: 3, height: 3, background: "var(--color-second)", transform: "rotate(45deg)" }} />
                ))}
              </div>

              <div className="flex flex-col items-center text-center">
                <div
                  className="mb-4 flex items-center justify-center"
                  style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: "var(--color-main)", border: "2px solid var(--color-accent)",
                    fontSize: 28, fontWeight: 700, color: "var(--color-text)", fontFamily: "'Cinzel', serif",
                    boxShadow: "0 0 24px color-mix(in srgb, var(--color-accent) 30%, transparent)",
                  }}
                >
                  {user.display_name?.charAt(0).toUpperCase()}
                </div>

                <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700, color: "var(--color-text)", letterSpacing: "0.04em", marginBottom: 4 }}>
                  {user.display_name}
                </h1>
                <p style={{ fontSize: 13, color: "var(--color-accent)", fontWeight: 700, marginBottom: 4, letterSpacing: "0.06em" }}>
                  @{user.username}
                </p>
                {/* ID dari API */}
                <p style={{ fontSize: 10, color: "var(--color-text-muted)", marginBottom: 12, letterSpacing: "0.03em", fontFamily: "monospace", opacity: 0.7 }}>
                  ID: {user.id}
                </p>
                {user.bio && (
                  <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.6 }}>{user.bio}</p>
                )}
              </div>
            </div>

            {/* Section Ulasan */}
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: 3, height: 22, background: "var(--color-accent)", borderRadius: 2 }} />
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 700, color: "var(--color-text)", letterSpacing: "0.04em" }}>
                Ulasan
              </h2>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-accent)", background: "color-mix(in srgb, var(--color-accent) 18%, transparent)", borderRadius: 6, padding: "2px 8px", letterSpacing: "0.08em" }}>
                {reviews.length}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--color-main))" }} />
              <div style={{ width: 5, height: 5, background: "var(--color-accent)", transform: "rotate(45deg)", flexShrink: 0 }} />
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--color-main), transparent)" }} />
            </div>

            {reviews.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Belum ada ulasan.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {reviews.map((rev: any, idx: number) => (
                  <div
                    key={idx}
                    className="review-card"
                    style={{
                      background: "var(--color-surface)",
                      borderRadius: 12,
                      border: "1px solid color-mix(in srgb, var(--color-accent) 15%, transparent)",
                      padding: "16px",
                      position: "relative",
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)" }}>{rev.film}</p>
                      <div style={{ color: "#FFD700", fontSize: 12, flexShrink: 0, marginLeft: 8 }}>
                        ★ {rev.rating}/10
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.5, fontStyle: "italic" }}>
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── KOLOM KANAN: Watchlist Publik ── */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: 3, height: 22, background: "var(--color-accent)", borderRadius: 2 }} />
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 700, color: "var(--color-text)", letterSpacing: "0.04em" }}>
                Watchlist Publik
              </h2>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-accent)", background: "color-mix(in srgb, var(--color-accent) 18%, transparent)", borderRadius: 6, padding: "2px 8px", letterSpacing: "0.08em" }}>
                {publicWatchlist.length}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--color-main))" }} />
              <div style={{ width: 5, height: 5, background: "var(--color-accent)", transform: "rotate(45deg)", flexShrink: 0 }} />
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--color-main), transparent)" }} />
            </div>

            {publicWatchlist.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Tidak ada watchlist publik.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {publicWatchlist.map((item: any) => (
                  <div
                    key={item.id}
                    className="watchlist-card"
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid color-mix(in srgb, var(--color-accent) 15%, transparent)",
                      borderRadius: 12,
                      padding: "12px 14px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 14px 14px 0", borderColor: `transparent color-mix(in srgb, var(--color-accent) 30%, transparent) transparent transparent` }} />

                    <div className="flex items-center gap-3">
                      <FilmPosterSmall filmId={item.id} />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.film_title}
                        </p>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-accent)", background: "color-mix(in srgb, var(--color-accent) 15%, transparent)", borderRadius: 999, padding: "2px 8px", textTransform: "capitalize" }}>
                          {item.list_status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}