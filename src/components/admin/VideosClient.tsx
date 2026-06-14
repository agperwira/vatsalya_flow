"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Plus,
  Edit,
  Trash2,
  LayoutGrid,
  List,
  Eye,
  EyeOff,
  Loader2,
  X,
  Play,
  ArrowUp,
  ArrowDown,
  Video
} from "lucide-react"
import { useToast } from "@/components/providers"
import { useRouter } from "next/navigation"

interface VideoWithUserCount {
  id: string
  title: string
  description: string | null
  youtubeId: string
  category: string
  duration: string | null
  thumbnail: string | null
  isPublished: boolean
  order: number
  createdAt: Date
  _count?: {
    users: number
  }
}

interface VideosClientProps {
  initialVideos: VideoWithUserCount[]
}

const videoSchema = z.object({
  title: z.string().min(2, "Judul video minimal 2 karakter"),
  youtubeId: z.string().min(11, "YouTube ID minimal 11 karakter").max(11, "YouTube ID maksimal 11 karakter"),
  description: z.string().optional(),
  category: z.string().min(1, "Kategori wajib dipilih"),
  duration: z.string().min(1, "Durasi wajib diisi (misal: 45 menit)"),
  order: z.number().int().min(0),
  isPublished: z.boolean(),
})

type VideoFormValues = z.infer<typeof videoSchema>

