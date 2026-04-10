import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  user_id: string;
  email: string;
  role: string;
}

export const useAuth = () => {
  const { user, token, setAuth, clearAuth } = useAuthStore();

  // Ambil data profil user yang sedang login via /auth/me
  const fetchMe = async (savedToken: string) => {
    const res = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${savedToken}` },
    });
    return res.data.data.personal_info;
  };

  // Login, decode JWT, fetch profil, simpan ke store
  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, role } = res.data.data;

    const decoded = jwtDecode<JwtPayload>(token);
    const profile = await fetchMe(token);

    const user = { ...profile, role: role.toLowerCase() };
    setAuth(user, token);
    toast.success("Login berhasil!");
    return res.data;
  };

  // Register akun baru
  const register = async (payload: {
    username: string;
    email: string;
    password: string;
    display_name: string;
    bio: string;
  }) => {
    const res = await api.post("/auth/register", payload);
    toast.success("Registrasi berhasil! Silahkan login.");
    return res.data;
  };

  // Hapus session dan arahkan user keluar
  const logout = () => {
    clearAuth();
    toast.success("Logout berhasil!");
  };

  return { user, token, fetchMe, login, register, logout };
};