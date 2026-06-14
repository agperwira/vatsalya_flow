# 🌸 Vatsalya Yoga Platform

Vatsalya Yoga adalah platform prenatal yoga premium yang menggabungkan kemewahan minimalis (*luxury minimalist*) dengan kehangatan organik (*organic warmth*). Platform ini dirancang menggunakan **Next.js 14 (App Router)** untuk memberikan pengalaman kelas yoga yang dipersonalisasi bagi ibu hamil (berdasarkan trimester kehamilan) serta menyediakan panel kontrol administrator lengkap untuk mengelola konten dan member.

---

## 🚀 Tech Stack

* **Core Framework**: Next.js 14 (App Router, React 18, TypeScript)
* **Styling & Animations**: Tailwind CSS v3, Framer Motion (micro-animations)
* **Icons**: Lucide React
* **Authentication**: NextAuth.js (Session JWT, Credentials Provider)
* **Database ORM**: Prisma ORM v5 (PostgreSQL Database)
* **Security & Validation**: Zod, React Hook Form, Bcrypt (Salt 12)
* **Video Player**: High-performance Custom Player (No local video storage, on-demand YouTube iframe rendering)

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── layout.tsx          # Root Layout (Google Fonts & Context Providers)
│   ├── globals.css         # Global Stylesheet & Custom Glassmorphism Classes
│   ├── middleware.ts       # Route guard (ADMIN / MEMBER security rules)
│   ├── (public)/           # Halaman Landing Page Publik
│   │   └── page.tsx
│   ├── (auth)/             # Halaman Login & Register Member
│   │   ├── login/
│   │   └── register/
│   ├── (member)/           # Area Dashboard Khusus Member
│   │   ├── dashboard/
│   │   └── watch/[slug]/   # Kelas Video Player & Rekomendasi
│   └── admin/              # Area Panel Administrator (Protected)
│       ├── login/          # Login khusus admin (tersembunyi)
│       └── (dashboard)/    # Layout Panel & Sidebar Navigation
│           ├── dashboard/  # Statistik overview aktivitas
│           ├── users/      # Kelola User (Buat Akun, Share WA, Edit)
│           ├── videos/     # Kelola Video (Tambah, Live Preview, Urutan)
│           ├── assign/     # Hubungkan Video ke Banyak Member sekaligus
│           └── settings/   # Konfigurasi No WA & Maintenance Mode
├── components/
│   ├── landing/            # 12 Seksi Komponen Landing Page Publik
│   ├── admin/              # Komponen Pendukung Panel Admin (Sidebar, dll)
│   ├── member/             # Komponen Panel Member
│   └── providers.tsx       # NextAuth & Custom Toast Notification Provider
├── lib/
│   ├── auth.ts             # Konfigurasi NextAuth Credentials
│   ├── prisma.ts           # Singleton Prisma Client Connection
│   └── utils.ts            # Helper cn merger Tailwind CSS
└── config/
    └── content.ts          # Static copy/teks default landing page
```

---

## 🛠️ Langkah-Langkah Menjalankan Project

Ikuti langkah berikut untuk memulai aplikasi di komputer Anda:

### 1. Prasyarat
Pastikan Anda sudah menginstal:
* [Node.js](https://nodejs.org/) (versi 18 ke atas)
* [Docker Desktop](https://www.docker.com/) (jika ingin menjalankan PostgreSQL lewat Docker)

### 2. Jalankan Database PostgreSQL (Menggunakan Docker)
Buka aplikasi **Docker Desktop**, lalu jalankan perintah berikut di terminal Anda untuk menyalakan database Postgres otomatis:
```bash
docker run --name vatsalya-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=vatsalya_db -p 5432:5432 -d postgres
```

### 3. Konfigurasi Environment Variable (`.env`)
Di root folder project, pastikan file `.env` memiliki koneksi string database yang tepat:
```env
# Database URL (Bawaan Docker di atas)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vatsalya_db?schema=public"

# NextAuth Config
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="vatsalyayoga_jwt_secret_key_some_random_string_here_987654321"
```

### 4. Sinkronisasi Database (Push Schema)
Jalankan perintah berikut untuk mengunggah skema database (User, Video, UserVideo, Setting) ke PostgreSQL:
```bash
npx prisma db push
```

### 5. Masukkan Data Sampel (Seeding)
Isi database dengan data tes awal seperti Admin, Member, Video Prenatal, dan Pengaturan awal:
```bash
npx prisma db seed
```

### 6. Jalankan Server Lokal
Mulai aplikasi dalam mode development:
```bash
npm run dev
```
Buka browser Anda di **[http://localhost:3000](http://localhost:3000)**.

---

## 🔑 Kredensial Akun Pengujian

Gunakan akun berikut untuk menguji seluruh fitur platform:

### 👥 Peran: MEMBER (Bunda)
* **Halaman Login:** `/login`
* **Akun Tes 1:**
  * **Email:** `bunda.siti@gmail.com`
  * **Password:** `bunda123`
  * *Trimester:* Trimester 2 (Mendapat akses ke video latihan T-1 dan T-2)
* **Akun Tes 2:**
  * **Email:** `bunda.rara@gmail.com`
  * **Password:** `bunda456`
  * *Trimester:* Trimester 3 (Mendapat akses ke video latihan T-1 dan T-3)

### ⚙️ Peran: ADMINISTRATOR
* **Halaman Login:** `/admin/login` (Halaman tersembunyi khusus admin)
* **Akun:**
  * **Email:** `admin@vatsalyayoga.com`
  * **Password:** `admin123`

---

## 💡 Fitur Ungkapan Keunggulan (Premium UX/UI)

1. **Custom YouTube Player Preview**: Video Preview memuat gambar thumbnail ringan dari Unsplash/YouTube API dan hanya memicu loading iframe YouTube setelah tombol "Play" diklik, mencegah beban loading awal website yang berat.
2. **WhatsApp Share Credential Link**: Ketika Admin mendaftarkan member baru, sistem akan meng-generate tombol pintasan WhatsApp. Saat diklik, browser akan membuka WhatsApp Web dengan teks pesan berisi URL login, email, dan password akun baru tersebut sehingga Bunda bisa langsung diberitahu.
3. **Bulk Assignment**: Admin dapat memilih banyak member sekaligus di panel `/admin/assign` dan memberikan paket video kelas trimester tertentu hanya dalam satu klik tombol.
4. **Maintenance Mode Toggle**: Admin dapat menyalakan mode perbaikan secara instan di halaman Pengaturan untuk mengunci akses halaman publik tanpa menyentuh kode.
5. **Interactive Toasts**: Dilengkapi notifikasi mengambang dengan micro-animation (Framer Motion) untuk memberikan respon instan setiap kali user berhasil masuk, mendaftar, menyelesaikan video, maupun merubah pengaturan.
