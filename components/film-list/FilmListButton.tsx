"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";

interface Props {
  filmId: string;
}

export default function FilmListButton({ filmId }: Props) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Cek apakah film sudah ada di watchlist dengan fetch profile user
  const { data: userData } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const res = await api.get(`/users/${user?.id}`);
      return res.data.data;
    },
    enabled: !!user?.id,
  });

  // Cek apakah film ini sudah ada di watchlist
  const alreadyAdded = userData?.film_lists?.some(
    (item: any) => item.film_title && item.film_id === filmId
  );

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post("/film-lists", {
        film_id: filmId,
        list_status: "watching",
      });
    },
    onSuccess: () => {
      toast.success("Film ditambahkan ke watchlist!");
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error ?? "Gagal menambahkan ke watchlist");
    },
  });

  if (alreadyAdded) {
    return (
      <button
        disabled
        className="bg-gray-600 opacity-60 text-white px-5 py-2 rounded-lg cursor-not-allowed"
      >
        ✓ Sudah di Watchlist
      </button>
    );
  }

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg transition"
    >
      {mutation.isPending ? "Menambahkan..." : "+ Tambah ke Watchlist"}
    </button>
  );
}