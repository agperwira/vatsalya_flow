import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function verifyAdmin() {
  const session = await getServerSession(authOptions)
  return session && session.user.role === "ADMIN"
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const video = await prisma.video.findUnique({
      where: { id: params.id },
      include: {
        users: {
          include: { user: true }
        }
      }
    })

    if (!video) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 })
    }

    return NextResponse.json(video)
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch video" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const updateData: any = {}

    if (data.title !== undefined) updateData.title = data.title
    if (data.youtubeId !== undefined) {
      updateData.youtubeId = data.youtubeId
      updateData.thumbnail = data.thumbnail || `https://img.youtube.com/vi/${data.youtubeId}/hqdefault.jpg`
    }
    if (data.description !== undefined) updateData.description = data.description
    if (data.category !== undefined) updateData.category = data.category
    if (data.duration !== undefined) updateData.duration = data.duration
    if (data.order !== undefined) updateData.order = parseInt(data.order)
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished

    const updatedVideo = await prisma.video.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(updatedVideo)
  } catch (error) {
    return NextResponse.json({ message: "Failed to update video" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    await prisma.video.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ message: "Video deleted successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete video" }, { status: 500 })
  }
}
