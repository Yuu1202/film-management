"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Props {
  filmId: string;
}

// Tombol untuk menambahkan film ke daftar tontonan user
export default function FilmListButton({ filmId }: Props) {
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      await api.post("/film-lists", { film_id: filmId });
      toast.success("Film ditambahkan ke watchlist!");
    } catch {
      toast.error("Gagal menambahkan ke watchlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg transition"
    >
      {loading ? "Menambahkan..." : "+ Tambah ke Watchlist"}
    </button>
  );
}