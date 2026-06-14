"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { siteConfig } from "@/config/content"

export default function Testimoni() {
  const [activeIndex, setActiveIndex] = useState(0)

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? siteConfig.testimonials.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === siteConfig.testimonials.length - 1 ? 0 : prev + 1))
  }

  return (
    <section id="testimoni" className="py-24 bg-[#FAF7F2] relative overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 rounded-full bg-accent-rose/5 blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 rounded-full bg-soft-sage/5 blur-[80px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-accent-rose uppercase">
            Testimoni Bunda
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-espresso">
            Kisah Sukses Persalinan Bunda
          </h2>
        </div>

        {/* Carousel Slider */}
        <div className="relative">
          <div className="absolute top-0 left-0 text-accent-rose/10 pointer-events-none">
            <Quote className="w-24 h-24 stroke-[3px]" />
          </div>

          <div className="min-h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center px-4 md:px-12 space-y-6"
              >
                <p className="text-lg md:text-xl font-serif italic text-dark-espresso leading-relaxed">
                  "{siteConfig.testimonials[activeIndex].quote}"
                </p>

                <div className="flex flex-col items-center gap-3">
                  <img
                    src={siteConfig.testimonials[activeIndex].avatar}
                    alt={siteConfig.testimonials[activeIndex].name}
                    className="w-14 h-14 rounded-full object-cover border border-white shadow-md"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-dark-espresso">
                      {siteConfig.testimonials[activeIndex].name}
                    </h4>
                    <p className="text-[10px] text-dark-espresso/50 font-medium mt-0.5">
                      {siteConfig.testimonials[activeIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-6 mt-10">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-dark-espresso/15 flex items-center justify-center hover:bg-white hover:text-accent-rose hover:border-white transition-all shadow-sm focus:outline-none"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Dots */}
            <div className="flex gap-1.5">
              {siteConfig.testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === activeIndex ? "w-6 bg-accent-rose" : "bg-dark-espresso/10"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-dark-espresso/15 flex items-center justify-center hover:bg-white hover:text-accent-rose hover:border-white transition-all shadow-sm focus:outline-none"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  )
}
