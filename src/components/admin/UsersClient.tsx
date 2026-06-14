"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Eye,
  Loader2,
  X,
  Phone,
  UserCheck,
  UserMinus
} from "lucide-react"
import { useToast } from "@/components/providers"
import { useRouter } from "next/navigation"

interface UserWithVideos {
  id: string
  name: string
  email: string
  phone: string | null
  trimester: number | null
  isActive: boolean
  createdAt: Date
  videos: { id: string }[]
}

interface UsersClientProps {
  initialUsers: UserWithVideos[]
}

// Zod validation schemas
const createUserSchema = z.object({
  name: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  phone: z.string().min(8, "Nomor WhatsApp tidak valid"),
  trimester: z.number().min(1).max(3),
  isActive: z.boolean(),
})

type CreateUserValues = z.infer<typeof createUserSchema>

const editUserSchema = z.object({
  name: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(8, "Nomor WhatsApp tidak valid"),
  trimester: z.number().min(1).max(3),
  isActive: z.boolean(),
  password: z.string().optional(),
})

type EditUserValues = z.infer<typeof editUserSchema>

export default function UsersClient({ initialUsers }: UsersClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<UserWithVideos[]>(initialUsers)
  
  // Search & Filter state
  const [search, setSearch] = useState("")
  const [trimesterFilter, setTrimesterFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [activeEditUser, setActiveEditUser] = useState<UserWithVideos | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Success Credentials Display State
  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string
    email: string
    password: string
    phone: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  // React Hook Form for Create
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    setValue: setCreateValue,
    watch: watchCreate,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      trimester: 1,
      isActive: true,
    },
  })

  // React Hook Form for Edit
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setEditValue,
    watch: watchEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<EditUserValues>({
    resolver: zodResolver(editUserSchema),
  })

  const createTrimester = watchCreate("trimester")
  const editTrimester = watchEdit("trimester")

  // Auto generate password helper
  const handleAutoGeneratePassword = () => {
    const randomPass = `Vatsalya-${Math.floor(100000 + Math.random() * 900000)}`
    setCreateValue("password", randomPass)
    toast("Password berhasil di-generate secara acak!", "success")
  }

  // Handle Create Submit
  const onCreateSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message || "Gagal membuat akun member")
      }

      toast("Akun member berhasil dibuat! 🌸", "success")
      
      // Save credentials to display
      setCreatedCredentials({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      })

      // Refresh list
      router.refresh()
      setIsCreateOpen(false)
      resetCreate()
      
      // Call endpoint to get fresh list
      const fetchList = await fetch("/api/admin/users")
      if (fetchList.ok) {
        const freshList = await fetchList.json()
        setUsers(freshList)
      }

    } catch (error: any) {
      toast(error.message || "Terjadi kesalahan.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Edit Click
  const openEditModal = (user: UserWithVideos) => {
    setActiveEditUser(user)
    resetEdit({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      trimester: user.trimester || 1,
      isActive: user.isActive,
      password: "",
    })
    setIsEditOpen(true)
  }

  // Handle Edit Submit
  const onEditSubmit = async (data: any) => {
    if (!activeEditUser) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${activeEditUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const resData = await response.json()

      if (!response.ok) {
        throw new Error(resData.message || "Gagal memperbarui profil")
      }

      toast("Profil member berhasil diperbarui 🌸", "success")
      setIsEditOpen(false)
      router.refresh()

      // Refresh list
      const fetchList = await fetch("/api/admin/users")
      if (fetchList.ok) {
        const freshList = await fetchList.json()
        setUsers(freshList)
      }
    } catch (error: any) {
      toast(error.message || "Gagal memperbarui member.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Delete User Account
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus akun member ini secara permanen? Seluruh log riwayat dan data assignment akan dihapus.")) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Gagal menghapus akun")
      }

      toast("Akun member berhasil dihapus permanen.", "success")
      setIsEditOpen(false)
      router.refresh()

      // Refresh list
      const fetchList = await fetch("/api/admin/users")
      if (fetchList.ok) {
        const freshList = await fetchList.json()
        setUsers(freshList)
      }
    } catch (error: any) {
      toast(error.message || "Gagal menghapus.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Bulk status update
  const handleBulkStatus = async (activate: boolean) => {
    if (selectedUserIds.length === 0) return
    setIsLoading(true)
    try {
      const responses = await Promise.all(
        selectedUserIds.map((id) =>
          fetch(`/api/admin/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              isActive: activate,
            }),
          })
        )
      )

      toast(`Berhasil memperbarui status ${selectedUserIds.length} member.`, "success")
      setSelectedUserIds([])
      router.refresh()

      const fetchList = await fetch("/api/admin/users")
      if (fetchList.ok) {
        const freshList = await fetchList.json()
        setUsers(freshList)
      }
    } catch (error) {
      toast("Gagal melakukan aksi massal.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(filteredUsers.map((u) => u.id))
    } else {
      setSelectedUserIds([])
    }
  }

  const handleSelectOne = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds((prev) => [...prev, userId])
    } else {
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId))
    }
  }

  // Filter Logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())

    const matchesTrimester =
      trimesterFilter === "all" ? true : u.trimester === parseInt(trimesterFilter)

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? u.isActive === true
        : u.isActive === false

    return matchesSearch && matchesTrimester && matchesStatus
  })

  // Copy credentials helper
  const handleCopyCredentials = () => {
    if (!createdCredentials) return
    const credString = `Akun Vatsalya Yoga Anda:\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}`
    navigator.clipboard.writeText(credString)
    setCopied(true)
    toast("Kredensial berhasil disalin!", "success")
    setTimeout(() => setCopied(false), 2000)
  }

  // WhatsApp share link generator
  const getWhatsAppShareLink = () => {
    if (!createdCredentials) return "#"
    const message = `Halo Bunda ${createdCredentials.name} 🌸\n\nSelamat! Akun Anda untuk platform prenatal yoga Vatsalya Yoga telah aktif.\n\nBerikut detail akun Bunda:\n- Alamat Website: http://localhost:3000\n- Email: ${createdCredentials.email}\n- Kata Sandi: ${createdCredentials.password}\n\nSilakan masuk dan nikmati kelas yoga yang sesuai dengan trimester kehamilan Bunda. Terima kasih.`
    return `https://wa.me/${createdCredentials.phone}?text=${encodeURIComponent(message)}`
  }

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-dark-espresso">Kelola Member</h1>
          <p className="text-xs text-dark-espresso/60 mt-1">Daftarkan member baru, aktifkan akun, dan sesuaikan data profil trimester.</p>
        </div>
        <button
          onClick={() => {
            setCreatedCredentials(null)
            setIsCreateOpen(true)
          }}
          className="px-5 py-3 bg-accent-rose hover:bg-accent-rose/95 text-white text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          Registrasi Member Baru
        </button>
      </div>

      {/* Success Credentials Banner */}
      {createdCredentials && (
        <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-soft-sage/30 relative animate-fade-in shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <button
            onClick={() => setCreatedCredentials(null)}
            className="absolute top-4 right-4 text-dark-espresso/45 hover:text-dark-espresso"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-soft-sage flex items-center gap-1.5">
              🎉 Akun Berhasil Dibuat!
            </h4>
            <p className="text-xs text-dark-espresso/70">
              Berikut detail akun untuk <strong>{createdCredentials.name}</strong>:
            </p>
            <div className="bg-white p-3.5 rounded-xl border border-dark-espresso/5 text-xs font-mono space-y-1 mt-2">
              <p>Email: {createdCredentials.email}</p>
              <p>Password: {createdCredentials.password}</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={handleCopyCredentials}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-dark-espresso/15 text-xs font-semibold rounded-full hover:bg-dark-espresso/5 transition-all text-dark-espresso"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-soft-sage" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Tersalin" : "Salin Akun"}
            </button>
            <a
              href={getWhatsAppShareLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-grow md:flex-grow-0 flex items-center justify-center gap-1.5 px-5 py-2.5 bg-soft-sage text-white text-xs font-semibold rounded-full hover:bg-soft-sage/95 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Kirim via WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Filter and Search Panel */}
      <div className="bg-white p-5 rounded-3xl border border-dark-espresso/5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          {/* Search bar */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-espresso/40" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-dark-espresso/10 rounded-2xl text-xs bg-[#FAF7F2]/50 focus:outline-none focus:ring-2 focus:ring-accent-rose/30 focus:border-accent-rose transition-all"
            />
          </div>

          {/* Trimester filter */}
          <div className="sm:col-span-3">
            <select
              value={trimesterFilter}
              onChange={(e) => setTrimesterFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-dark-espresso/10 rounded-2xl text-xs bg-[#FAF7F2]/50 focus:outline-none focus:ring-2 focus:ring-accent-rose/30 focus:border-accent-rose transition-all text-dark-espresso"
            >
              <option value="all">Semua Trimester</option>
              <option value="1">Trimester 1</option>
              <option value="2">Trimester 2</option>
              <option value="3">Trimester 3</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-dark-espresso/10 rounded-2xl text-xs bg-[#FAF7F2]/50 focus:outline-none focus:ring-2 focus:ring-accent-rose/30 focus:border-accent-rose transition-all text-dark-espresso"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Controls */}
        {selectedUserIds.length > 0 && (
          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-dark-espresso/5 flex items-center justify-between gap-4 animate-fade-in">
            <span className="text-[10px] font-bold text-dark-espresso/60 uppercase pl-2">
              {selectedUserIds.length} Member Terpilih
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatus(true)}
                disabled={isLoading}
                className="px-3.5 py-1.5 bg-soft-sage text-white text-[10px] font-bold rounded-lg hover:bg-soft-sage/95 transition-all flex items-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5" /> Aktifkan
              </button>
              <button
                onClick={() => handleBulkStatus(false)}
                disabled={isLoading}
                className="px-3.5 py-1.5 bg-accent-rose text-white text-[10px] font-bold rounded-lg hover:bg-accent-rose/95 transition-all flex items-center gap-1"
              >
                <UserMinus className="w-3.5 h-3.5" /> Nonaktifkan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-3xl border border-dark-espresso/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-dark-espresso/5 font-bold text-dark-espresso/60">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded text-accent-rose focus:ring-accent-rose"
                  />
                </th>
                <th className="p-4">Nama</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-center">Trimester</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Video Assigned</th>
                <th className="p-4">Bergabung</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-espresso/5 text-dark-espresso/80">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={(e) => handleSelectOne(user.id, e.target.checked)}
                        className="rounded text-accent-rose focus:ring-accent-rose"
                      />
                    </td>
                    <td className="p-4 font-bold text-dark-espresso">{user.name}</td>
                    <td className="p-4 font-medium">{user.email}</td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded bg-accent-rose/10 text-accent-rose text-[10px] font-bold">
                        T-{user.trimester || "?"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${
                          user.isActive
                            ? "bg-soft-sage/10 text-soft-sage"
                            : "bg-accent-rose/10 text-accent-rose"
                        }`}
                      >
                        {user.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold">{user.videos.length} Video</td>
                    <td className="p-4 text-dark-espresso/60">
                      {new Date(user.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-center flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="p-1.5 rounded hover:bg-dark-espresso/5 text-dark-espresso/60"
                        title="Detail Member"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1.5 rounded hover:bg-dark-espresso/5 text-accent-rose"
                        title="Edit Profil"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-dark-espresso/40 italic">
                    Tidak ada member yang cocok dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MEMBER MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark-espresso/40 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-dark-espresso/5 shadow-2xl relative max-w-md w-full z-10 space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-dark-espresso/5">
              <h3 className="font-serif text-lg font-bold text-dark-espresso">Registrasi Akun Baru</h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 text-dark-espresso/50 hover:text-dark-espresso">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCreate(onCreateSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  {...registerCreate("name")}
                  className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none focus:border-accent-rose focus:ring-1 focus:ring-accent-rose"
                  placeholder="Bunda Siti"
                />
                {createErrors.name && <p className="text-[10px] text-accent-rose font-medium mt-0.5">{createErrors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">Alamat Email *</label>
                <input
                  type="email"
                  {...registerCreate("email")}
                  className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none focus:border-accent-rose focus:ring-1 focus:ring-accent-rose"
                  placeholder="bunda.siti@email.com"
                />
                {createErrors.email && <p className="text-[10px] text-accent-rose font-medium mt-0.5">{createErrors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60">Password Baru *</label>
                  <button
                    type="button"
                    onClick={handleAutoGeneratePassword}
                    className="text-[9px] font-bold text-accent-rose hover:underline"
                  >
                    Generate Otomatis
                  </button>
                </div>
                <input
                  type="text"
                  {...registerCreate("password")}
                  className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs font-mono bg-[#FAF7F2]/40 focus:outline-none focus:border-accent-rose focus:ring-1 focus:ring-accent-rose"
                  placeholder="Isi password atau generate"
                />
                {createErrors.password && <p className="text-[10px] text-accent-rose font-medium mt-0.5">{createErrors.password.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">No WhatsApp (e.g. 62812xxx) *</label>
                <input
                  type="tel"
                  {...registerCreate("phone")}
                  className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none focus:border-accent-rose focus:ring-1 focus:ring-accent-rose"
                  placeholder="628123456789"
                />
                {createErrors.phone && <p className="text-[10px] text-accent-rose font-medium mt-0.5">{createErrors.phone.message}</p>}
              </div>

              {/* Trimester */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-2">Trimester Kehamilan</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCreateValue("trimester", t)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                        createTrimester === t
                          ? "border-accent-rose bg-accent-rose/10 text-accent-rose"
                          : "border-dark-espresso/10 bg-white text-dark-espresso/60"
                      }`}
                    >
                      Trimester {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Switch */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...registerCreate("isActive")}
                  className="rounded text-accent-rose focus:ring-accent-rose"
                />
                <label htmlFor="isActive" className="text-xs font-bold text-dark-espresso/70">
                  Langsung Aktifkan Akun
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 py-3 text-xs font-semibold border border-dark-espresso/15 rounded-full hover:bg-dark-espresso/5 transition-all text-dark-espresso"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-accent-rose hover:bg-accent-rose/95 text-white text-xs font-semibold rounded-full shadow-sm flex items-center justify-center gap-1 transition-all"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buat Akun & Notif"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {isEditOpen && activeEditUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark-espresso/40 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-dark-espresso/5 shadow-2xl relative max-w-md w-full z-10 space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-dark-espresso/5">
              <h3 className="font-serif text-lg font-bold text-dark-espresso">Edit Akun Member</h3>
              <button onClick={() => setIsEditOpen(false)} className="p-1 text-dark-espresso/50 hover:text-dark-espresso">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  {...registerEdit("name")}
                  className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none focus:border-accent-rose"
                />
                {editErrors.name && <p className="text-[10px] text-accent-rose font-medium mt-0.5">{editErrors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">Email</label>
                <input
                  type="email"
                  {...registerEdit("email")}
                  className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none focus:border-accent-rose"
                />
                {editErrors.email && <p className="text-[10px] text-accent-rose font-medium mt-0.5">{editErrors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">Reset Password (Opsional)</label>
                <input
                  type="text"
                  {...registerEdit("password")}
                  placeholder="Isi hanya jika ingin mengganti password"
                  className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none focus:border-accent-rose font-mono"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-1">WhatsApp</label>
                <input
                  type="tel"
                  {...registerEdit("phone")}
                  className="w-full px-3.5 py-2 border border-dark-espresso/10 rounded-xl text-xs bg-[#FAF7F2]/40 focus:outline-none focus:border-accent-rose"
                />
                {editErrors.phone && <p className="text-[10px] text-accent-rose font-medium mt-0.5">{editErrors.phone.message}</p>}
              </div>

              {/* Trimester */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-dark-espresso/60 mb-2">Trimester Kehamilan</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setEditValue("trimester", t)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                        editTrimester === t
                          ? "border-accent-rose bg-accent-rose/10 text-accent-rose"
                          : "border-dark-espresso/10 bg-white text-dark-espresso/60"
                      }`}
                    >
                      Trimester {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveEdit"
                  {...registerEdit("isActive")}
                  className="rounded text-accent-rose focus:ring-accent-rose"
                />
                <label htmlFor="isActiveEdit" className="text-xs font-bold text-dark-espresso/70">
                  Akun ini Aktif
                </label>
              </div>

              {/* Action buttons */}
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

                {/* Danger Zone */}
                <div className="border-t border-accent-rose/10 pt-4 mt-2">
                  <p className="text-[10px] text-dark-espresso/50 font-bold uppercase tracking-widest mb-2">Zona Bahaya</p>
                  <button
                    type="button"
                    onClick={() => handleDeleteUser(activeEditUser.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-3 border border-accent-rose/30 hover:bg-accent-rose/10 text-accent-rose text-xs font-semibold rounded-full transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus Akun Member Secara Permanen
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
