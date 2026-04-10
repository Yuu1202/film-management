"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { User } from "@/types";

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();

  // Ambil data profil publik user berdasarkan ID
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await api.get<{ data: User }>(`/users/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  if (isLoading) return (
    <div className="text-gray-400 text-center py-20">Memuat profil...</div>
  );

  if (isError || !user) return (
    <div className="text-red-400 text-center py-20">Profil tidak ditemukan.</div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="bg-gray-800 rounded-xl p-8 text-center">
        {/* Avatar placeholder */}
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
          {user.display_name?.charAt(0).toUpperCase()}
        </div>

        {/* Info user */}
        <h1 className="text-2xl font-bold text-white mb-1">{user.display_name}</h1>
        <p className="text-gray-400 text-sm mb-4">@{user.username}</p>
        {user.bio && (
          <p className="text-gray-300 text-sm leading-relaxed">{user.bio}</p>
        )}
      </div>
    </div>
  );
}