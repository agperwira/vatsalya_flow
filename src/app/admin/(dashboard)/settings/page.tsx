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

  const whatsappNumber = whatsappSetting ? JSON.parse(whatsappSetting.value).number : siteConfig.whatsappNumber
  const socialLinks = socialLinksSetting
    ? JSON.parse(socialLinksSetting.value)
    : siteConfig.socialLinks
  const maintenanceMode = maintenanceSetting
    ? JSON.parse(maintenanceSetting.value).enabled
    : false

  const initialSettings = {
    whatsappNumber,
    instagram: socialLinks.instagram || "",
    youtube: socialLinks.youtube || "",
    facebook: socialLinks.facebook || "",
    maintenanceMode,
  }

  return <SettingsClient initialSettings={initialSettings} />
}
