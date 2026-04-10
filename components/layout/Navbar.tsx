"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const router = useRouter();

  // Logout lalu redirect ke halaman login
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold text-white hover:text-gray-300">
        🎬 FilmApp
      </Link>

      <div className="flex items-center gap-4">
        {/* Link publik */}
        <Link href="/films" className="hover:text-gray-300 text-sm">Films</Link>
        <Link href="/genres" className="hover:text-gray-300 text-sm">Genres</Link>

        {user ? (
          <>
            {/* Tampil menu admin kalau role admin */}
            {user.role === "admin" && (
              <div className="flex items-center gap-3">
                <Link href="/admin/genres" className="hover:text-yellow-400 text-sm text-yellow-300">
                ⚙️ Genres
                </Link>
                <Link href="/admin/films" className="hover:text-yellow-400 text-sm text-yellow-300">
                ➕ Film
                </Link>
                </div>
              )}

              
            <Link href="/profile" className="hover:text-gray-300 text-sm">
              {user.display_name}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-sm px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-gray-300 text-sm">Login</Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1 rounded"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}