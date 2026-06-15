"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Heart, Flame } from "lucide-react"
import { siteConfig } from "@/config/content"

export default function Hero({ content }: { content?: typeof siteConfig.hero }) {
  const data = content || siteConfig.hero

  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#F3EEE5]">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-accent-rose/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] rounded-full bg-soft-sage/8 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Text Area */}
        <div className="lg:col-span-7 text-left flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-rose/10 text-accent-rose border border-accent-rose/15 text-xs font-semibold uppercase tracking-wider mb-6 w-fit"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {data.highlightText}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-dark-espresso leading-[1.1] mb-6"
          >
            {data.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-lg text-dark-espresso/70 leading-relaxed font-sans mb-10 max-w-xl"
          >
            {data.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
          >
            <Link
              href="/register"
              className="px-8 py-4 rounded-full bg-accent-rose text-white text-sm font-semibold hover:bg-accent-rose/95 hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 group"
            >
              {data.ctaPrimary}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#program"
              className="px-8 py-4 rounded-full bg-transparent text-dark-espresso border border-dark-espresso/20 text-sm font-semibold hover:bg-dark-espresso/5 transition-all text-center"
            >
              {data.ctaSecondary}
            </Link>
          </motion.div>
        </div>

        {/* Visual Graphic Representation */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-80 h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-accent-rose/20 to-soft-sage/20 flex items-center justify-center p-8 border border-white/40"
          >
            {/* Inner Ring */}
            <div className="w-full h-full rounded-full border border-dashed border-dark-espresso/15 flex items-center justify-center animate-[spin_60s_linear_infinite] relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-accent-rose flex items-center justify-center shadow-md">
                <Heart className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Inner Circular Card - Organic Warmth Shape */}
            <div className="absolute inset-8 rounded-full bg-white/85 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center text-center p-8 border border-white">
              <span className="text-4xl mb-4 select-none">🤰🌸</span>
              <h3 className="font-serif text-2xl font-bold text-dark-espresso leading-tight">
                Vatsalya Yoga
              </h3>
              <p className="text-xs text-dark-espresso/60 mt-2 font-medium tracking-wide uppercase">
                Gently Restorative
              </p>
              
              {/* Micro interactive elements */}
              <div className="mt-6 flex items-center gap-1.5 px-3 py-1.5 bg-soft-sage/15 rounded-full">
                <div className="w-2 h-2 rounded-full bg-soft-sage animate-ping" />
                <span className="text-[10px] font-bold text-soft-sage tracking-wider uppercase">
                  Sesi Live Setiap Hari
                </span>
              </div>
            </div>
          </motion.div>

          {/* Floaters */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-5 bg-white p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100"
          >
            <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-accent-rose">
              ✨
            </div>
            <div>
              <p className="text-xs font-bold text-dark-espresso">Sertifikasi RYT</p>
              <p className="text-[10px] text-dark-espresso/50">Yoga Alliance USA</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-5 left-5 bg-white p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100"
          >
            <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-soft-sage">
              🌿
            </div>
            <div>
              <p className="text-xs font-bold text-dark-espresso">Bidan & Doula</p>
              <p className="text-[10px] text-dark-espresso/50">Instruktur Berpengalaman</p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
