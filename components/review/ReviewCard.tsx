"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

interface ReviewCardProps {
  review: {
    id: string;
    user_id: string;
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
    <div
      style={{
        background: "var(--color-surface)",
        borderRadius: 12,
        border: "1px solid color-mix(in srgb, var(--color-accent) 15%, transparent)",
        padding: "18px 20px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Nunito', sans-serif",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "color-mix(in srgb, var(--color-accent) 35%, transparent)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "color-mix(in srgb, var(--color-accent) 15%, transparent)")}
    >
      {/* Corner accent */}
      <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 16px 16px 0", borderColor: `transparent color-mix(in srgb, var(--color-accent) 30%, transparent) transparent transparent` }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <Link
          href={`/users/${review.user_id}`}
          style={{ fontSize: 13, fontWeight: 700, color: "var(--color-accent)", letterSpacing: "0.04em", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          {review.user?.display_name ?? "Anonymous"}
        </Link>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#f4b942",
            background: "color-mix(in srgb, #f4b942 15%, transparent)",
            border: "1px solid color-mix(in srgb, #f4b942 30%, transparent)",
            borderRadius: 999,
            padding: "2px 10px",
          }}
        >
          ★ {review.rating}/10
        </span>
      </div>

      {/* Comment */}
      <p style={{ fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.7, marginBottom: 14, whiteSpace: "pre-wrap" }}>
        {safeComment}
      </p>

      {/* Reactions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={() => handleReaction("like")}
          disabled={loading || !user}
          style={{
            fontSize: 12,
            fontWeight: 700,
            padding: "5px 12px",
            borderRadius: 8,
            border: "1px solid",
            cursor: loading || !user ? "not-allowed" : "pointer",
            opacity: loading || !user ? 0.5 : 1,
            fontFamily: "'Nunito', sans-serif",
            transition: "opacity 0.2s",
            background: myReaction?.status === "like"
              ? "color-mix(in srgb, var(--color-accent) 25%, transparent)"
              : "var(--color-bg)",
            borderColor: myReaction?.status === "like"
              ? "var(--color-accent)"
              : "color-mix(in srgb, var(--color-accent) 20%, transparent)",
            color: myReaction?.status === "like" ? "var(--color-accent)" : "var(--color-text-muted)",
          }}
        >
          👍 {review.likes}
        </button>

        <button
          onClick={() => handleReaction("dislike")}
          disabled={loading || !user}
          style={{
            fontSize: 12,
            fontWeight: 700,
            padding: "5px 12px",
            borderRadius: 8,
            border: "1px solid",
            cursor: loading || !user ? "not-allowed" : "pointer",
            opacity: loading || !user ? 0.5 : 1,
            fontFamily: "'Nunito', sans-serif",
            transition: "opacity 0.2s",
            background: myReaction?.status === "dislike"
              ? "color-mix(in srgb, var(--color-second) 25%, transparent)"
              : "var(--color-bg)",
            borderColor: myReaction?.status === "dislike"
              ? "var(--color-second)"
              : "color-mix(in srgb, var(--color-accent) 20%, transparent)",
            color: myReaction?.status === "dislike" ? "var(--color-second)" : "var(--color-text-muted)",
          }}
        >
          👎 {review.dislikes}
        </button>

        {!user && (
          <span style={{ fontSize: 11, color: "var(--color-text-muted)", opacity: 0.6 }}>Login untuk bereaksi</span>
        )}
      </div>
    </div>
  );
}