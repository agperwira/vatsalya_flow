"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Save, 
  Loader2, 
  MessageSquare, 
  Globe, 
  AlertTriangle, 
  Settings, 
  Home, 
  Info, 
  Layers, 
  Calendar, 
  Plus, 
  Trash2, 
  HelpCircle,
  FileText,
  Video
} from "lucide-react"
import { useToast } from "@/components/providers"

interface SettingsClientProps {
  initialSettings: {
    whatsappNumber: string
    instagram: string
    youtube: string
    facebook: string
    maintenanceMode: boolean
    dashboardTitle: string
    dashboardTheme: "classic" | "ocean" | "sunset" | "lavender"
    dashboardWelcomeTitle: string
    dashboardWelcomeSubtitle: string
    landingPageContent: any
  }
}

const settingsSchema = z.object({
  whatsappNumber: z.string().min(8, "Nomor WhatsApp tidak valid"),
  instagram: z.string().url("Format Instagram URL tidak valid").or(z.string().length(0)),
  youtube: z.string().url("Format YouTube URL tidak valid").or(z.string().length(0)),
  facebook: z.string().url("Format Facebook URL tidak valid").or(z.string().length(0)),
  maintenanceMode: z.boolean(),
  dashboardTitle: z.string().min(1, "Judul dashboard wajib diisi"),
  dashboardTheme: z.enum(["classic", "ocean", "sunset", "lavender"]),
  dashboardWelcomeTitle: z.string().min(1, "Judul selamat datang wajib diisi"),
  dashboardWelcomeSubtitle: z.string().min(1, "Subjudul selamat datang wajib diisi"),
  
  // Nested landing page config schema
  landingPageContent: z.object({
    name: z.string().min(1, "Nama platform wajib diisi"),
    navbar: z.object({
      ctaText: z.string().min(1, "Teks CTA wajib diisi"),
    }),
    hero: z.object({
      title: z.string().min(1, "Judul hero wajib"),
      subtitle: z.string().min(1, "Subjudul hero wajib"),
      ctaPrimary: z.string().min(1, "CTA primary wajib"),
      ctaSecondary: z.string().min(1, "CTA secondary wajib"),
      highlightText: z.string().min(1, "Highlight text wajib"),
    }),
    about: z.object({
      title: z.string().min(1, "Judul about wajib"),
      subtitle: z.string().min(1, "Subjudul about wajib"),
      paragraph1: z.string().min(1, "Paragraf 1 wajib"),
      paragraph2: z.string().min(1, "Paragraf 2 wajib"),
      teacherName: z.string().min(1, "Nama pengajar wajib"),
      teacherRole: z.string().min(1, "Peran pengajar wajib"),
      teacherQuote: z.string().min(1, "Kutipan pengajar wajib"),
    }),
    program: z.object({
      title: z.string().min(1, "Judul program wajib"),
      subtitle: z.string().min(1, "Subjudul program wajib"),
      items: z.array(z.object({
        id: z.string(),
        title: z.string().min(1, "Judul item wajib"),
        description: z.string().min(1, "Deskripsi item wajib"),
        weeks: z.string().min(1, "Keterangan minggu wajib"),
        difficulty: z.string().min(1, "Tingkat kesulitan wajib"),
      }))
    }),
    manfaat: z.object({
      title: z.string().min(1, "Judul manfaat wajib"),
      subtitle: z.string().min(1, "Subjudul manfaat wajib"),
      items: z.array(z.object({
        title: z.string().min(1, "Judul item wajib"),
        description: z.string().min(1, "Deskripsi item wajib"),
        icon: z.string(),
      }))
    }),
    schedule: z.object({
      title: z.string().min(1, "Judul jadwal wajib"),
      subtitle: z.string().min(1, "Subjudul jadwal wajib"),
      items: z.array(z.object({
        day: z.string().min(1, "Hari wajib"),
        time: z.string().min(1, "Waktu wajib"),
        type: z.string().min(1, "Tipe wajib"),
        instructor: z.string().min(1, "Instruktur wajib"),
      }))
    }),
    faqs: z.array(z.object({
      question: z.string().min(1, "Pertanyaan wajib"),
      answer: z.string().min(1, "Jawaban wajib"),
    })),
    cta: z.object({
      title: z.string().min(1, "Judul CTA wajib"),
      subtitle: z.string().min(1, "Subjudul CTA wajib"),
      buttonText: z.string().min(1, "Teks tombol wajib"),
    }),
    videoPreview: z.object({
      title: z.string().min(1, "Judul video preview wajib"),
      subtitle: z.string().min(1, "Subjudul video preview wajib"),
      description: z.string().min(1, "Deskripsi video preview wajib"),
      youtubeId: z.string().min(1, "YouTube ID video preview wajib"),
    }),
    testimonials: z.array(z.object({
      name: z.string().min(1, "Nama testi wajib"),
      role: z.string().min(1, "Peran/keterangan testi wajib"),
      quote: z.string().min(1, "Kutipan testi wajib"),
      avatar: z.string().min(1, "URL avatar testi wajib"),
    }))
  })
})

