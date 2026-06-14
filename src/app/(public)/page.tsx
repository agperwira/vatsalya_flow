import React from "react"
import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import TrustBar from "@/components/landing/TrustBar"
import About from "@/components/landing/About"
import Program from "@/components/landing/Program"
import VideoPreview from "@/components/landing/VideoPreview"
import Manfaat from "@/components/landing/Manfaat"
import Testimoni from "@/components/landing/Testimoni"
import Jadwal from "@/components/landing/Jadwal"
import FAQ from "@/components/landing/FAQ"
import CTA from "@/components/landing/CTA"
import Footer from "@/components/landing/Footer"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <TrustBar />
        <About />
        <Program />
        <VideoPreview />
        <Manfaat />
        <Testimoni />
        <Jadwal />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
