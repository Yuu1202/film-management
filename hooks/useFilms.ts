import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

// Ambil daftar film dengan pagination dan search
export const useFilms = (page: number = 1, search: string = "") => {
  return useQuery({
    queryKey: ["films", page, search],
    queryFn: async () => {
      const params: Record<string, any> = {
        page,
        take: 12,
      };
      // Tambah filter hanya kalau search tidak kosong
      if (search) {
        params.filter_by = "title";
        params.filter = search;
      }
      const res = await api.get("/films", { params });
      return res.data;
    },
  });
};

// Ambil detail satu film berdasarkan ID
export const useFilm = (id: string) => {
  return useQuery({
    queryKey: ["film", id],
    queryFn: async () => {
      const res = await api.get(`/films/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};