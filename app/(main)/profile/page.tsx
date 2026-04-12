"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import toast from "react-hot-toast";

// Menghapus komponen FilmPosterSmall karena API tidak mengembalikan film_id 
// yang valid untuk melakukan fetch detail film di dalam list.

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const res = await api.get(`/users/${user?.id}`);
      return res.data.data;
    },
    enabled: !!user?.id,
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, visibility }: { id: string; visibility: string }) => {
      await api.patch(`/film-lists/${id}`, { visibility });
    },
    onSuccess: () => {
      // Refresh data profile agar mendapatkan status visibilitas terbaru dari server
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Visibilitas diperbarui!");
    },
    onError: () => toast.error("Gagal mengubah visibilitas"),
  });

  const watchlist = userData?.film_lists ?? [];
  const reviews = userData?.reviews ?? [];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "var(--color-bg)", fontFamily: "'Nunito', sans-serif" }}
    >
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
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

          {/* ── KOLOM KIRI: Avatar + Info + Ulasan ── */}
          <div>
            <div
              className="mb-8 relative overflow-hidden"
              style={{
                background: "var(--color-surface)",
                borderRadius: 16,
                border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)",
                padding: "40px 32px 32px",
              }}
            >
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
                  {user?.display_name?.charAt(0).toUpperCase()}
                </div>

                <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700, color: "var(--color-text)", letterSpacing: "0.04em", marginBottom: 4 }}>
                  {user?.display_name}
                </h1>
                <p style={{ fontSize: 13, color: "var(--color-accent)", fontWeight: 700, marginBottom: 4, letterSpacing: "0.06em" }}>
                  @{user?.username}
                </p>
                <p style={{ fontSize: 10, color: "var(--color-text-muted)", marginBottom: 12, opacity: 0.7 }}>
                  ID: {user?.id}
                </p>
                {user?.bio && (
                  <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.6 }}>{user.bio}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: 3, height: 22, background: "var(--color-accent)", borderRadius: 2 }} />
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 700, color: "var(--color-text)" }}>
                Ulasan Saya
              </h2>
            </div>
            
            {isLoading && <p className="text-sm opacity-50">Memuat ulasan...</p>}
            {!isLoading && reviews.length === 0 && (
              <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Belum ada ulasan yang ditulis.</p>
            )}

            <div className="flex flex-col gap-3">
              {reviews.map((rev: any, idx: number) => (
                <div key={idx} className="review-card" style={{ background: "var(--color-surface)", borderRadius: 12, border: "1px solid color-mix(in srgb, var(--color-accent) 15%, transparent)", padding: "16px" }}>
                  <div className="flex justify-between items-start mb-2">
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)" }}>{rev.film}</p>
                    <div style={{ color: "#FFD700", fontSize: 12 }}>★ {rev.rating}/10</div>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--color-text-muted)", fontStyle: "italic" }}>"{rev.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── KOLOM KANAN: Watchlist ── */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: 3, height: 22, background: "var(--color-accent)", borderRadius: 2 }} />
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 700, color: "var(--color-text)" }}>
                Watchlist Saya
              </h2>
            </div>

            {isLoading && <p className="text-sm opacity-50">Memuat watchlist...</p>}
            {!isLoading && watchlist.length === 0 && (
              <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Belum ada film di watchlist.</p>
            )}

            <div className="flex flex-col gap-3">
              {watchlist.map((item: any) => {
                // Menggunakan visibilitas langsung dari API
                const currentVisibility = item.visibility ?? "private";
                const isPublic = currentVisibility === "public";
                
                return (
                  <div
                    key={item.id}
                    className="watchlist-card"
                    style={{
                      background: "var(--color-surface)",
                      borderRadius: 12,
                      border: "1px solid color-mix(in srgb, var(--color-accent) 15%, transparent)",
                      padding: "12px 14px",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Placeholder Poster karena tidak ada film_id */}
                      <div style={{ width: 48, height: 68, borderRadius: 6, background: "var(--color-main)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <span style={{ fontSize: 18, opacity: 0.4 }}>🎬</span>
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.film_title}
                        </p>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-accent)", background: "color-mix(in srgb, var(--color-accent) 15%, transparent)", borderRadius: 999, padding: "2px 8px", textTransform: "capitalize" }}>
                          {item.list_status}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleVisibility.mutate({ id: item.id, visibility: isPublic ? "private" : "public" })}
                        disabled={toggleVisibility.isPending}
                        style={{
                          fontSize: 10, fontWeight: 700, padding: "5px 10px", borderRadius: 999, border: "1px solid",
                          cursor: toggleVisibility.isPending ? "not-allowed" : "pointer",
                          background: isPublic ? "color-mix(in srgb, var(--color-accent) 20%, transparent)" : "color-mix(in srgb, var(--color-main) 40%, transparent)",
                          borderColor: isPublic ? "var(--color-accent)" : "rgba(255,255,255,0.2)",
                          color: isPublic ? "var(--color-accent)" : "var(--color-text-muted)",
                          flexShrink: 0,
                        }}
                      >
                        {toggleVisibility.isPending ? "..." : (isPublic ? "🌐 Publik" : "🔒 Privat")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}