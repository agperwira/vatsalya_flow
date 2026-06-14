import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function verifyAdmin() {
  const session = await getServerSession(authOptions)
  return session && session.user.role === "ADMIN"
}

export async function GET() {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const videos = await prisma.video.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { order: "asc" }
    })
    return NextResponse.json(videos)
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch videos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { title, youtubeId, description, category, duration, thumbnail, isPublished, order } = data

    if (!title || !youtubeId || !category || !duration) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const video = await prisma.video.create({
      data: {
        title,
        youtubeId,
        description,
        category,
        duration,
        thumbnail,
        isPublished: isPublished !== undefined ? isPublished : true,
        order: order !== undefined ? parseInt(order) : 0,
      }
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to create video" }, { status: 500 })
  }
}
