"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { useGenres } from "@/hooks/useGenres";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// 1. Tambahkan images ke skema validasi
const filmSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  synopsis: z.string().min(10, "Sinopsis minimal 10 karakter"),
  release_date: z.string().min(1, "Tanggal rilis wajib diisi"),
  airing_status: z.enum(["airing", "finished_airing", "not_yet_aired"]),
  total_episodes: z.number().min(1, "Minimal 1 episode"),
  genres: z.array(z.string()).min(1, "Pilih minimal 1 genre"),
  // Validasi untuk file (opsional: bisa dicek ukurannya atau tipenya)
  images: z.any().optional(),
});

type FilmForm = z.infer<typeof filmSchema>;

export default function AdminAddFilmPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminAddFilmContent />
    </ProtectedRoute>
  );
}

function AdminAddFilmContent() {
  const router = useRouter();
  const { data: genres } = useGenres();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FilmForm>({
    resolver: zodResolver(filmSchema),
    defaultValues: {
      airing_status: "finished_airing",
      total_episodes: 1,
      genres: [],
    },
  });

  const formatDateTime = (val: string) => {
    if (!val) return "";
    return val.replace("T", " ") + ":00";
  };

  const onSubmit = async (data: FilmForm) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("synopsis", data.synopsis);
      formData.append("release_date", formatDateTime(data.release_date));
      formData.append("airing_status", data.airing_status);
      formData.append("total_episodes", String(data.total_episodes));
      formData.append("genres", data.genres.join(","));

      // 2. Logika untuk memasukkan gambar ke FormData
      if (data.images && data.images.length > 0) {
        // Karena API mendukung multiple images (berdasarkan Postman), kita loop filenya
        for (let i = 0; i < data.images.length; i++) {
          formData.append("images", data.images[i]);
        }
      }

      await api.post("/films", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      toast.success("Film berhasil ditambahkan!");
      router.push("/films");
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? "Gagal menambahkan film");
    }
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
        .genre-check:hover { border-color: color-mix(in srgb, var(--color-accent) 60%, transparent) !important; }
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

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">

        {/* ── HEADER ── */}
        <div className="flex items-center gap-3 mb-2">
          <div style={{ width: 3, height: 28, background: "var(--color-accent)", borderRadius: 2 }} />
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 24, fontWeight: 700, color: "var(--color-text)", letterSpacing: "0.04em" }}>
            Tambah Film Baru
          </h1>
        </div>
        <div className="flex items-center gap-3 mb-8">
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--color-main))" }} />
          <div style={{ width: 5, height: 5, background: "var(--color-accent)", transform: "rotate(45deg)", flexShrink: 0 }} />
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--color-main), transparent)" }} />
        </div>

        {/* ── FORM CARD ── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 relative overflow-hidden"
          style={{
            background: "var(--color-surface)",
            borderRadius: 16,
            border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)",
            padding: "36px 32px",
          }}
        >
          {/* Top accent */}
          <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 2, background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)" }} />

          {/* helper style */}
          {(() => {
            const labelStyle: React.CSSProperties = { fontSize: 11, color: "var(--color-text-muted)", display: "block", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 };
            const inputStyle: React.CSSProperties = { width: "100%", background: "var(--color-bg)", color: "var(--color-text)", border: "1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)", borderRadius: 10, padding: "11px 14px", fontSize: 14, outline: "none", fontFamily: "'Nunito', sans-serif", transition: "border-color 0.2s" };
            const errStyle: React.CSSProperties = { color: "var(--color-second)", fontSize: 11, marginTop: 4 };

            return (
              <>
                {/* Judul */}
                <div>
                  <label style={labelStyle}>Judul Film</label>
                  <input {...register("title")} placeholder="Judul film..." className="field-input" style={inputStyle} />
                  {errors.title && <p style={errStyle}>{errors.title.message}</p>}
                </div>

                {/* Poster */}
                <div>
                  <label style={labelStyle}>Poster Film <span style={{ opacity: 0.5, textTransform: "none", letterSpacing: 0 }}>(PNG/JPG)</span></label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    {...register("images")}
                    style={{ ...inputStyle, padding: "8px 14px", cursor: "pointer" }}
                    className="field-input"
                  />
                  <p style={{ fontSize: 10, color: "var(--color-text-muted)", marginTop: 4, opacity: 0.7 }}>*Bisa pilih lebih dari satu gambar</p>
                </div>

                {/* Sinopsis */}
                <div>
                  <label style={labelStyle}>Sinopsis</label>
                  <textarea
                    {...register("synopsis")}
                    placeholder="Sinopsis film..."
                    rows={4}
                    className="field-input"
                    style={{ ...inputStyle, resize: "none" }}
                  />
                  {errors.synopsis && <p style={errStyle}>{errors.synopsis.message}</p>}
                </div>

                {/* Tanggal Rilis */}
                <div>
                  <label style={labelStyle}>Tanggal Rilis</label>
                  <input {...register("release_date")} type="datetime-local" className="field-input" style={inputStyle} />
                  {errors.release_date && <p style={errStyle}>{errors.release_date.message}</p>}
                </div>

                {/* Status Tayang */}
                <div>
                  <label style={labelStyle}>Status Tayang</label>
                  <select {...register("airing_status")} className="field-input" style={inputStyle}>
                    <option value="finished_airing">Selesai Tayang</option>
                    <option value="airing">Sedang Tayang</option>
                    <option value="not_yet_aired">Belum Tayang</option>
                  </select>
                </div>

                {/* Total Episode */}
                <div>
                  <label style={labelStyle}>Total Episode</label>
                  <input {...register("total_episodes", { valueAsNumber: true })} type="number" min={1} className="field-input" style={inputStyle} />
                  {errors.total_episodes && <p style={errStyle}>{errors.total_episodes.message}</p>}
                </div>

                {/* Genre */}
                <div>
                  <label style={labelStyle}>Genre</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {genres?.map((genre: any) => (
                      <label
                        key={genre.id}
                        className="genre-check flex items-center gap-2 cursor-pointer"
                        style={{
                          background: "var(--color-bg)",
                          border: "1px solid color-mix(in srgb, var(--color-accent) 20%, transparent)",
                          borderRadius: 10,
                          padding: "9px 12px",
                          transition: "border-color 0.2s",
                        }}
                      >
                        <input
                          type="checkbox"
                          value={genre.id}
                          {...register("genres")}
                          style={{ accentColor: "var(--color-accent)", width: 14, height: 14 }}
                        />
                        <span style={{ fontSize: 13, color: "var(--color-text)", fontWeight: 600 }}>{genre.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.genres && <p style={errStyle}>{errors.genres.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: isSubmitting ? "var(--color-main)" : "var(--color-accent)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "13px 0",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.6 : 1,
                    fontFamily: "'Nunito', sans-serif",
                    letterSpacing: "0.06em",
                    transition: "opacity 0.2s",
                    marginTop: 4,
                  }}
                >
                  {isSubmitting ? "Menyimpan..." : "Tambah Film"}
                </button>
              </>
            );
          })()}
        </form>
      </div>
    </div>
  );
}