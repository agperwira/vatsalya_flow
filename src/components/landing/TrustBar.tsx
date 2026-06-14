"use client"

import React from "react"
import { siteConfig } from "@/config/content"

export default function TrustBar() {
  return (
    <div className="py-10 bg-white border-y border-dark-espresso/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-center text-[10px] sm:text-xs font-bold tracking-widest text-dark-espresso/45 uppercase mb-6">
          {siteConfig.trustBar.title}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:justify-around opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
          {siteConfig.trustBar.brands.map((brand, idx) => (
            <div
              key={idx}
              className="text-xs sm:text-sm md:text-base font-serif font-bold text-dark-espresso tracking-wide flex items-center gap-1.5"
            >
              <span className="text-accent-rose/70">✦</span>
              {brand}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
