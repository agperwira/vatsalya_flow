import React from "react"
import { prisma } from "@/lib/prisma"
import UsersClient from "@/components/admin/UsersClient"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: {
      role: "MEMBER",
    },
    include: {
      videos: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return <UsersClient initialUsers={users} />
}
