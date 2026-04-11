# 🎬 Film Management

Aplikasi web untuk menemukan, mengulas, dan menyimpan film favorit. Dibangun dengan Next.js sebagai bagian dari Open Recruitment Admin RPL 2026.

## Demo

[film-management.vercel.app](https://film-management.vercel.app)

## Fitur

**Untuk semua pengunjung:**
- Melihat katalog film dengan pencarian dan pagination
- Melihat detail film beserta ulasan dan rating
- Melihat daftar genre
- Melihat profil publik pengguna lain

**Untuk pengguna yang sudah login:**
- Menambahkan film ke watchlist
- Mengubah visibilitas watchlist (publik/privat)
- Menulis ulasan pada film
- Memberikan dan mengubah reaksi (like/dislike) pada ulasan

**Untuk Admin:**
- Menambahkan film baru ke katalog
- Mengelola genre (tambah dan edit)
- Melihat tabel genre berpaginasi

## Teknologi

- [Next.js](https://nextjs.org/) — Framework React dengan App Router
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [Zustand](https://zustand-demo.pmnd.rs/) — State management
- [TanStack React Query](https://tanstack.com/query) — Data fetching dan caching
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — Form handling dan validasi
- [Axios](https://axios-http.com/) — HTTP client
- [React Hot Toast](https://react-hot-toast.com/) — Notifikasi

## Instalasi

### Prasyarat
- Node.js 18 ke atas
- npm

### Langkah-langkah

1. Clone repository
```bash
git clone https://github.com/USERNAME/film-management.git
cd film-management
```

2. Install dependencies
```bash
npm install
```

3. Buat file `.env.local` di root project
```
NEXT_PUBLIC_API_URL=https://film-management-api.labse.id/api/v1
```

4. Jalankan development server
```bash
npm run dev
```

5. Buka [http://localhost:3000](http://localhost:3000) di browser

## Struktur Folder

```
film-management/
├── app/                    # Halaman (Next.js App Router)
│   ├── (auth)/             # Halaman login dan register
│   ├── (main)/             # Halaman publik (film, genre, profil)
│   └── admin/              # Halaman khusus admin
├── components/             # Komponen reusable
│   ├── layout/             # Navbar, Providers, ProtectedRoute
│   ├── film/               # Komponen poster film
│   ├── film-list/          # Komponen watchlist
│   └── review/             # Komponen ulasan dan reaksi
├── hooks/                  # Custom React hooks
├── lib/                    # Konfigurasi axios dan utilitas
├── stores/                 # Zustand stores
└── types/                  # TypeScript interfaces
```

## Akun Demo

| Role | Email | Password |
|------|-------|----------|
| Admin | atmin@email.com | myatmin123 |

## Deployment

Project ini di-deploy di Vercel. Setiap push ke branch `main` akan otomatis men-trigger deployment baru.