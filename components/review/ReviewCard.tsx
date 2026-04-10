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
    likes: number;
    dislikes: number;
    user?: { display_name: string; username: string } | null;
    user_reaction?: { id: string; status: string } | null;
    reactions?: { id: string; user_id: string; status: string }[];
  };
  onReactionChange: () => void;
}

export default function ReviewCard({ review, onReactionChange }: ReviewCardProps) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // Cari reaksi milik user yang sedang login dari array reactions
  const myReaction = review.reactions?.find((r) => r.user_id === user?.id);

  const handleReaction = async (status: "like" | "dislike") => {
    if (!user) return;
    setLoading(true);
    try {
      if (myReaction) {
        await api.put(`/reactions/${myReaction.id}`, { status });
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

  // Sanitasi comment — tampilkan sebagai teks biasa, bukan HTML
  const safeComment = review.comment
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]*>/g, "");

  return (
    <div className="bg-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-2">
        {/* Tampilkan nama user dari field user.display_name */}
        <span className="text-blue-400 font-medium text-sm">
          {review.user?.display_name ?? "Anonymous"}
        </span>
        <span className="text-yellow-400 text-sm">⭐ {review.rating}/10</span>
      </div>

      {/* Render sebagai teks biasa untuk cegah XSS */}
      <p className="text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
        {safeComment}
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => handleReaction("like")}
          disabled={loading || !user}
          className={`text-sm px-3 py-1 rounded-lg transition disabled:opacity-50 flex items-center gap-1 ${
            myReaction?.status === "like"
              ? "bg-green-600"
              : "bg-gray-700 hover:bg-green-700"
          }`}
        >
          👍 {review.likes}
        </button>
        <button
          onClick={() => handleReaction("dislike")}
          disabled={loading || !user}
          className={`text-sm px-3 py-1 rounded-lg transition disabled:opacity-50 flex items-center gap-1 ${
            myReaction?.status === "dislike"
              ? "bg-red-600"
              : "bg-gray-700 hover:bg-red-700"
          }`}
        >
          👎 {review.dislikes}
        </button>
        {!user && (
          <span className="text-gray-500 text-xs self-center">Login untuk bereaksi</span>
        )}
      </div>
    </div>
  );
}