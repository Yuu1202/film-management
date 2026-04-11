"use client";

import { useState } from "react";
import { useGenresAdmin } from "@/hooks/useGenres";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import toast from "react-hot-toast";
import { Genre } from "@/types";

// Skema validasi form genre
const genreSchema = z.object({
  name: z.string().min(2, "Nama genre minimal 2 karakter"),
});

type GenreForm = z.infer<typeof genreSchema>;

export default function AdminGenresPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminGenresContent />
    </ProtectedRoute>
  );
}

function AdminGenresContent() {
  const [page, setPage] = useState(1);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useGenresAdmin(page);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GenreForm>({
    resolver: zodResolver(genreSchema),
  });

  // Tambah genre baru
  const createGenre = useMutation({
    mutationFn: (data: GenreForm) => api.post("/genres", data),
    onSuccess: () => {
      toast.success("Genre berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: ["genres-admin"] });
      reset();
    },
    onError: () => toast.error("Gagal menambahkan genre"),
  });

  // Update genre yang sudah ada
  const updateGenre = useMutation({
    mutationFn: ({ id, data }: { id: string; data: GenreForm }) =>
      api.put(`/genres/${id}`, data),
    onSuccess: () => {
      toast.success("Genre berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["genres-admin"] });
      setEditingGenre(null);
      reset();
    },
    onError: () => toast.error("Gagal memperbarui genre"),
  });

  // Handle submit form — bisa create atau update tergantung state
  const onSubmit = (data: GenreForm) => {
    if (editingGenre) {
      updateGenre.mutate({ id: editingGenre.id, data });
    } else {
      createGenre.mutate(data);
    }
  };

  // Set form ke mode edit dengan data genre yang dipilih
  const handleEdit = (genre: Genre) => {
    setEditingGenre(genre);
    setValue("name", genre.name);
  };

  // Reset form ke mode tambah baru
  const handleCancelEdit = () => {
    setEditingGenre(null);
    reset();
  };

return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "var(--color-bg)", fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Nunito:wght@400;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .field-input:focus { border-color: var(--color-accent) !important; }
        .genre-row:hover { background: color-mix(in srgb, var(--color-accent) 6%, transparent) !important; }
      `}</style>

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 400, height: 400, top: -100, right: -80, background: "var(--color-accent)", filter: "blur(90px)", opacity: 0.09 }} />
        <div className="absolute rounded-full" style={{ width: 300, height: 300, bottom: -80, left: -100, background: "var(--color-second)", filter: "blur(80px)", opacity: 0.09 }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)", opacity: 0.4 }} />
        <div style={{ position: "absolute", top: 24, right: 24, display: "grid", gridTemplateColumns: "repeat(5, 8px)", gap: 6, opacity: 0.1 }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} style={{ width: 4, height: 4, background: "var(--color-accent)", transform: "rotate(45deg)" }} />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">

        {/* ── HEADER ── */}
        <div className="flex items-center gap-3 mb-2">
          <div style={{ width: 3, height: 28, background: "var(--color-accent)", borderRadius: 2 }} />
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 24, fontWeight: 700, color: "var(--color-text)", letterSpacing: "0.04em" }}>
            Manajemen Genre
          </h1>
        </div>
        <div className="flex items-center gap-3 mb-8">
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--color-main))" }} />
          <div style={{ width: 5, height: 5, background: "var(--color-accent)", transform: "rotate(45deg)", flexShrink: 0 }} />
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--color-main), transparent)" }} />
        </div>

        {/* ── FORM CARD ── */}
        <div
          className="relative overflow-hidden mb-8"
          style={{
            background: "var(--color-surface)",
            borderRadius: 14,
            border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)",
            padding: "28px 28px 24px",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 2, background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)" }} />

          <h2 style={{ fontSize: 13, fontWeight: 700, color: "var(--color-accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
            {editingGenre ? `Edit Genre: ${editingGenre.name}` : "Tambah Genre Baru"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
            <div style={{ flex: 1 }}>
              <input
                {...register("name")}
                placeholder="Nama genre..."
                className="field-input"
                style={{
                  width: "100%",
                  background: "var(--color-bg)",
                  color: "var(--color-text)",
                  border: "1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: 14,
                  outline: "none",
                  fontFamily: "'Nunito', sans-serif",
                  transition: "border-color 0.2s",
                }}
              />
              {errors.name && <p style={{ color: "var(--color-second)", fontSize: 11, marginTop: 4 }}>{errors.name.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: "var(--color-accent)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "0 22px",
                fontSize: 13,
                fontWeight: 700,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.6 : 1,
                fontFamily: "'Nunito', sans-serif",
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
                transition: "opacity 0.2s",
              }}
            >
              {editingGenre ? "Update" : "Tambah"}
            </button>

            {editingGenre && (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  background: "var(--color-surface)",
                  color: "var(--color-text-muted)",
                  border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)",
                  borderRadius: 10,
                  padding: "0 18px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                Batal
              </button>
            )}
          </form>
        </div>

        {/* ── TABLE CARD ── */}
        <div
          className="relative overflow-hidden"
          style={{
            background: "var(--color-surface)",
            borderRadius: 14,
            border: "1px solid color-mix(in srgb, var(--color-accent) 20%, transparent)",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 2, background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)" }} />

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "color-mix(in srgb, var(--color-main) 60%, transparent)" }}>
                <th style={{ textAlign: "left", padding: "12px 24px", color: "var(--color-text-muted)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 11 }}>Nama Genre</th>
                <th style={{ textAlign: "left", padding: "12px 24px", color: "var(--color-text-muted)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 11 }}>ID</th>
                <th style={{ textAlign: "right", padding: "12px 24px", color: "var(--color-text-muted)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 11 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: "32px 0" }}>
                    <div className="flex items-center justify-center gap-2" style={{ color: "var(--color-text-muted)", fontSize: 13 }}>
                      {[0, 1, 2].map((i) => (
                        <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-accent)", display: "inline-block", animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
                      ))}
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : (
                data?.data?.map((genre: Genre) => (
                  <tr
                    key={genre.id}
                    className="genre-row"
                    style={{ borderTop: "1px solid color-mix(in srgb, var(--color-accent) 10%, transparent)", transition: "background 0.15s" }}
                  >
                    <td style={{ padding: "14px 24px", color: "var(--color-text)", fontWeight: 600 }}>{genre.name}</td>
                    <td style={{ padding: "14px 24px", color: "var(--color-text-muted)", fontSize: 11, fontFamily: "monospace" }}>{genre.id}</td>
                    <td style={{ padding: "14px 24px", textAlign: "right" }}>
                      <button
                        onClick={() => handleEdit(genre)}
                        style={{
                          background: "color-mix(in srgb, var(--color-second) 20%, transparent)",
                          border: "1px solid color-mix(in srgb, var(--color-second) 50%, transparent)",
                          color: "var(--color-second)",
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "4px 14px",
                          borderRadius: 8,
                          cursor: "pointer",
                          fontFamily: "'Nunito', sans-serif",
                          letterSpacing: "0.04em",
                          transition: "opacity 0.2s",
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderTop: "1px solid color-mix(in srgb, var(--color-accent) 12%, transparent)" }}
          >
            <div className="flex items-center gap-2">
              <div style={{ width: 4, height: 4, background: "var(--color-accent)", transform: "rotate(45deg)" }} />
              <span style={{ fontSize: 12, color: "var(--color-text-muted)", fontWeight: 600 }}>Halaman {page}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)",
                  color: "var(--color-text)",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "6px 14px",
                  borderRadius: 8,
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  opacity: page === 1 ? 0.4 : 1,
                  fontFamily: "'Nunito', sans-serif",
                  transition: "opacity 0.2s",
                }}
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={data?.data?.length < 10}
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)",
                  color: "var(--color-text)",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "6px 14px",
                  borderRadius: 8,
                  cursor: data?.data?.length < 10 ? "not-allowed" : "pointer",
                  opacity: data?.data?.length < 10 ? 0.4 : 1,
                  fontFamily: "'Nunito', sans-serif",
                  transition: "opacity 0.2s",
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}