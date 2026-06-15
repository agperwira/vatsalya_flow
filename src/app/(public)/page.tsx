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
import { prisma } from "@/lib/prisma"
import { siteConfig } from "@/config/content"

export const dynamic = "force-dynamic"

export default async function LandingPage() {
  const contentSetting = await prisma.setting.findUnique({ where: { key: "landing_page_content" } })
  
  // Use DB content if available, fallback to static siteConfig
  const content = contentSetting ? JSON.parse(contentSetting.value) : siteConfig

  // WhatsApp number can be customized in general settings or landing page content
  const whatsappSetting = await prisma.setting.findUnique({ where: { key: "whatsapp_number" } })
  const whatsappNumber = whatsappSetting ? JSON.parse(whatsappSetting.value).number : (content.whatsappNumber || siteConfig.whatsappNumber)

  // Social Links
  const socialLinksSetting = await prisma.setting.findUnique({ where: { key: "social_links" } })
  const socialLinks = socialLinksSetting ? JSON.parse(socialLinksSetting.value) : (content.socialLinks || siteConfig.socialLinks)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar content={content.navbar} contactNumber={whatsappNumber} socialLinks={socialLinks} />
      <main className="flex-grow">
        <Hero content={content.hero} />
        <TrustBar content={content.trustBar} />
        <About content={content.about} />
        <Program content={content.program} />
        <VideoPreview content={content.videoPreview} />
        <Manfaat content={content.manfaat} />
        <Testimoni content={content.testimonials} />
        <Jadwal content={content.schedule} />
        <FAQ content={content.faqs} />
        <CTA content={content.cta} contactNumber={whatsappNumber} />
      </main>
      <Footer socialLinks={socialLinks} contactNumber={whatsappNumber} />
    </div>
  )
}
