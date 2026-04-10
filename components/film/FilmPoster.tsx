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
  return (
    <div className={`w-full h-full bg-gradient-to-b ${getFilmColor(title)} flex items-end p-2 ${className}`}>
      <p className="text-white text-xs font-medium leading-tight line-clamp-3">{title}</p>
    </div>
  );
}