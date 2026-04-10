"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import toast from "react-hot-toast";

// Skema validasi form ulasan
const reviewSchema = z.object({
  content: z.string().min(10, "Ulasan minimal 10 karakter"),
  rating: z.number().min(1).max(10),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface Props {
  filmId: string;
  onSuccess: () => void;
}

// Form untuk menulis ulasan baru pada sebuah film
export default function ReviewForm({ filmId, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 7 },
  });

  // Kirim ulasan ke API lalu reset form
  const onSubmit = async (data: ReviewFormData) => {
    try {
      await api.post("/reviews", { ...data, film_id: filmId });
      toast.success("Ulasan berhasil dikirim!");
      reset();
      onSuccess();
    } catch {
      toast.error("Gagal mengirim ulasan");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 rounded-xl p-5 mb-4">
      <h3 className="text-white font-semibold mb-4">Tulis Ulasan</h3>

      {/* Input konten ulasan */}
      <textarea
        {...register("content")}
        placeholder="Tulis pendapatmu tentang film ini..."
        rows={4}
        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 resize-none mb-2"
      />
      {errors.content && (
        <p className="text-red-400 text-xs mb-2">{errors.content.message}</p>
      )}

      {/* Input rating */}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-gray-400 text-sm">Rating:</label>
        <input
          {...register("rating", { valueAsNumber: true })}
          type="number"
          min={1}
          max={10}
          className="w-16 bg-gray-700 text-white px-3 py-1 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
        />
        <span className="text-gray-400 text-sm">/10</span>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg transition"
      >
        {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
      </button>
    </form>
  );
}