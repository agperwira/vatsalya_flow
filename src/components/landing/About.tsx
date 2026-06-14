"use client"

import React from "react"
import { motion } from "framer-motion"
import { ShieldCheck, Heart, Sparkles } from "lucide-react"
import { siteConfig } from "@/config/content"

export default function About() {
  return (
    <section id="about" className="py-24 bg-[#FAF7F2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Image Block */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-rose/10 to-soft-sage/10 rounded-2xl transform rotate-3 scale-105" />
            <img
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
              alt="Prenatal Yoga Session"
              className="relative rounded-2xl shadow-xl border border-white max-h-[500px] w-full object-cover"
            />
            {/* Embedded Quote Box */}
            <div className="absolute -bottom-8 -right-4 md:right-4 bg-white p-5 rounded-2xl shadow-lg border border-gray-100 max-w-xs glass">
              <p className="text-sm font-serif italic text-dark-espresso leading-relaxed">
                {siteConfig.about.teacherQuote}
              </p>
              <div className="mt-3">
                <p className="text-xs font-bold text-dark-espresso">
                  {siteConfig.about.teacherName}
                </p>
                <p className="text-[10px] text-dark-espresso/50">
                  {siteConfig.about.teacherRole}
                </p>
              </div>
            </div>
          </div>

          {/* Text Content Block */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold tracking-widest text-accent-rose uppercase">
              {siteConfig.about.subtitle}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-espresso leading-tight">
              {siteConfig.about.title}
            </h2>
            <div className="space-y-4 text-dark-espresso/70 text-sm md:text-base leading-relaxed">
              <p>{siteConfig.about.paragraph1}</p>
              <p>{siteConfig.about.paragraph2}</p>
            </div>

            {/* Value Props Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-dark-espresso/10">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-accent-rose/10 text-accent-rose shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-dark-espresso">Sangat Aman</h4>
                  <p className="text-[10px] text-dark-espresso/50 mt-1">Gerakan aman tervalidasi medis</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-soft-sage/10 text-soft-sage shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-dark-espresso">Ramah Pemula</h4>
                  <p className="text-[10px] text-dark-espresso/50 mt-1">Disesuaikan tanpa pengalaman yoga</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-accent-rose/10 text-accent-rose shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-dark-espresso">Fokus Holistik</h4>
                  <p className="text-[10px] text-dark-espresso/50 mt-1">Melatih napas, pikiran, dan mental</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
