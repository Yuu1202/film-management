"use client";

import { useState } from "react";
import { useGenresAdmin } from "@/hooks/useGenres";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import toast from "react-hot-toast";
import { Genre } from "@/types";

// Skema validasi form genre
const genreSchema = z.object({
  name: z.string().min(2, "Nama genre minimal 2 karakter"),
});

type GenreForm = z.infer<typeof genreSchema>;

export default function AdminGenresPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminGenresContent />
    </ProtectedRoute>
  );
}

function AdminGenresContent() {
  const [page, setPage] = useState(1);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useGenresAdmin(page);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GenreForm>({
    resolver: zodResolver(genreSchema),
  });

  // Tambah genre baru
  const createGenre = useMutation({
    mutationFn: (data: GenreForm) => api.post("/genres", data),
    onSuccess: () => {
      toast.success("Genre berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: ["genres-admin"] });
      reset();
    },
    onError: () => toast.error("Gagal menambahkan genre"),
  });

  // Update genre yang sudah ada
  const updateGenre = useMutation({
    mutationFn: ({ id, data }: { id: string; data: GenreForm }) =>
      api.put(`/genres/${id}`, data),
    onSuccess: () => {
      toast.success("Genre berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["genres-admin"] });
      setEditingGenre(null);
      reset();
    },
    onError: () => toast.error("Gagal memperbarui genre"),
  });

  // Handle submit form — bisa create atau update tergantung state
  const onSubmit = (data: GenreForm) => {
    if (editingGenre) {
      updateGenre.mutate({ id: editingGenre.id, data });
    } else {
      createGenre.mutate(data);
    }
  };

  // Set form ke mode edit dengan data genre yang dipilih
  const handleEdit = (genre: Genre) => {
    setEditingGenre(genre);
    setValue("name", genre.name);
  };

  // Reset form ke mode tambah baru
  const handleCancelEdit = () => {
    setEditingGenre(null);
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">⚙️ Manajemen Genre</h1>

      {/* Form tambah / edit genre */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-white font-semibold mb-4">
          {editingGenre ? `Edit Genre: ${editingGenre.name}` : "Tambah Genre Baru"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
          <div className="flex-1">
            <input
              {...register("name")}
              placeholder="Nama genre..."
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg transition"
          >
            {editingGenre ? "Update" : "Tambah"}
          </button>
          {/* Tombol cancel edit */}
          {editingGenre && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
            >
              Batal
            </button>
          )}
        </form>
      </div>

      {/* Tabel genre */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="text-left px-6 py-3">Nama Genre</th>
              <th className="text-left px-6 py-3">ID</th>
              <th className="text-right px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="text-center text-gray-400 py-8">
                  Memuat data...
                </td>
              </tr>
            ) : (
              data?.data?.map((genre: Genre) => (
                <tr key={genre.id} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="px-6 py-4 text-white">{genre.name}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs font-mono">{genre.id}</td>
                  <td className="px-6 py-4 text-right">
                    {/* Tombol edit genre */}
                    <button
                      onClick={() => handleEdit(genre)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1 rounded-lg transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination tabel */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
          <span className="text-gray-400 text-sm">Halaman {page}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white text-sm px-3 py-1 rounded-lg transition"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={data?.data?.length < 10}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white text-sm px-3 py-1 rounded-lg transition"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}