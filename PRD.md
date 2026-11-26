# Product Requirements Document (PRD) & System Architecture Bible
## Galeri Karya Komputer SD — Dashboard V20+ (Production Ready)

> **Dokumen ini adalah Sumber Kebenaran Tunggal (*Single Source of Truth*)** untuk seluruh spesifikasi, alur kerja, logika bisnis, skema data, konfigurasi kredensial, dan arsitektur kode aplikasi **Galeri Karya Komputer SD**.  
> Wajib dibaca oleh pengembang atau AI Assistant sebelum melakukan perubahan kode agar tidak terjadi halusinasi atau regresi fitur.

---

## 1. Ringkasan Eksekutif & Visi Produk

**Galeri Karya Komputer SD** adalah platform web interaktif modern yang dirancang khusus untuk memamerkan, mengumpulkan, dan menilai hasil karya tugas komputer siswa Sekolah Dasar (Kelas 4, 5, dan 6).

### Nilai Utama:
* **Desain Berkelas & Menyenangkan (*Kid-Friendly yet Professional*):** Memadukan estetika *Dark Glassmorphism*, animasi fisika kenyal (*spring bounce*), kartu flip 3D, lingkaran dial pemilihan kelas, dan efek glow outline yang halus.
* **Performa Tinggi:** Animasi 60fps/120fps menggunakan GPU compositing (Framer Motion), React Portals untuk modal/lightbox, dan penguncian scroll layar.
* **Dual-Backend Resilience:** Bekerja mulus dengan Google Spreadsheet & Google Drive, didukung *local persistence layer* di browser agar data karya baru siswa tidak pernah hilang saat sinkronisasi background.

---

## 2. Tech Stack & Dependensi Utama

| Kategori | Teknologi | Deskripsi / Peran |
| :--- | :--- | :--- |
| **Framework** | **React 18** (Vite 6 SPA) | Client-side reactive Single Page Application |
| **Styling** | **Tailwind CSS 3.4** | Utility-first CSS dengan custom animations & glassmorphism |
| **Motion Engine** | **Framer Motion 11** | Animasi kartu 3D flip, spring bounce, layoutId, dan motion values |
| **Icons** | **Lucide React** | Ikon vektor modern berdesain bersih |
| **File Handling** | **JSZip & File-Saver** | Download massal karya kelas dalam 1 berkas ZIP |
| **Spreadsheet Parsing** | **XLSX (SheetJS)** | Import & Export data siswa via file Excel (`.xlsx`) |
| **Database & Storage** | **Google Sheets & Google Drive** | Penyimpanan data master dan file melalui GViz / Google Apps Script |
| **Offline Cache** | **LocalStorage + In-Memory** | Sinkronisasi karya baru siswa agar tahan terhadap polling spreadsheet |

---

## 3. Struktur Direktori Proyek

```
d:\kirimtugaskomputer\
├── index.html                   # HTML Entry point (Google Fonts: Plus Jakarta Sans, Kalam)
├── package.json                 # Dependencies & scripts (npm run dev, npm run build)
├── vite.config.js               # Konfigurasi Vite (port: 3000, build rollup options)
├── tailwind.config.js           # Konfigurasi Tailwind & animasi custom (glow, spin)
├── GAS_Code.gs                  # Source code Google Apps Script (Web App endpoint)
├── percakapan.md                # Log riwayat lengkap pembaruan (Iterasi 1 s.d. 40)
├── PRD.md                       # Dokumen PRD dan arsitektur sistem ini
└── src/
    ├── main.jsx                 # React root mount
    ├── App.jsx                  # Main wrapper, context providers, auth check
    ├── index.css                # Custom CSS, glass-card, utility styles, keyframes
    ├── context/
    │   ├── AuthContext.jsx      # State login, peran (guru/siswa), session storage
    │   ├── DataContext.jsx      # State database, polling 12s, local submissions cache
    │   ├── ToastContext.jsx     # Floating notification toast (success, error)
    │   └── ConfirmContext.jsx   # Interactive confirmation modal (dialog ya/tidak)
    ├── services/
    │   └── api.js               # Komunikasi GViz & Google Apps Script API
    ├── utils/
    │   ├── helpers.js           # ID extractors, link thumbnail, Scratch/PDF detector
    │   └── motion.js            # Preset animasi Framer Motion (springBounce, fadeInScale)
    └── components/
        ├── auth/
        │   └── Login.jsx        # Login 3D Flip Card, Running Glow, Circular Dial Kelas
        ├── common/
        │   ├── Avatar.jsx       # Avatar siswa/guru dengan foto/inisial
        │   ├── Button.jsx       # Tombol dengan spring tap animation
        │   ├── Card.jsx         # Kontainer kartu glassmorphic
        │   ├── Input.jsx        # Form input reusable
        │   ├── Lightbox.jsx     # Viewport overlay (createPortal): Scratch, PDF, Image
        │   ├── Modal.jsx        # Modal popup (createPortal, body scroll lock)
        │   └── StatsCard.jsx    # Kartu statistik ringkasan dashboard
        ├── layout/
        │   └── DashboardLayout.jsx # Floating compact dock bar, tooltips, responsive nav
        ├── student/
        │   ├── StudentDashboard.jsx# Hero card, kartu tugas aktif, photo preview
        │   ├── StudentUpload.jsx   # Form upload, 2.8s smooth RAF progress bar
        │   └── StudentGallery.jsx  # Galeri karya siswa, tabel/grid, feedback guru
        └── teacher/
            ├── TeacherDashboard.jsx# Ringkasan guru, pending submission tracker
            ├── TeacherStudents.jsx # Kelola data siswa, import/export Excel, foto
            ├── TeacherProjects.jsx # Kelola tugas per folder kelas, status buka/tutup
            ├── TeacherGallery.jsx  # Galeri guru, filter kelas/project, penilaian, ZIP
            └── TeacherSettings.jsx # Pengaturan akun, ganti password, URL GAS
```

