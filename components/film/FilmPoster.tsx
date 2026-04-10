import { getFilmColor } from "@/lib/filmColor";

interface Props {
  images: string[] | null;
  title: string;
  className?: string;
}

// Komponen poster film — tampilkan gambar kalau ada, fallback ke warna kalau tidak ada
export default function FilmPoster({ images, title, className = "" }: Props) {
  const hasImage = images && images.length > 0 && images[0];

  if (hasImage) {
    return (
      <img
        src={images[0]}
        alt={title}
        className={`w-full h-full object-cover ${className}`}
        onError={(e) => {
          // Kalau gambar gagal load, sembunyikan dan tampilkan fallback
          (e.target as HTMLImageElement).style.display = "none";
          (e.target as HTMLImageElement).parentElement!.classList.add("show-fallback");
        }}
      />
    );
  }

  // Fallback — warna gradient berdasarkan judul film
  return (
    <div className={`w-full h-full bg-gradient-to-b ${getFilmColor(title)} flex items-end p-2 ${className}`}>
      <p className="text-white text-xs font-medium leading-tight line-clamp-3">{title}</p>
    </div>
  );
}