"use client"

import React from "react"
import { motion } from "framer-motion"
import { Calendar, Layers, Activity, Sparkles } from "lucide-react"
import { siteConfig } from "@/config/content"

export default function Program() {
  return (
    <section id="program" className="py-24 bg-white relative">
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-accent-rose/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-soft-sage/5 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-accent-rose uppercase">
            Pilihan Latihan
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-espresso leading-tight">
            {siteConfig.program.title}
          </h2>
          <p className="text-sm md:text-base text-dark-espresso/60 font-sans">
            {siteConfig.program.subtitle}
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {siteConfig.program.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-[#FAF7F2] border border-dark-espresso/5 shadow-sm hover:shadow-lg hover:border-accent-rose/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Visual indicator */}
                <div className="w-12 h-12 rounded-2xl bg-white border border-dark-espresso/5 shadow-sm flex items-center justify-center mb-6 text-accent-rose group-hover:bg-accent-rose group-hover:text-white transition-all duration-300">
                  {index === 0 && <Sparkles className="w-5 h-5" />}
                  {index === 1 && <Activity className="w-5 h-5" />}
                  {index === 2 && <Layers className="w-5 h-5" />}
                  {index === 3 && <Calendar className="w-5 h-5" />}
                </div>

                <h3 className="text-lg font-serif font-bold text-dark-espresso leading-snug mb-3">
                  {item.title}
                </h3>
                <p className="text-xs text-dark-espresso/60 leading-relaxed font-sans mb-6">
                  {item.description}
                </p>
              </div>

              {/* Badges/Info footer */}
              <div className="pt-4 border-t border-dark-espresso/5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-dark-espresso/50 font-bold uppercase tracking-wider">Durasi Fase</span>
                  <span className="text-xs font-semibold text-dark-espresso">{item.weeks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-dark-espresso/50 font-bold uppercase tracking-wider">Tingkatan</span>
                  <span className="px-2 py-0.5 rounded-full bg-soft-sage/10 text-soft-sage text-[10px] font-bold">
                    {item.difficulty}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