---

## 4. Modul Autentikasi & Alur Login

### A. Fitur 3D Flip Card & Running Glow Border ([Login.jsx](file:///d:/kirimtugaskomputer/src/components/auth/Login.jsx))
1. **Dimensi Terkunci:**
   * Kartu login memiliki ukuran tetap: `w-full max-w-[430px]` dan `min-h-[470px]` (atau `h-[470px]`) dengan `perspective: 1000px`.
   * Membalik kartu antara tampak depan (*front*: Pilihan Peran) dan tampak belakang (*back*: Form Login Siswa/Guru) menggunakan animasi `rotateY(180deg)` dengan `transform-style: preserve-3d`.
   * **Tidak ada lonjakan posisi** (*zero layout shift*) saat kartu berbalik.
2. **Efek Running Glow Outline:**
   * Outline kartu dikelilingi cahaya animasi yang berjalan memutari sudut melengkung kartu (*rounded borders*), menggunakan pseudo-elemen `conic-gradient` dengan keyframes `spinGlow` (6 detik).

### B. Login Guru:
* **Hanya Menggunakan PIN:** Cukup masukkan **PIN: `2389`** (sederhana, cepat, dan terpusat).
* *Fallback username & password:* `admin` / `admin123`.
* Tombol *Kembali ke Pilihan Peran* membalik kartu secara 3D ke menu awal.

### C. Login Siswa (Animasi Lingkaran Dial Kelas):
1. **Tahap 1 (Lingkaran Tengah Awal):**
   * Saat pertama kali siswa dipilih, kartu hanya menampilkan satu lingkaran kecil elegan di tengah dengan logo topi toga (`GraduationCap`).
   * Tidak ada teks berantakan (*clean aesthetic*).
2. **Tahap 2 (Ekspansi Dial Kelas Melingkar):**
   * Saat lingkaran tengah diklik, kelas-kelas (**4A, 4B, 5A, 5B, 6A, 6B**) muncul memancar mengelilingi lingkaran tengah secara orbital dengan efek *spring bounce*.
   * Teks kelas (misal: "4A") berada di dalam bulatan tersendiri dengan efek hover yang membal (*bouncy hover*).
3. **Tahap 3 (Pemilihan Kelas & Animasi Masuk):**
   * Saat salah satu bulatan kelas diklik, dial kelas menutup kembali (*animasi balik ke asal*), dan halaman langsung bertransformasi menampilkan pilihan/input nama siswa dan PIN siswa.
4. **Tahap 4 (Kredensial Siswa):**
   * Default PIN siswa: **`1234`**.
   * Jika tombol *Kembali ke Pilihan Peran* diklik, kartu berbalik secara 3D dan status dial siswa di-reset kembali ke lingkaran kecil di tengah.

---

## 5. Modul Siswa (*Student Journey*)

### A. Dashboard Siswa ([StudentDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentDashboard.jsx))
* **Hero Banner:** Sapaan ramah sesuai nama siswa, avatar foto profil (bisa diklik untuk preview layar penuh via React Portal), dan indikator tugas yang belum diselesaikan.
* **3 Kartu Statistik:** Tugas Aktif, Karya Sudah Dikumpul, dan Tugas Menunggu.
* **Aksi Cepat:** Tombol langsung menuju menu *Upload Karya* atau *Lihat Galeri*.

### B. Upload Karya Siswa ([StudentUpload.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentUpload.jsx))
* **Pilihan File:** Gambar (`.jpg`, `.jpeg`, `.png`), Dokumen (`.pdf`, `.ppt`, `.pptx`, `.xls`, `.xlsx`), Game Scratch (`.sb3`). Maksimal 5MB.
* **Animasi Load Bar Super Halus (Kecepatan Medium 2.8 Detik):**
  * **Trek Luar:** Bentuk kapsul pill track warna charcoal gelap (`#242e35`), border tebal 3px, sudut rounded-full.
  * **Batang Pengisi (*Fill Bar*):** Warna sage green (`#477d5f`), bergerak dari `width: 0%` hingga `100%` diproses oleh hardware GPU (`will-change: width`).
  * **Gelembung Persentase (*Speech Bubble Tooltip*):** Warna charcoal gelap dengan jarum segitiga ke bawah, meluncur presisi dari `left: 5%` hingga `95%` tepat di atas ujung batang pengisi.
  * **Hardware Sync:** Sinkronisasi refresh rate 60Hz/120Hz/144Hz via `requestAnimationFrame` dan `performance.now()`, tanpa transisi CSS yang bentrok (*zero stutter/patah-patah*).
  * **Bebas Saweran:** Efek confetti (*saweran*) dihilangkan total agar tampilan bersih dan profesional.
  * **Transisi Otomatis:** Begitu mencapai 100%, payload karya tersimpan ke local persistence & spreadsheet, toast sukses muncul, dan dalam 400ms siswa otomatis dialihkan ke halaman galeri.

