"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Play, CheckCircle, Search, Filter } from "lucide-react"

interface Video {
  id: string
  title: string
  description: string | null
  youtubeId: string
  category: string
  duration: string | null
  thumbnail: string | null
  isPublished: boolean
  order: number
}

interface VideoCatalogProps {
  videos: Video[]
  watchedVideoIds: string[]
  theme: {
    text: string
    textMuted: string
    textMuted50: string
    border: string
    accentText: string
    accentBg: string
    progressBg: string
  }
}

export default function VideoCatalog({ videos, watchedVideoIds, theme }: VideoCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const watchedSet = new Set(watchedVideoIds)

  // Get unique categories from assigned videos
  const categories = ["all", ...Array.from(new Set(videos.map((v) => v.category)))]

  // Filter videos based on category and search query
  const filteredVideos = videos.filter((video) => {
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getCategoryLabel = (cat: string) => {
    if (cat === "all") return "Semua Kelas"
    return cat.replace("-", " ")
  }

  return (
    <div className="space-y-8">
      {/* Search and Category Filter Panel */}
      <div className="bg-white p-5 rounded-3xl border border-dark-espresso/5 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-dark-espresso/45 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all focus:outline-none ${
                    isActive
                      ? `${theme.accentBg} text-white shadow-sm`
                      : "bg-[#FAF7F2] text-dark-espresso/70 hover:bg-dark-espresso/5"
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              )
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-espresso/40" />
            <input
              type="text"
              placeholder="Cari kelas yoga..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-dark-espresso/10 rounded-2xl text-xs bg-[#FAF7F2]/50 focus:outline-none focus:ring-2 focus:ring-accent-rose/30 focus:border-accent-rose transition-all"
            />
          </div>

        </div>
      </div>

      {/* Video Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((video) => {
            const isWatched = watchedSet.has(video.id)

            return (
              <div
                key={video.id}
                className="rounded-3xl border border-dark-espresso/5 overflow-hidden shadow-sm transition-all duration-300 bg-white hover:shadow-md"
              >
                {/* Thumbnail / Header */}
                <div className="relative aspect-video bg-dark-espresso/5">
                  <img
                    src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Play/Hover Overlay */}
                  <Link
                    href={`/watch/${video.id}`}
                    className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center transition-colors group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-white text-accent-rose flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </Link>

                  {/* Category Label */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[9px] font-bold uppercase tracking-wider shadow-sm">
                      {video.category.replace("-", " ")}
                    </span>
                  </div>

                  {/* Watched tag */}
                  {isWatched && (
                    <div className={`absolute top-3 right-3 ${theme.progressBg} text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm`}>
                      <CheckCircle className="w-3 h-3" /> Sudah Ditonton
                    </div>
                  )}
                </div>

                {/* Body details */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-serif text-base font-bold leading-snug line-clamp-1">
                      {video.title}
                    </h4>
                    <p className={`text-xs ${theme.textMuted} line-clamp-2 leading-relaxed`}>
                      {video.description}
                    </p>
                  </div>
                  
                  <div className={`flex justify-between items-center pt-2 border-t ${theme.border} text-xs`}>
                    <span className={`${theme.textMuted50} font-medium`}>⏱️ {video.duration || "30 menit"}</span>
                    <Link
                      href={`/watch/${video.id}`}
                      className={`font-bold ${theme.accentText} hover:opacity-85 transition-colors flex items-center gap-1`}
                    >
                      Mulai Belajar
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-dark-espresso/5 shadow-sm space-y-2">
          <span className="text-2xl">🧘‍♀️🌸</span>
          <h3 className="font-serif text-base font-bold">Tidak Ada Video Ditemukan</h3>
          <p className="text-xs text-dark-espresso/50 max-w-sm mx-auto">
            Tidak ada video latihan yoga yang cocok dengan filter atau pencarian Anda saat ini.
          </p>
        </div>
      )}
    </div>
  )
}
