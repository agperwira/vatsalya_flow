"use client"

import React, { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Lock, Mail, Loader2, Sparkles } from "lucide-react"
import { useToast } from "@/components/providers"

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid").min(1, "Email wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

type LoginFormValues = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        loginType: "member",
      })

      if (result?.error) {
        toast(result.error, "error")
      } else {
        toast("Berhasil masuk, selamat datang Bunda! 🌸", "success")
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      toast("Terjadi kesalahan sistem, silakan coba lagi.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#F3EEE5] flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-accent-rose/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-soft-sage/10 blur-[80px] pointer-events-none" />

      {/* Back to Home link */}
      <div className="absolute top-6 left-6 md:left-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-dark-espresso/60 hover:text-accent-rose transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <span className="text-2xl">🤰🌸</span>
          <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-dark-espresso">
            Selamat Datang, Bunda
          </h2>
          <p className="mt-2 text-sm text-dark-espresso/60 font-medium">
            Masuk untuk mengakses materi prenatal yoga khusus Bunda
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-md py-8 px-6 shadow-xl border border-white/50 rounded-3xl sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-dark-espresso tracking-wide uppercase mb-2">
                Alamat Email
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-espresso/40">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-2xl text-sm bg-white/70 focus:outline-none focus:ring-2 focus:ring-accent-rose/30 focus:border-accent-rose transition-all ${
                    errors.email ? "border-accent-rose/50" : "border-dark-espresso/10"
                  }`}
                  placeholder="bunda@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-accent-rose font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-dark-espresso tracking-wide uppercase mb-2">
                Kata Sandi
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-espresso/40">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-2xl text-sm bg-white/70 focus:outline-none focus:ring-2 focus:ring-accent-rose/30 focus:border-accent-rose transition-all ${
                    errors.password ? "border-accent-rose/50" : "border-dark-espresso/10"
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-accent-rose font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-accent-rose hover:bg-accent-rose/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-rose disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Masuk ke Dashboard"
                )}
              </button>
            </div>
          </form>

          {/* Bottom links */}
          <div className="mt-8 text-center pt-6 border-t border-dark-espresso/5">
            <p className="text-xs text-dark-espresso/60">
              Belum memiliki akun?{" "}
              <Link href="/register" className="font-semibold text-accent-rose hover:text-accent-rose/80 transition-colors">
                Daftar Akun Baru
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MemberLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#F3EEE5] flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-accent-rose border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-dark-espresso/55 font-semibold">Memuat halaman masuk...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
