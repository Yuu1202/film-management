"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState } from "react";

const registerSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  display_name: z.string().min(2, "Display name minimal 2 karakter"),
  bio: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        display_name: data.display_name,
        bio: data.bio || "",
      });
      router.push("/login");
    } catch {
      toast.error("Registrasi gagal, coba lagi");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Register</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Username</label>
            <input
              {...register("username")}
              type="text"
              placeholder="username"
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="email@example.com"
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Input password dengan toggle show/hide */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 pr-12"
              />
              {/* Tombol toggle show/hide password */}
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Display Name</label>
            <input
              {...register("display_name")}
              type="text"
              placeholder="Nama tampilan kamu"
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            {errors.display_name && (
              <p className="text-red-400 text-xs mt-1">{errors.display_name.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Bio <span className="text-gray-600">(opsional)</span>
            </label>
            <textarea
              {...register("bio")}
              placeholder="Ceritakan sedikit tentang dirimu..."
              rows={3}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition"
          >
            {isSubmitting ? "Loading..." : "Register"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}