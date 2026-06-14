import "./globals.css"
import type { Metadata } from "next"
import { Cormorant_Garamond, DM_Sans } from "next/font/google"
import Providers from "@/components/providers"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "700"],
})

export const metadata: Metadata = {
  title: "Vatsalya Yoga - Prenatal Yoga Premium Platform",
  description: "Kelas Prenatal Yoga premium yang dirancang secara holistik oleh para ahli untuk mendukung kebugaran fisik, kestabilan mental, dan ikatan suci antara Bunda dan sang buah hati.",
  keywords: ["prenatal yoga", "yoga hamil", "vatsalya yoga", "persiapan persalinan", "yoga ibu hamil"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${cormorant.variable} ${dmSans.variable} scroll-smooth`}>
      <body className="bg-primary-cream text-dark-espresso min-h-screen font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
