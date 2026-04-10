import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

// Tipe payload yang ada di dalam JWT token
interface JwtPayload {
  user_id: string;
  email: string;
  role: string;
}

export const useAuth = () => {
  const { user, token, setAuth, clearAuth } = useAuthStore();

  // Ambil data profil user yang sedang login
  const fetchMe = async () => {
    try {
      const res = await api.get("/users/me");
      return res.data.data;
    } catch {
      return null;
    }
  };


  const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  const { token, role } = res.data.data;

  // Decode JWT untuk ambil user_id tanpa perlu request tambahan
  const decoded = jwtDecode<JwtPayload>(token);

  // Fetch profil user pakai user_id dari token
  const profileRes = await api.get(`/users/${decoded.user_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const user = { ...profileRes.data.data, role: role.toLowerCase() };
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