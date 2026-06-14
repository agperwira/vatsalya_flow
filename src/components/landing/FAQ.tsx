"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import { siteConfig } from "@/config/content"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-24 bg-[#FAF7F2] relative">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-accent-rose uppercase">
            Tanya Jawab
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-dark-espresso">
            Pertanyaan yang Sering Diajukan
          </h2>
        </div>

        {/* Accordion Lists */}
        <div className="space-y-4">
          {siteConfig.faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className="rounded-2xl border border-dark-espresso/5 bg-white shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left p-6 md:p-8 flex justify-between items-center gap-4 focus:outline-none"
                >
                  <span className="font-serif text-sm md:text-base font-bold text-dark-espresso">
                    {faq.question}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center shrink-0 text-dark-espresso/60">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0 border-t border-dark-espresso/5">
                        <p className="text-xs md:text-sm text-dark-espresso/60 leading-relaxed font-sans mt-4">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
