"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "admin";
}

// Komponen untuk membatasi akses halaman berdasarkan status login dan role
export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Kalau belum login, redirect ke halaman login
    if (!token && !localStorage.getItem("token")) {
      router.push("/login");
      return;
    }

    // Kalau butuh role admin tapi user bukan admin, redirect ke home
    if (requiredRole === "admin" && user?.role !== "admin") {
      router.push("/");
      return;
    }
  }, [token, user, requiredRole]);

  // Jangan render apapun kalau belum terautentikasi
  if (!token && !localStorage.getItem("token")) return null;
  if (requiredRole === "admin" && user?.role !== "admin") return null;

  return <>{children}</>;
}