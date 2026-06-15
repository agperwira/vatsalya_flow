import React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { 
  ArrowLeft, 
  Calendar, 
  Mail, 
  Phone, 
  Video, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ExternalLink,
  Settings,
  Heart
} from "lucide-react"

interface PageProps {
  params: {
    id: string
  }
}

export const dynamic = "force-dynamic"

export default async function MemberDetailPage({ params }: PageProps) {
  const user = await prisma.user.findFirst({
    where: {
      id: params.id,
      role: "MEMBER",
    },
    include: {
      videos: {
        include: {
          video: true,
        },
        orderBy: {
          assignedAt: "desc"
        }
      },
    },
  })

  if (!user) {
    notFound()
  }

  const totalAssigned = user.videos.length
  const watchedVideos = user.videos.filter(v => v.watchedAt !== null)
  const totalWatched = watchedVideos.length
  const completionPercentage = totalAssigned > 0 ? Math.round((totalWatched / totalAssigned) * 100) : 0

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-xs font-semibold text-dark-espresso/60 hover:text-accent-rose transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Member
          </Link>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-dark-espresso flex items-center gap-2">
            Detail Member <Heart className="w-6 h-6 text-accent-rose fill-accent-rose/20" />
          </h1>
          <p className="text-xs text-dark-espresso/60">
            Lihat informasi lengkap profil member dan log aktivitas latihan yoga mereka.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href={`/admin/assign?userId=${user.id}`}
            className="flex-1 sm:flex-initial text-center px-5 py-3 bg-accent-rose hover:bg-accent-rose/95 text-white text-xs font-semibold rounded-full shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <Video className="w-4 h-4" />
            Kelola Assignment Video
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Card & Progress summary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Profile Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-dark-espresso/5 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-accent-rose/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-soft-sage/5 blur-3xl pointer-events-none" />
            
            {/* Avatar & Basic Info */}
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent-rose/20 to-[#FAF7F2] text-accent-rose font-bold font-serif text-2xl flex items-center justify-center border border-accent-rose/10">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-dark-espresso">{user.name}</h3>
                <div className="flex gap-2 items-center mt-1">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-accent-rose/10 text-accent-rose text-[10px] font-bold">
                    Trimester {user.trimester || "?"}
                  </span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${
                      user.isActive
                        ? "bg-soft-sage/10 text-soft-sage"
                        : "bg-accent-rose/10 text-accent-rose"
                    }`}
                  >
                    {user.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-4 pt-4 border-t border-dark-espresso/5 text-xs text-dark-espresso/80 relative z-10">
              {/* Email */}
              <div className="flex items-center gap-3 py-1.5">
                <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-dark-espresso/50 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-dark-espresso/45 uppercase tracking-wider">Email</p>
                  <p className="font-semibold truncate">{user.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 py-1.5">
                <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-dark-espresso/50 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-dark-espresso/45 uppercase tracking-wider">WhatsApp</p>
                  <p className="font-semibold truncate">{user.phone || "-"}</p>
                </div>
                {user.phone && (
                  <a
                    href={`https://wa.me/${user.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-soft-sage hover:bg-soft-sage/95 text-white rounded-full transition-all"
                    title="Hubungi via WhatsApp"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Join Date */}
              <div className="flex items-center gap-3 py-1.5">
                <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] text-dark-espresso/50 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-dark-espresso/45 uppercase tracking-wider">Tanggal Bergabung</p>
                  <p className="font-semibold">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Summary Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-dark-espresso/5 shadow-sm space-y-6">
            <h4 className="font-serif text-sm font-bold text-dark-espresso pb-2 border-b border-dark-espresso/5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-rose" /> Ringkasan Latihan
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FAF7F2]/50 p-4 rounded-2xl border border-dark-espresso/5">
                <p className="text-[10px] font-bold text-dark-espresso/55 uppercase tracking-wider">Assigned</p>
                <p className="text-2xl font-serif font-bold text-dark-espresso mt-1">{totalAssigned} <span className="text-xs font-sans font-normal text-dark-espresso/50">video</span></p>
              </div>
              <div className="bg-[#FAF7F2]/50 p-4 rounded-2xl border border-dark-espresso/5">
                <p className="text-[10px] font-bold text-dark-espresso/55 uppercase tracking-wider">Ditonton</p>
                <p className="text-2xl font-serif font-bold text-soft-sage mt-1">{totalWatched} <span className="text-xs font-sans font-normal text-dark-espresso/50">video</span></p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-dark-espresso/60">Persentase Selesai</span>
                <span className="font-bold text-accent-rose">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-dark-espresso/5 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-accent-rose h-full rounded-full transition-all duration-500" 
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Assigned Videos List */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-dark-espresso/5 shadow-sm space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-dark-espresso">Daftar Video & Progress</h3>
            <p className="text-xs text-dark-espresso/60 mt-1">Daftar semua video yang ditugaskan ke member ini beserta status tontonnya.</p>
          </div>

          <div className="space-y-4">
            {user.videos.length > 0 ? (
              user.videos.map((uv) => {
                const isWatched = uv.watchedAt !== null
                return (
                  <div 
                    key={uv.id} 
                    className="p-4 rounded-2xl border border-dark-espresso/5 hover:border-dark-espresso/15 transition-all bg-white flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                  >
                    {/* Video Thumbnail (or icon placeholder) */}
                    <div className="w-full sm:w-28 aspect-video rounded-xl bg-gradient-to-tr from-[#FAF7F2] to-dark-espresso/5 border border-dark-espresso/5 flex items-center justify-center shrink-0 relative overflow-hidden group">
                      {uv.video.youtubeId ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={`https://img.youtube.com/vi/${uv.video.youtubeId}/mqdefault.jpg`} 
                            alt={uv.video.title} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                        </>
                      ) : (
                        <Video className="w-6 h-6 text-dark-espresso/30" />
                      )}
                      
                      {uv.video.duration && (
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {uv.video.duration}
                        </span>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-block px-2 py-0.5 rounded bg-accent-rose/5 text-accent-rose text-[9px] font-bold uppercase tracking-wider">
                          {uv.video.category.replace("-", " ")}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-dark-espresso leading-snug">{uv.video.title}</h4>
                      <p className="text-[10px] text-dark-espresso/50">
                        Ditugaskan: {new Date(uv.assignedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </p>
                    </div>

                    {/* Watched Status */}
                    <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-dark-espresso/5 flex items-center justify-end">
                      {isWatched ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-soft-sage/10 text-soft-sage rounded-full text-[10px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Selesai Ditonton</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-espresso/5 text-dark-espresso/40 rounded-full text-[10px] font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Belum Ditonton</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12 border border-dashed border-dark-espresso/10 rounded-2xl">
                <Video className="w-8 h-8 text-dark-espresso/25 mx-auto mb-2" />
                <p className="text-xs text-dark-espresso/40 italic">Belum ada video yang ditugaskan untuk member ini.</p>
                <Link
                  href={`/admin/assign?userId=${user.id}`}
                  className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-accent-rose hover:underline"
                >
                  Tugaskan Video Pertama →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
