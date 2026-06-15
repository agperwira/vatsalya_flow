"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, ArrowRight, User } from "lucide-react"
import { siteConfig } from "@/config/content"

interface NavbarProps {
  content?: typeof siteConfig.navbar
  contactNumber?: string
  socialLinks?: typeof siteConfig.socialLinks
}

export default function Navbar({ content, contactNumber, socialLinks }: NavbarProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const links = content?.links || siteConfig.navbar.links
  const ctaText = content?.ctaText || siteConfig.navbar.ctaText

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const dashboardHref =
    session?.user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold tracking-wide text-dark-espresso">
            {siteConfig.name}
          </span>
          <span className="text-xl leading-none">🌸</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-dark-espresso/80 hover:text-accent-rose transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <Link
                href={dashboardHref}
                className="px-5 py-2.5 rounded-full bg-soft-sage text-white text-xs font-semibold tracking-wide hover:bg-soft-sage/90 transition-all shadow-sm flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs text-dark-espresso/60 hover:text-accent-rose font-medium transition-colors"
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-full bg-accent-rose text-white text-xs font-semibold tracking-wide hover:bg-accent-rose/95 transition-all shadow-sm flex items-center gap-1.5 group"
            >
              {ctaText}
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-dark-espresso/80 hover:text-accent-rose transition-colors focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-lg py-6 px-6 flex flex-col gap-5 animate-fade-in">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-dark-espresso/95 hover:text-accent-rose py-1 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-dark-espresso/10 my-1" />
          {session ? (
            <div className="flex flex-col gap-4">
              <Link
                href={dashboardHref}
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-5 py-3 rounded-full bg-soft-sage text-white text-sm font-semibold flex items-center justify-center gap-1.5"
              >
                <User className="w-4 h-4" />
                Masuk Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false)
                  signOut({ callbackUrl: "/" })
                }}
                className="w-full py-2.5 text-center text-sm font-medium text-dark-espresso/70 border border-dark-espresso/15 rounded-full hover:bg-dark-espresso/5 transition-colors"
              >
                Keluar dari Akun
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-5 py-3 rounded-full bg-accent-rose text-white text-sm font-semibold flex items-center justify-center gap-1.5"
            >
              {ctaText}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
