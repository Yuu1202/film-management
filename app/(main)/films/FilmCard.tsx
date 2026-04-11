"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import FilmPoster from "@/components/film/FilmPoster";

// Definisikan tipe datanya supaya tidak "error" saat build
interface FilmProps {
  film: {
    id: string | number;
    title: string;
    release_date?: string;
    average_rating?: number;
  };
}

export default function FilmCard({ film }: FilmProps) {
  const [detail, setDetail] = useState<any>(null);

  useEffect(() => {
    // Ambil detail hanya untuk film ini saja
    if (film.id) {
      api.get(`/films/${film.id}`)
        .then((res) => {
          setDetail(res.data.data);
        })
        .catch((err) => {
          console.error("Gagal ambil detail film:", err);
        });
    }
  }, [film.id]);

  return (
    <Link href={`/films/${film.id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "var(--color-surface)",
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid transparent",
          cursor: "pointer",
          transition: "transform 0.22s cubic-bezier(.34,1.56,.64,1), border-color 0.2s",
        }}
        // Tambahkan efek hover manual via CSS class atau biarkan polosan dulu untuk test build
      >
        <div className="w-full" style={{ aspectRatio: "2/3" }}>
          {/* Pastikan path ke FilmPoster sudah benar */}
          <FilmPoster images={detail?.images ?? null} title={film.title} />
        </div>
        <div style={{ padding: "8px 10px 10px" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 3 }}>
            {film.title}
          </p>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
              {film.release_date ? film.release_date.slice(0, 4) : "-"}
            </span>
            {film.average_rating && film.average_rating > 0 && (
              <span style={{ fontSize: 11, color: "#f4b942", fontWeight: 700 }}>
                ★ {film.average_rating}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}