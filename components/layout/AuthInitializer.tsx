"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import { jwtDecode } from "jwt-decode";

// Tipe payload JWT
interface JwtPayload {
  user_id: string;
  email: string;
  role: string;
}

// Auto-restore session user saat app pertama dibuka
export default function AuthInitializer() {
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) return;

    try {
      // Decode token untuk ambil user_id dan role
      const decoded = jwtDecode<JwtPayload>(savedToken);

      api.get(`/users/${decoded.user_id}`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => {
          const user = { ...res.data.data, role: decoded.role.toLowerCase() };
          setAuth(user, savedToken);
        })
        .catch(() => {
          // Token expired atau tidak valid
          localStorage.removeItem("token");
        });
    } catch {
      // Token rusak / tidak bisa di-decode
      localStorage.removeItem("token");
    }
  }, []);

  return null;
}