### C. Galeri Karya Siswa ([StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx))
* **Dual Tampilan:** Mode Grid Kartu & Mode Tabel.
* **Thumbnail Pintar:**
  * File gambar: Menampilkan preview gambar jernih.
  * File PDF: Menampilkan kartu badge merah elegan dengan ikon `FileText` dan tombol "Buka PDF".
  * File Office (PPT, Excel, Word): Menampilkan kartu badge biru/ungu dengan ikon dokumen.
  * File Scratch: Menampilkan badge game Scratch bernuansa jingga/amber.
* **Feedback Guru:** Catatan guru ditampilkan dengan font tulisan tangan santai (*Kalam* cursive), dan nilai ditampilkan dengan cap stempel merah miring (*Comic Sans MS*).
* **Ganti File Karya:** Siswa masih dapat mengubah berkas karyanya sebelum dinilai oleh guru.

---

## 6. Modul Guru (*Teacher Journey*)

### A. Dashboard Guru ([TeacherDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherDashboard.jsx))
* Statistik real-time: Total Siswa, Total Project Tugas, Total Karya Masuk, dan Siswa Belum Kumpul.
* Sapaan profil guru dinamis dan panel riwayat upload karya terbaru.

### B. Manajemen Data Siswa ([TeacherStudents.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherStudents.jsx))
* **CRUD Siswa:** Tambah, edit, dan hapus siswa lengkap dengan kompresi foto otomatis (300px JPEG).
* **Import & Export Excel:** Download template Excel, isi daftar siswa, dan upload langsung via SheetJS (`.xlsx`).
* **Hapus Massal:** Multi-select siswa dengan modal konfirmasi interaktif.

### C. Manajemen Project Tugas ([TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx))
* Pengelompokan tugas berdasarkan tab kelas (Semua Kelas, 4A, 4B, 5A, 5B, 6A, 6B) dengan slider kapsul `layoutId`.
* Status tugas dapat diaktifkan atau dinonaktifkan (*Aktif* vs *Tutup*).

### D. Galeri & Penilaian Karya ([TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx))
* Filter per folder kelas, per tugas, dan pencarian instan nama siswa.
* **Input Penilaian Langsung:** Guru dapat mengetik nilai angka (0-100) dan catatan evaluasi, lalu klik tombol kirim.
* **Unduh Seluruh Karya Kelas (Batch ZIP):** Mengumpulkan seluruh file submission kelas terpilih dan mengunduhnya sebagai satu file ZIP rapi menggunakan JSZip.
* **Download File Coding Scratch (.sb3):** Tombol download khusus untuk file game siswa kelas 6.
* **Sidebar Tracker Siswa Belum Kumpul:** Guru dapat melihat secara transparan siapa saja siswa yang belum mengumpulkan tugas.

### E. Pengaturan Akun & API ([TeacherSettings.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherSettings.jsx))
* Ganti nama guru, username, dan password login.
* Konfigurasi URL Google Apps Script Web App (`/exec`) dan tombol **Simpan & Tes Koneksi**.

---

## 7. Arsitektur Modal & Lightbox (*The React Portal Bible*)

> [!IMPORTANT]
> **Aturan Wajib:** Setiap komponen yang menggunakan `position: fixed` (seperti Modal, Lightbox, dan Avatar Photo Overlay) **WAJIB DIRENDER MENGGUNAKAN `createPortal(..., document.body)`**.

### Mengapa Ini Wajib?
Jika elemen `position: fixed` berada di dalam elemen beranimasi yang memiliki CSS `transform` (misal `<motion.div variants={fadeInScale}>` atau transisi Framer Motion), maka peramban akan memperlakukan elemen fixed tersebut sebagai `absolute` terhadap leluhur yang memiliki transform tersebut. Hal ini menyebabkan modal terperangkap di dalam scrollable container dashboard, memanjangkan halaman ke bawah dan memunculkan scrollbar raksasa.

### Fitur Lengkap [Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx):
1. **Render Portal:** Selalu menempel langsung ke `document.body` dengan `z-[9999999]` dan dimensi terkunci `100vw` × `100dvh`.
2. **Scroll Lock:** Mengunci `document.body.style.overflow = 'hidden'` saat terbuka dan mengembalikannya saat ditutup.
3. **Keyboard & Backdrop:** Menutup otomatis jika tombol **Escape** ditekan atau area gelap backdrop diklik.
4. **Viewer Gambar:** Mendukung Zoom In (+), Zoom Out (-), Reset persentase, wheel zoom, dan drag mouse saat zoom > 1x.
5. **Viewer PDF:** Membuka iframe responsive `max-w-5xl h-[82vh]` (baik Google Drive `/preview` maupun base64 data) lengkap dengan tombol *Buka di Tab Baru* dan *Download PDF*.
6. **Viewer Game Scratch:**
   * Proyek online Scratch MIT: Switcher pemutar ganda antara **⚡ TurboWarp (60fps)** dan **🐱 Scratch MIT Resmi**.
   * File `.sb3`: Pemutar lokal internal (`/scratch-player.html`) atau link ke TurboWarp Editor online.
