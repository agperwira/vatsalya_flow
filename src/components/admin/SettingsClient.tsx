"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, Loader2, MessageSquare, Globe, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/providers"

interface SettingsClientProps {
  initialSettings: {
    whatsappNumber: string
    instagram: string
    youtube: string
    facebook: string
    maintenanceMode: boolean
  }
}

const settingsSchema = z.object({
  whatsappNumber: z.string().min(8, "Nomor WhatsApp tidak valid"),
  instagram: z.string().url("Format Instagram URL tidak valid").or(z.string().length(0)),
  youtube: z.string().url("Format YouTube URL tidak valid").or(z.string().length(0)),
  facebook: z.string().url("Format Facebook URL tidak valid").or(z.string().length(0)),
  maintenanceMode: z.boolean(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialSettings,
  })

  const onSubmit = async (data: SettingsFormValues) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Gagal menyimpan pengaturan")
      }

      toast("Pengaturan berhasil disimpan! 🌸", "success")
      router.refresh()
    } catch (error: any) {
      toast(error.message || "Terjadi kesalahan.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-dark-espresso">Pengaturan Platform</h1>
        <p className="text-xs text-dark-espresso/60 mt-1">Ubah tautan kontak, sosial media, dan atur status operasional website.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 md:p-8 rounded-3xl border border-dark-espresso/5 shadow-sm space-y-6">
        
        {/* Contact Section */}
        <div className="space-y-4">
          <h3 className="font-serif text-base font-bold text-dark-espresso flex items-center gap-2 pb-2 border-b border-dark-espresso/5">
            <MessageSquare className="w-5 h-5 text-accent-rose" />
            Saluran Hubungan (WhatsApp)
          </h3>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Nomor WhatsApp Admin (Kode Negara Tanpa '+')</label>
            <input
              type="text"
              {...register("whatsappNumber")}
              className={`w-full px-3.5 py-2.5 border rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none focus:ring-1 focus:ring-accent-rose ${errors.whatsappNumber ? "border-accent-rose" : "border-dark-espresso/10"}`}
              placeholder="Contoh: 6281234567890"
            />
            {errors.whatsappNumber && <p className="text-[10px] text-accent-rose font-medium mt-1">{errors.whatsappNumber.message}</p>}
          </div>
        </div>

        {/* Social Links Section */}
        <div className="space-y-4 pt-4 border-t border-dark-espresso/5">
          <h3 className="font-serif text-base font-bold text-dark-espresso flex items-center gap-2 pb-2 border-b border-dark-espresso/5">
            <Globe className="w-5 h-5 text-accent-rose" />
            Media Sosial Platform
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Link Instagram</label>
              <input
                type="text"
                {...register("instagram")}
                className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                placeholder="https://instagram.com/username"
              />
              {errors.instagram && <p className="text-[10px] text-accent-rose font-medium mt-1">{errors.instagram.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Link YouTube</label>
              <input
                type="text"
                {...register("youtube")}
                className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                placeholder="https://youtube.com/channel"
              />
              {errors.youtube && <p className="text-[10px] text-accent-rose font-medium mt-1">{errors.youtube.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Link Facebook</label>
              <input
                type="text"
                {...register("facebook")}
                className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                placeholder="https://facebook.com/page"
              />
              {errors.facebook && <p className="text-[10px] text-accent-rose font-medium mt-1">{errors.facebook.message}</p>}
            </div>
          </div>
        </div>

        {/* Maintenance Mode Section */}
        <div className="space-y-4 pt-4 border-t border-dark-espresso/5">
          <h3 className="font-serif text-base font-bold text-dark-espresso flex items-center gap-2 pb-2 border-b border-dark-espresso/5">
            <AlertTriangle className="w-5 h-5 text-accent-rose" />
            Mode Pemeliharaan (Maintenance Mode)
          </h3>
          <div className="flex items-start gap-3 p-4 bg-accent-rose/5 border border-accent-rose/10 rounded-2xl">
            <input
              type="checkbox"
              id="maintenanceMode"
              {...register("maintenanceMode")}
              className="rounded text-accent-rose focus:ring-accent-rose mt-1 shrink-0 cursor-pointer"
            />
            <label htmlFor="maintenanceMode" className="cursor-pointer">
              <span className="block text-xs font-bold text-dark-espresso">Aktifkan Mode Pemeliharaan</span>
              <span className="block text-[10px] text-dark-espresso/60 leading-relaxed mt-1">
                Jika diaktifkan, halaman publik akan tertutup dan menampilkan halaman perbaikan. Hanya Admin yang tetap dapat mengakses panel dashboard ini.
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-dark-espresso/5 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-accent-rose hover:bg-accent-rose/95 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-2 transition-all"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Pengaturan
          </button>
        </div>

      </form>
    </div>
  )
}
