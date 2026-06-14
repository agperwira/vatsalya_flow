"use client"

import React, { useState, useEffect } from "react"
import { Search, Loader2, Link2, CheckSquare, Square, Check } from "lucide-react"
import { useToast } from "@/components/providers"
import { useRouter, useSearchParams } from "next/navigation"

interface UserItem {
  id: string
  name: string
  email: string
  trimester: number | null
  videos: { videoId: string }[]
}

interface VideoItem {
  id: string
  title: string
  category: string
}

interface AssignClientProps {
  users: UserItem[]
  videos: VideoItem[]
}

export default function AssignClient({ users, videos }: AssignClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // Search state
  const [userSearch, setUserSearch] = useState("")
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Pre-select user from query params if available
  useEffect(() => {
    const userIdParam = searchParams.get("userId")
    if (userIdParam) {
      const exists = users.some(u => u.id === userIdParam)
      if (exists) {
        setSelectedUserIds([userIdParam])
      }
    }
  }, [searchParams, users])

  // When selected users change, if it is exactly ONE user, pre-fill their current video assignments!
  useEffect(() => {
    if (selectedUserIds.length === 1) {
      const user = users.find(u => u.id === selectedUserIds[0])
      if (user) {
        setSelectedVideoIds(user.videos.map(v => v.videoId))
      }
    } else if (selectedUserIds.length === 0) {
      setSelectedVideoIds([])
    }
  }, [selectedUserIds, users])

  // Filtered users list
  const filteredUsers = users.filter(
    u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  // Group videos by category
  const categories = Array.from(new Set(videos.map(v => v.category)))

  const handleVideoCheck = (videoId: string, checked: boolean) => {
    if (checked) {
      setSelectedVideoIds(prev => [...prev, videoId])
    } else {
      setSelectedVideoIds(prev => prev.filter(id => id !== videoId))
    }
  }

  // Bulk assign all videos under a certain category
  const handleBulkCheckCategory = (category: string) => {
    const categoryVideoIds = videos.filter(v => v.category === category).map(v => v.id)
    
    // Check if ALL are already checked
    const allChecked = categoryVideoIds.every(id => selectedVideoIds.includes(id))

    if (allChecked) {
      // Uncheck all in category
      setSelectedVideoIds(prev => prev.filter(id => !categoryVideoIds.includes(id)))
      toast(`Video ${category.replace("-", " ")} dibatalkan assignment-nya`, "info")
    } else {
      // Check all in category (avoid duplicates)
      setSelectedVideoIds(prev => Array.from(new Set([...prev, ...categoryVideoIds])))
      toast(`Seluruh video ${category.replace("-", " ")} dipilih`, "success")
    }
  }

  // Handle Save
  const handleSaveAssignments = async () => {
    if (selectedUserIds.length === 0) {
      toast("Pilih minimal 1 member terlebih dahulu.", "error")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: selectedUserIds,
          videoIds: selectedVideoIds,
        }),
      })

      if (!response.ok) {
        throw new Error("Gagal menyimpan data assignment")
      }

      toast(`Sukses memperbarui assignment video untuk ${selectedUserIds.length} member! 🌸`, "success")
      router.refresh()
    } catch (error: any) {
      toast(error.message || "Gagal menyimpan.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleSelectUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(prev => prev.filter(id => id !== userId))
    } else {
      setSelectedUserIds(prev => [...prev, userId])
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-dark-espresso">Assign Video Latihan</h1>
          <p className="text-xs text-dark-espresso/60 mt-1">
            Hubungkan materi video latihan ke satu member atau banyak member secara massal.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Select Member */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-dark-espresso/5 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-dark-espresso pb-2 border-b border-dark-espresso/5">
            1. Pilih Member ({selectedUserIds.length} terpilih)
          </h3>

          {/* Search Member */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-espresso/40" />
            <input
              type="text"
              placeholder="Cari member berdasarkan nama..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none focus:border-accent-rose"
            />
          </div>

          {/* Member Checklist Grid */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-dark-espresso/5 pr-1 space-y-1">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => {
                const isChecked = selectedUserIds.includes(u.id)
                return (
                  <button
                    key={u.id}
                    onClick={() => handleToggleSelectUser(u.id)}
                    className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all ${
                      isChecked
                        ? "bg-accent-rose/10 text-accent-rose font-bold"
                        : "hover:bg-dark-espresso/5 text-dark-espresso/80"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold leading-tight">{u.name}</p>
                      <p className="text-[10px] text-dark-espresso/50 font-normal">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white border rounded">
                        T-{u.trimester || "?"}
                      </span>
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-accent-rose shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-dark-espresso/20 shrink-0" />
                      )}
                    </div>
                  </button>
                )
              })
            ) : (
              <p className="text-xs text-dark-espresso/40 italic py-6 text-center">
                Member tidak ditemukan.
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Video Checklist */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-dark-espresso/5 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-dark-espresso/5">
            <h3 className="font-serif text-base font-bold text-dark-espresso">
              2. Checklist Video Pembelajaran
            </h3>
            
            {/* Save Button */}
            <button
              onClick={handleSaveAssignments}
              disabled={isLoading || selectedUserIds.length === 0}
              className="px-5 py-2.5 bg-soft-sage hover:bg-soft-sage/95 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5 transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  Simpan Assignment
                </>
              )}
            </button>
          </div>

          {/* Videos Checklist Grouped by Category */}
          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-1">
            {categories.map((category) => {
              const categoryVideos = videos.filter(v => v.category === category)
              const allCategoryChecked = categoryVideos.every(v => selectedVideoIds.includes(v.id))

              return (
                <div key={category} className="space-y-3 bg-[#FAF7F2]/60 p-4 rounded-2xl border border-dark-espresso/5">
                  {/* Category Header with bulk trigger */}
                  <div className="flex justify-between items-center border-b border-dark-espresso/5 pb-2">
                    <span className="text-[10px] font-bold text-dark-espresso/70 uppercase tracking-widest">
                      📂 {category.replace("-", " ")}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleBulkCheckCategory(category)}
                      className={`text-[9px] font-bold px-2 py-1 rounded transition-colors ${
                        allCategoryChecked
                          ? "bg-accent-rose text-white"
                          : "bg-white text-dark-espresso/60 hover:bg-accent-rose hover:text-white"
                      }`}
                    >
                      {allCategoryChecked ? "Batal Pilih Semua" : `Pilih Semua ${category.replace("-", " ")}`}
                    </button>
                  </div>

                  {/* Video Items Checklist */}
                  <div className="space-y-2.5">
                    {categoryVideos.map((video) => {
                      const isChecked = selectedVideoIds.includes(video.id)
                      return (
                        <label
                          key={video.id}
                          className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? "bg-white border-accent-rose/30 shadow-sm"
                              : "bg-white/50 border-transparent hover:bg-white"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleVideoCheck(video.id, e.target.checked)}
                            className="rounded text-accent-rose focus:ring-accent-rose mt-0.5 shrink-0"
                          />
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-dark-espresso leading-tight">{video.title}</p>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
