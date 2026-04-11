"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      router.push("/");
    } catch {
      toast.error("Email atau password salah");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--color-bg)", fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Nunito:wght@400;600;700&display=swap');`}</style>

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 360, height: 360, top: -100, right: -80, background: "var(--color-accent)", filter: "blur(90px)", opacity: 0.1 }} />
        <div className="absolute rounded-full" style={{ width: 280, height: 280, bottom: -80, left: -80, background: "var(--color-second)", filter: "blur(80px)", opacity: 0.1 }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)", opacity: 0.4 }} />
        {/* Diamond dots */}
        <div style={{ position: "absolute", top: 24, right: 24, display: "grid", gridTemplateColumns: "repeat(5, 8px)", gap: 6, opacity: 0.12 }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} style={{ width: 4, height: 4, background: "var(--color-accent)", transform: "rotate(45deg)" }} />
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 24, left: 24, display: "grid", gridTemplateColumns: "repeat(5, 8px)", gap: 6, opacity: 0.12 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{ width: 4, height: 4, background: "var(--color-second)", transform: "rotate(45deg)" }} />
          ))}
        </div>
      </div>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md mx-4"
        style={{
          background: "var(--color-surface)",
          borderRadius: 16,
          border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)",
          padding: "40px 36px",
          boxShadow: "0 0 60px color-mix(in srgb, var(--color-accent) 8%, transparent)",
        }}
      >
        {/* Top accent line */}
        <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 2, background: "linear-gradient(90deg, transparent, var(--color-accent), transparent)", borderRadius: "0 0 4px 4px" }} />

        {/* Title */}
        <div className="text-center mb-8">
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 32,
              fontWeight: 700,
              color: "var(--color-text)",
              letterSpacing: "0.06em",
              marginBottom: 6,
            }}
          >
            Film<span style={{ color: "var(--color-accent)" }}>App</span>
          </h1>
          <div className="flex items-center gap-3 mt-4 mb-1">
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, var(--color-main))" }} />
            <span style={{ fontSize: 11, color: "var(--color-text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>Login</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--color-main), transparent)" }} />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <label style={{ fontSize: 11, color: "var(--color-text-muted)", display: "block", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="email@example.com"
              style={{
                width: "100%",
                background: "var(--color-bg)",
                color: "var(--color-text)",
                border: "1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)",
                borderRadius: 10,
                padding: "11px 14px",
                fontSize: 14,
                outline: "none",
                fontFamily: "'Nunito', sans-serif",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.target.style.borderColor = "color-mix(in srgb, var(--color-accent) 30%, transparent)")}
            />
            {errors.email && (
              <p style={{ color: "var(--color-second)", fontSize: 11, marginTop: 4 }}>{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: 11, color: "var(--color-text-muted)", display: "block", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  background: "var(--color-bg)",
                  color: "var(--color-text)",
                  border: "1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)",
                  borderRadius: 10,
                  padding: "11px 44px 11px 14px",
                  fontSize: 14,
                  outline: "none",
                  fontFamily: "'Nunito', sans-serif",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
                onBlur={(e) => (e.target.style.borderColor = "color-mix(in srgb, var(--color-accent) 30%, transparent)")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                  color: "var(--color-text-muted)",
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <p style={{ color: "var(--color-second)", fontSize: 11, marginTop: 4 }}>{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: isSubmitting ? "var(--color-main)" : "var(--color-accent)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 0",
              fontSize: 14,
              fontWeight: 700,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              fontFamily: "'Nunito', sans-serif",
              letterSpacing: "0.06em",
              opacity: isSubmitting ? 0.6 : 1,
              transition: "opacity 0.2s",
              marginTop: 4,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {isSubmitting ? "Loading..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p style={{ color: "var(--color-text-muted)", fontSize: 13, textAlign: "center", marginTop: 24 }}>
          Belum punya akun?{" "}
          <Link href="/register" style={{ color: "var(--color-accent)", fontWeight: 700, textDecoration: "none" }}>
            Register
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
      `}</style>
    </div>
  );
}