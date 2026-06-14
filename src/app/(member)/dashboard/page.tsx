import React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Lock, Play, CheckCircle, Award, Calendar, LogOut } from "lucide-react"

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

  // Fetch all published videos to show locked/unlocked
  const allVideos = await prisma.video.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" }
  })

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

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-dark-espresso font-sans">
      {/* Header Banner */}
      <header className="bg-white border-b border-dark-espresso/5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold tracking-wide text-dark-espresso">
              Vatsalya Flow
            </span>
            <span className="text-lg">🌸</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-dark-espresso/60 hidden sm:inline">
              Bunda {user.name}
            </span>
            <Link
              href="/api/auth/signout"
              className="p-2 rounded-full border border-dark-espresso/15 text-dark-espresso/60 hover:text-accent-rose hover:border-accent-rose transition-all focus:outline-none"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-8">
        {/* Greetings Panel */}
        <div className="bg-gradient-to-r from-accent-rose/10 to-soft-sage/10 rounded-[32px] p-6 md:p-8 border border-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-dark-espresso">
              Selamat datang, Bunda {user.name} 🌸
            </h1>
            <p className="text-xs md:text-sm text-dark-espresso/70">
              Semoga sesi latihan hari ini membawa kedamaian dan kebugaran bagi Bunda dan si kecil.
            </p>
          </div>
          {/* Profile Card */}
          <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl border border-white shadow-sm flex items-center gap-4 shrink-0">
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-accent-rose/10 text-accent-rose text-xs font-bold uppercase tracking-wider">
                Trimester {user.trimester || "?"}
              </span>
              <p className="text-[10px] text-dark-espresso/50 font-bold uppercase mt-2">Bergabung Sejak</p>
              <p className="text-xs font-bold text-dark-espresso">{joinDate}</p>
            </div>
          </div>
        </div>

        {/* Progress & Last Watched Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Progress Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-dark-espresso/5 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-dark-espresso">Progress Kebugaran</h3>
                <Award className="w-5 h-5 text-soft-sage" />
              </div>
              <p className="text-xs text-dark-espresso/60 leading-relaxed">
                Persentase video latihan yang telah Bunda selesaikan dari seluruh video yang di-assign.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-dark-espresso/70">
                  {totalWatched} dari {totalAssigned} Selesai
                </span>
                <span className="text-xl font-bold font-serif text-soft-sage">{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#FAF7F2] h-3.5 rounded-full overflow-hidden border border-dark-espresso/5 p-0.5">
                <div
                  className="bg-soft-sage h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Continue Watching Card */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-dark-espresso/5 shadow-sm flex flex-col md:flex-row items-center gap-6">
            {continueVideo ? (
              <>
                <div className="relative aspect-video w-full md:w-56 rounded-2xl overflow-hidden shrink-0 bg-dark-espresso/5 border border-dark-espresso/5">
                  <img
                    src={continueVideo.thumbnail || `https://img.youtube.com/vi/${continueVideo.youtubeId}/hqdefault.jpg`}
                    alt={continueVideo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-dark-espresso/25 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white text-accent-rose flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4 w-full flex flex-col justify-between h-full py-1">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-accent-rose uppercase tracking-widest">
                      Lanjutkan Menonton
                    </span>
                    <h3 className="font-serif text-lg font-bold text-dark-espresso leading-snug">
                      {continueVideo.title}
                    </h3>
                    <p className="text-xs text-dark-espresso/60 line-clamp-2 leading-relaxed">
                      {continueVideo.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-dark-espresso/50 font-medium">⏱️ {continueVideo.duration || "30 menit"}</span>
                    <Link
                      href={`/watch/${continueVideo.id}`}
                      className="px-5 py-2.5 bg-accent-rose hover:bg-accent-rose/95 text-white text-xs font-semibold rounded-full shadow-sm transition-all"
                    >
                      Mulai Belajar
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full text-center py-10 space-y-2">
                <span className="text-2xl">🧘‍♀️🌸</span>
                <h3 className="font-serif text-base font-bold text-dark-espresso">
                  Belum ada kelas yang di-assign
                </h3>
                <p className="text-xs text-dark-espresso/60 max-w-sm mx-auto">
                  Silakan hubungi administrator untuk menentukan trimester dan mengaktifkan program video yoga Anda.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Video Catalog Grid */}
        <div className="space-y-6 pt-4">
          <h3 className="font-serif text-xl font-bold text-dark-espresso border-b border-dark-espresso/5 pb-3">
            Daftar Kelas Video Anda
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allVideos.map((video) => {
              const isAssigned = assignedVideoIds.has(video.id)
              const isWatched = watchedVideoIds.has(video.id)

              return (
                <div
                  key={video.id}
                  className={`rounded-3xl border overflow-hidden shadow-sm transition-all duration-300 bg-white ${
                    isAssigned
                      ? "border-dark-espresso/5 hover:shadow-md hover:border-accent-rose/20"
                      : "border-dark-espresso/5 opacity-70 select-none"
                  }`}
                >
                  {/* Thumbnail / Header */}
                  <div className="relative aspect-video bg-dark-espresso/5">
                    <img
                      src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />

                    {!isAssigned ? (
                      // Locked Overlay
                      <div className="absolute inset-0 bg-dark-espresso/45 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-semibold tracking-wide uppercase">Belum Di-Assign</span>
                      </div>
                    ) : (
                      // Play/Hover Overlay
                      <Link
                        href={`/watch/${video.id}`}
                        className="absolute inset-0 bg-dark-espresso/0 hover:bg-dark-espresso/20 flex items-center justify-center transition-colors group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full bg-white text-accent-rose flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </Link>
                    )}

                    {/* Category Label */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[9px] font-bold text-dark-espresso uppercase tracking-wider shadow-sm">
                        {video.category.replace("-", " ")}
                      </span>
                    </div>

                    {/* Watched tag */}
                    {isAssigned && isWatched && (
                      <div className="absolute top-3 right-3 bg-soft-sage text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm">
                        <CheckCircle className="w-3 h-3" /> Sudah Ditonton
                      </div>
                    )}
                  </div>

                  {/* Body details */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-serif text-base font-bold text-dark-espresso leading-snug line-clamp-1">
                        {video.title}
                      </h4>
                      <p className="text-xs text-dark-espresso/60 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-dark-espresso/5 text-xs">
                      <span className="text-dark-espresso/50 font-medium">⏱️ {video.duration || "30 menit"}</span>
                      {isAssigned ? (
                        <Link
                          href={`/watch/${video.id}`}
                          className="font-bold text-accent-rose hover:text-accent-rose/80 transition-colors flex items-center gap-1"
                        >
                          Mulai Belajar
                        </Link>
                      ) : (
                        <span className="text-dark-espresso/40 font-medium flex items-center gap-1">
                          Terkunci
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
