import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Film, PaginatedResponse } from "@/types";

// Ambil daftar film dengan pagination dan search
export const useFilms = (page: number = 1, search: string = "") => {
  return useQuery({
    queryKey: ["films", page, search],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Film>>("/films", {
        params: { page, limit: 12, search },
      });
      return res.data;
    },
  });
};

// Ambil detail satu film berdasarkan ID
export const useFilm = (id: string) => {
  return useQuery({
    queryKey: ["film", id],
    queryFn: async () => {
      const res = await api.get<{ data: Film }>(`/films/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};