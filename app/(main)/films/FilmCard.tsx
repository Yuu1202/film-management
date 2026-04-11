// components/film/FilmCard.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import FilmPoster from "@/components/film/FilmPoster";

export default function FilmCard({ film }: { film: any }) {
  const [detail, setDetail] = useState<any>(null);

  useEffect(() => {
    // Only fetch if we don't have the detail yet
    api.get(`/films/${film.id}`).then((res) => {
      setDetail(res.data.data);
    });
  }, [film.id]);

  return (
    <Link href={`/films/${film.id}`} style={{ textDecoration: "none" }}>
      <div className="film-card-style"> 
        <div className="w-full" style={{ aspectRatio: "2/3" }}>
          <FilmPoster images={detail?.images ?? null} title={film.title} />
        </div>
        <div style={{ padding: "8px 10px 10px" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text)" }}>
            {film.title}
          </p>
          <span style={{ fontSize: 11 }}>{film.release_date?.slice(0, 4)}</span>
        </div>
      </div>
    </Link>
  );
}