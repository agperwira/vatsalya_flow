const { PrismaClient, Role } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean tables
  await prisma.userVideo.deleteMany()
  await prisma.video.deleteMany()
  await prisma.user.deleteMany()
  await prisma.setting.deleteMany()

  // Admin Account
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Vatsalya',
      email: 'admin@vatsalyayoga.com',
      password: adminPassword,
      role: Role.ADMIN,
      phone: '628111111111',
      isActive: true,
    },
  })
  console.log('Admin account created:', admin.email)

  // Sample Videos
  const video1 = await prisma.video.create({
    data: {
      title: 'Prenatal Yoga Trimester 1: Fondasi & Relaksasi',
      description: 'Latihan lembut untuk menguatkan tubuh dan pikiran di trimester pertama. Fokus pada pernapasan dan postur dasar.',
      youtubeId: 'hN26YxX3_iU',
      category: 'trimester-1',
      duration: '30 menit',
      thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
      isPublished: true,
      order: 1,
    },
  })

  const video2 = await prisma.video.create({
    data: {
      title: 'Prenatal Yoga Trimester 2: Kekuatan & Fleksibilitas',
      description: 'Membuka panggul dan meredakan nyeri punggung bawah untuk kenyamanan Bunda dan janin di trimester kedua.',
      youtubeId: 'Kpyh713g64M',
      category: 'trimester-2',
      duration: '45 menit',
      thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
      isPublished: true,
      order: 2,
    },
  })

  const video3 = await prisma.video.create({
    data: {
      title: 'Prenatal Yoga Trimester 3: Persiapan Persalinan',
      description: 'Latihan pernapasan (pranayama) dan gerakan optimalisasi posisi janin untuk memperlancar proses melahirkan.',
      youtubeId: 'lq7r9Z4p050',
      category: 'trimester-3',
      duration: '35 menit',
      thumbnail: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=600',
      isPublished: true,
      order: 3,
    },
  })
  console.log('Sample videos created')

  // Sample Members
  const memberPassword1 = await bcrypt.hash('bunda123', 12)
  const member1 = await prisma.user.create({
    data: {
      name: 'Bunda Siti',
      email: 'bunda.siti@gmail.com',
      password: memberPassword1,
      role: Role.MEMBER,
      phone: '6281234567890',
      trimester: 2,
      isActive: true,
    },
  })

  const memberPassword2 = await bcrypt.hash('bunda456', 12)
  const member2 = await prisma.user.create({
    data: {
      name: 'Bunda Rara',
      email: 'bunda.rara@gmail.com',
      password: memberPassword2,
      role: Role.MEMBER,
      phone: '6289876543210',
      trimester: 3,
      isActive: true,
    },
  })
  console.log('Sample members created:', member1.email, member2.email)

  // Assign videos
  await prisma.userVideo.createMany({
    data: [
      { userId: member1.id, videoId: video1.id },
      { userId: member1.id, videoId: video2.id },
      { userId: member2.id, videoId: video1.id },
      { userId: member2.id, videoId: video3.id },
    ],
  })
  console.log('Video assignments created')

  // Seed default settings
  await prisma.setting.createMany({
    data: [
      {
        key: 'whatsapp_number',
        value: JSON.stringify({ number: '6281234567890' }),
      },
      {
        key: 'social_links',
        value: JSON.stringify({
          instagram: 'https://instagram.com/vatsalyayoga',
          youtube: 'https://youtube.com/vatsalyayoga',
          facebook: 'https://facebook.com/vatsalyayoga',
        }),
      },
      {
        key: 'maintenance_mode',
        value: JSON.stringify({ enabled: false }),
      },
    ],
  })
  console.log('Default settings seeded')

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
