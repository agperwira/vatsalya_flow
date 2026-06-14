"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/providers"

interface WatchControlsProps {
  videoId: string
  initialWatched: boolean
}

export default function WatchControls({ videoId, initialWatched }: WatchControlsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isWatched, setIsWatched] = useState(initialWatched)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleWatched = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/member/watch/${videoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ watched: !isWatched }),
      })

      if (!response.ok) {
        throw new Error("Gagal memperbarui status menonton")
      }

      setIsWatched(!isWatched)
      toast(
        !isWatched
          ? "Selamat! Sesi video telah diselesaikan 🌸"
          : "Status menonton telah dibatalkan",
        "success"
      )
      router.refresh()
    } catch (error) {
      toast("Gagal menyimpan progress belajar Bunda.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-dark-espresso/5 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
            isWatched ? "bg-soft-sage/10 text-soft-sage" : "bg-dark-espresso/5 text-dark-espresso/30"
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-dark-espresso">
            {isWatched ? "Sesi Telah Selesai" : "Tandai Selesai Belajar"}
          </h4>
          <p className="text-[10px] text-dark-espresso/50">
            {isWatched ? "Bunda telah menyelesaikan kelas ini" : "Klik tombol di samping jika Bunda telah menyelesaikan sesi"}
          </p>
        </div>
      </div>

      <button
        onClick={handleToggleWatched}
        disabled={isLoading}
        className={`px-6 py-3 rounded-full text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 focus:outline-none ${
          isWatched
            ? "bg-white text-dark-espresso/70 border border-dark-espresso/15 hover:bg-dark-espresso/5"
            : "bg-soft-sage hover:bg-soft-sage/95 text-white"
        }`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isWatched ? (
          "Batalkan Selesai"
        ) : (
          "Tandai Sudah Ditonton"
        )}
      </button>
    </div>
  )
}
