import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

// Ambil semua genre untuk halaman publik
export const useGenres = () => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const res = await api.get("/genres");
      return res.data.data;
    },
  });
};

// Ambil daftar genre versi admin — pakai param take bukan limit
export const useGenresAdmin = (page: number = 1) => {
  return useQuery({
    queryKey: ["genres-admin", page],
    queryFn: async () => {
      const res = await api.get("/genres/admin", {
        params: { take: 10, page },
      });
      return res.data;
    },
  });
};