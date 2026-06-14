import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

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
    const user = await prisma.user.findUnique({
      where: { id: params.id, role: "MEMBER" },
      include: {
        videos: {
          include: { video: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 })
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

    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email.toLowerCase()
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.trimester !== undefined) updateData.trimester = parseInt(data.trimester)
    if (data.isActive !== undefined) updateData.isActive = data.isActive

    if (data.password && data.password.trim().length >= 6) {
      updateData.password = await bcrypt.hash(data.password, 12)
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id, role: "MEMBER" },
      data: updateData
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ message: "Failed to update user" }, { status: 500 })
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
    await prisma.user.delete({
      where: { id: params.id, role: "MEMBER" }
    })
    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete user" }, { status: 500 })
  }
}
