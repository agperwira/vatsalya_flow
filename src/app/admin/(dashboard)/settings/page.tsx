import React from "react"
import { prisma } from "@/lib/prisma"
import SettingsClient from "@/components/admin/SettingsClient"
import { siteConfig } from "@/config/content"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  // Query db values
  const whatsappSetting = await prisma.setting.findUnique({ where: { key: "whatsapp_number" } })
  const socialLinksSetting = await prisma.setting.findUnique({ where: { key: "social_links" } })
  const maintenanceSetting = await prisma.setting.findUnique({ where: { key: "maintenance_mode" } })
  const dashboardSetting = await prisma.setting.findUnique({ where: { key: "dashboard_settings" } })

  const whatsappNumber = whatsappSetting ? JSON.parse(whatsappSetting.value).number : siteConfig.whatsappNumber
  const socialLinks = socialLinksSetting
    ? JSON.parse(socialLinksSetting.value)
    : siteConfig.socialLinks
  const maintenanceMode = maintenanceSetting
    ? JSON.parse(maintenanceSetting.value).enabled
    : false

  const dashboardSettings = dashboardSetting
    ? JSON.parse(dashboardSetting.value)
    : {
        title: "Vatsalya Flow",
        theme: "classic",
        welcomeTitle: "Selamat datang, Bunda {name} 🌸",
        welcomeSubtitle: "Semoga sesi latihan hari ini membawa kedamaian dan kebugaran bagi Bunda dan si kecil.",
      }

  const landingPageSetting = await prisma.setting.findUnique({ where: { key: "landing_page_content" } })
  const landingPageContent = landingPageSetting ? JSON.parse(landingPageSetting.value) : siteConfig

  const initialSettings = {
    whatsappNumber,
    instagram: socialLinks.instagram || "",
    youtube: socialLinks.youtube || "",
    facebook: socialLinks.facebook || "",
    maintenanceMode,
    dashboardTitle: dashboardSettings.title || "Vatsalya Flow",
    dashboardTheme: (dashboardSettings.theme || "classic") as "classic" | "ocean" | "sunset" | "lavender",
    dashboardWelcomeTitle: dashboardSettings.welcomeTitle || "Selamat datang, Bunda {name} 🌸",
    dashboardWelcomeSubtitle: dashboardSettings.welcomeSubtitle || "Semoga sesi latihan hari ini membawa kedamaian dan kebugaran bagi Bunda dan si kecil.",
    landingPageContent: landingPageContent,
  }

  return <SettingsClient initialSettings={initialSettings} />
}