export default function VideosClient({ initialVideos }: VideosClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  const [videos, setVideos] = useState<VideoWithUserCount[]>(initialVideos)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(false)
  
  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [activeVideo, setActiveVideo] = useState<VideoWithUserCount | null>(null)

  // Forms
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    watch: watchAdd,
    setValue: setAddValue,
    reset: resetAdd,
    formState: { errors: addErrors },
  } = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      youtubeId: "",
      description: "",
      category: "trimester-1",
      duration: "30 menit",
      order: 0,
      isPublished: true,
    },
  })

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    watch: watchEdit,
    setValue: setEditValue,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
  })

  const addYoutubeId = watchAdd("youtubeId")
  const editYoutubeId = watchEdit("youtubeId")

  // Sync Thumbnail when YoutubeId changes
  const getThumbnailUrl = (id: string) => {
    if (!id || id.length !== 11) return ""
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
  }

  // Handle Add submit
  const onAddSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          thumbnail: getThumbnailUrl(data.youtubeId),
        }),
      })

      if (!response.ok) {
        throw new Error("Gagal menambahkan video")
      }

      toast("Video baru berhasil ditambahkan! 🎬", "success")
      setIsAddOpen(false)
      resetAdd()
      router.refresh()

      // Refresh state list
      const fetchList = await fetch("/api/admin/videos")
      if (fetchList.ok) {
        const freshList = await fetchList.json()
        setVideos(freshList)
      }
    } catch (error: any) {
      toast(error.message || "Gagal menyimpan video.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Edit Click
  const openEditModal = (video: VideoWithUserCount) => {
    setActiveVideo(video)
    resetEdit({
      title: video.title,
      youtubeId: video.youtubeId,
      description: video.description || "",
      category: video.category,
      duration: video.duration || "",
      order: video.order,
      isPublished: video.isPublished,
    })
    setIsEditOpen(true)
  }

  // Handle Edit submit
  const onEditSubmit = async (data: any) => {
    if (!activeVideo) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/videos/${activeVideo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          thumbnail: getThumbnailUrl(data.youtubeId),
        }),
      })

      if (!response.ok) {
        throw new Error("Gagal memperbarui video")
      }

      toast("Video berhasil diperbarui 🌸", "success")
      setIsEditOpen(false)
      router.refresh()

      const fetchList = await fetch("/api/admin/videos")
      if (fetchList.ok) {
        const freshList = await fetchList.json()
        setVideos(freshList)
      }
    } catch (error: any) {
      toast(error.message || "Gagal menyimpan.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Delete video
  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus video ini secara permanen? Seluruh record assignment user ke video ini juga akan terhapus.")) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Gagal menghapus video")
      }

      toast("Video berhasil dihapus permanen.", "success")
      setIsEditOpen(false)
      router.refresh()

      const fetchList = await fetch("/api/admin/videos")
      if (fetchList.ok) {
        const freshList = await fetchList.json()
        setVideos(freshList)
      }
    } catch (error: any) {
      toast(error.message || "Gagal menghapus.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Change video status (publish / draft)
  const handleTogglePublish = async (video: VideoWithUserCount) => {
    try {
      const response = await fetch(`/api/admin/videos/${video.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPublished: !video.isPublished,
        }),
      })

      if (!response.ok) {
        throw new Error("Gagal mengubah status publikasi")
      }

      toast(
        !video.isPublished ? "Video berhasil dipublikasikan! 🔓" : "Video diubah ke draf. 🔒",
        "success"
      )
      router.refresh()

      const fetchList = await fetch("/api/admin/videos")
      if (fetchList.ok) {
        const freshList = await fetchList.json()
        setVideos(freshList)
      }
    } catch (error: any) {
      toast(error.message || "Gagal memperbarui status.", "error")
    }
  }

  // Change video order
  const handleOrderChange = async (video: VideoWithUserCount, direction: "up" | "down") => {
    const newOrder = direction === "up" ? Math.max(0, video.order - 1) : video.order + 1
    try {
      const response = await fetch(`/api/admin/videos/${video.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: newOrder,
        }),
      })

      if (response.ok) {
        router.refresh()
        const fetchList = await fetch("/api/admin/videos")
        if (fetchList.ok) {
          const freshList = await fetchList.json()
          setVideos(freshList)
        }
      }
    } catch (error) {
      toast("Gagal merubah urutan video.", "error")
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-dark-espresso">Kelola Video</h1>
          <p className="text-xs text-dark-espresso/60 mt-1">Daftarkan video YouTube prenatal baru, atur urutan tampil, dan publikasikan kelas.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* View Mode Toggle */}
          <div className="bg-white border border-dark-espresso/10 p-1 rounded-xl flex shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-accent-rose/10 text-accent-rose" : "text-dark-espresso/50 hover:text-dark-espresso"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-accent-rose/10 text-accent-rose" : "text-dark-espresso/50 hover:text-dark-espresso"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex-grow sm:flex-grow-0 px-5 py-3 bg-accent-rose hover:bg-accent-rose/95 text-white text-xs font-semibold rounded-full shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah Video Baru
          </button>
        </div>
      </div>

      {/* Grid Mode View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-3xl border border-dark-espresso/5 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                {/* Image & Badges */}
                <div className="relative aspect-video bg-dark-espresso/5 border-b border-dark-espresso/5">
                  <img
                    src={video.thumbnail || getThumbnailUrl(video.youtubeId)}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay for Draft state */}
                  {!video.isPublished && (
                    <div className="absolute inset-0 bg-dark-espresso/40 backdrop-blur-[1px] flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">
                      🔏 Status: Draf
                    </div>
                  )}

                  {/* Category badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[9px] font-bold text-dark-espresso uppercase tracking-wider shadow-sm">
                    {video.category.replace("-", " ")}
                  </div>
                  
                  {/* Order indicator */}
                  <div className="absolute bottom-3 right-3 bg-dark-espresso/80 text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    Urutan: {video.order}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-serif text-base font-bold text-dark-espresso line-clamp-1 leading-snug">{video.title}</h3>
                    <p className="text-[10px] text-dark-espresso/50 font-bold uppercase tracking-wider">⏱️ {video.duration || "30 menit"}</p>
                    <p className="text-xs text-dark-espresso/60 line-clamp-2 leading-relaxed">{video.description || "Tidak ada deskripsi."}</p>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-6 pt-0 border-t border-dark-espresso/5 flex items-center justify-between gap-4">
                <span className="text-[10px] font-bold text-dark-espresso/55 uppercase tracking-wider">
                  {video._count?.users || 0} Member
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Order Shifters */}
                  <button
                    onClick={() => handleOrderChange(video, "up")}
                    className="p-1.5 rounded hover:bg-dark-espresso/5 text-dark-espresso/60"
                    title="Urutan Keatas"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOrderChange(video, "down")}
                    className="p-1.5 rounded hover:bg-dark-espresso/5 text-dark-espresso/60"
                    title="Urutan Kebawah"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  {/* Publish/Draft toggle */}
                  <button
                    onClick={() => handleTogglePublish(video)}
                    className={`p-1.5 rounded hover:bg-dark-espresso/5 ${video.isPublished ? "text-soft-sage" : "text-dark-espresso/40"}`}
                    title={video.isPublished ? "Set ke Draf" : "Publikasikan"}
                  >
                    {video.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  {/* Edit */}
                  <button
                    onClick={() => openEditModal(video)}
                    className="p-1.5 rounded hover:bg-dark-espresso/5 text-accent-rose"
                    title="Edit Video"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List Mode View */
        <div className="bg-white rounded-3xl border border-dark-espresso/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-dark-espresso/5 font-bold text-dark-espresso/60">
                  <th className="p-4 w-24">Pratinjau</th>
                  <th className="p-4">Judul</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4 text-center">Durasi</th>
                  <th className="p-4 text-center">Urutan</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Assigned Count</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-espresso/5 text-dark-espresso/80">
                {videos.map((video) => (
                  <tr key={video.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                    <td className="p-4">
                      <div className="aspect-video w-16 rounded overflow-hidden border border-dark-espresso/15">
                        <img
                          src={video.thumbnail || getThumbnailUrl(video.youtubeId)}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-dark-espresso">{video.title}</td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-accent-rose/10 text-accent-rose text-[10px] font-bold uppercase tracking-wider">
                        {video.category.replace("-", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-center">{video.duration || "30 menit"}</td>
                    <td className="p-4 text-center font-mono font-bold">{video.order}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${video.isPublished ? "bg-soft-sage/10 text-soft-sage" : "bg-dark-espresso/15 text-dark-espresso/55"}`}>
                        {video.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold">{video._count?.users || 0} Member</td>
                    <td className="p-4 text-center flex items-center justify-center gap-1.5 h-[72px]">
                      <button
                        onClick={() => handleTogglePublish(video)}
                        className={`p-1.5 rounded hover:bg-dark-espresso/5 ${video.isPublished ? "text-soft-sage" : "text-dark-espresso/40"}`}
                      >
                        {video.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openEditModal(video)}
                        className="p-1.5 rounded hover:bg-dark-espresso/5 text-accent-rose"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD VIDEO MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark-espresso/40 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-dark-espresso/5 shadow-2xl relative max-w-lg w-full z-10 space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-dark-espresso/5">
              <h3 className="font-serif text-lg font-bold text-dark-espresso">Tambah Video Latihan Baru</h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-dark-espresso/50 hover:text-dark-espresso">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd(onAddSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">Judul Video *</label>
                  <input
                    type="text"
                    {...registerAdd("title")}
                    className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none focus:border-accent-rose focus:ring-1 focus:ring-accent-rose"
                    placeholder="Prenatal Yoga Trimester 1: Peregangan Bahu"
                  />
                  {addErrors.title && <p className="text-[10px] text-accent-rose font-medium mt-0.5">{addErrors.title.message}</p>}
                </div>

                {/* YouTube ID */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">YouTube Video ID (11 Karakter) *</label>
                  <input
                    type="text"
                    {...registerAdd("youtubeId")}
                    className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs font-mono bg-[#FAF7F2]/40 focus:outline-none focus:border-accent-rose"
                    placeholder="Contoh: hN26YxX3_iU"
                  />
                  {addErrors.youtubeId && <p className="text-[10px] text-accent-rose font-medium mt-0.5">{addErrors.youtubeId.message}</p>}
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">Durasi *</label>
                  <input
                    type="text"
                    {...registerAdd("duration")}
                    className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                    placeholder="Contoh: 40 menit"
                  />
                  {addErrors.duration && <p className="text-[10px] text-accent-rose font-medium mt-0.5">{addErrors.duration.message}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">Kategori *</label>
                  <select
                    {...registerAdd("category")}
                    className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                  >
                    <option value="trimester-1">Trimester 1</option>
                    <option value="trimester-2">Trimester 2</option>
                    <option value="trimester-3">Trimester 3</option>
                    <option value="pasca-melahirkan">Pasca Melahirkan</option>
                    <option value="umum">Umum</option>
                  </select>
                </div>

                {/* Order */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">Urutan Tampil</label>
                  <input
                    type="number"
                    {...registerAdd("order", { valueAsNumber: true })}
                    className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">Deskripsi Latihan</label>
                <textarea
                  {...registerAdd("description")}
                  rows={3}
                  className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                  placeholder="Keterangan latihan yoga prenatal..."
                />
              </div>

              {/* LIVE YouTube Preview Embed */}
              {addYoutubeId && addYoutubeId.length === 11 && (
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-soft-sage">Pratinjau Live Video</label>
                  <div className="aspect-video rounded-xl overflow-hidden border border-soft-sage/30 bg-black">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${addYoutubeId}`}
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Published switch */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="addPublished"
                  {...registerAdd("isPublished")}
                  className="rounded text-accent-rose focus:ring-accent-rose"
                />
                <label htmlFor="addPublished" className="text-xs font-bold text-dark-espresso/70">
                  Langsung Publikasikan (Publish)
                </label>
              </div>

              {/* Submit buttons */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-3 text-xs font-semibold border border-dark-espresso/15 rounded-full hover:bg-dark-espresso/5 transition-all text-dark-espresso"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-accent-rose hover:bg-accent-rose/95 text-white text-xs font-semibold rounded-full shadow-sm flex items-center justify-center gap-1 transition-all"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Video"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT VIDEO MODAL */}
      {isEditOpen && activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark-espresso/40 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-dark-espresso/5 shadow-2xl relative max-w-lg w-full z-10 space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-dark-espresso/5">
              <h3 className="font-serif text-lg font-bold text-dark-espresso">Edit Video Latihan</h3>
              <button onClick={() => setIsEditOpen(false)} className="p-1 text-dark-espresso/50 hover:text-dark-espresso">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">Judul Video *</label>
                  <input
                    type="text"
                    {...registerEdit("title")}
                    className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                  />
                  {editErrors.title && <p className="text-[10px] text-accent-rose font-medium mt-0.5">{editErrors.title.message}</p>}
                </div>

                {/* YouTube ID */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">YouTube ID *</label>
                  <input
                    type="text"
                    {...registerEdit("youtubeId")}
                    className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs font-mono bg-[#FAF7F2]/40 focus:outline-none"
                  />
                  {editErrors.youtubeId && <p className="text-[10px] text-accent-rose font-medium mt-0.5">{editErrors.youtubeId.message}</p>}
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">Durasi *</label>
                  <input
                    type="text"
                    {...registerEdit("duration")}
                    className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                  />
                  {editErrors.duration && <p className="text-[10px] text-accent-rose font-medium mt-0.5">{editErrors.duration.message}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">Kategori *</label>
                  <select
                    {...registerEdit("category")}
                    className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                  >
                    <option value="trimester-1">Trimester 1</option>
                    <option value="trimester-2">Trimester 2</option>
                    <option value="trimester-3">Trimester 3</option>
                    <option value="pasca-melahirkan">Pasca Melahirkan</option>
                    <option value="umum">Umum</option>
                  </select>
                </div>

                {/* Order */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">Urutan</label>
                  <input
                    type="number"
                    {...registerEdit("order", { valueAsNumber: true })}
                    className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">Deskripsi Latihan</label>
                <textarea
                  {...registerEdit("description")}
                  rows={3}
                  className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none"
                />
              </div>

              {/* LIVE YouTube Preview Embed */}
              {editYoutubeId && editYoutubeId.length === 11 && (
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-soft-sage">Pratinjau Live Video</label>
                  <div className="aspect-video rounded-xl overflow-hidden border border-soft-sage/30 bg-black">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${editYoutubeId}`}
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Published Switch */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="editPublished"
                  {...registerEdit("isPublished")}
                  className="rounded text-accent-rose focus:ring-accent-rose"
                />
                <label htmlFor="editPublished" className="text-xs font-bold text-dark-espresso/70">
                  Video Publik (Published)
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-col gap-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="flex-1 py-3 text-xs font-semibold border border-dark-espresso/15 rounded-full hover:bg-dark-espresso/5 transition-all text-dark-espresso"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-accent-rose hover:bg-accent-rose/95 text-white text-xs font-semibold rounded-full shadow-sm flex items-center justify-center gap-1 transition-all"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Perubahan"}
                  </button>
                </div>

                <div className="border-t border-accent-rose/10 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteVideo(activeVideo.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-3 border border-accent-rose/30 hover:bg-accent-rose/10 text-accent-rose text-xs font-semibold rounded-full transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus Video Dari Catalog
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
