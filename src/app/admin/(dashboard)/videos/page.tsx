import React from "react"
import { prisma } from "@/lib/prisma"
import VideosClient from "@/components/admin/VideosClient"

export const dynamic = "force-dynamic"

export default async function AdminVideosPage() {
  const videos = await prisma.video.findMany({
    include: {
      _count: {
        select: {
          users: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  })

  return <VideosClient initialVideos={videos} />
}
