import React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ArrowLeft, Lock } from "lucide-react"
import WatchControls from "@/components/member/WatchControls"

export const dynamic = "force-dynamic"

interface PageProps {
  params: {
    slug: string
  }
}

export default async function WatchPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "MEMBER") {
    redirect("/login")
  }

  const videoId = params.slug

  // Verify that this video is assigned to the current user
  const userVideo = await prisma.userVideo.findUnique({
    where: {
      userId_videoId: {
        userId: session.user.id,
        videoId: videoId,
      },
    },
    include: {
      video: true,
    },
  })

  // If not assigned, show access denied
  if (!userVideo) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-dark-espresso flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-dark-espresso/5 shadow-lg text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-accent-rose/10 text-accent-rose flex items-center justify-center mx-auto border border-accent-rose/25">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold">Akses Terkunci</h2>
            <p className="text-xs text-dark-espresso/60 leading-relaxed">
              Bunda belum memiliki akses ke video latihan ini. Silakan hubungi admin atau buka video lain yang di-assign untuk Bunda.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center w-full py-3 bg-accent-rose hover:bg-accent-rose/95 text-white text-xs font-semibold rounded-full shadow-sm transition-all"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const { video, watchedAt } = userVideo
  const isWatched = watchedAt !== null

  // Recommended next video: another assigned video that is NOT watched yet
  const otherAssignedVideos = await prisma.userVideo.findMany({
    where: {
      userId: session.user.id,
      videoId: { not: videoId },
    },
    include: {
      video: true,
    },
    take: 3,
  })

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-dark-espresso font-sans pb-16">
      {/* Top Header */}
      <header className="bg-white border-b border-dark-espresso/5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-dark-espresso/60 hover:text-accent-rose transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
          <span className="text-[10px] font-bold text-accent-rose uppercase tracking-widest bg-accent-rose/10 px-3 py-1 rounded-full">
            {video.category.replace("-", " ")}
          </span>
        </div>
      </header>

      {/* Main Watch Layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Player & Info */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Iframe Video Player Container */}
          <div className="aspect-video rounded-3xl overflow-hidden shadow-xl bg-black border border-dark-espresso/5">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Interactive controls */}
          <WatchControls videoId={video.id} initialWatched={isWatched} />

          {/* Video description card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-dark-espresso/5 shadow-sm space-y-4">
            <h1 className="font-serif text-xl md:text-2xl font-bold text-dark-espresso leading-snug">
              {video.title}
            </h1>
            <div className="flex gap-4 text-[10px] sm:text-xs text-dark-espresso/50 border-y border-dark-espresso/5 py-2.5">
              <span>Kategori: <strong className="uppercase">{video.category.replace("-", " ")}</strong></span>
              <span>•</span>
              <span>Durasi: <strong>{video.duration || "30 menit"}</strong></span>
            </div>
            <div className="space-y-4 text-xs md:text-sm text-dark-espresso/70 leading-relaxed font-sans">
              {video.description ? (
                <p className="whitespace-pre-line">{video.description}</p>
              ) : (
                <p className="italic text-dark-espresso/45">Tidak ada deskripsi untuk video latihan ini.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Recommended / Playlist */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-dark-espresso/5 shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-dark-espresso border-b border-dark-espresso/5 pb-3">
              Rekomendasi Kelas Lainnya
            </h3>

            {otherAssignedVideos.length > 0 ? (
              <div className="space-y-4">
                {otherAssignedVideos.map((uv) => (
                  <Link
                    key={uv.video.id}
                    href={`/watch/${uv.video.id}`}
                    className="flex gap-4 group hover:bg-[#FAF7F2] p-2.5 rounded-2xl transition-all border border-transparent hover:border-dark-espresso/5"
                  >
                    <div className="relative aspect-video w-24 rounded-lg overflow-hidden shrink-0 bg-dark-espresso/5 border border-dark-espresso/5">
                      <img
                        src={uv.video.thumbnail || `https://img.youtube.com/vi/${uv.video.youtubeId}/hqdefault.jpg`}
                        alt={uv.video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-center">
                      <h4 className="text-xs font-bold text-dark-espresso group-hover:text-accent-rose transition-colors line-clamp-1 leading-snug">
                        {uv.video.title}
                      </h4>
                      <p className="text-[10px] text-dark-espresso/50">⏱️ {uv.video.duration || "30 mnt"}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-dark-espresso/40 italic py-4 text-center">
                Belum ada rekomendasi kelas lainnya.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
