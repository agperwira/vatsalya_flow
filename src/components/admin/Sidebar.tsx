"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  BarChart3,
  Users,
  Video,
  Link2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react"

interface SidebarProps {
  adminName: string
}

export default function Sidebar({ adminName }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { label: "Kelola User", href: "/admin/users", icon: Users },
    { label: "Kelola Video", href: "/admin/videos", icon: Video },
    { label: "Assign Video", href: "/admin/assign", icon: Link2 },
    { label: "Pengaturan", href: "/admin/settings", icon: Settings },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-dark-espresso/10 sticky top-0 z-40">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="font-serif font-bold text-dark-espresso text-base">Vatsalya Admin</span>
          <span className="text-sm">🌸</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg hover:bg-dark-espresso/5 text-dark-espresso focus:outline-none"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-dark-espresso/30 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="relative flex flex-col w-72 max-w-xs bg-white h-full shadow-2xl p-6 border-r border-dark-espresso/10 animate-fade-in z-50">
            <div className="flex items-center justify-between mb-8">
              <span className="font-serif font-bold text-dark-espresso text-lg">Vatsalya Admin</span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1 rounded-full border border-dark-espresso/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      active
                        ? "bg-accent-rose text-white shadow-md shadow-accent-rose/15"
                        : "text-dark-espresso/70 hover:bg-dark-espresso/5 hover:text-dark-espresso"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="pt-4 border-t border-dark-espresso/5 space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-accent-rose/10 flex items-center justify-center text-accent-rose font-bold text-xs uppercase border border-accent-rose/20">
                  {adminName[0]}
                </div>
                <div>
                  <p className="text-xs font-bold text-dark-espresso line-clamp-1">{adminName}</p>
                  <p className="text-[9px] text-dark-espresso/55 font-bold uppercase tracking-wider">Admin</p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-accent-rose hover:bg-accent-rose/10 rounded-2xl transition-all"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-dark-espresso/5 h-screen sticky top-0 shrink-0 transition-all duration-300 z-40 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Top Header */}
        <div className="p-6 flex items-center justify-between border-b border-dark-espresso/5">
          {!isCollapsed && (
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <span className="font-serif text-base font-bold tracking-wide text-dark-espresso">
                Vatsalya Admin
              </span>
              <span>🌸</span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-full border border-dark-espresso/10 hover:bg-dark-espresso/5 text-dark-espresso/60 mx-auto"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2.5">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-accent-rose text-white shadow-md shadow-accent-rose/15"
                    : "text-dark-espresso/70 hover:bg-dark-espresso/5 hover:text-dark-espresso"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-dark-espresso/5 space-y-4">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-accent-rose/10 flex items-center justify-center text-accent-rose font-bold text-sm uppercase border border-accent-rose/25 shrink-0">
                {adminName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-dark-espresso truncate">{adminName}</p>
                <p className="text-[9px] text-dark-espresso/50 font-bold uppercase tracking-wider">Administrator</p>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-accent-rose/10 flex items-center justify-center text-accent-rose font-bold text-sm uppercase border border-accent-rose/25 mx-auto shrink-0">
              {adminName[0]}
            </div>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm font-semibold text-accent-rose hover:bg-accent-rose/10 rounded-2xl transition-all ${
              isCollapsed ? "justify-center" : ""
            }`}
            title="Keluar"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
