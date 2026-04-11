"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

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

  // Simpan visibility state lokal per item watchlist
  const [visibilityMap, setVisibilityMap] = useState<Record<string, string>>({});

  const { data: userData, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const res = await api.get(`/users/${user?.id}`);
      return res.data.data;
    },
    enabled: !!user?.id,
  });

  // Inisialisasi visibility map dengan default "private" karena API tidak return field ini
  useEffect(() => {
    if (!userData?.film_lists) return;
    setVisibilityMap((prev) => {
      const next = { ...prev };
      userData.film_lists.forEach((item: any) => {
        if (!(item.id in next)) {
          next[item.id] = item.visibility ?? "private";
        }
      });
      return next;
    });
  }, [userData]);

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, visibility }: { id: string; visibility: string }) => {
      await api.patch(`/film-lists/${id}`, { visibility });
    },
    onSuccess: (_, variables) => {
      toast.success("Visibilitas diperbarui!");
      // Hanya update state lokal, TIDAK invalidate query
      setVisibilityMap((prev) => ({
        ...prev,
        [variables.id]: variables.visibility,
      }));
    },
    onError: () => toast.error("Gagal mengubah visibilitas"),
  });

  const watchlist = userData?.film_lists ?? [];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-gray-800 rounded-xl p-8 mb-8 text-center">
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
          {user?.display_name?.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">{user?.display_name}</h1>
        <p className="text-gray-400 text-sm mb-2">@{user?.username}</p>
        {user?.bio && <p className="text-gray-300 text-sm">{user.bio}</p>}
      </div>

      <h2 className="text-xl font-bold text-white mb-4">🎬 Watchlist Saya</h2>

      {isLoading && <p className="text-gray-400">Memuat watchlist...</p>}

      {!isLoading && watchlist.length === 0 && (
        <p className="text-gray-500">Belum ada film di watchlist.</p>
      )}

      <div className="flex flex-col gap-4">
        {watchlist.map((item: any) => {
          const currentVisibility = visibilityMap[item.id] ?? "private";
          return (
            <div
              key={item.id}
              className="bg-gray-800 rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-white font-medium">{item.film_title}</p>
                <p className="text-gray-400 text-xs capitalize">{item.list_status}</p>
              </div>

              <button
                onClick={() =>
                  toggleVisibility.mutate({
                    id: item.id,
                    visibility: currentVisibility === "public" ? "private" : "public",
                  })
                }
                disabled={toggleVisibility.isPending}
                className={`text-xs px-3 py-1 rounded-full transition disabled:opacity-50 ${currentVisibility === "public"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-600 hover:bg-gray-500"
                  } text-white`}
              >
                {currentVisibility === "public" ? "🌐 Publik" : "🔒 Privat"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}