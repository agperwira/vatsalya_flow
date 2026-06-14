import React from "react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Users, Video, PlaySquare, UserPlus, FileVideo, ShieldAlert, CheckCircle, ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboardOverview() {
  // 1. Fetch Stats Metrics
  const totalActiveMembers = await prisma.user.count({
    where: { role: "MEMBER", isActive: true }
  })

  const totalVideos = await prisma.video.count()

  // Videos watched this week (last 7 days)
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const watchedThisWeek = await prisma.userVideo.count({
    where: {
      watchedAt: {
        gte: oneWeekAgo
      }
    }
  })

  // New members this month (since 1st of current month)
  const firstOfCurrentMonth = new Date()
  firstOfCurrentMonth.setDate(1)
  firstOfCurrentMonth.setHours(0, 0, 0, 0)
  const newMembersThisMonth = await prisma.user.count({
    where: {
      role: "MEMBER",
      createdAt: {
        gte: firstOfCurrentMonth
      }
    }
  })

  // 2. Fetch Recent Activities (Recent Watch History & Recent Registrations)
  const recentWatches = await prisma.userVideo.findMany({
    where: {
      watchedAt: { not: null }
    },
    include: {
      user: true,
      video: true
    },
    orderBy: {
      watchedAt: "desc"
    },
    take: 5
  })

  const recentUsers = await prisma.user.findMany({
    where: {
      role: "MEMBER"
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 5
  })

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-dark-espresso">
          Ringkasan Dashboard
        </h1>
        <p className="text-xs text-dark-espresso/60 mt-1">
          Pantau keaktifan member, video pembelajaran, dan log riwayat akses di platform Vatsalya.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Members */}
        <div className="bg-white p-6 rounded-3xl border border-dark-espresso/5 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-accent-rose/10 text-accent-rose flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-dark-espresso/50 font-bold uppercase tracking-wider">Member Aktif</p>
            <h3 className="font-serif text-2xl font-bold text-dark-espresso mt-1">{totalActiveMembers}</h3>
          </div>
        </div>

        {/* Total Videos */}
        <div className="bg-white p-6 rounded-3xl border border-dark-espresso/5 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-soft-sage/10 text-soft-sage flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-dark-espresso/50 font-bold uppercase tracking-wider">Total Video</p>
            <h3 className="font-serif text-2xl font-bold text-dark-espresso mt-1">{totalVideos}</h3>
          </div>
        </div>

        {/* Videos Watched This Week */}
        <div className="bg-white p-6 rounded-3xl border border-dark-espresso/5 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-accent-rose/10 text-accent-rose flex items-center justify-center shrink-0">
            <PlaySquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-dark-espresso/50 font-bold uppercase tracking-wider">Ditonton Pekan Ini</p>
            <h3 className="font-serif text-2xl font-bold text-dark-espresso mt-1">{watchedThisWeek}</h3>
          </div>
        </div>

        {/* New Members This Month */}
        <div className="bg-white p-6 rounded-3xl border border-dark-espresso/5 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-soft-sage/10 text-soft-sage flex items-center justify-center shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-dark-espresso/50 font-bold uppercase tracking-wider">Member Baru Bulan Ini</p>
            <h3 className="font-serif text-2xl font-bold text-dark-espresso mt-1">{newMembersThisMonth}</h3>
          </div>
        </div>
      </div>

      {/* Quick Action Panels */}
      <div className="bg-white p-6 rounded-3xl border border-dark-espresso/5 shadow-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-dark-espresso">
          Aksi Cepat
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/users"
            className="flex items-center justify-between p-4 rounded-2xl border border-dark-espresso/10 hover:border-accent-rose/50 hover:bg-[#FAF7F2] transition-all group"
          >
            <div className="flex items-center gap-3">
              <UserPlus className="w-4 h-4 text-accent-rose" />
              <span className="text-xs font-semibold text-dark-espresso">Buat Akun Member</span>
            </div>
            <ArrowRight className="w-4 h-4 text-dark-espresso/35 group-hover:text-accent-rose group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/videos"
            className="flex items-center justify-between p-4 rounded-2xl border border-dark-espresso/10 hover:border-accent-rose/50 hover:bg-[#FAF7F2] transition-all group"
          >
            <div className="flex items-center gap-3">
              <FileVideo className="w-4 h-4 text-accent-rose" />
              <span className="text-xs font-semibold text-dark-espresso">Tambah Video Kelas</span>
            </div>
            <ArrowRight className="w-4 h-4 text-dark-espresso/35 group-hover:text-accent-rose group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/assign"
            className="flex items-center justify-between p-4 rounded-2xl border border-dark-espresso/10 hover:border-accent-rose/50 hover:bg-[#FAF7F2] transition-all group"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-accent-rose" />
              <span className="text-xs font-semibold text-dark-espresso">Assign Video ke Member</span>
            </div>
            <ArrowRight className="w-4 h-4 text-dark-espresso/35 group-hover:text-accent-rose group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>

      {/* Double Column Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Recent watch history */}
        <div className="bg-white rounded-3xl p-6 border border-dark-espresso/5 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-dark-espresso pb-2 border-b border-dark-espresso/5">
            Riwayat Menonton Terbaru
          </h3>
          {recentWatches.length > 0 ? (
            <div className="divide-y divide-dark-espresso/5">
              {recentWatches.map((rw) => (
                <div key={rw.id} className="py-3.5 flex justify-between items-center gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-dark-espresso">{rw.user.name}</h4>
                    <p className="text-[10px] text-dark-espresso/50 mt-0.5 truncate max-w-[200px] sm:max-w-xs">
                      Menonton: {rw.video.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-soft-sage uppercase tracking-wider bg-soft-sage/10 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-2.5 h-2.5" /> Selesai
                    </span>
                    <p className="text-[9px] text-dark-espresso/40 mt-1">
                      {rw.watchedAt ? new Date(rw.watchedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-dark-espresso/40 italic py-6 text-center">
              Belum ada riwayat aktivitas menonton kelas.
            </p>
          )}
        </div>

        {/* Right Column: Recent registrations */}
        <div className="bg-white rounded-3xl p-6 border border-dark-espresso/5 shadow-sm space-y-4">
          <h3 className="font-serif text-base font-bold text-dark-espresso pb-2 border-b border-dark-espresso/5">
            Member Baru Terdaftar
          </h3>
          {recentUsers.length > 0 ? (
            <div className="divide-y divide-dark-espresso/5">
              {recentUsers.map((member) => (
                <div key={member.id} className="py-3.5 flex justify-between items-center gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-dark-espresso">{member.name}</h4>
                    <p className="text-[10px] text-dark-espresso/50 mt-0.5">{member.email}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        member.isActive
                          ? "bg-soft-sage/10 text-soft-sage"
                          : "bg-accent-rose/10 text-accent-rose"
                      }`}
                    >
                      {member.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                    <p className="text-[9px] text-dark-espresso/40 mt-1">
                      Joined: {new Date(member.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-dark-espresso/40 italic py-6 text-center">
              Belum ada data member terdaftar.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
