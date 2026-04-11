import { getFilmColor } from "@/lib/filmColor";

interface Props {
  images: string[] | null;
  title: string;
  className?: string;
}

const BASE_IMAGE_URL = "https://film-management-api.labse.id/api/static/";

// Komponen poster film — tampilkan gambar kalau ada, fallback ke warna kalau tidak ada
export default function FilmPoster({ images, title, className = "" }: Props) {
  const hasImage = images && images.length > 0 && images[0];

  if (hasImage) {
    return (
      <img
        src={`${BASE_IMAGE_URL}${images[0]}`}
        alt={title}
        className={`w-full h-full object-cover ${className}`}
        onError={(e) => {
          // Kalau gambar gagal load, ganti ke fallback warna
          const parent = (e.target as HTMLImageElement).parentElement;
          if (parent) {
            (e.target as HTMLImageElement).style.display = "none";
          }
        }}
      />
    );
  }

  // Fallback — warna gradient acak dengan judul film
if (hasImage) {
    return (
      <img
        src={`${BASE_IMAGE_URL}${images[0]}`}
        alt={title}
        className={`w-full h-full object-cover ${className}`}
        onError={(e) => {
          const parent = (e.target as HTMLImageElement).parentElement;
          if (parent) {
            (e.target as HTMLImageElement).style.display = "none";
          }
        }}
      />
    );
  }

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center gap-2 ${className}`}
      style={{
        background: "linear-gradient(160deg, var(--color-main), color-mix(in srgb, var(--color-accent) 30%, var(--color-main)))",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "55%", alignItems: "center" }}>
        <div style={{ width: "100%", height: 3, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} />
        <div style={{ width: "75%", height: 3, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        <div style={{ width: "88%", height: 3, borderRadius: 2, background: "rgba(255,255,255,0.1)" }} />
      </div>
      <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 10, fontWeight: 700, textAlign: "center", padding: "0 8px", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {title}
      </p>
    </div>
  );
}