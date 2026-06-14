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
    const { userIds, videoIds } = await request.json()

    if (!Array.isArray(userIds) || !Array.isArray(videoIds)) {
      return NextResponse.json({ message: "Invalid payload format" }, { status: 400 })
    }

    // Wrap in transaction for database consistency
    await prisma.$transaction(async (tx) => {
      // 1. Delete all previous assignments for these users
      await tx.userVideo.deleteMany({
        where: {
          userId: { in: userIds }
        }
      })

      // 2. Build new assignments
      const dataToInsert = userIds.flatMap((uid) =>
        videoIds.map((vid) => ({
          userId: uid,
          videoId: vid
        }))
      )

      if (dataToInsert.length > 0) {
        await tx.userVideo.createMany({
          data: dataToInsert
        })
      }
    })

    return NextResponse.json({ message: "Assignments updated successfully" })
  } catch (error) {
    console.error("Assignment save error:", error)
    return NextResponse.json({ message: "Failed to save assignments" }, { status: 500 })
  }
}
