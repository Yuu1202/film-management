import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Genre } from "@/types";

// Ambil semua genre untuk halaman publik
export const useGenres = () => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const res = await api.get<{ data: Genre[] }>("/genres");
      return res.data.data;
    },
  });
};

// Ambil daftar genre versi admin dengan pagination
export const useGenresAdmin = (page: number = 1) => {
  return useQuery({
    queryKey: ["genres-admin", page],
    queryFn: async () => {
      const res = await api.get("/genres/admin", {
        params: { page, limit: 10 },
      });
      return res.data;
    },
  });
};