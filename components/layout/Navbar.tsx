"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-white hover:text-gray-300">
        🎬 FilmApp
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/films" className="hover:text-gray-300 text-sm">Films</Link>
        <Link href="/genres" className="hover:text-gray-300 text-sm">Genres</Link>

        {user ? (
          <>
            {/* Dropdown-style admin menu */}
            {user.role === "admin" && (
              <div className="flex items-center gap-1 bg-yellow-900 border border-yellow-700 rounded-lg px-3 py-1">
                <span className="text-yellow-400 text-xs font-semibold mr-1">ADMIN</span>
                <Link href="/admin/genres" className="hover:text-yellow-300 text-yellow-400 text-xs">
                  Genre
                </Link>
                <span className="text-yellow-700">·</span>
                <Link href="/admin/films" className="hover:text-yellow-300 text-yellow-400 text-xs">
                  Tambah Film
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