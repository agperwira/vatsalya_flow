"use client"

import React from "react"
import Link from "next/link"
import { Instagram, Youtube, Facebook } from "lucide-react"
import { siteConfig } from "@/config/content"

export default function Footer() {
  return (
    <footer className="bg-dark-espresso text-[#FAF7F2] pt-20 pb-10 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/5">
        
        {/* Brand Info */}
        <div className="md:col-span-5 space-y-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-wide text-white">
              {siteConfig.name}
            </span>
            <span className="text-xl">🌸</span>
          </Link>
          <p className="text-xs text-[#FAF7F2]/60 leading-relaxed font-sans max-w-sm">
            Platform Prenatal Yoga premium yang dirancang secara khusus untuk mendampingi masa kehamilan Bunda dengan harmoni, kenyamanan, dan kekuatan.
          </p>
          
          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href={siteConfig.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#FAF7F2]/60 hover:text-white hover:border-white transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={siteConfig.socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#FAF7F2]/60 hover:text-white hover:border-white transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href={siteConfig.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#FAF7F2]/60 hover:text-white hover:border-white transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-accent-rose">
            Peta Situs
          </h4>
          <ul className="space-y-2.5 text-xs text-[#FAF7F2]/70 font-medium">
            {siteConfig.navbar.links.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-accent-rose">
            Hubungi Kami
          </h4>
          <ul className="space-y-2.5 text-xs text-[#FAF7F2]/75 leading-relaxed font-sans">
            <li>
              📍 Jl. Kemang Timur No. 42, Jakarta Selatan, Indonesia
            </li>
            <li>
              📞 WhatsApp: +{siteConfig.whatsappNumber}
            </li>
            <li>
              ✉️ Email: info@vatsalyayoga.com
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Footer Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Disclaimer */}
        <div className="max-w-2xl text-center md:text-left">
          <p className="text-[10px] text-[#FAF7F2]/40 leading-relaxed max-w-xl">
            <strong>Pemberitahuan Medis:</strong> Seluruh materi video latihan dan panduan gerakan di dalam platform Vatsalya Yoga bertujuan untuk edukasi kebugaran ibu hamil. Sangat disarankan untuk berkonsultasi dengan dokter spesialis kandungan (Sp.OG) atau bidan Anda sebelum memulai program latihan fisik ini.
          </p>
        </div>

        {/* Copyright */}
        <div className="shrink-0 text-center md:text-right">
          <p className="text-[10px] text-[#FAF7F2]/40">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
