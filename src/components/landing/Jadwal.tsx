"use client"

import React from "react"
import { CalendarRange, MapPin, Laptop } from "lucide-react"
import { siteConfig } from "@/config/content"

export default function Jadwal({ content }: { content?: typeof siteConfig.schedule }) {
  const data = content || siteConfig.schedule

  return (
    <section id="jadwal" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-accent-rose uppercase">
            Jadwal Sesi
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-espresso leading-tight">
            {data.title}
          </h2>
          <p className="text-sm md:text-base text-dark-espresso/60">
            {data.subtitle}
          </p>
        </div>

        {/* Schedule list/table representation */}
        <div className="max-w-4xl mx-auto overflow-hidden rounded-3xl border border-dark-espresso/5 shadow-sm bg-[#FAF7F2]">
          <div className="divide-y divide-dark-espresso/5">
            {data.items.map((item, index) => {
              const isZoom = item.type.toLowerCase().includes("zoom") || item.type.toLowerCase().includes("online")
              return (
                <div
                  key={index}
                  className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white transition-colors duration-200"
                >
                  {/* Left: Day & Time */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-dark-espresso/5 shadow-sm flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-accent-rose uppercase">{item.day.slice(0, 3)}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-dark-espresso">{item.day}</h4>
                      <p className="text-xs text-dark-espresso/50 font-medium mt-0.5">{item.time}</p>
                    </div>
                  </div>

                  {/* Middle: Type & Location badge */}
                  <div className="flex items-center gap-2">
                    {isZoom ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-soft-sage/10 text-soft-sage text-[10px] font-bold">
                        <Laptop className="w-3 h-3" /> Online Zoom
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-rose/10 text-accent-rose text-[10px] font-bold">
                        <MapPin className="w-3 h-3" /> Studio Vatsalya
                      </span>
                    )}
                    <span className="text-xs text-dark-espresso/70 font-semibold">{item.type.split(" (")[0]}</span>
                  </div>

                  {/* Right: Instructor */}
                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-dark-espresso/50 font-bold uppercase tracking-wider">Instruktur</p>
                    <p className="text-xs font-bold text-dark-espresso mt-0.5">{item.instructor}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
