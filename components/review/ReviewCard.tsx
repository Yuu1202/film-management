"use client";

import { useState } from "react";
import { Review } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Props {
  review: Review;
  onReactionChange: () => void;
}

// Kartu ulasan tunggal dengan tombol reaksi like/dislike
export default function ReviewCard({ review, onReactionChange }: Props) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Cek apakah user sudah pernah bereaksi pada ulasan ini
  const existingReaction = review.reactions?.find(
    (r) => r.user_id === user?.id
  );

  // Kalau sudah ada reaksi → update, kalau belum → buat baru
  const handleReaction = async (status: "like" | "dislike") => {
    if (!user) return;
    setLoading(true);
    try {
      if (existingReaction) {
        // Update reaksi yang sudah ada
        await api.put(`/reactions/${existingReaction.id}`, { status });
        toast.success("Reaksi diperbarui!");
      } else {
        // Buat reaksi baru
        await api.post("/reactions", { review_id: review.id, status });
        toast.success(`Reaksi ${status} diberikan!`);
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
          {review.user?.display_name || "Anonymous"}
        </span>
        <span className="text-yellow-400 text-sm">⭐ {review.rating}/10</span>
      </div>

      {/* Isi ulasan */}
      <p className="text-gray-300 text-sm leading-relaxed mb-4">{review.content}</p>

      {/* Tombol reaksi hanya tampil kalau sudah login */}
      {user && (
        <div className="flex gap-3">
          <button
            onClick={() => handleReaction("like")}
            disabled={loading}
            className={`text-sm px-3 py-1 rounded-lg transition disabled:opacity-50 ${
              existingReaction?.status === "like"
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
              existingReaction?.status === "dislike"
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