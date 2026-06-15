"use client"

import React from "react"
import { motion } from "framer-motion"
import { Heart, Moon, Sparkles, Users, ArrowRight } from "lucide-react"
import { siteConfig } from "@/config/content"

export default function Manfaat({ content }: { content?: typeof siteConfig.manfaat }) {
  const data = content || siteConfig.manfaat

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "heart":
        return <Heart className="w-6 h-6 text-accent-rose" />
      case "moon":
        return <Moon className="w-6 h-6 text-accent-rose" />
      case "sparkles":
        return <Sparkles className="w-6 h-6 text-accent-rose" />
      case "users":
        return <Users className="w-6 h-6 text-accent-rose" />
      default:
        return <Sparkles className="w-6 h-6 text-accent-rose" />
    }
  }

  return (
    <section id="manfaat" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-bold tracking-widest text-accent-rose uppercase">
            Manfaat Prenatal
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-espresso leading-tight">
            {data.title}
          </h2>
          <p className="text-sm md:text-base text-dark-espresso/60">
            {data.subtitle}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {data.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex gap-6 p-8 rounded-3xl bg-[#FAF7F2] border border-dark-espresso/5 hover:border-accent-rose/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-dark-espresso/5 shadow-sm flex items-center justify-center shrink-0">
                {getIcon(item.icon)}
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-serif font-bold text-dark-espresso">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-dark-espresso/60 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
