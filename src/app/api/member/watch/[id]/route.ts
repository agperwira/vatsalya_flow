import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "MEMBER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { watched } = await request.json()
    const videoId = params.id
    const userId = session.user.id

    // Check if assignment exists
    const assignment = await prisma.userVideo.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId,
        }
      }
    })

    if (!assignment) {
      return NextResponse.json({ message: "Akses Ditolak: Kelas tidak di-assign untuk Anda" }, { status: 403 })
    }

    const updated = await prisma.userVideo.update({
      where: {
        userId_videoId: {
          userId,
          videoId,
        }
      },
      data: {
        watchedAt: watched ? new Date() : null,
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Watch state update error:", error)
    return NextResponse.json({ message: "Gagal memperbarui progress" }, { status: 500 })
  }
}