7. **Viewer Office Dokumen:** Preview Google Drive terintegrasi atau kartu download berkas Office.

---

## 8. Skema Data & Mekanisme Sinkronisasi

### A. Dual Backend: Google GViz vs Google Apps Script
1. **GViz Endpoint (Read-Only Default):**
   * Mengambil data spreadsheet publik secara cepat tanpa kuota login:
     `https://docs.google.com/spreadsheets/d/1xqVsKnSEiasss2f_o7FY-F7cZy3Pyz5cMp-4J1tG6RM/gviz/tq?tqx=out:json`
2. **Google Apps Script Web App (Read/Write):**
   * Dideploy via menu Apps Script dari kode `GAS_Code.gs`.
   * Menerima aksi POST: `add`, `update`, `delete` untuk tabel `submissions`, `users`, `projects`, `classes`.

### B. Struktur Tabel Spreadsheet
* **Sheet `classes`:** `id`, `name`, `createdAt`
* **Sheet `users`:** `id`, `name`, `role`, `classId`, `pin`, `username`, `password`, `photo`, `createdAt`
* **Sheet `projects`:** `id`, `title`, `desc`, `classId`, `deadline`, `status`, `createdAt`
* **Sheet `submissions`:** `id`, `studentId`, `projectId`, `title`, `fileData`, `fileName`, `fileExt`, `nilai`, `catatan`, `feedback`, `createdAt`

