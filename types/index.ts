// Tipe data user
export interface User {
  id: string;
  username: string;
  email: string;
  display_name: string;
  bio: string;
  role: "user" | "admin";
}

// Tipe data film
export interface Film {
  id: string;
  title: string;
  description: string;
  release_year: number;
  poster_url: string;
  genres: Genre[];
}

// Tipe data genre
export interface Genre {
  id: string;
  name: string;
}

// Tipe data review
export interface Review {
  id: string;
  film_id: string;
  user_id: string;
  user: User;
  content: string;
  rating: number;
  created_at: string;
  reactions?: Reaction[]; // Reaksi yang terkait dengan review ini
}

// Tipe data reaksi pada review
export interface Reaction {
  id: string;
  review_id: string;
  user_id: string;
  status: "like" | "dislike";
}

// Tipe data daftar tontonan
export interface FilmList {
  id: string;
  user_id: string;
  film_id: string;
  film: Film;
  visibility: "public" | "private";
}

// Tipe response standar dari API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Tipe response paginasi
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  total: number;
  page: number;
  limit: number;
}
