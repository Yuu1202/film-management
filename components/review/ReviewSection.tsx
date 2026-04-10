"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Review } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import ReviewCard from "@/components/review/ReviewCard";
import ReviewForm from "@/components/review/ReviewForm";

interface Props {
  filmId: string;
}

// Section ulasan lengkap: form tambah ulasan + daftar ulasan
export default function ReviewSection({ filmId }: Props) {
  const { user } = useAuthStore();

  // Ambil semua ulasan untuk film ini
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["reviews", filmId],
    queryFn: async () => {
      const res = await api.get(`/reviews`, {
  params: { film_id: filmId }});
      return res.data.data as Review[];
    },
  });

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">Ulasan</h2>

      {/* Form tambah ulasan hanya untuk user yang sudah login */}
      {user && (
        <ReviewForm filmId={filmId} onSuccess={refetch} />
      )}

      {/* Loading state ulasan */}
      {isLoading && (
        <p className="text-gray-400 mt-4">Memuat ulasan...</p>
      )}

      {/* Daftar ulasan */}
      <div className="flex flex-col gap-4 mt-6">
        {data?.map((review) => (
          <ReviewCard key={review.id} review={review} onReactionChange={refetch} />
        ))}
        {data?.length === 0 && (
          <p className="text-gray-500">Belum ada ulasan untuk film ini.</p>
        )}
      </div>
    </div>
  );
}