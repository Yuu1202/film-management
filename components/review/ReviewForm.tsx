"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import toast from "react-hot-toast";

const reviewSchema = z.object({
  comment: z.string().min(10, "Ulasan minimal 10 karakter"),
  rating: z.number().min(1).max(10),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface Props {
  filmId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ filmId, onSuccess }: Props) {
  const [hover, setHover] = useState(0);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  // Mengawasi nilai rating dari react-hook-form
  const currentRating = watch("rating");

  const onSubmit = async (data: ReviewFormData) => {
    try {
      await api.post("/reviews", {
        film_id: filmId,
        comment: data.comment,
        rating: data.rating,
      });
      toast.success("Ulasan berhasil dikirim!");
      reset();
      setHover(0);
      onSuccess();
    } catch {
      toast.error("Gagal mengirim ulasan");
    }
  };

return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        background: "var(--color-surface)",
        borderRadius: 14,
        border: "1px solid color-mix(in srgb, var(--color-accent) 20%, transparent)",
        padding: "24px 24px 20px",
        marginBottom: 16,
        fontFamily: "'Nunito', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent */}
      <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 2, background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)" }} />

      <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--color-accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
        Tulis Ulasan
      </h3>

      {/* Textarea */}
      <textarea
        {...register("comment")}
        placeholder="Tulis pendapatmu tentang film ini..."
        rows={4}
        style={{
          width: "100%",
          background: "var(--color-bg)",
          color: "var(--color-text)",
          border: "1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)",
          borderRadius: 10,
          padding: "11px 14px",
          fontSize: 14,
          outline: "none",
          fontFamily: "'Nunito', sans-serif",
          resize: "none",
          marginBottom: 6,
          transition: "border-color 0.2s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
        onBlur={(e) => (e.target.style.borderColor = "color-mix(in srgb, var(--color-accent) 30%, transparent)")}
      />
      {errors.comment && (
        <p style={{ color: "var(--color-second)", fontSize: 11, marginBottom: 8 }}>{errors.comment.message}</p>
      )}

      {/* Star Rating */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>
          Rating
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[...Array(10)].map((_, index) => {
            const starValue = index + 1;
            const isActive = starValue <= (hover || currentRating);
            return (
              <button
                key={starValue}
                type="button"
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setValue("rating", starValue, { shouldValidate: true })}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 22,
                  padding: "0 1px",
                  color: isActive ? "#f4b942" : "color-mix(in srgb, var(--color-text-muted) 30%, transparent)",
                  transition: "color 0.15s, transform 0.15s",
                  transform: isActive ? "scale(1.15)" : "scale(1)",
                  lineHeight: 1,
                }}
              >
                ★
              </button>
            );
          })}
          <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 700, color: currentRating ? "#f4b942" : "var(--color-text-muted)" }}>
            {currentRating || 0} / 10
          </span>
        </div>
        {errors.rating && (
          <p style={{ color: "var(--color-second)", fontSize: 11, marginTop: 6 }}>{errors.rating.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          background: isSubmitting ? "var(--color-main)" : "var(--color-accent)",
          color: "#020202",
          border: "none",
          borderRadius: 10,
          padding: "10px 24px",
          fontSize: 13,
          fontWeight: 700,
          cursor: isSubmitting ? "not-allowed" : "pointer",
          opacity: isSubmitting ? 0.6 : 1,
          fontFamily: "'Nunito', sans-serif",
          letterSpacing: "0.06em",
          transition: "opacity 0.2s",
        }}
      >
        {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
      </button>
    </form>
  );
}