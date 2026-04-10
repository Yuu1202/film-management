"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { FilmList } from "@/types";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import toast from "react-hot-toast";

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

  // Ambil daftar watchlist milik user yang sedang login
  const { data: watchlist, isLoading } = useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const res = await api.get("/film-lists");
      return res.data.data as FilmList[];
    },
  });

  // Mutation untuk ubah visibilitas watchlist item
  const toggleVisibility = useMutation({
    mutationFn: async ({ id, visibility }: { id: string; visibility: "public" | "private" }) => {
      await api.patch(`/film-lists/${id}`, { visibility });
    },
    onSuccess: () => {
      toast.success("Visibilitas diperbarui!");
      // Refresh data watchlist setelah update
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
    onError: () => {
      toast.error("Gagal mengubah visibilitas");
    },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Info profil user */}
      <div className="bg-gray-800 rounded-xl p-8 mb-8 text-center">
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
          {user?.display_name?.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">{user?.display_name}</h1>
        <p className="text-gray-400 text-sm mb-2">@{user?.username}</p>
        {user?.bio && (
          <p className="text-gray-300 text-sm">{user.bio}</p>
        )}
      </div>

      {/* Daftar Watchlist */}
      <h2 className="text-xl font-bold text-white mb-4">🎬 Watchlist Saya</h2>

      {isLoading && (
        <p className="text-gray-400">Memuat watchlist...</p>
      )}

      {watchlist?.length === 0 && (
        <p className="text-gray-500">Belum ada film di watchlist.</p>
      )}

      <div className="flex flex-col gap-4">
        {watchlist?.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-xl p-4 flex items-center justify-between"
          >
            {/* Info film */}
            <div className="flex items-center gap-4">
              <img
                src={item.film?.poster_url || "/placeholder.png"}
                alt={item.film?.title}
                className="w-12 h-16 object-cover rounded-lg"
              />
              <div>
                <p className="text-white font-medium">{item.film?.title}</p>
                <p className="text-gray-400 text-xs">{item.film?.release_year}</p>
              </div>
            </div>

            {/* Toggle visibilitas public/private */}
            <button
              onClick={() =>
                toggleVisibility.mutate({
                  id: item.id,
                  visibility: item.visibility === "public" ? "private" : "public",
                })
              }
              className={`text-xs px-3 py-1 rounded-full transition ${
                item.visibility === "public"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600 hover:bg-gray-500"
              } text-white`}
            >
              {item.visibility === "public" ? "🌐 Publik" : "🔒 Privat"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}