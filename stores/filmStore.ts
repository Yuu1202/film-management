import { create } from "zustand";
import { Film } from "@/types";

interface FilmState {
  films: Film[];
  selectedFilm: Film | null;

  // Simpan daftar film ke store
  setFilms: (films: Film[]) => void;

  // Simpan film yang sedang dilihat detailnya
  setSelectedFilm: (film: Film | null) => void;
}

export const useFilmStore = create<FilmState>((set) => ({
  films: [],
  selectedFilm: null,

  setFilms: (films) => set({ films }),

  setSelectedFilm: (film) => set({ selectedFilm: film }),
}));