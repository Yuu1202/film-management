"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { useGenres } from "@/hooks/useGenres";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Skema validasi form tambah film
const filmSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  release_year: z.number().min(1900).max(new Date().getFullYear()),
  poster_url: z.string().url("URL poster tidak valid").optional().or(z.literal("")),
  genre_ids: z.array(z.string()).min(1, "Pilih minimal 1 genre"),
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
    defaultValues: { genre_ids: [] },
  });

  // Kirim data film baru ke API
 const onSubmit = async (data: FilmForm) => {
  try {
    console.log("Sending:", data); // debug dulu
    await api.post("/films", data);
    toast.success("Film berhasil ditambahkan!");
    router.push("/films");
  } catch (err: any) {
    console.error("Error:", err.response?.data);
    toast.error("Gagal menambahkan film");
  }
};;

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
          {errors.title && (
            <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Input deskripsi */}
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Deskripsi</label>
          <textarea
            {...register("description")}
            placeholder="Sinopsis film..."
            rows={4}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 resize-none"
          />
          {errors.description && (
            <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Input tahun rilis */}
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Tahun Rilis</label>
          <input
            {...register("release_year", { valueAsNumber: true })}
            type="number"
            placeholder="2024"
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          {errors.release_year && (
            <p className="text-red-400 text-xs mt-1">{errors.release_year.message}</p>
          )}
        </div>

        {/* Input URL poster */}
        <div>
          <label className="text-sm text-gray-400 mb-1 block">
            URL Poster <span className="text-gray-600">(opsional)</span>
          </label>
          <input
            {...register("poster_url")}
            placeholder="https://..."
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          {errors.poster_url && (
            <p className="text-red-400 text-xs mt-1">{errors.poster_url.message}</p>
          )}
        </div>

        {/* Pilih genre — multi select dengan checkbox */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Genre</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {genres?.map((genre) => (
              <label
                key={genre.id}
                className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-600 transition"
              >
                <input
                  type="checkbox"
                  value={genre.id}
                  {...register("genre_ids")}
                  className="accent-blue-500"
                />
                <span className="text-white text-sm">{genre.name}</span>
              </label>
            ))}
          </div>
          {errors.genre_ids && (
            <p className="text-red-400 text-xs mt-1">{errors.genre_ids.message}</p>
          )}
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