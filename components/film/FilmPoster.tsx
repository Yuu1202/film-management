"use client";

interface Props {
  images: string[] | null;
  title: string;
  className?: string;
}

const BASE_IMAGE_URL = "https://film-management-api.labse.id/api/static/";

/**
 * Komponen poster film — menampilkan gambar jika tersedia, 
 * fallback ke desain gradient statis jika tidak ada atau gagal load.
 */
export default function FilmPoster({ images, title, className = "" }: Props) {
  const hasImage = images && images.length > 0 && images[0];

  if (hasImage) {
    return (
      <img
        src={`${BASE_IMAGE_URL}${images[0]}`}
        alt={title}
        className={`w-full h-full object-cover ${className}`}
        onError={(e) => {
          // Jika gambar gagal load di sisi klien, sembunyikan elemen img
          // agar fallback di belakangnya (jika ada) atau state UI berubah.
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          
          // Menambahkan background ke parent sebagai fail-safe
          if (target.parentElement) {
            target.parentElement.style.background = "var(--color-surface)";
          }
        }}
      />
    );
  }

  // Fallback UI — Menggunakan gradient dari CSS variables sebagai pengganti getFilmColor
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center gap-2 ${className}`}
      style={{
        background: "linear-gradient(160deg, var(--color-surface), var(--color-main))",
        border: "1px solid color-mix(in srgb, var(--color-accent) 10%, transparent)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Dekorasi Abstrak Pengganti Poster */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "55%", alignItems: "center" }}>
        <div style={{ width: "100%", height: 3, borderRadius: 2, background: "rgba(255,255,255,0.1)" }} />
        <div style={{ width: "75%", height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)" }} />
        <div style={{ width: "88%", height: 3, borderRadius: 2, background: "rgba(255,255,255,0.05)" }} />
      </div>

      <p 
        style={{ 
          color: "var(--color-text-muted)", 
          fontSize: 10, 
          fontWeight: 700, 
          textAlign: "center", 
          padding: "0 12px", 
          lineHeight: 1.4, 
          display: "-webkit-box", 
          WebkitLineClamp: 3, 
          WebkitBoxOrient: "vertical", 
          overflow: "hidden",
          textTransform: "uppercase",
          letterSpacing: "0.02em"
        }}
      >
        {title}
      </p>
    </div>
  );
}