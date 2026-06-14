import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function verifyAdmin() {
  const session = await getServerSession(authOptions)
  return session && session.user.role === "ADMIN"
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { whatsappNumber, instagram, youtube, facebook, maintenanceMode } = await request.json()

    // Upsert whatsapp number
    await prisma.setting.upsert({
      where: { key: "whatsapp_number" },
      update: { value: JSON.stringify({ number: whatsappNumber }) },
      create: { key: "whatsapp_number", value: JSON.stringify({ number: whatsappNumber }) }
    })

    // Upsert social links
    await prisma.setting.upsert({
      where: { key: "social_links" },
      update: { value: JSON.stringify({ instagram, youtube, facebook }) },
      create: { key: "social_links", value: JSON.stringify({ instagram, youtube, facebook }) }
    })

    // Upsert maintenance mode
    await prisma.setting.upsert({
      where: { key: "maintenance_mode" },
      update: { value: JSON.stringify({ enabled: maintenanceMode }) },
      create: { key: "maintenance_mode", value: JSON.stringify({ enabled: maintenanceMode }) }
    })

    return NextResponse.json({ message: "Settings saved successfully" })
  } catch (error) {
    console.error("Save settings error:", error)
    return NextResponse.json({ message: "Failed to save settings" }, { status: 500 })
  }
}
