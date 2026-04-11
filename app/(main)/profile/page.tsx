"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

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

  // Simpan visibility state lokal per item watchlist
  const [visibilityMap, setVisibilityMap] = useState<Record<string, string>>({});

  const { data: userData, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const res = await api.get(`/users/${user?.id}`);
      return res.data.data;
    },
    enabled: !!user?.id,
  });

  // Inisialisasi visibility map dengan default "private" karena API tidak return field ini
  useEffect(() => {
    if (!userData?.film_lists) return;
    setVisibilityMap((prev) => {
      const next = { ...prev };
      userData.film_lists.forEach((item: any) => {
        if (!(item.id in next)) {
          next[item.id] = item.visibility ?? "private";
        }
      });
      return next;
    });
  }, [userData]);

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, visibility }: { id: string; visibility: string }) => {
      await api.patch(`/film-lists/${id}`, { visibility });
    },
    onSuccess: (_, variables) => {
      // PERUBAHAN 1: Troll Toast
      toast("⏳ Menunggu backend menambahkan field visibility di response GET /users/:id");

      // Tetap update state lokal agar UI berubah
      setVisibilityMap((prev) => ({
        ...prev,
        [variables.id]: variables.visibility,
      }));
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
        .watchlist-card, .review-card { transition: border-color 0.2s; }
        .watchlist-card:hover, .review-card:hover { border-color: color-mix(in srgb, var(--color-accent) 50%, transparent) !important; }
      `}</style>

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 400, height: 400, top: -100, right: -80, background: "var(--color-accent)", filter: "blur(90px)", opacity: 0.09 }} />
        <div className="absolute rounded-full" style={{ width: 300, height: 300, bottom: -80, left: -100, background: "var(--color-second)", filter: "blur(80px)", opacity: 0.09 }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)", opacity: 0.4 }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10">

        {/* ── PROFILE CARD ── */}
        <div
          className="mb-8 text-center relative overflow-hidden"
          style={{
            background: "var(--color-surface)",
            borderRadius: 16,
            border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)",
            padding: "40px 32px 32px",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 2, background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)" }} />

          <div
            className="mx-auto mb-4 flex items-center justify-center"
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
          <p style={{ fontSize: 13, color: "var(--color-accent)", fontWeight: 700, marginBottom: 6, letterSpacing: "0.06em" }}>
            @{user?.username}
          </p>
          {user?.bio && <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.6 }}>{user.bio}</p>}
        </div>

        {/* ── WATCHLIST SECTION ── */}
        <div className="flex items-center gap-3 mb-2">
          <div style={{ width: 3, height: 22, background: "var(--color-accent)", borderRadius: 2 }} />
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 700, color: "var(--color-text)", letterSpacing: "0.04em" }}>
            Watchlist Saya
          </h2>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--color-main))" }} />
          <div style={{ width: 5, height: 5, background: "var(--color-accent)", transform: "rotate(45deg)", flexShrink: 0 }} />
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--color-main), transparent)" }} />
        </div>

        {isLoading && (
          <div className="flex items-center gap-3 mb-8" style={{ color: "var(--color-text-muted)", fontSize: 14 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-accent)", display: "inline-block", animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
            ))}
            Memuat data...
          </div>
        )}

        {!isLoading && watchlist.length === 0 && (
          <p className="mb-8" style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Belum ada film di watchlist.</p>
        )}

        <div className="flex flex-col gap-3 mb-12">
          {watchlist.map((item: any) => {
            const currentVisibility = visibilityMap[item.id] ?? "private";
            const isPublic = currentVisibility === "public";
            return (
              <div
                key={item.id}
                className="watchlist-card flex items-center justify-between"
                style={{
                  background: "var(--color-surface)",
                  borderRadius: 12,
                  border: "1px solid color-mix(in srgb, var(--color-accent) 15%, transparent)",
                  padding: "14px 16px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 14px 14px 0", borderColor: `transparent color-mix(in srgb, var(--color-accent) 30%, transparent) transparent transparent` }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)", marginBottom: 3 }}>{item.film_title}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-accent)", background: "color-mix(in srgb, var(--color-accent) 15%, transparent)", borderRadius: 999, padding: "2px 8px", textTransform: "capitalize" }}>
                    {item.list_status}
                  </span>
                </div>
                <button
                  onClick={() => toggleVisibility.mutate({ id: item.id, visibility: isPublic ? "private" : "public" })}
                  disabled={toggleVisibility.isPending}
                  style={{
                    fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 999, border: "1px solid",
                    cursor: toggleVisibility.isPending ? "not-allowed" : "pointer",
                    background: isPublic ? "color-mix(in srgb, var(--color-accent) 20%, transparent)" : "color-mix(in srgb, var(--color-main) 40%, transparent)",
                    borderColor: isPublic ? "var(--color-accent)" : "var(--color-main)",
                    color: isPublic ? "var(--color-accent)" : "var(--color-text-muted)",
                  }}
                >
                  {isPublic ? "🌐 Publik" : "🔒 Privat"}
                </button>
              </div>
            );
          })}
        </div>

        {/* ── PERUBAHAN 2: SECTION ULASAN ── */}
        <div className="flex items-center gap-3 mb-2">
          <div style={{ width: 3, height: 22, background: "var(--color-accent)", borderRadius: 2 }} />
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 700, color: "var(--color-text)", letterSpacing: "0.04em" }}>
            Ulasan Saya
          </h2>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--color-main))" }} />
          <div style={{ width: 5, height: 5, background: "var(--color-accent)", transform: "rotate(45deg)", flexShrink: 0 }} />
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--color-main), transparent)" }} />
        </div>

        {!isLoading && reviews.length === 0 && (
          <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Belum ada ulasan yang ditulis.</p>
        )}

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
                <div style={{ color: "#FFD700", fontSize: 12 }}>
                  ★ {rev.rating}/10
                </div>
              </div>
              <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.5, fontStyle: "italic" }}>
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}