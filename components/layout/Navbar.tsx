"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useThemeStore, Theme } from "@/stores/themeStore";

export default function Navbar() {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };


  const { theme, setTheme } = useThemeStore();

  const themes: { value: Theme; emoji: string }[] = [
    { value: "purple", emoji: "💜" },
    { value: "dark", emoji: "🖤" },
    { value: "light", emoji: "🤍" },
  ];

return (
    <nav
      style={{
        background: "var(--color-surface)",
        borderBottom: "1px solid color-mix(in srgb, var(--color-accent) 20%, transparent)",
        padding: "0 24px",
        height: 58,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
        fontFamily: "'Nunito', sans-serif",
        backdropFilter: "blur(12px)",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Nunito:wght@400;600;700&display=swap');`}</style>

      {/* Theme switcher */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {themes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            title={t.value}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              padding: "2px 4px",
              borderRadius: 6,
              transition: "transform 0.2s, opacity 0.2s",
              transform: theme === t.value ? "scale(1.3)" : "scale(1)",
              opacity: theme === t.value ? 1 : 0.4,
            }}
          >
            {t.emoji}
          </button>
        ))}
      </div>

      {/* Logo */}
      <Link
        href="/"
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 18,
          fontWeight: 700,
          color: "var(--color-text)",
          textDecoration: "none",
          letterSpacing: "0.04em",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        Film<span style={{ color: "var(--color-accent)" }}>App</span>
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Link href="/films" style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-muted)", textDecoration: "none", letterSpacing: "0.04em", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >Films</Link>
        <Link href="/genres" style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-muted)", textDecoration: "none", letterSpacing: "0.04em", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >Genres</Link>

        {user ? (
          <>
            {user.role === "admin" && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "color-mix(in srgb, var(--color-second) 15%, transparent)",
                border: "1px solid color-mix(in srgb, var(--color-second) 40%, transparent)",
                borderRadius: 8,
                padding: "4px 12px",
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-second)", letterSpacing: "0.1em" }}>ADMIN</span>
                <span style={{ color: "color-mix(in srgb, var(--color-second) 40%, transparent)", fontSize: 12 }}>·</span>
                <Link href="/admin/genres" style={{ fontSize: 12, fontWeight: 700, color: "var(--color-second)", textDecoration: "none" }}>Genre</Link>
                <span style={{ color: "color-mix(in srgb, var(--color-second) 40%, transparent)", fontSize: 12 }}>·</span>
                <Link href="/admin/films" style={{ fontSize: 12, fontWeight: 700, color: "var(--color-second)", textDecoration: "none" }}>Tambah Film</Link>
              </div>
            )}

            <Link href="/profile" style={{ fontSize: 13, fontWeight: 700, color: "var(--color-accent)", textDecoration: "none", letterSpacing: "0.02em" }}>
              {user.display_name}
            </Link>

            <button
              onClick={handleLogout}
              style={{
                background: "color-mix(in srgb, var(--color-second) 20%, transparent)",
                border: "1px solid color-mix(in srgb, var(--color-second) 50%, transparent)",
                color: "var(--color-second)",
                fontSize: 12,
                fontWeight: 700,
                padding: "5px 14px",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                letterSpacing: "0.04em",
                transition: "opacity 0.2s",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-muted)", textDecoration: "none", letterSpacing: "0.04em" }}>Login</Link>
            <Link
              href="/register"
              style={{
                background: "var(--color-accent)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                padding: "6px 16px",
                borderRadius: 8,
                textDecoration: "none",
                letterSpacing: "0.04em",
                transition: "opacity 0.2s",
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}