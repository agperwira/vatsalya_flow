"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Lock, Mail, Loader2, ShieldCheck } from "lucide-react"
import { useToast } from "@/components/providers"

const adminLoginSchema = z.object({
  email: z.string().email("Format email tidak valid").min(1, "Email wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>

export default function AdminLogin() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: AdminLoginFormValues) => {
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (result?.error) {
        toast(result.error, "error")
      } else {
        // Double check session in server/client to ensure it's admin (middleware will protect but let's guide them)
        toast("Login admin sukses! Masuk ke panel kontrol... ⚙️", "success")
        router.push("/admin/dashboard")
        router.refresh()
      }
    } catch (error) {
      toast("Gagal memproses otentikasi admin.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1F120C] flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] rounded-full bg-accent-rose/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] rounded-full bg-[#8A9E7E]/5 blur-[120px] pointer-events-none" />

      {/* Back to Home */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="w-12 h-12 rounded-2xl bg-accent-rose/10 text-accent-rose flex items-center justify-center mx-auto border border-accent-rose/25">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-white">
          Vatsalya Admin Portal
        </h2>
        <p className="mt-2 text-xs text-white/40 tracking-wider uppercase font-bold">
          Authorized Personnel Only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#2C1810]/70 backdrop-blur-md py-8 px-6 shadow-2xl border border-white/5 rounded-3xl sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-white/60 tracking-wide uppercase mb-2">
                Email Administrator
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-2xl text-sm bg-white/5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-accent-rose/30 focus:border-accent-rose transition-all ${
                    errors.email ? "border-accent-rose/40" : "border-white/10"
                  }`}
                  placeholder="admin@vatsalyayoga.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-accent-rose font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-white/60 tracking-wide uppercase mb-2">
                Kata Sandi
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-2xl text-sm bg-white/5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-accent-rose/30 focus:border-accent-rose transition-all ${
                    errors.password ? "border-accent-rose/40" : "border-white/10"
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

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-md text-sm font-semibold text-white bg-accent-rose hover:bg-accent-rose/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-rose disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Verifikasi & Masuk"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
