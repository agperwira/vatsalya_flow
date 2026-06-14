"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, User, Mail, Lock, Phone, Loader2 } from "lucide-react"
import { useToast } from "@/components/providers"

const registerSchema = z.object({
  name: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  email: z.string().email("Format email tidak valid").min(1, "Email wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  phone: z.string().min(8, "Nomor WhatsApp tidak valid"),
  trimester: z.number().min(1).max(3, "Pilih trimester kehamilan Anda"),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function MemberRegister() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      trimester: 1,
    },
  })

  const currentTrimester = watch("trimester")

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message || "Gagal melakukan registrasi")
      }

      toast("Registrasi berhasil! Silakan login dengan akun Anda. 🌸", "success")
      router.push("/login")
    } catch (error: any) {
      toast(error.message || "Terjadi kesalahan, silakan coba lagi.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#F3EEE5] flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Orbs */}
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
            Daftar Akun Baru
          </h2>
          <p className="mt-2 text-sm text-dark-espresso/60 font-medium">
            Mulailah latihan prenatal yoga yang dipersonalisasi
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-md py-8 px-6 shadow-xl border border-white/50 rounded-3xl sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-dark-espresso tracking-wide uppercase mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-espresso/40">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  {...register("name")}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-2xl text-sm bg-white/70 focus:outline-none focus:ring-2 focus:ring-accent-rose/30 focus:border-accent-rose transition-all ${
                    errors.name ? "border-accent-rose/50" : "border-dark-espresso/10"
                  }`}
                  placeholder="Bunda Clarissa"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-accent-rose font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-dark-espresso tracking-wide uppercase mb-1.5">
                Alamat Email
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-espresso/40">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-2xl text-sm bg-white/70 focus:outline-none focus:ring-2 focus:ring-accent-rose/30 focus:border-accent-rose transition-all ${
                    errors.email ? "border-accent-rose/50" : "border-dark-espresso/10"
                  }`}
                  placeholder="bunda@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-accent-rose font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-dark-espresso tracking-wide uppercase mb-1.5">
                Kata Sandi
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-espresso/40">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  {...register("password")}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-2xl text-sm bg-white/70 focus:outline-none focus:ring-2 focus:ring-accent-rose/30 focus:border-accent-rose transition-all ${
                    errors.password ? "border-accent-rose/50" : "border-dark-espresso/10"
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-accent-rose font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-dark-espresso tracking-wide uppercase mb-1.5">
                Nomor WhatsApp
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-espresso/40">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="tel"
                  {...register("phone")}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-2xl text-sm bg-white/70 focus:outline-none focus:ring-2 focus:ring-accent-rose/30 focus:border-accent-rose transition-all ${
                    errors.phone ? "border-accent-rose/50" : "border-dark-espresso/10"
                  }`}
                  placeholder="62812345678"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-accent-rose font-medium">{errors.phone.message}</p>
              )}
            </div>

            {/* Trimester Selector */}
            <div>
              <label className="block text-xs font-bold text-dark-espresso tracking-wide uppercase mb-2">
                Trimester Kehamilan Saat Ini
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((tri) => (
                  <button
                    key={tri}
                    type="button"
                    onClick={() => setValue("trimester", tri)}
                    className={`py-3 rounded-2xl border text-sm font-semibold transition-all ${
                      currentTrimester === tri
                        ? "border-accent-rose bg-accent-rose/15 text-accent-rose ring-2 ring-accent-rose/20"
                        : "border-dark-espresso/10 bg-white hover:bg-dark-espresso/5 text-dark-espresso/70"
                    }`}
                  >
                    T-{tri}
                  </button>
                ))}
              </div>
              {errors.trimester && (
                <p className="mt-1 text-xs text-accent-rose font-medium">{errors.trimester.message}</p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-accent-rose hover:bg-accent-rose/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-rose disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Daftar Akun Baru"}
              </button>
            </div>
          </form>

          {/* Links */}
          <div className="mt-6 text-center pt-4 border-t border-dark-espresso/5">
            <p className="text-xs text-dark-espresso/60">
              Sudah memiliki akun?{" "}
              <Link href="/login" className="font-semibold text-accent-rose hover:text-accent-rose/80 transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