type SettingsFormValues = z.infer<typeof settingsSchema>

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"general" | "home" | "about" | "program" | "schedule">("general")

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialSettings,
  })

  // Dynamic Array Fields
  const { fields: programFields } = useFieldArray({
    control,
    name: "landingPageContent.program.items"
  })

  const { fields: manfaatFields } = useFieldArray({
    control,
    name: "landingPageContent.manfaat.items"
  })

  const { fields: scheduleFields, append: appendSchedule, remove: removeSchedule } = useFieldArray({
    control,
    name: "landingPageContent.schedule.items"
  })

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control,
    name: "landingPageContent.faqs"
  })

  const { fields: testimonialFields, append: appendTestimonial, remove: removeTestimonial } = useFieldArray({
    control,
    name: "landingPageContent.testimonials"
  })

  const onSubmit = async (data: SettingsFormValues) => {
    setIsLoading(true)
    
    // Inject top-level overrides into landingPageContent for consistency
    const pageContent = data.landingPageContent as any
    pageContent.name = data.dashboardTitle
    pageContent.whatsappNumber = data.whatsappNumber
    pageContent.socialLinks = {
      instagram: data.instagram,
      youtube: data.youtube,
      facebook: data.facebook
    }

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
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-dark-espresso">Pengaturan Platform & Web</h1>
          <p className="text-xs text-dark-espresso/60 mt-1">Ubah tautan kontak, sosial media, atur status website, serta isi konten landing page.</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-dark-espresso/10 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "general"
              ? "bg-white border-t border-x border-dark-espresso/10 text-accent-rose font-bold"
              : "text-dark-espresso/60 hover:text-dark-espresso"
          }`}
        >
          <Settings className="w-4 h-4" /> Umum & Dashboard
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("home")}
          className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "home"
              ? "bg-white border-t border-x border-dark-espresso/10 text-accent-rose font-bold"
              : "text-dark-espresso/60 hover:text-dark-espresso"
          }`}
        >
          <Home className="w-4 h-4" /> Home & CTA
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("about")}
          className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "about"
              ? "bg-white border-t border-x border-dark-espresso/10 text-accent-rose font-bold"
              : "text-dark-espresso/60 hover:text-dark-espresso"
          }`}
        >
          <Info className="w-4 h-4" /> Tentang Kami
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("program")}
          className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "program"
              ? "bg-white border-t border-x border-dark-espresso/10 text-accent-rose font-bold"
              : "text-dark-espresso/60 hover:text-dark-espresso"
          }`}
        >
          <Layers className="w-4 h-4" /> Program & Manfaat
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("schedule")}
          className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "schedule"
              ? "bg-white border-t border-x border-dark-espresso/10 text-accent-rose font-bold"
              : "text-dark-espresso/60 hover:text-dark-espresso"
          }`}
        >
          <Calendar className="w-4 h-4" /> Jadwal & FAQ
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 md:p-8 rounded-3xl border border-dark-espresso/5 shadow-sm space-y-8">
        
        {/* TAB 1: GENERAL & DASHBOARD */}
        {activeTab === "general" && (
          <div className="space-y-6 animate-fade-in">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Member Dashboard styling customization */}
            <div className="space-y-4 pt-4 border-t border-dark-espresso/5">
              <h3 className="font-serif text-base font-bold text-dark-espresso flex items-center gap-2 pb-2 border-b border-dark-espresso/5">
                <Settings className="w-5 h-5 text-accent-rose" />
                Tampilan & Konten Dashboard Member
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Judul Platform Dashboard</label>
                    <input
                      type="text"
                      {...register("dashboardTitle")}
                      className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                      placeholder="Vatsalya Flow"
                    />
                    {errors.dashboardTitle && <p className="text-[10px] text-accent-rose font-medium mt-1">{errors.dashboardTitle.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Tema Warna Dashboard</label>
                    <select
                      {...register("dashboardTheme")}
                      className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none text-dark-espresso"
                    >
                      <option value="classic">Classic Sage & Rose (Hijau & Merah Muda)</option>
                      <option value="ocean">Ocean Mint & Teal (Biru Laut & Toska)</option>
                      <option value="sunset">Sunset Warmth & Orange (Jingga & Peach)</option>
                      <option value="lavender">Sweet Lavender & Purple (Ungu & Lavender)</option>
                    </select>
                    {errors.dashboardTheme && <p className="text-[10px] text-accent-rose font-medium mt-1">{errors.dashboardTheme.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Judul Selamat Datang (Gunakan <code>{`{name}`}</code> untuk menyisipkan nama member)</label>
                  <input
                    type="text"
                    {...register("dashboardWelcomeTitle")}
                    className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                    placeholder="Selamat datang, Bunda {name} 🌸"
                  />
                  {errors.dashboardWelcomeTitle && <p className="text-[10px] text-accent-rose font-medium mt-1">{errors.dashboardWelcomeTitle.message}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Deskripsi / Pengumuman Selamat Datang</label>
                  <textarea
                    {...register("dashboardWelcomeSubtitle")}
                    rows={3}
                    className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none resize-none"
                    placeholder="Semoga sesi latihan hari ini membawa kedamaian..."
                  />
                  {errors.dashboardWelcomeSubtitle && <p className="text-[10px] text-accent-rose font-medium mt-1">{errors.dashboardWelcomeSubtitle.message}</p>}
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
          </div>
        )}

        {/* TAB 2: HOME & CTA */}
        {activeTab === "home" && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="font-serif text-base font-bold text-dark-espresso flex items-center gap-2 pb-2 border-b border-dark-espresso/5">
              <Home className="w-5 h-5 text-accent-rose" />
              Konten Bagian Utama (Hero Section)
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Teks Tag Sorotan (Highlight Text)</label>
                <input
                  type="text"
                  {...register("landingPageContent.hero.highlightText")}
                  className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                  placeholder="Contoh: ✨ Pendekatan Holistik"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Judul Utama Hero (Hero Title)</label>
                <textarea
                  {...register("landingPageContent.hero.title")}
                  rows={2}
                  className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Subjudul Hero (Hero Subtitle)</label>
                <textarea
                  {...register("landingPageContent.hero.subtitle")}
                  rows={3}
                  className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Teks Tombol Utama (Primary CTA)</label>
                  <input
                    type="text"
                    {...register("landingPageContent.hero.ctaPrimary")}
                    className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Teks Tombol Kedua (Secondary CTA)</label>
                  <input
                    type="text"
                    {...register("landingPageContent.hero.ctaSecondary")}
                    className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40"
                  />
                </div>
              </div>
            </div>

            <h3 className="font-serif text-base font-bold text-dark-espresso flex items-center gap-2 pt-6 pb-2 border-b border-dark-espresso/5">
              <Video className="w-5 h-5 text-accent-rose" />
              Konten Cuplikan Video Latihan (Video Preview)
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Tag Subtitle Video Preview</label>
                  <input
                    type="text"
                    {...register("landingPageContent.videoPreview.subtitle")}
                    className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                    placeholder="Video Preview Latihan"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Judul Video Preview</label>
                  <input
                    type="text"
                    {...register("landingPageContent.videoPreview.title")}
                    className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                    placeholder="Rasakan Pengalaman Kelas Kami"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Deskripsi Singkat Video Preview</label>
                <textarea
                  {...register("landingPageContent.videoPreview.description")}
                  rows={2}
                  className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none resize-none"
                  placeholder="Tonton cuplikan gerakan yoga prenatal..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">ID Video YouTube (misal: hN26YxX3_iU dari https://youtu.be/hN26YxX3_iU)</label>
                <input
                  type="text"
                  {...register("landingPageContent.videoPreview.youtubeId")}
                  className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                  placeholder="hN26YxX3_iU"
                />
              </div>
            </div>

            <h3 className="font-serif text-base font-bold text-dark-espresso flex items-center gap-2 pt-6 pb-2 border-b border-dark-espresso/5">
              <FileText className="w-5 h-5 text-accent-rose" />
              Konten Ajakan Bertindak (CTA Banner)
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Judul Banner CTA</label>
                <input
                  type="text"
                  {...register("landingPageContent.cta.title")}
                  className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Subjudul Banner CTA</label>
                <textarea
                  {...register("landingPageContent.cta.subtitle")}
                  rows={2}
                  className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Teks Tombol WhatsApp</label>
                <input
                  type="text"
                  {...register("landingPageContent.cta.buttonText")}
                  className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TENTANG KAMI */}
        {activeTab === "about" && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="font-serif text-base font-bold text-dark-espresso flex items-center gap-2 pb-2 border-b border-dark-espresso/5">
              <Info className="w-5 h-5 text-accent-rose" />
              Konten Bagian Tentang Kami (About Section)
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Tag Subtitle</label>
                  <input
                    type="text"
                    {...register("landingPageContent.about.subtitle")}
                    className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Judul Utama Tentang Kami</label>
                  <input
                    type="text"
                    {...register("landingPageContent.about.title")}
                    className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Paragraf Deskripsi 1</label>
                <textarea
                  {...register("landingPageContent.about.paragraph1")}
                  rows={3}
                  className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Paragraf Deskripsi 2</label>
                <textarea
                  {...register("landingPageContent.about.paragraph2")}
                  rows={3}
                  className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none resize-none"
                />
              </div>

              <div className="p-5 bg-[#FAF7F2] rounded-3xl border border-dark-espresso/5 space-y-4">
                <h4 className="font-serif text-sm font-bold text-dark-espresso border-b border-dark-espresso/5 pb-2">Profil Kepala Instruktur</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Nama Instruktur</label>
                    <input
                      type="text"
                      {...register("landingPageContent.about.teacherName")}
                      className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Gelar / Peran</label>
                    <input
                      type="text"
                      {...register("landingPageContent.about.teacherRole")}
                      className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Kutipan Guru (Quote)</label>
                  <textarea
                    {...register("landingPageContent.about.teacherQuote")}
                    rows={2}
                    className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-white focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Testimonials List */}
              <div className="space-y-4 pt-6 border-t border-dark-espresso/5">
                <h3 className="font-serif text-base font-bold text-dark-espresso flex items-center gap-2 pb-2 border-b border-dark-espresso/5">
                  <MessageSquare className="w-5 h-5 text-accent-rose" />
                  Daftar Testimoni Bunda (Testimonials)
                </h3>
                
                <div className="space-y-4">
                  {testimonialFields.map((field, idx) => (
                    <div key={field.id} className="p-5 bg-[#FAF7F2] border border-dark-espresso/5 rounded-3xl space-y-4 relative">
                      <button
                        type="button"
                        onClick={() => removeTestimonial(idx)}
                        className="absolute top-4 right-4 p-1.5 bg-accent-rose/10 text-accent-rose rounded-full hover:bg-accent-rose hover:text-white transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Nama Bunda</label>
                          <input
                            type="text"
                            {...register(`landingPageContent.testimonials.${idx}.name` as const)}
                            className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-white focus:outline-none"
                            placeholder="Nama Bunda"
                          />
                          {errors.landingPageContent?.testimonials?.[idx]?.name && (
                            <p className="text-[10px] text-accent-rose font-medium mt-1">
                              {errors.landingPageContent.testimonials[idx]?.name?.message}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Peran / Keterangan (e.g., Usia Kehamilan)</label>
                          <input
                            type="text"
                            {...register(`landingPageContent.testimonials.${idx}.role` as const)}
                            className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-white focus:outline-none"
                            placeholder="Bunda Hamil 32 Minggu / Ibu Menyusui"
                          />
                          {errors.landingPageContent?.testimonials?.[idx]?.role && (
                            <p className="text-[10px] text-accent-rose font-medium mt-1">
                              {errors.landingPageContent.testimonials[idx]?.role?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">URL Gambar Avatar (Gunakan URL gambar valid)</label>
                        <input
                          type="text"
                          {...register(`landingPageContent.testimonials.${idx}.avatar` as const)}
                          className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-white focus:outline-none"
                          placeholder="https://images.unsplash.com/... atau path lokal /images/..."
                        />
                        {errors.landingPageContent?.testimonials?.[idx]?.avatar && (
                          <p className="text-[10px] text-accent-rose font-medium mt-1">
                            {errors.landingPageContent.testimonials[idx]?.avatar?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Kutipan Testimoni (Quote)</label>
                        <textarea
                          {...register(`landingPageContent.testimonials.${idx}.quote` as const)}
                          rows={3}
                          className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-white focus:outline-none resize-none"
                          placeholder="Vatsalya Flow membantu proses persalinan saya berjalan lancar..."
                        />
                        {errors.landingPageContent?.testimonials?.[idx]?.quote && (
                          <p className="text-[10px] text-accent-rose font-medium mt-1">
                            {errors.landingPageContent.testimonials[idx]?.quote?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => appendTestimonial({ name: "", role: "", quote: "", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120" })}
                    className="px-4 py-2 border border-dashed border-dark-espresso/20 text-dark-espresso/60 hover:text-accent-rose hover:border-accent-rose/40 rounded-xl text-xs flex items-center justify-center gap-1.5 w-full transition-all"
                  >
                    <Plus className="w-4 h-4" /> Tambah Testimoni Baru
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROGRAM & MANFAAT */}
        {activeTab === "program" && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="font-serif text-base font-bold text-dark-espresso flex items-center gap-2 pb-2 border-b border-dark-espresso/5">
              <Layers className="w-5 h-5 text-accent-rose" />
              Judul Bagian Program & Manfaat
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-[#FAF7F2]/60 rounded-2xl border border-dark-espresso/5 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wide text-dark-espresso/50">Header Program</span>
                <input
                  type="text"
                  {...register("landingPageContent.program.title")}
                  placeholder="Judul Section Program"
                  className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-white"
                />
                <input
                  type="text"
                  {...register("landingPageContent.program.subtitle")}
                  placeholder="Subjudul Section Program"
                  className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-white"
                />
              </div>

              <div className="p-4 bg-[#FAF7F2]/60 rounded-2xl border border-dark-espresso/5 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wide text-dark-espresso/50">Header Manfaat</span>
                <input
                  type="text"
                  {...register("landingPageContent.manfaat.title")}
                  placeholder="Judul Section Manfaat"
                  className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-white"
                />
                <input
                  type="text"
                  {...register("landingPageContent.manfaat.subtitle")}
                  placeholder="Subjudul Section Manfaat"
                  className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-white"
                />
              </div>
            </div>

            {/* Program Items List */}
            <div className="space-y-4 pt-4 border-t border-dark-espresso/5">
              <h4 className="font-serif text-sm font-bold text-dark-espresso">Daftar Paket Program (Disesuaikan di list)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {programFields.map((field, idx) => (
                  <div key={field.id} className="p-4 bg-[#FAF7F2] border border-dark-espresso/5 rounded-2xl space-y-2">
                    <span className="text-[9px] font-bold text-accent-rose uppercase">Program #{idx + 1}</span>
                    <input
                      type="text"
                      {...register(`landingPageContent.program.items.${idx}.title` as const)}
                      placeholder="Nama Program"
                      className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-white font-bold"
                    />
                    <textarea
                      {...register(`landingPageContent.program.items.${idx}.description` as const)}
                      placeholder="Deskripsi Program"
                      rows={2}
                      className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-white resize-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        {...register(`landingPageContent.program.items.${idx}.weeks` as const)}
                        placeholder="Estimasi Minggu"
                        className="px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-white"
                      />
                      <input
                        type="text"
                        {...register(`landingPageContent.program.items.${idx}.difficulty` as const)}
                        placeholder="Tingkat Kesulitan"
                        className="px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manfaat Items List */}
            <div className="space-y-4 pt-4 border-t border-dark-espresso/5">
              <h4 className="font-serif text-sm font-bold text-dark-espresso">Daftar Manfaat Utama</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {manfaatFields.map((field, idx) => (
                  <div key={field.id} className="p-4 bg-[#FAF7F2] border border-dark-espresso/5 rounded-2xl space-y-2">
                    <span className="text-[9px] font-bold text-accent-rose uppercase">Manfaat #{idx + 1}</span>
                    <input
                      type="text"
                      {...register(`landingPageContent.manfaat.items.${idx}.title` as const)}
                      placeholder="Judul Manfaat"
                      className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-white font-bold"
                    />
                    <textarea
                      {...register(`landingPageContent.manfaat.items.${idx}.description` as const)}
                      placeholder="Penjelasan singkat"
                      rows={2}
                      className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-white resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: JADWAL & FAQ */}
        {activeTab === "schedule" && (
          <div className="space-y-6 animate-fade-in">
            {/* Schedule Section */}
            <div className="space-y-4">
              <h3 className="font-serif text-base font-bold text-dark-espresso flex items-center gap-2 pb-2 border-b border-dark-espresso/5">
                <Calendar className="w-5 h-5 text-accent-rose" />
                Daftar Jadwal Kelas Mingguan
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Judul Bagian Jadwal</label>
                  <input
                    type="text"
                    {...register("landingPageContent.schedule.title")}
                    className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1.5">Subjudul Bagian Jadwal</label>
                  <input
                    type="text"
                    {...register("landingPageContent.schedule.subtitle")}
                    className="w-full px-3.5 py-2.5 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {scheduleFields.map((field, idx) => (
                  <div key={field.id} className="p-4 bg-[#FAF7F2] border border-dark-espresso/5 rounded-2xl flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
                      <div>
                        <label className="block text-[8px] font-bold uppercase text-dark-espresso/50 mb-0.5">Hari</label>
                        <input
                          type="text"
                          {...register(`landingPageContent.schedule.items.${idx}.day` as const)}
                          className="w-full px-2 py-1.5 border border-dark-espresso/10 rounded-lg text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold uppercase text-dark-espresso/50 mb-0.5">Waktu</label>
                        <input
                          type="text"
                          {...register(`landingPageContent.schedule.items.${idx}.time` as const)}
                          className="w-full px-2 py-1.5 border border-dark-espresso/10 rounded-lg text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold uppercase text-dark-espresso/50 mb-0.5">Tipe & Lokasi</label>
                        <input
                          type="text"
                          {...register(`landingPageContent.schedule.items.${idx}.type` as const)}
                          className="w-full px-2 py-1.5 border border-dark-espresso/10 rounded-lg text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold uppercase text-dark-espresso/50 mb-0.5">Instruktur</label>
                        <input
                          type="text"
                          {...register(`landingPageContent.schedule.items.${idx}.instructor` as const)}
                          className="w-full px-2 py-1.5 border border-dark-espresso/10 rounded-lg text-xs bg-white"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSchedule(idx)}
                      className="p-2 bg-accent-rose/10 text-accent-rose rounded-lg hover:bg-accent-rose hover:text-white transition-all shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => appendSchedule({ day: "Senin", time: "09:00 WIB", type: "Studio", instructor: "Bidan Saraswati" })}
                  className="px-4 py-2 border border-dashed border-dark-espresso/20 text-dark-espresso/60 hover:text-accent-rose hover:border-accent-rose/40 rounded-xl text-xs flex items-center justify-center gap-1.5 w-full transition-all"
                >
                  <Plus className="w-4 h-4" /> Tambah Sesi Jadwal
                </button>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-4 pt-6 border-t border-dark-espresso/5">
              <h3 className="font-serif text-base font-bold text-dark-espresso flex items-center gap-2 pb-2 border-b border-dark-espresso/5">
                <HelpCircle className="w-5 h-5 text-accent-rose" />
                Daftar Tanya Jawab (FAQ)
              </h3>

              <div className="space-y-4">
                {faqFields.map((field, idx) => (
                  <div key={field.id} className="p-4 bg-[#FAF7F2] border border-dark-espresso/5 rounded-2xl space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => removeFaq(idx)}
                      className="absolute top-4 right-4 p-1.5 bg-accent-rose/10 text-accent-rose rounded-full hover:bg-accent-rose hover:text-white transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="space-y-2 pr-8">
                      <div>
                        <label className="block text-[8px] font-bold uppercase text-dark-espresso/50 mb-1">Pertanyaan #{idx + 1}</label>
                        <input
                          type="text"
                          {...register(`landingPageContent.faqs.${idx}.question` as const)}
                          className="w-full px-3 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-white font-bold"
                          placeholder="Pertanyaan"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold uppercase text-dark-espresso/50 mb-1">Jawaban</label>
                        <textarea
                          {...register(`landingPageContent.faqs.${idx}.answer` as const)}
                          rows={2}
                          className="w-full px-3 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-white resize-none"
                          placeholder="Jawaban lengkap..."
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => appendFaq({ question: "Pertanyaan Baru?", answer: "Jawaban dari pertanyaan baru..." })}
                  className="px-4 py-2 border border-dashed border-dark-espresso/20 text-dark-espresso/60 hover:text-accent-rose hover:border-accent-rose/40 rounded-xl text-xs flex items-center justify-center gap-1.5 w-full transition-all"
                >
                  <Plus className="w-4 h-4" /> Tambah FAQ Baru
                </button>
              </div>
            </div>
          </div>
        )}

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
