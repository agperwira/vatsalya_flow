import React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Sidebar from "@/components/admin/Sidebar"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  if (session.user.role !== "ADMIN") {
    // If authenticated but not admin, redirect to member dashboard
    redirect("/dashboard")
  }

  const adminName = session.user.name || "Administrator"

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-dark-espresso font-sans flex flex-col md:flex-row">
      {/* Collapsible Sidebar */}
      <Sidebar adminName={adminName} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="hidden md:flex bg-white border-b border-dark-espresso/5 py-4 px-8 items-center justify-between sticky top-0 z-30">
          <div>
            <span className="text-[10px] text-dark-espresso/45 font-bold uppercase tracking-widest">
              Control Panel
            </span>
            <h2 className="text-xs font-semibold text-dark-espresso">
              Selamat datang kembali, {adminName} 👋
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-accent-rose/10 text-accent-rose text-[10px] font-bold uppercase tracking-wider border border-accent-rose/15">
              Admin Session
            </span>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
