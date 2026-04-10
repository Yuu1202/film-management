"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import ReviewCard from "@/components/review/ReviewCard";
import ReviewForm from "@/components/review/ReviewForm";

interface Props {
  filmId: string;
}

// Section ulasan lengkap: form tambah ulasan + daftar ulasan
export default function ReviewSection({ filmId }: Props) {
  const { user } = useAuthStore();

  // Ulasan ada di dalam response detail film
  const { data: film, isLoading, refetch } = useQuery({
    queryKey: ["film-reviews", filmId],
    queryFn: async () => {
      const res = await api.get(`/films/${filmId}`);
      return res.data.data;
    },
  });

  const reviews = film?.reviews ?? [];

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">Ulasan</h2>

      {/* Form tambah ulasan hanya untuk user yang sudah login */}
      {user && <ReviewForm filmId={filmId} onSuccess={refetch} />}

      {/* Loading state ulasan */}
      {isLoading && <p className="text-gray-400 mt-4">Memuat ulasan...</p>}

      {/* Daftar ulasan */}
      <div className="flex flex-col gap-4 mt-6">
        {reviews.map((review: any) => (
          <ReviewCard key={review.id} review={review} onReactionChange={refetch} />
        ))}
        {!isLoading && reviews.length === 0 && (
          <p className="text-gray-500">Belum ada ulasan untuk film ini.</p>
        )}
      </div>
    </div>
  );
}