"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

// Wrapper semua provider agar bisa dipakai di seluruh app
export default function Providers({ children }: { children: React.ReactNode }) {
  // Buat QueryClient sekali saja per session
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // Cache data selama 5 menit
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Toaster untuk notifikasi sukses/error */}
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}