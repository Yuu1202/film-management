"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

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

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--color-bg)", fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Nunito:wght@400;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }
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

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">

        {/* ── PROFILE CARD ── */}
        <div
          className="text-center relative overflow-hidden mb-8"
          style={{
            background: "var(--color-surface)",
            borderRadius: 16,
            border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)",
            padding: "48px 32px 40px",
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

          <div
            className="mx-auto mb-5 flex items-center justify-center"
            style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "var(--color-main)",
              border: "2px solid var(--color-accent)",
              fontSize: 32, fontWeight: 700,
              color: "var(--color-text)",
              fontFamily: "'Cinzel', serif",
              boxShadow: "0 0 28px color-mix(in srgb, var(--color-accent) 35%, transparent)",
            }}
          >
            {user.display_name?.charAt(0).toUpperCase()}
          </div>

          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 24, fontWeight: 700, color: "var(--color-text)", letterSpacing: "0.04em", marginBottom: 6 }}>
            {user.display_name}
          </h1>
          <p style={{ fontSize: 13, color: "var(--color-accent)", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 16 }}>
            @{user.username}
          </p>

          {user.bio && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--color-main))" }} />
                <div style={{ width: 5, height: 5, background: "var(--color-accent)", transform: "rotate(45deg)", flexShrink: 0 }} />
                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--color-main), transparent)" }} />
              </div>
              <p style={{ fontSize: 14, color: "var(--color-text-muted)", lineHeight: 1.7 }}>{user.bio}</p>
            </>
          )}
        </div>

        {/* ── WATCHLIST PUBLIK ── */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div style={{ width: 3, height: 22, background: "var(--color-accent)", borderRadius: 2 }} />
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 700, color: "var(--color-text)", letterSpacing: "0.04em" }}>
              Watchlist Publik
            </h2>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-accent)", background: "color-mix(in srgb, var(--color-accent) 18%, transparent)", borderRadius: 6, padding: "2px 8px", letterSpacing: "0.08em" }}>
              {publicWatchlist.length}
            </span>
          </div>

          {publicWatchlist.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--color-text-muted)", textAlign: "center", padding: "24px 0" }}>
              Tidak ada watchlist publik.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {publicWatchlist.map((item: any) => (
                <div
                  key={item.id}
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid color-mix(in srgb, var(--color-accent) 20%, transparent)",
                    borderRadius: 12,
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text)" }}>{item.film_title}</p>
                  <span style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "capitalize" }}>{item.list_status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}