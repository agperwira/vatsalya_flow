import React from "react"
import { prisma } from "@/lib/prisma"
import AssignClient from "@/components/admin/AssignClient"

export const dynamic = "force-dynamic"

export default async function AdminAssignPage() {
  const users = await prisma.user.findMany({
    where: {
      role: "MEMBER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      trimester: true,
      videos: {
        select: {
          videoId: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })

  const videos = await prisma.video.findMany({
    where: {
      isPublished: true,
    },
    select: {
      id: true,
      title: true,
      category: true,
    },
    orderBy: {
      order: "asc",
    },
  })

  return <AssignClient users={users} videos={videos} />
}
