import React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Lock, Play, CheckCircle, Award, Calendar, LogOut } from "lucide-react"
import VideoCatalog from "@/components/member/VideoCatalog"

export const dynamic = "force-dynamic"

export default async function MemberDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "MEMBER") {
    redirect("/login")
  }

  // Fetch member profile
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      videos: {
        include: {
          video: true
        }
      }
    }
  })

  if (!user) {
    redirect("/login")
  }

  // Unassigned/locked videos will no longer be loaded and displayed. Only assigned videos will be rendered.

  // Fetch customizable dashboard settings
  const dashboardSetting = await prisma.setting.findUnique({ where: { key: "dashboard_settings" } })
  const dashboardSettings = dashboardSetting
    ? JSON.parse(dashboardSetting.value)
    : {
        title: "Vatsalya Flow",
        theme: "classic",
        welcomeTitle: "Selamat datang, Bunda {name} 🌸",
        welcomeSubtitle: "Semoga sesi latihan hari ini membawa kedamaian dan kebugaran bagi Bunda dan si kecil.",
      }

  // Group user videos
  const assignedVideoIds = new Set(user.videos.map(uv => uv.videoId))
  const watchedVideoIds = new Set(
    user.videos.filter(uv => uv.watchedAt !== null).map(uv => uv.videoId)
  )

  // Calculate Progress
  const totalAssigned = user.videos.length
  const totalWatched = user.videos.filter(uv => uv.watchedAt !== null).length
  const progressPercent = totalAssigned > 0 ? Math.round((totalWatched / totalAssigned) * 100) : 0

  // Find "Lanjutkan Menonton" (Last watched or first unwatched assigned video)
  let continueVideo = null
  const lastWatchedUserVideo = user.videos
    .filter(uv => uv.watchedAt !== null)
    .sort((a, b) => (b.watchedAt?.getTime() || 0) - (a.watchedAt?.getTime() || 0))[0]

  if (lastWatchedUserVideo) {
    continueVideo = lastWatchedUserVideo.video
  } else if (user.videos.length > 0) {
    // If none watched, grab the first assigned one that isn't watched yet
    continueVideo = user.videos[0].video
  }

  // Format date
  const joinDate = new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(user.createdAt)

  // Theme Styling Configuration
  const themeKey = (dashboardSettings.theme || "classic") as "classic" | "ocean" | "sunset" | "lavender"
  const themes = {
    classic: {
      bg: "bg-[#FAF7F2]",
      text: "text-dark-espresso",
      textMuted: "text-dark-espresso/60",
      textMuted70: "text-dark-espresso/70",
      textMuted50: "text-dark-espresso/50",
      textMuted15: "text-dark-espresso/15",
      border: "border-dark-espresso/5",
      borderMuted15: "border-dark-espresso/15",
      accentBg: "bg-accent-rose",
      accentText: "text-accent-rose",
      accentHover: "hover:bg-accent-rose/95",
      accentBorder: "hover:border-accent-rose",
      accentBadgeBg: "bg-accent-rose/10",
      secondaryBg: "bg-soft-sage",
      secondaryText: "text-soft-sage",
      secondaryBadgeBg: "bg-soft-sage/10",
      gradient: "from-accent-rose/10 to-soft-sage/10",
      avatarBg: "from-accent-rose/20 to-[#FAF7F2]",
      progressBg: "bg-soft-sage",
      progressText: "text-soft-sage"
    },
    ocean: {
      bg: "bg-[#F0F6F7]",
      text: "text-[#1C2C30]",
      textMuted: "text-[#1C2C30]/60",
      textMuted70: "text-[#1C2C30]/70",
      textMuted50: "text-[#1C2C30]/50",
      textMuted15: "text-[#1C2C30]/15",
      border: "border-[#1C2C30]/5",
      borderMuted15: "border-[#1C2C30]/15",
      accentBg: "bg-[#2E8B9A]",
      accentText: "text-[#2E8B9A]",
      accentHover: "hover:bg-[#2E8B9A]/95",
      accentBorder: "hover:border-[#2E8B9A]",
      accentBadgeBg: "bg-[#2E8B9A]/10",
      secondaryBg: "bg-[#85BFC7]",
      secondaryText: "text-[#85BFC7]",
      secondaryBadgeBg: "bg-[#85BFC7]/10",
      gradient: "from-[#2E8B9A]/10 to-[#85BFC7]/10",
      avatarBg: "from-[#2E8B9A]/20 to-[#F0F6F7]",
      progressBg: "bg-[#2E8B9A]",
      progressText: "text-[#2E8B9A]"
    },
    sunset: {
      bg: "bg-[#FAF5F0]",
      text: "text-[#33221C]",
      textMuted: "text-[#33221C]/60",
      textMuted70: "text-[#33221C]/70",
      textMuted50: "text-[#33221C]/50",
      textMuted15: "text-[#33221C]/15",
      border: "border-[#33221C]/5",
      borderMuted15: "border-[#33221C]/15",
      accentBg: "bg-[#D97D64]",
      accentText: "text-[#D97D64]",
      accentHover: "hover:bg-[#D97D64]/95",
      accentBorder: "hover:border-[#D97D64]",
      accentBadgeBg: "bg-[#D97D64]/10",
      secondaryBg: "bg-[#E6A08E]",
      secondaryText: "text-[#E6A08E]",
      secondaryBadgeBg: "bg-[#E6A08E]/10",
      gradient: "from-[#D97D64]/10 to-[#E6A08E]/10",
      avatarBg: "from-[#D97D64]/20 to-[#FAF5F0]",
      progressBg: "bg-[#D97D64]",
      progressText: "text-[#D97D64]"
    },
    lavender: {
      bg: "bg-[#FAF7FC]",
      text: "text-[#2B1D30]",
      textMuted: "text-[#2B1D30]/60",
      textMuted70: "text-[#2B1D30]/70",
      textMuted50: "text-[#2B1D30]/50",
      textMuted15: "text-[#2B1D30]/15",
      border: "border-[#2B1D30]/5",
      borderMuted15: "border-[#2B1D30]/15",
      accentBg: "bg-[#967BB6]",
      accentText: "text-[#967BB6]",
      accentHover: "hover:bg-[#967BB6]/95",
      accentBorder: "hover:border-[#967BB6]",
      accentBadgeBg: "bg-[#967BB6]/10",
      secondaryBg: "bg-[#C2B2D6]",
      secondaryText: "text-[#C2B2D6]",
      secondaryBadgeBg: "bg-[#C2B2D6]/10",
      gradient: "from-[#967BB6]/10 to-[#C2B2D6]/10",
      avatarBg: "from-[#967BB6]/20 to-[#FAF7FC]",
      progressBg: "bg-[#967BB6]",
      progressText: "text-[#967BB6]"
    }
  }
  const theme = themes[themeKey] || themes.classic

  // Dynamic Content Interpolation
  const welcomeTitle = (dashboardSettings.welcomeTitle || "Selamat datang, Bunda {name} 🌸").replace("{name}", user.name)
  const welcomeSubtitle = dashboardSettings.welcomeSubtitle || "Semoga sesi latihan hari ini membawa kedamaian dan kebugaran bagi Bunda dan si kecil."
  const platformTitle = dashboardSettings.title || "Vatsalya Flow"

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans`}>
      {/* Header Banner */}
      <header className={`bg-white border-b ${theme.border} sticky top-0 z-30`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold tracking-wide">
              {platformTitle}
            </span>
            <span className="text-lg">🌸</span>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-xs font-semibold ${theme.textMuted} hidden sm:inline`}>
              Bunda {user.name}
            </span>
            <Link
              href="/api/auth/signout"
              className={`p-2 rounded-full border ${theme.borderMuted15} ${theme.textMuted} hover:${theme.accentText} hover:${theme.accentBorder} transition-all focus:outline-none`}
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-8">
        {/* Greetings Panel */}
        <div className={`bg-gradient-to-r ${theme.gradient} rounded-[32px] p-6 md:p-8 border border-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6`}>
          <div className="space-y-2">
            <h1 className="font-serif text-2xl md:text-3xl font-bold">
              {welcomeTitle}
            </h1>
            <p className={`text-xs md:text-sm ${theme.textMuted70}`}>
              {welcomeSubtitle}
            </p>
          </div>
          {/* Profile Card */}
          <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl border border-white shadow-sm flex items-center gap-4 shrink-0">
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${theme.accentBadgeBg} ${theme.accentText} text-xs font-bold uppercase tracking-wider`}>
                Trimester {user.trimester || "?"}
              </span>
              <p className={`text-[10px] ${theme.textMuted50} font-bold uppercase mt-2`}>Bergabung Sejak</p>
              <p className="text-xs font-bold">{joinDate}</p>
            </div>
          </div>
        </div>

        {/* Progress & Last Watched Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Progress Card */}
          <div className={`lg:col-span-4 bg-white rounded-3xl p-6 border ${theme.border} shadow-sm flex flex-col justify-between`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold">Progress Kebugaran</h3>
                <Award className={`w-5 h-5 ${theme.progressText}`} />
              </div>
              <p className={`text-xs ${theme.textMuted} leading-relaxed`}>
                Persentase video latihan yang telah Bunda selesaikan dari seluruh video yang di-assign.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-end">
                <span className={`text-xs font-bold ${theme.textMuted70}`}>
                  {totalWatched} dari {totalAssigned} Selesai
                </span>
                <span className={`text-xl font-bold font-serif ${theme.progressText}`}>{progressPercent}%</span>
              </div>
              <div className={`w-full bg-[#FAF7F2] h-3.5 rounded-full overflow-hidden border ${theme.border} p-0.5`}>
                <div
                  className={`${theme.progressBg} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Continue Watching Card */}
          <div className={`lg:col-span-8 bg-white rounded-3xl p-6 border ${theme.border} shadow-sm flex flex-col md:flex-row items-center gap-6`}>
            {continueVideo ? (
              <>
                <div className={`relative aspect-video w-full md:w-56 rounded-2xl overflow-hidden shrink-0 bg-dark-espresso/5 border ${theme.border}`}>
                  <img
                    src={continueVideo.thumbnail || `https://img.youtube.com/vi/${continueVideo.youtubeId}/hqdefault.jpg`}
                    alt={continueVideo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <div className={`w-10 h-10 rounded-full bg-white ${theme.accentText} flex items-center justify-center shadow-lg`}>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4 w-full flex flex-col justify-between h-full py-1">
                  <div className="space-y-1.5">
                    <span className={`text-[10px] font-bold ${theme.accentText} uppercase tracking-widest`}>
                      Lanjutkan Menonton
                    </span>
                    <h3 className="font-serif text-lg font-bold leading-snug">
                      {continueVideo.title}
                    </h3>
                    <p className={`text-xs ${theme.textMuted} line-clamp-2 leading-relaxed`}>
                      {continueVideo.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className={`text-xs ${theme.textMuted50} font-medium`}>⏱️ {continueVideo.duration || "30 menit"}</span>
                    <Link
                      href={`/watch/${continueVideo.id}`}
                      className={`px-5 py-2.5 ${theme.accentBg} hover:${theme.accentHover} text-white text-xs font-semibold rounded-full shadow-sm transition-all`}
                    >
                      Mulai Belajar
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full text-center py-10 space-y-2">
                <span className="text-2xl">🧘‍♀️🌸</span>
                <h3 className="font-serif text-base font-bold">
                  Belum ada kelas yang di-assign
                </h3>
                <p className={`text-xs ${theme.textMuted} max-w-sm mx-auto`}>
                  Silakan hubungi administrator untuk menentukan trimester dan mengaktifkan program video yoga Anda.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Video Catalog Grid */}
        <div className="space-y-6 pt-4">
          <h3 className={`font-serif text-xl font-bold border-b ${theme.border} pb-3`}>
            Daftar Kelas Video Anda
          </h3>

          <VideoCatalog
            videos={user.videos.filter(uv => uv.video.isPublished).map(uv => uv.video)}
            watchedVideoIds={Array.from(watchedVideoIds)}
            theme={theme}
          />
        </div>
      </main>
    </div>
  )
}
