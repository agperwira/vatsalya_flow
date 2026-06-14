import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcrypt"

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, trimester } = await request.json()

    if (!name || !email || !password || !phone || !trimester) {
      return NextResponse.json(
        { message: "Seluruh kolom data wajib diisi" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create member user
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
        trimester: parseInt(trimester),
        role: "MEMBER",
        isActive: true, // Active by default
      }
    })

    return NextResponse.json(
      { message: "Registrasi berhasil", userId: newUser.id },
      { status: 201 }
    )

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Terjadi kesalahan server internal" },
      { status: 500 }
    )
  }
}
