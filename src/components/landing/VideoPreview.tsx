"use client"

import React, { useState } from "react"
import { Play } from "lucide-react"
import { siteConfig } from "@/config/content"

export default function VideoPreview({ content }: { content?: typeof siteConfig.videoPreview }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const data = content || siteConfig.videoPreview
  const youtubeId = data.youtubeId

  return (
    <section className="py-20 bg-[#FAF7F2] relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        {/* Text Header */}
        <div className="space-y-4 mb-10">
          <span className="text-xs font-bold tracking-widest text-accent-rose uppercase">
            {data.subtitle}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-espresso">
            {data.title}
          </h2>
          <p className="text-sm md:text-base text-dark-espresso/60 max-w-xl mx-auto">
            {data.description}
          </p>
        </div>

        {/* Video Player Box */}
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-dark-espresso/10">
          {isPlaying ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              title="Vatsalya Yoga Prenatal Class Preview"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full group">
              {/* Cover Image */}
              <img
                src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                onError={(e) => {
                  // Fallback if maxresdefault doesn't exist
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                }}
                alt="Video Preview Thumbnail"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-dark-espresso/20 group-hover:bg-dark-espresso/30 transition-colors" />

              {/* Pulsing Play Button */}
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 m-auto w-16 h-16 md:w-20 md:h-20 rounded-full bg-white text-accent-rose flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none"
              >
                <Play className="w-6 h-6 md:w-8 md:h-8 fill-current ml-1" />
              </button>

              {/* Tiny Badge */}
              <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold text-dark-espresso tracking-wide uppercase">
                ⏱️ 5 Menit Demo Latihan
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
