"use client"

import React, { createContext, useContext, useState } from "react"
import { SessionProvider } from "next-auth/react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within a ToastProvider")
  return context
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4500)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <SessionProvider>
      <ToastContext.Provider value={{ toast }}>
        {children}
        
        {/* Toast Container */}
        <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                className="pointer-events-auto p-4 rounded-xl shadow-lg border flex items-start justify-between gap-3 bg-white/90 backdrop-blur-md"
                style={{
                  borderColor:
                    t.type === "success"
                      ? "#8A9E7E"
                      : t.type === "error"
                      ? "#C9897A"
                      : "#2C181020",
                }}
              >
                <div className="flex gap-3">
                  {t.type === "success" && (
                    <CheckCircle2 className="w-5 h-5 text-soft-sage shrink-0 mt-0.5" />
                  )}
                  {t.type === "error" && (
                    <AlertCircle className="w-5 h-5 text-accent-rose shrink-0 mt-0.5" />
                  )}
                  {t.type === "info" && (
                    <Info className="w-5 h-5 text-dark-espresso/70 shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm font-medium text-dark-espresso leading-relaxed">
                    {t.message}
                  </p>
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-dark-espresso/40 hover:text-dark-espresso shrink-0 mt-0.5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ToastContext.Provider>
    </SessionProvider>
  )
}
