"use client";

import { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);

  // Tunggu sampai component mounted di client sebelum cek localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const savedToken = token || localStorage.getItem("token");

    // Kalau belum login, redirect ke halaman login
    if (!savedToken) {
      router.push("/login");
      return;
    }

    // Kalau butuh role admin tapi user bukan admin, redirect ke home
    if (requiredRole === "admin" && user?.role !== "admin") {
      router.push("/");
    }
  }, [mounted, token, user, requiredRole]);

  // Jangan render apapun sebelum client siap
  if (!mounted) return null;

  const savedToken = token || localStorage.getItem("token");
  if (!savedToken) return null;
  if (requiredRole === "admin" && user?.role !== "admin") return null;

  return <>{children}</>;
}