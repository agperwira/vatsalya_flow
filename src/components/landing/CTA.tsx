"use client"

import React from "react"
import { MessageSquareShare } from "lucide-react"
import { siteConfig } from "@/config/content"

export default function CTA() {
  const encodedMessage = encodeURIComponent(
    "Halo Admin Vatsalya Yoga, saya ingin berkonsultasi mengenai kelas prenatal yoga yang sesuai untuk kehamilan saya. Terima kasih."
  )
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodedMessage}`

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-rose/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="p-10 md:p-16 rounded-[40px] bg-dark-espresso text-white shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dark-espresso/50 via-dark-espresso to-dark-espresso/90 opacity-80" />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent-rose/15 blur-[60px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-soft-sage/15 blur-[60px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-xs font-bold tracking-widest text-accent-rose uppercase">
              Mulai Perjalanan Bunda
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-semibold leading-tight text-[#FAF7F2]">
              {siteConfig.cta.title}
            </h2>
            <p className="text-sm md:text-base text-[#FAF7F2]/70 leading-relaxed font-sans max-w-xl mx-auto">
              {siteConfig.cta.subtitle}
            </p>

            <div className="pt-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#FAF7F2] text-dark-espresso text-sm font-semibold hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                <MessageSquareShare className="w-5 h-5 text-accent-rose" />
                {siteConfig.cta.buttonText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
