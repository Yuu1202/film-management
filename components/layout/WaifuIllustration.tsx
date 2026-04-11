"use client";

import { useThemeStore } from "@/stores/themeStore";
import { getWaifuConfig } from "@/lib/waifuConfig";
import { useState, useEffect } from "react";

interface Props {
  page: string;
}

export default function WaifuIllustration({ page }: Props) {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Reset error saat tema berubah
  useEffect(() => { setError(false); }, [theme]);

  if (!mounted) return null;
  if (error) return null;

  const config = getWaifuConfig(page, theme);
  if (!config) return null;

  return (
    <img
      key={`${page}-${theme}`}
      src={config.src}
      alt="illustration"
      style={config.style}
      onError={() => setError(true)}
    />
  );
}