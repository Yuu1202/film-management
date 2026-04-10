import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-8xl font-bold text-gray-700 mb-4">404</h1>
      <p className="text-2xl font-bold text-white mb-2">Halaman Tidak Ditemukan</p>
      <p className="text-gray-400 mb-8">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
      <Link
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
      >
        Kembali ke Home
      </Link>
    </div>
  );
}