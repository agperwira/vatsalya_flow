import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // 1. Admin route protection
  if (path.startsWith("/admin") && path !== "/admin/login") {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  // 2. Member route protection
  if (path.startsWith("/dashboard") || path.startsWith("/watch")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    if (token.role !== "MEMBER") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/watch/:path*",
  ],
}