### C. Layer Persistensi Lokal (*Anti-Wipe Cache*)
* **Masalah:** GViz bersifat read-only. Saat background polling berjalan setiap 12 detik, data spreadsheet online akan menimpa data React state.
* **Solusi [DataContext.jsx](file:///d:/kirimtugaskomputer/src/context/DataContext.jsx):**
  * Semua submission baru disimpan ke `localStorage` dengan kunci `galeri_local_submissions`.
  * Saat polling 12 detik atau refresh halaman terjadi, `DataContext` secara otomatis **menggabungkan (*merge*)** data lokal dengan data spreadsheet online.
  * Hasil upload siswa tidak akan pernah hilang meskipun Google Apps Script Web App belum dihubungkan.

---

## 9. Pedoman UI/UX & Design Tokens

* **Palet Warna Utama:**
  * Background Dashboard: Gradasi ungu lembut `#EFE9FE` → `#F6F3FE` → `#ECE5FD`.
  * Dock Navigasi: Hitam pekat obsidian `#0F111A` dengan transparansi 95% dan border putih halus `border-white/10`.
  * Hero Card Banner: Pemandangan sinematik geometris (`/login-bg.jpg`) dengan lapisan *Dark Glass Gradient Tint* (`from-[#0B0D18]/92 via-[#0F111A]/82 to-[#141226]/85`) dan border kristal halus `border-white/15`.
  * Track Bar Upload: Charcoal gelap `#242e35` (border 3px).
  * Batang Isi Upload: Sage green `#477d5f`.
  * Aksen Guru/Siswa: Violet `#7c3aed`, Indigo `#4f46e5`, Amber `#f59e0b`, Emerald `#10b981`, Rose `#f43f5e`.
* **Tipografi:**
  * Teks Utama & UI: `Plus Jakarta Sans`, sans-serif (tebal, modern, bersih).
  * Nama Guru & Siswa pada Hero Card: `Kalam`, cursive (tulisan tangan tegas bernuansa artistik & berkarakter).
  * Catatan Guru: `Kalam`, cursive (seperti tulisan tangan guru asli).
  * Nilai Siswa: `Comic Sans MS`, cursive (stempel nilai merah bersahabat).

---

## 10. Kredensial Default Sistem

| Peran | Metode Login | Kredensial Default |
| :--- | :--- | :--- |
| **Guru** | **PIN Sederhana** (Rekomendasi) | **PIN: `2389`** |
| **Guru** | Username & Password (Fallback) | User: `admin` / Pass: `admin123` |
| **Siswa** | Pilihan Kelas Dial + Nama Siswa | **PIN: `1234`** |

---

## 11. Panduan Anti-Halusinasi untuk Pengembang & AI (Golden Rules)

1. **JANGAN MERENDER MODAL / LIGHTBOX TANPA PORTAL:** Selalu gunakan `createPortal(..., document.body)`. Jangan pernah menaruh `position: fixed` di dalam `<motion.div>` yang memiliki transform.
2. **JANGAN MENGUBAH PIN GURU:** PIN Guru adalah **`2389`**. Jangan diubah menjadi kredensial lain kecuali atas permintaan eksplisit pengguna.
3. **JANGAN MENGEMBALIKAN EFEK SAWERAN / CONFETTI:** Efek kembang api/saweran pada upload siswa sudah diminta dihapus permanen oleh pengguna.
4. **JANGAN MENAMBAH TRANSISI CSS PADA LOAD BAR:** Load bar di [StudentUpload.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentUpload.jsx) harus tetap menggunakan Framer Motion GPU (`linear`, 2.8s) dan `requestAnimationFrame`. Menambahkan `transition-all` pada CSS akan memicu bug patah-patah (*judder*).
5. **JANGAN MENGHAPUS LOCAL PERSISTENCE CACHE DI DATACONTEXT:** Fungsi `galeri_local_submissions` dan `galeri_local_users` wajib dipertahankan agar karya siswa dan foto profil pengguna tidak terhapus saat polling spreadsheet 12 detik berjalan.
6. **PENGUJIAN BUILD WAJIB BERSIH:** Sebelum menyelesaikan tugas, selalu pastikan `npm run build` berjalan dengan exit code 0 tanpa error TypeScript/JSX/Vite.
7. **JANGAN MENAIKKAN RESOLUSI / KUALITAS KOMPRESI AVATAR MELEBIHI 200px / 0.72:** Sel Google Sheets memiliki batas maksimal 50.000 karakter. Kompresi `compressAvatar(file, 200)` dengan kualitas `0.72` menghasilkan string base64 ~8–12KB yang aman dari terpotongnya data (truncation).
8. **JANGAN MERENDER FOTO USER TANPA ERROR FALLBACK:** Selalu sediakan handler `onError` dan fallback inisial nama / ikon kamera jika URL foto profil atau Google Drive thumbnail gagal dimuat.

---

## 12. Penerapan Standar Anti-Slop UI/UX (Selesai Diterapkan)

Aplikasi telah dibersihkan secara komprehensif mengikuti standar **Anti-Slop UI Design Tokens & Guidelines**:
1. **Eliminasi Total Emoji Teks:**
   * Seluruh emoji Unicode (🚀, ✨, 🌟, 📸, 🎉, 👋, 🏆, 🎯, 🐱, ⚡) pada teks tombol, toast notification, header kartu, dan label telah dihapus 100% dan digantikan oleh ikon vektor SVG murni dari `lucide-react`.
2. **Penyempurnaan Label & Redundansi Navigasi:**
   * Tab filter kelas pada Galeri Guru dan Kelola Project disederhanakan dari "Folder 4A, Folder 4B" menjadi "4A, 4B" yang bersih, menghemat ruang visual dan mengurangi kebisingan teks (*text clutter*).
   * Menghilangkan badge kilauan floating dekoratif yang tidak perlu pada header login.
3. **Penyelarasan Toast Notification:**
   * Seluruh toast notifikasi sistem kini menggunakan bahasa lugas, profesional, dan bersih tanpa akhiran emoji norak (misal: "Karyamu berhasil dikirim!", "Foto profil berhasil diperbarui", "Penilaian berhasil disimpan").
4. **Verifikasi Build:**
   * `npm run build` sukses 100% (0 error) dan dev server aktif di port 3000.

---

## 13. Sidebar Desktop Fleksibel & Ketahanan Foto Profil (Update V21)

1. **Sidebar Desktop Expandable / Collapsible (`DashboardLayout.jsx`):**
   * **Tombol Panah Toggle:** Ikon `<ChevronRight size={14} />` berbentuk tombol melingkar pada batas kanan sidebar yang berputar 180° saat diklik.
   * **Mode Ciut (`w-[88px]`):** Tampilan dock kapsul ringkas, ikon terpusat, dengan smooth bounce tooltip pill saat disentuh kursor.
   * **Mode Melebar (`w-[245px]`):** Melebar mulus menampilkan logo, judul aplikasi lengkap, nama label menu di samping ikon, indikator aktif titik putih, dan teks tombol keluar.
   * **Persistensi State:** Disimpan pada `localStorage` kunci `galeri_sidebar_expanded`.
2. **Ketahanan & Fallback Foto Profil Pengguna:**
   * **Local Storage Sync:** Kunci `galeri_local_users` di `DataContext.jsx` melindungi foto profil pengguna dari background polling spreadsheet 12 detik.
   * **Ukuran Base64 Teroptimasi:** Kompresi 200x200 @ 0.72 (~8-12KB) mencegah string base64 terpotong oleh batasan sel Google Sheets (50.000 karakter).
   * **Multi-Endpoint Drive Thumbnail:** Endpoint `drive.google.com/thumbnail?id=...&sz=w400` menangani izin akses publik dengan stabil.
   * **Auto Fallback Kamera / Inisial:** Jika gambar gagal dimuat (403/404/corrupt), sistem otomatis menampilkan placeholder kamera atau inisial nama tanpa pernah merusak tata letak atau menampilkan lingkaran transparan dengan teks alt.


---

## 14. Perbaikan Bug Galeri Guru & Filter Karya (Sesi Nov 25, 2026)

### Masalah yang Ditemukan

**Root Cause:** Bukan bug kode, melainkan masalah UX filter tugas + normalisasi ID string.

1. **Dropdown filter tugas terlalu sempit** (`max-w-[170px]`) sehingga judul tugas terpotong — "Membuat Disain Ka..." terlihat seolah satu tugas, padahal ada dua:
   - "Membuat Disain Karakter Panda" → **0 karya** (yang dipilih guru tanpa sadar)
   - "Membuat Design T-Shirt With CorelDraw" → **13 karya** (tugas yang dimaksud)
2. **ID matching terlalu ketat** (`===`) tanpa normalisasi string, rentan terhadap spasi tersembunyi atau perbedaan huruf besar/kecil.
3. **Data siswa di spreadsheet sudah ada** — total 31 karya siswa 5A terverifikasi via GViz live query. Tidak ada data yang hilang.
4. **Payload submission kurang lengkap** — `studentName`, `classId`, `className` tidak disertakan sehingga filter fallback gagal.

### Perbaikan yang Diterapkan

| File | Perubahan |
|---|---|
| `src/components/teacher/TeacherGallery.jsx` | Semua ID matching dinormalisasi `String().trim().toLowerCase()` |
| `src/components/teacher/TeacherGallery.jsx` | Helper `getSubmissionsCountForProject(projectId)` + `totalClassSubmissions` |
| `src/components/teacher/TeacherGallery.jsx` | Dropdown tugas diperlebar + tampilkan jumlah karya: `Membuat Design T-Shirt (13 karya)` |
| `src/components/teacher/TeacherGallery.jsx` | Empty state informatif + tombol "Lihat Semua Karya 5A (31 Karya)" jika tugas terpilih 0 karya |
| `src/components/teacher/TeacherGallery.jsx` | Sidebar "Belum Kumpul" diperbarui ID matching-nya |
| `src/components/student/StudentUpload.jsx` | Payload submission menyertakan `studentName`, `classId`, `className` sebagai fallback data |

### Golden Rule Tambahan (wajib dipatuhi)

- **JANGAN batasi lebar dropdown filter tugas di bawah 200px.** Gunakan min-width atau truncate yang proporsional.

---

## 15. Redirect Domain Terpusat (Sesi Nov 25, 2026)

### Masalah

Dua domain aktif secara paralel:
- `kirimtugaskomputer.vercel.app` (default Vercel)
- `kirimtugaskomputer.my.id` (domain custom)

Siswa yang mengakses `.vercel.app` menyimpan data di `localStorage` browser domain tersebut. Data tidak sync ke domain `.my.id` yang berbeda origin → karya tidak muncul di halaman guru yang membuka `.my.id`.

### Solusi yang Diterapkan

1. **`vercel.json`** — Redirect 301 permanen: semua traffic dari `kirimtugaskomputer.vercel.app` → `https://kirimtugaskomputer.my.id/$1`
2. **`index.html`** — Script inline redirect browser-side sebagai lapisan pengaman kedua
3. **Rekomendasi manual:** Vercel Dashboard → Settings → Domains → Set `kirimtugaskomputer.my.id` sebagai **primary domain**

### Instruksi untuk Pengguna

- Bagikan **hanya** link `https://kirimtugaskomputer.my.id` kepada semua siswa
- Hapus link lama `.vercel.app` dari grup WhatsApp / papan pengumuman

---

## 16. Temuan Teknis Spreadsheet & GAS (Sesi Nov 25, 2026)

### Spreadsheet ID
`1xqVsKnSEiasss2f_o7FY-F7cZy3Pyz5cMp-4J1tG6RM`

### Record Korup di Sheet `classes`
Sheet `classes` memiliki 1 record korup: `class-1` dengan nama `{"name":"Kelas 5A",...}` (nilai JSON tertulis sebagai string). Filter ID harus mengabaikan record ini secara otomatis — sudah ditangani oleh normalisasi string.

### GAS Web App
URL GAS yang ditemukan di git history mengembalikan HTML (bukan JSON), menandakan endpoint tersebut adalah endpoint lama dan tidak aktif sebagai REST API. Aplikasi sudah berjalan dengan fallback GViz read-only yang berfungsi normal.

### Verifikasi Data Live (GViz Query Nov 25, 2026)
- Sheet `submissions`: 88 baris data, sudah ada karya dari Adskhan, Adreena, Alfatih, Nisrina, dll.
- Tugas T-Shirt (5A): 13 karya terverifikasi
- Total karya siswa 5A: 31 karya terverifikasi


---

## 17. Penyelidikan Sistem, Eksperimen UI, dan Dokumentasi Sesi Malam (Sesi Nov 25, 2026)

### 1. Klarifikasi Folder Kerja GitHub Desktop
- **Kondisi:** Di GitHub Desktop terdeteksi dua folder dengan nama yang sama:
  - `D:\kirimtugaskomputer`
  - `C:\Users\user\Documents\GitHub\kirimtugaskomputer`
- **Keputusan:** Folder **`D:\kirimtugaskomputer`** adalah folder **AKTIF / RIIL** tempat seluruh kodingan, build, editor, dan aset berada. Folder di drive C adalah clone lama yang dapat dihapus dari daftar GitHub Desktop.

### 2. Analisis Kasus Upload Siswa "Karakter Panda" & Pengaruh Domain
- **Kasus:** Siswa mengupload tugas Panda di laptop masing-masing dan terlihat tersimpan di layar siswa, namun tidak muncul sama sekali di layar Guru.
- **Penyebab Akar (Root Causes):**
  1. **Kekosongan Endpoint Tulis (GAS Backend URL):**
     - Aplikasi membaca data melalui jalur GViz (Read-Only) yang berfungsi normal.
     - Namun untuk menulis data (upload karya), aplikasi memerlukan Web App Google Apps Script (`VITE_GAS_API_URL`).
     - Karena variabel ini belum diisi, `DataContext.jsx` otomatis mengalihkan penyimpanan ke *offline fallback* (`localStorage` lokal di browser laptop siswa).
     - Akibatnya: Di laptop siswa tampak tersimpan, namun baris data di sheet `submissions` Google Spreadsheet **tetap 0** dan file tidak pernah terkirim ke Google Drive.
  2. **Isolasi Domain & Pintasan Microsoft Edge:**
     - Pintasan di desktop laptop siswa dibuat dari domain lama `kirimtugaskomputer.vercel.app`.
     - Guru membuka domain baru `kirimtugaskomputer.my.id`.
     - Berdasarkan *Same-Origin Policy*, data lokal browser pada `.vercel.app` tidak dapat diakses oleh domain `.my.id`.
- **Solusi yang Diterapkan & Rekomendasi:**
  - Redirect 301 otomatis dari `.vercel.app` ke `.my.id` sudah terpasang di `vercel.json` dan `index.html`.
  - Pintasan Edge di desktop siswa diarahkan ke `kirimtugaskomputer.my.id`.
  - Backend `GAS_Code.gs` perlu di-deploy sebagai Web App ("Anyone") pada Google Sheets agar karya siswa langsung masuk ke Drive & Spreadsheet.

### 3. Eksperimen Skala Tampilan (Zoom 67%) & Pembatalan (Revert)
- **Permintaan:** Mencoba mengunci tampilan browser di skala 67% secara default saat link dibuka.
- **Uji Coba:** Diterapkan CSS `zoom: 0.67` pada `body` untuk layar desktop/laptop (`min-width: 768px`).
- **Evaluasi & Keputusan:** Tampilan visual dinilai tidak optimal oleh pengguna ("aduh jadi jelek kembalikan ke normal saja").
- **Tindakan:** Seluruh penambahan kode CSS zoom langsung di-revert/dihapus dari `src/index.css`. Tampilan dikembalikan 100% ke ukuran asli bawaan sistem.

### 4. Diagnosis Masalah Koneksi GitHub Desktop (Port 443 Timeout)
- **Gejala:** Muncul error `Failed to connect to github.com:443 after 21093 ms: Could not connect to server` saat melakukan push via GitHub Desktop.
- **Diagnosis:** Masalah koneksi internet/Wi-Fi yang mengalami timeout sesaat (RTO 21 detik) saat menghubungi server GitHub, bukan kerusakan kode repository.
- **Verifikasi:** Tes jaringan `Test-NetConnection -ComputerName github.com -Port 443` menghasilkan `TcpTestSucceeded: True`. Masalah diselesaikan cukup dengan menekan tombol **"Retry push"** di GitHub Desktop.


---

## 18. Integrasi Penuh Backend Google Apps Script & Auto-Sync Cloud (Update Nov 26, 2026)

### 1. Masalah yang Diselesaikan:
- **Karya Siswa Tidak Sampai ke Google Drive & Spreadsheet:**
  Karya siswa untuk tugas *"Membuat Karakter Panda"* (Kelas 5) dan *"Membuat Kalkulator with Scratch"* (Kelas 6) tersimpan di memori lokal laptop anak (`localStorage`) namun tidak masuk ke Google Spreadsheet.
- **Penyebab Akar:**
  Variabel `VITE_GAS_API_URL` sebelumnya kosong dan fungsi `callGas` melakukan *silent fake success*. Akibatnya data tidak pernah terkirim ke internet/cloud.

### 2. Solusi Permanen yang Diterapkan:
1. **Pemasangan URL Backend Aktif (`src/services/api.js` & `.env`):**
   - URL Google Apps Script Web App resmi dihubungkan:  
     `https://script.google.com/macros/s/AKfycbxyVjg2bHGUEDsXCTQ8_rDO1qxNp-aoLDR2nISfov5TaS7bHXjTlyawf9m0NdcL9Whc/exec`
   - Dipasang sebagai nilai fallback global di `api.js` sehingga **seluruh laptop siswa di lab komputer otomatis langsung terhubung ke backend tanpa perlu pengaturan manual**.
2. **Mekanisme Auto-Sync Otomatis (`src/context/DataContext.jsx`):**
   - Setiap kali aplikasi dibuka di laptop siswa atau laptop guru, sistem memindai memori lokal (`localStorage.getItem('galeri_local_submissions')`).
   - Jika ditemukan karya yang berstatus belum tersinkron (berisi data raw base64 atau ID lokal), sistem secara otomatis mengunggahnya ke Google Apps Script di latar belakang.
   - Begitu berhasil diunggah ke Google Drive dan tercatat di Google Spreadsheet, ID lokal diganti dengan ID permanen cloud.
   - **Dampak Penyelamatan:** Anak-anak atau guru cukup membuka kembali web `kirimtugaskomputer.my.id` di laptop lab, dan seluruh karya yang sebelumnya tertahan di laptop tersebut akan **otomatis terunggah ke Google Drive & Spreadsheet**.
3. **Otorisasi Google Drive (`GAS_Code.gs`):**
   - Ditambahkan fungsi `testDriveAccess()` di awal `GAS_Code.gs` untuk mempermudah otorisasi satu kali hak akses Google Drive (`DriveApp`) di Apps Script editor.

---

## 19. Migrasi Penuh ke Arsitektur Supabase Realtime & Storage (Update Nov 26, 2026)

### 1. Latar Belakang Migrasi:
- Google Apps Script Web App terhambat izin `DriveApp` anonim saat siswa mengunggah karya sekaligus dan tidak mendukung sinkronisasi WebSocket waktu-nyata.
- Aplikasi dimigrasikan ke **Supabase** (PostgreSQL + Realtime WebSocket + Supabase Storage bucket `karya`) dengan GAS sebagai fallback cadangan saja.

### 2. Komponen Arsitektur Baru:
- **Database Schema (`supabase_schema.sql` & `supabase_fix_rls.sql`):**
  - 4 tabel utama: `classes`, `users`, `projects`, `submissions` dengan policy RLS terbuka untuk `anon` & `authenticated`, serta publikasi `supabase_realtime` aktif.
  - Storage bucket publik `karya` untuk menyimpan berkas `.sb3`, `.jpg`, `.png`, dan `.pdf` secara langsung via HTTPS.
- **Supabase Client (`src/services/supabase.js`):**
  - Menginisialisasi `@supabase/supabase-js` client dengan Realtime `eventsPerSecond: 10` dan helper `uploadKaryaFile()` untuk konversi base64 data URL ke biner dan upload ke bucket `karya`.
- **Realtime Sync Layer (`src/context/DataContext.jsx`):**
  - Membaca data utama langsung dari Supabase (`getInitialData` fallback ke GAS hanya jika Supabase kosong/error).
  - Berlangganan kanal Realtime `public:submissions`, `projects`, dan `users` agar kiriman baru, nilai guru, dan revisi langsung tampil di layar tanpa reload halaman.
  - Sanitasi payload kolom (`pickColumns`) dan generate ID otomatis sebelum insert agar bebas mismatch skema Postgres.
- **Unduhan Berkas (`src/components/teacher/TeacherGallery.jsx`):**
  - Mendukung fetch langsung file `.sb3` dan pembungkusan ZIP dari URL publik Supabase Storage maupun link Google Drive lama.
- **Migrasi Data Lama (`migrate_to_supabase.js`):**
  - Seluruh data historis (6 kelas, 112 user setelah deduplikasi, 8 project, 88 submission) telah dimigrasikan dan diverifikasi di Supabase.

---

## 20. Fitur Sementara Penyelamat Karya Lokal (`LocalRescueModal`) (Update Nov 26, 2026)

### 1. Tujuan (Bersifat Sementara ±1 Minggu):
- Menyelamatkan seluruh file project siswa yang sebelumnya sempat tersangkut di penyimpanan lokal browser (`localStorage` key `galeri_local_submissions`) di laptop-laptop lab komputer, baik yang diunggah melalui `kirimtugaskomputer.my.id` maupun domain lama `kirimtugaskomputer.vercel.app`.

### 2. Cara Kerja:
- **Otomatis Muncul di Dashboard Siswa:** Saat siswa masuk ke halaman Dashboard (`activeMenu === 'dashboard'`) atau halaman Upload (`activeMenu === 'upload'`), `DataContext` mencocokkan isi `galeri_local_submissions` laptop tersebut dengan data live di Supabase.
- Jika ditemukan karya yang belum masuk Supabase, `LocalRescueModal` otomatis terbuka menampilkan daftar karya tersebut dengan status per file (Menunggu, Mengirim, Terkirim, Gagal), tombol **"Kirim"** mandiri per karya, serta tombol utama **"Kirim Semua Sekarang"** untuk mengunggah semuanya ke Supabase Storage bucket `karya` dan tabel `submissions`.
- **Banner Pengingat di Dashboard & Halaman Upload:** Jika siswa sempat menutup popup ("Tutup Sementara"), tetap terdapat banner peringatan ramah di bagian atas Dashboard dan halaman Upload bertuliskan *"Ditemukan X Karya Tersimpan di Laptop Ini"* dengan tombol *"Kirim ke Server Sekarang"* untuk memunculkan kembali modal kapan saja.
- **Dukungan Domain Lama (`.vercel.app`):** Redirect edge di `vercel.json` dimatikan sementara dan ditangani oleh `index.html` + `App.jsx`: domain `.vercel.app` hanya langsung me-redirect ke `.my.id` apabila `galeri_local_submissions` kosong; jika ada karya tersangkut, modal penyelamat muncul langsung di `.vercel.app` sebelum mengalihkan ke `.my.id`.

### 3. Cara Menutup Fitur Ini Setelah Periode Migrasi Selesai:
1. Ubah `ENABLE_LOCAL_RESCUE = false` di `src/context/DataContext.jsx` (atau hapus `src/components/common/LocalRescueModal.jsx`).
2. Kembalikan rule `"redirects"` 301 di `vercel.json` dan `index.html`.
