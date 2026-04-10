"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { useGenres } from "@/hooks/useGenres";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Skema validasi form tambah film sesuai API
const filmSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  synopsis: z.string().min(10, "Sinopsis minimal 10 karakter"),
  release_date: z.string().min(1, "Tanggal rilis wajib diisi"),
  airing_status: z.enum(["airing", "finished_airing", "not_yet_aired"]),
  total_episodes: z.number().min(1, "Minimal 1 episode"),
  genres: z.array(z.string()).min(1, "Pilih minimal 1 genre"),
});

type FilmForm = z.infer<typeof filmSchema>;

export default function AdminAddFilmPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminAddFilmContent />
    </ProtectedRoute>
  );
}

function AdminAddFilmContent() {
  const router = useRouter();
  const { data: genres } = useGenres();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FilmForm>({
    resolver: zodResolver(filmSchema),
    defaultValues: {
      airing_status: "finished_airing",
      total_episodes: 1,
      genres: [],
    },
  });

// Konversi format datetime-local ke format yang dibutuhkan API
const formatDateTime = (val: string) => {
  if (!val) return "";
  return val.replace("T", " ") + ":00";
};


  // Kirim data film baru ke API menggunakan FormData
const onSubmit = async (data: FilmForm) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("synopsis", data.synopsis);
    formData.append("release_date", formatDateTime(data.release_date));
    formData.append("airing_status", data.airing_status);
    formData.append("total_episodes", String(data.total_episodes));
    formData.append("genres", data.genres.join(","));

    await api.post("/films", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Film berhasil ditambahkan!");
    router.push("/films");
  } catch (err: any) {
    toast.error(err?.response?.data?.error ?? "Gagal menambahkan film");
  }
};

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">🎬 Tambah Film Baru</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-800 rounded-xl p-8 flex flex-col gap-5"
      >
        {/* Input judul */}
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Judul Film</label>
          <input
            {...register("title")}
            placeholder="Judul film..."
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Input sinopsis */}
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Sinopsis</label>
          <textarea
            {...register("synopsis")}
            placeholder="Sinopsis film..."
            rows={4}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 resize-none"
          />
          {errors.synopsis && <p className="text-red-400 text-xs mt-1">{errors.synopsis.message}</p>}
        </div>

        {/* Input tanggal rilis */}
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Tanggal Rilis</label>
          <input
            {...register("release_date")}
            type="datetime-local"
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          {errors.release_date && <p className="text-red-400 text-xs mt-1">{errors.release_date.message}</p>}
        </div>

        {/* Input status tayang */}
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Status Tayang</label>
          <select
            {...register("airing_status")}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option value="finished_airing">Selesai Tayang</option>
            <option value="airing">Sedang Tayang</option>
            <option value="not_yet_aired">Belum Tayang</option>
          </select>
        </div>

        {/* Input total episode */}
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Total Episode</label>
          <input
            {...register("total_episodes", { valueAsNumber: true })}
            type="number"
            min={1}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          {errors.total_episodes && <p className="text-red-400 text-xs mt-1">{errors.total_episodes.message}</p>}
        </div>

        {/* Pilih genre */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Genre</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {genres?.map((genre: any) => (
              <label
                key={genre.id}
                className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-600 transition"
              >
                <input
                  type="checkbox"
                  value={genre.id}
                  {...register("genres")}
                  className="accent-blue-500"
                />
                <span className="text-white text-sm">{genre.name}</span>
              </label>
            ))}
          </div>
          {errors.genres && <p className="text-red-400 text-xs mt-1">{errors.genres.message}</p>}
        </div>

        {/* Tombol submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
        >
          {isSubmitting ? "Menyimpan..." : "Tambah Film"}
        </button>
      </form>
    </div>
  );
}