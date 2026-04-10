"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface ReviewCardProps {
  review: {
    id: string;
    comment: string;
    rating: number;
    user?: { display_name: string };
    user_reaction?: { id: string; status: string } | null;
  };
  onReactionChange: () => void;
}

// Kartu ulasan tunggal dengan tombol reaksi like/dislike
export default function ReviewCard({ review, onReactionChange }: ReviewCardProps) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Kalau sudah ada reaksi → update, kalau belum → buat baru
  const handleReaction = async (status: "like" | "dislike") => {
    if (!user) return;
    setLoading(true);
    try {
      if (review.user_reaction) {
        await api.put(`/reactions/${review.user_reaction.id}`, { status });
        toast.success("Reaksi diperbarui!");
      } else {
        await api.post("/reactions", { review_id: review.id, status });
        toast.success("Reaksi diberikan!");
      }
      onReactionChange();
    } catch {
      toast.error("Gagal memberikan reaksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-5">
      {/* Info user dan rating */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-blue-400 font-medium text-sm">
          {review.user?.display_name ?? "Anonymous"}
        </span>
        <span className="text-yellow-400 text-sm">⭐ {review.rating}/10</span>
      </div>

      {/* Isi ulasan */}
      <p className="text-gray-300 text-sm leading-relaxed mb-4">{review.comment}</p>

      {/* Tombol reaksi hanya untuk user yang sudah login */}
      {user && (
        <div className="flex gap-3">
          <button
            onClick={() => handleReaction("like")}
            disabled={loading}
            className={`text-sm px-3 py-1 rounded-lg transition disabled:opacity-50 ${
              review.user_reaction?.status === "like"
                ? "bg-green-600"
                : "bg-gray-700 hover:bg-green-700"
            }`}
          >
            👍 Like
          </button>
          <button
            onClick={() => handleReaction("dislike")}
            disabled={loading}
            className={`text-sm px-3 py-1 rounded-lg transition disabled:opacity-50 ${
              review.user_reaction?.status === "dislike"
                ? "bg-red-600"
                : "bg-gray-700 hover:bg-red-700"
            }`}
          >
            👎 Dislike
          </button>
        </div>
      )}
    </div>
  );
}