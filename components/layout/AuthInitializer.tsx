"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import api from "@/lib/api";
import { jwtDecode } from "jwt-decode";

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
      const decoded = jwtDecode<JwtPayload>(savedToken);

      // Fetch profil via /auth/me
      api.get("/auth/me", {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => {
          const profile = res.data.data.personal_info;
          const user = { ...profile, role: decoded.role.toLowerCase() };
          setAuth(user, savedToken);
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    } catch {
      localStorage.removeItem("token");
    }
  }, []);

  return null;
}