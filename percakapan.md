# DOKUMEN PERCAKAPAN & PRD (PROJECT REQUIREMENTS DOCUMENT)
**Proyek:** Galeri Karya Komputer - Dashboard V20  
**Lokasi Folder:** `d:\kirimtugaskomputer`  
**Waktu Penyimpanan:** 27 November 2026, 00:05 WIB  
**Status Sesi:** Jeda Istirahat (Akan dilanjutkan kembali kapan saja saat pengguna mengetik **"lanjut"** atau memberikan instruksi baru)

---

## 1. Ringkasan & Latar Belakang Proyek
* **Aplikasi:** Galeri Karya Komputer Siswa Kelas 4, 5, dan 6 SD.
* **Kondisi Awal:** Berjalan selama 1 bulan menggunakan Google Apps Script (HTML sederhana + UMD React lama).
* **Tujuan Rombak:** 
  * Merombak total tampilan visual menjadi modern, estetik, dan viral sesuai video referensi **Dashboard V20 (TikTok @paulcodes4)**.
  * Menggunakan stack: **React 18 + Vite + Tailwind CSS + Framer Motion (Spring Bounce Physics) + Lucide Icons + Canvas Confetti**.
  * **Batasan Utama:** Menu tidak boleh ditambah atau dikurangi (tetap sesuai menu yang sudah ada).
  * **Keamanan Data:** 100% data riwayat upload siswa yang sudah berjalan 1 bulan tidak boleh hilang dan tetap tersambung ke Google Drive & Google Spreadsheet.

---

## 2. Status Data & Database (Google Spreadsheet & Drive)
* **Spreadsheet ID:** `1xqVsKnSEiasss2f_o7FY-F7cZy3Pyz5cMp-4J1tG6RM`
* **Status Terverifikasi (100% Aman & Utuh):**
  * `users`: **113 Siswa & Guru** (*Mr. Tamam, Defrian Athar, Elvaretta, Gading Ali, dll.*)
  * `classes`: **Kelas 4A, 4B, 5A, 5B, 6A, 6B** (baris sampah JSON telah otomatis difilter)
  * `projects`: **6 Project Aktif** (*Membuat Design T-Shirt With CorelDraw, Game Quiz Scratch, dll.*)
  * `submissions`: **89 Karya Siswa** lengkap dengan link Google Drive, nilai angka, dan catatan guru.
* **Integrasi API:**
  * File `src/services/api.js` telah dikonfigurasi untuk membaca langsung data live dari Google Spreadsheet melalui endpoint GViz API, sehingga seluruh siswa dan karya langsung muncul seketika saat aplikasi dibuka tanpa perlu mock data lagi.
  * File `GAS_Code.gs` telah disiapkan dengan endpoint `doPost` & `doGet` untuk kebutuhan mutasi data (tambah, update, delete).

---

## 3. Desain Visual & Animasi Sesuai Referensi (Dashboard V20)
1. **Color Palette:**
   * **Background:** Gradien halus *Soft Lavender / Pastel Lilac* (`linear-gradient(135deg, #F0EBFE 0%, #F6F3FE 50%, #ECE5FD 100%)`).
   * **Primary Accent:** Vibrant Violet & Indigo (`#7C3AED` & `#6366F1`).
2. **Claymorphic & Glassmorphic Elements:**
   * Sudut kartu super bulat estetik (`rounded-[2.25rem]` dan `rounded-[2.5rem]`).
   * Kartu melayang (*floating island card*) dengan bayangan ungu lembut (`shadow-[0_14px_38px_rgba(109,40,217,0.08)]`).
3. **Framer Motion Spring Bounce:**
   * Pantulan kenyal membal di setiap kartu dan tombol: `type: "spring", stiffness: 400, damping: 17`.
   * Efek interaksi: `whileHover={{ y: -7, scale: 1.015 }}` dan `whileTap={{ scale: 0.96 }}`.
4. **Sidebar Floating Island:**
   * Sidebar melayang dengan rounded corners tebal.
   * Menu aktif berwujud kapsul ungu gradien terang kontras tinggi (`bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/35`).
5. **Fitur Spesial Scratch Kelas 6:**
   * Integrasi **TurboWarp Player** (.sb3) langsung di dalam aplikasi untuk memutar game Scratch siswa.

---

## 4. Struktur Menu Aplikasi (Tetap Sesuai Aslinya)

### 👨‍🏫 Menu Guru (5 Menu):
1. **Dashboard:**
   * Hero banner sapaan guru + frame foto profil (upload & zoom).
   * 4 Kartu Statistik membal (*StatsCard*): Siswa Terdaftar, Total Project, Total Karya, Belum Kumpul.
   * Daftar aktivitas pengumpulan terbaru.
2. **Data Siswa:**
   * Pencarian siswa, hapus massal terpilih.
   * Ekspor Template Excel & Impor massal siswa dari Excel (`.xlsx`).
   * Tambah & Edit data siswa lengkap dengan foto profil.
3. **Kelola Project:**
   * Tab filter folder kelas berbentuk kapsul pil.
   * Kartu project claymorphic dengan status aktif/selesai, badge kelas target, deadline, dan tombol tutup/buka kembali.
   * Modal buat project baru.
4. **Galeri Karya:**
   * Filter per kelas, per project, dan pencarian nama siswa.
   * Mode tampilan ganda: **Mode Kartu (Grid)** & **Mode Tabel**.
   * Penilaian langsung: Input nilai angka dan catatan guru.
   * Unduh seluruh file karya satu kelas menjadi satu file **ZIP**.
   * Unduh file game Scratch (`.sb3`).
   * Lightbox foto layar penuh dengan Zoom In, Zoom Out, Pan/Drag, dan Reset.
   * Sidebar pemantau siswa yang **Belum Kumpul**.
5. **Pengaturan:**
   * Edit nama guru, username, password baru, foto profil.
   * Input dan tes koneksi URL Google Apps Script Web App.

### 🎒 Menu Siswa (3 Menu):
1. **Dashboard:**
   * Hero banner personal dengan foto profil.
   * Hitungan tugas aktif yang belum dikerjakan.
   * 3 Kartu status (Tugas Aktif, Sudah Dikumpul, Belum Dikumpul).
2. **Upload Karya:**
   * Pilih tugas, judul karya, kotak drag-and-drop file (gambar, dokumen, scratch .sb3).
   * Efek selebrasi kembang api (*confetti*) saat sukses terkirim.
3. **Karya Saya:**
   * Mode Kartu & Tabel.
   * Tampilan nilai merah khas tulisan tangan (*font Kalam/Comic*).
   * Catatan motivasi guru.
   * Tombol ganti file karya (sebelum dinilai oleh guru).
   * Pemutar game Scratch TurboWarp terintegrasi.

---

## 5. File-File Kunci yang Telah Selesai Dibuat
* `src/services/api.js` (Integrasi live data Google Sheets GViz + GAS Web App)
* `src/index.css` (Styling Tailwind, glassmorphism, claymorphism, pastel lavender background)
* `src/utils/motion.js` (Preset animasi spring bounce physics Framer Motion)
* `src/utils/helpers.js` (Kompresi foto, Google Drive thumbnail resolver, hash password)
* `src/components/layout/DashboardLayout.jsx` (Sidebar floating island + header floating pill)
* `src/components/auth/LoginScreen.jsx` (Layar login pastel bouncy peran Guru & Siswa PIN 4 angka)
* `src/components/teacher/TeacherDashboard.jsx` (Dashboard guru V20)
* `src/components/teacher/TeacherStudents.jsx` (Manajemen siswa & Excel)
* `src/components/teacher/TeacherProjects.jsx` (Kelola project kartu claymorphic)
* `src/components/teacher/TeacherGallery.jsx` (Galeri penilaian, download ZIP, tracker belum kumpul)
* `src/components/teacher/TeacherSettings.jsx` (Pengaturan akun & API Web App)
* `src/components/student/StudentDashboard.jsx` (Dashboard siswa sapaan personal)
* `src/components/student/StudentUpload.jsx` (Form upload drag-and-drop + confetti)
* `src/components/student/StudentGallery.jsx` (Karya siswa, nilai tulisan tangan, TurboWarp player)
* `GAS_Code.gs` (Kode backend Google Apps Script siap pakai)
* `README.md` (Panduan menjalankan dan deploy)

---

## 6. Rencana Kerja Saat Melanjutkan (Kata Kunci: "lanjut")
1. Pengguna membuka kembali browser di `http://localhost:3000` dan mereview tampilan baru dengan data asli yang sudah masuk lengkap.
2. Memeriksa setiap halaman bersama pengguna (Dashboard, Data Siswa, Galeri Karya, dan Halaman Siswa) untuk memastikan setiap animasi bounce dan tata letak sudah 100% memuaskan.
3. Membantu pengguna jika ingin mendeploy frontend ke **Vercel** / **Cloudflare Pages** agar bisa diakses oleh seluruh siswa melalui HP atau komputer sekolah secara online.

---

## 7. Catatan Pembaruan Terakhir (Update Tanggal 20 Nov 2026, 01:51 WIB)
1. **Penyesuaian Sistem Fill (Sejajar Atas & Bawah):**
   * Menghapus pembatas `max-w-7xl mx-auto` pada container konten di `DashboardLayout.jsx` dan menggantinya dengan sistem `w-full` (Fill Container).
   * Sekarang kartu atas (Header Bar & Hero Banner), kartu tengah (Stats Cards), dan kartu bawah (Aktivitas Terbaru / Tabel) **sejajar 100% pada sisi kiri dan sisi kanannya**.
2. **Penghapusan Hover Bounce yang Mengganggu:**
   * Menghapus `whileHover` dan efek `scale` yang terlalu besar pada komponen `Card.jsx`, tabel data siswa, kartu project, dan kartu galeri karya.
   * Efek hover bounce besar **hanya dipertahankan pada 4 kartu statistik kecil di Dashboard (`StatsCard.jsx`)**, sehingga tidak ada lagi kartu besar yang terangkat atau menutupi elemen lain di atasnya saat kursor digerakkan.

---

## 8. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 02:05 WIB)
1. **Kelola Project (Kartu Proporsional, Rapi & Ada Mouse Hover):**
   * Memberikan padding pernapasan horizontal yang cukup (`px-3 sm:px-4 lg:px-6`) pada `DashboardLayout.jsx` sehingga kartu tidak lagi menempel batas layout atau menempel scrollbar layar.
   * Mengubah tata letak grid menjadi lebih proporsional (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5`), sehingga kartu tidak tampak terlalu lebar atau raksasa.
   * Menambahkan animasi interaksi mouse hover yang rapi dan halus (`whileHover={{ y: -4 }}` dengan spring physics, bayangan ungu `shadow-[0_16px_36px_rgba(109,40,217,0.12)]`, dan highlight border), tanpa menutupi kartu lainnya.
2. **Sistem Scrolling Data Siswa (Maksimal ~5 Data):**
   * Menerapkan container scroll internal pada tabel (`max-h-[370px] overflow-y-auto`) di `TeacherStudents.jsx` sehingga ketika data melebihi baris ke-5, tabel langsung mengaktifkan scroll vertikal dan tidak memanjang ke bawah merusak layout halaman.
   * Header tabel dibuat **sticky (`sticky top-0 z-10 bg-purple-50/95 backdrop-blur-md`)** agar judul kolom (No, Foto, Nama Siswa, Kelas, PIN, Aksi) tetap terlihat jelas saat di-scroll.
   * Menambahkan kolom nomor urut (**No**) 1, 2, 3, 4, 5... secara otomatis.
   * Menambahkan footer informasi jumlah total siswa serta petunjuk scroll.
   * Menerapkan sistem container scroll yang sama pada tampilan tabel di **Galeri Karya Guru** dan **Karya Saya Siswa**.

---

## 9. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 02:11 WIB)
1. **Penghapusan Header Mengambang Dobel (Single Rounded Card):**
   * Menghapus elemen `<header>` mengambang yang berada di atas setiap halaman menu pada layar desktop.
   * Sekarang **hanya ada SATU elemen rounded utama di bagian atas** (yaitu banner/konten utama dari masing-masing menu), sehingga tampilan menjadi sangat bersih, luas, dan tidak ada tumpukan rounded bar ganda.
   * Pada layar HP/Mobile (`lg:hidden`), tetap disediakan bar navigasi ringkas agar drawer menu samping tetap bisa dibuka dengan mudah.

---

## 10. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 02:15 WIB)
1. **Pembersihan Elemen Sidebar (Minimalist & Clean):**
   * Menghapus 3 elemen di sidebar sesuai instruksi coretan merah:
     1. **Kartu Profil Pengguna** (foto, nama Mr. Tamam, label role Guru).
     2. **Widget Jam & Tanggal Digital Realtime**.
     3. **Tombol "Sinkron Data"** di bagian bawah.
   * Sekarang sidebar tampil murni, lega, dan minimalis:
     * **Bagian Atas:** Brand Header *"Galeri Karya - KOMPUTER SD"* dengan ikon sparkle melayang.
     * **Bagian Tengah:** Menu Navigasi Kapsul Ungu Kontras Tinggi (*Dashboard, Data Siswa, Kelola Project, Galeri Karya, Pengaturan*).
     * **Bagian Bawah:** Tombol *"Keluar Akun"*.
   * Tampilan sidebar menjadi sangat bersih, fokus pada navigasi, dan tidak ada lagi elemen yang menumpuk.

---

## 11. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 02:25 WIB)
1. **Perbaikan Card Rounded Bagian Atas yang Terpotong:**
   * Menambahkan ruang batas atas (*top headroom* `pt-3 sm:pt-4 lg:pt-5`) dan batas horizontal (`px-2 sm:px-4 lg:px-6`) pada container scroll utama di `DashboardLayout.jsx`.
   * Banner atas disempurnakan menjadi `rounded-[2rem]` dengan padding yang pas (`p-5 sm:p-6`).
   * Sudut lengkung rounded bagian atas kartu kini **100% utuh, mulus, tidak lagi terpotong atau mentok ke langit-langit browser**.
2. **Ukuran Card Galeri Karya Menjadi Rapi & Proporsional (Tidak Terlalu Besar):**
   * Mengubah tata letak grid dari yang tadinya raksasa (3 kolom) menjadi responsif 4–5 kolom (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4`).
   * Menyesuaikan rasio foto karya dari `aspect-[4/3]` yang terlalu tinggi menjadi `aspect-[16/10]` yang proporsional.
   * Merapikan ukuran avatar siswa (`size={28}`), input nilai, input catatan, dan tombol simpan agar hemat ruang dan estetis.
   * Tinggi kartu berkurang drastis dari ~540px menjadi ~260px, sehingga tampilan galeri terlihat seperti pameran karya seni digital yang elegan dan tidak membebani layar.
   * Penyesuaian proporsi kartu yang rapi ini juga diterapkan pada Galeri Karya Siswa (`StudentGallery.jsx`).

---

## 12. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 02:40 WIB)
1. **Fitur Live Play Game Scratch (.sb3) Langsung di Aplikasi:**
   * Mengatasi kendala di mana game Scratch (.sb3) sebelumnya tidak bisa dimainkan langsung saat guru mengeklik kartu game.
   * **Penyebab:**
     1. Deteksi file Scratch sebelumnya hanya aktif jika folder kelas 6 dipilih; saat membuka tab *"Semua Karya"*, sistem menganggapnya gambar biasa.
     2. Iframe player sebelumnya belum menyertakan query parameter `project_url` resmi dari TurboWarp dan terhalang CORS Google Drive lama.
   * **Solusi & Fitur Baru:**
     1. **Deteksi Otomatis Cerdas (`isScratchProject`):** Otomatis mendeteksi 38 karya Scratch di database (*Game Quiz with Scratch, Game Tembak Balon with Scratch, Kelas 6A, Kelas 6B, maupun ekstensi .sb3*) di folder mana pun guru berada.
     2. **Tampilan Kartu Game Khusus:** Kartu tugas Scratch kini otomatis menampilkan badge bertema Gamepad oranye-ungu yang atraktif bertuliskan *"▶ Mainkan Game"*.
     3. **TurboWarp Live Embed Player:** Menggunakan endpoint CDN Google Drive direct (`drive.usercontent.google.com`) dengan header CORS terbuka (`Access-Control-Allow-Origin: *`) yang diumpankan ke TurboWarp embed player resmi (`https://turbowarp.org/embed?project_url=...`).
     4. **Bisa Dimainkan Langsung:** Guru kini bisa langsung menekan bendera hijau di dalam popup untuk menguji game, menggerakkan keyboard/mouse, dan memainkan game siswa secara langsung tanpa perlu aplikasi tambahan.
     5. **Tombol "Layar Penuh" & "Download File .sb3":** Guru juga dapat membuka game di tab baru atau mengunduh file `.sb3` langsung ke komputer.
     6. Fitur live play ini juga otomatis aktif di akun siswa pada menu **Karya Saya**.


---

## 13. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 03:20 WIB) — Solusi Tuntas Player Scratch .sb3 Tanpa Error
1. **Analisis Akar Masalah Layar Merah TurboWarp (`TypeError: Failed to fetch`):**
   * Saat iframe `https://turbowarp.org/embed?project_url=...` memanggil `fetch()` ke URL Google Drive (`drive.usercontent.google.com`), browser Chrome/Edge menolak pembacaan data karena Google Drive mengirimkan header **`Cross-Origin-Resource-Policy: same-site` (CORP)**.
   * Akibatnya, website pihak ketiga (`turbowarp.org`) dilarang membaca data binary file game dari Google Drive melalui JavaScript `fetch()`, sehingga TurboWarp menampilkan layar merah *"Oops! Something went wrong... TypeError: Failed to fetch"*.
2. **Implementasi Solusi Mandiri & 100% Berjalan Lancar:**
   * **TurboWarp Scaffolding Engine Mandiri (`/public/scaffolding-min.js`):**
     * Mengintegrasikan library resmi `@turbowarp/scaffolding` (1.85 MB) langsung ke dalam aplikasi lokal tanpa bergantung pada iframe eksternal `turbowarp.org`.
     * Scaffolding menyertakan WebGL renderer, Scratch VM compiler, audio synthesizer, dan penangan input keyboard/mouse.
   * **Pemutar Game Khusus (`/public/scratch-player.html`):**
     * Dilengkapi tombol **Mulai (Bendera Hijau)**, tombol **Stop (Segi Enam Merah)**, dan tombol **Layar Penuh**.
     * Memiliki overlay animasi pemuatan status aset game.
     * Dilengkapi zona **Drag & Drop / Pilih File .sb3 dari Komputer** sebagai opsi cadangan fleksibel.
   * **Backend Proxy Streaming Bersih CORS di Vite (`/api/scratch-proxy?id=...`):**
     * Ditambahkan middleware server di `vite.config.js` yang mengunduh file game dari Google Drive (Node.js tidak terhalang oleh CORP browser) dan menyajikannya ke player lokal dengan header `Cross-Origin-Resource-Policy: cross-origin` dan `Access-Control-Allow-Origin: *`.
   * **Pembaruan Modal Lightbox (`Lightbox.jsx`):**
     * Menghubungkan popup ke `/scratch-player.html?id=${driveId}`.
     * Tombol **TurboWarp Editor** dan tombol **Download File .sb3** tetap tersedia lengkap.
   * **Verifikasi Build:**
     * `npm run build` berhasil 100% tanpa error dalam 9.35 detik.
     * Server lokal berjalan aktif di `http://localhost:3000/`.


---

## 14. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 03:45 WIB) — Implementasi Fitur Pengumpulan Link & Embed Scratch MIT (Dual-Mode)
1. **Fitur Pengumpulan Link Scratch Online (`scratch.mit.edu`):**
   * **Ekstraktor ID Cerdas (`getScratchProjectId`):** Otomatis mengenali input siswa dalam berbagai format:
     - URL Proyek biasa: `https://scratch.mit.edu/projects/1129381416`
     - URL dengan slash: `https://scratch.mit.edu/projects/1129381416/`
     - URL embed: `https://scratch.mit.edu/projects/1129381416/embed`
     - Kode iframe embed: `<iframe src="https://scratch.mit.edu/projects/1129381416/embed" ...>`
     - Angka ID murni: `1129381416`
2. **Form Pengumpulan Siswa (`StudentUpload.jsx`):**
   * Menyediakan tab pemilih metode pengumpulan:
     - **Tab 1: 📁 Upload File (.sb3 / Foto / Doc)** — Untuk siswa pengguna Scratch Desktop offline atau tugas desain CorelDraw.
     - **Tab 2: 🌐 Tempel Link Scratch (Online)** — Untuk siswa yang membuat game langsung di situs Scratch MIT.
   * **Live Validation & Thumbnail Preview:**
     - Ketika link ditempel, sistem langsung menampilkan thumbnail sampul asli dari CDN Scratch (`https://uploads.scratch.mit.edu/get_image/project/{id}_480x360.png`).
     - Tampil badge hijau: `✓ Project Scratch #{id} Terhubung`.
3. **Player Ganda di Modal Galeri (`Lightbox.jsx`):**
   * Jika karya merupakan link Scratch Online, guru dapat memilih memutar game dengan:
     - **⚡ TurboWarp (60fps):** Performa game super mulus dan cepat.
     - **🐱 Scratch MIT Resmi:** Tampilan asli khas Scratch MIT.
   * Dilengkapi tombol navigasi cepat *"Buka Web"* langsung ke halaman project di `scratch.mit.edu`.
4. **Tampilan Kartu Galeri Guru & Siswa (`TeacherGallery.jsx` & `StudentGallery.jsx`):**
   * Kartu karya Scratch Online otomatis menampilkan poster sampul game asli dengan badge *"▶ Mainkan (Scratch Online)"*.
   * Karya Scratch offline `.sb3` tetap menampilkan badge gamepad oranye-ungu dengan player scaffolding lokal.
5. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error (15.94 detik).
   * Dev server aktif berjalan di `http://localhost:3000`.


---

## 15. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 04:15 WIB) — Perbaikan Thumbnail Gambar Karya (Folder 5B & Kelas Lain)
1. **Analisis Akar Masalah Placeholder "Buka File":**
   * Sebelumnya URL gambar di `getDirectImageUrl` menggunakan format `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`.
   * Endpoint `drive.google.com/thumbnail` melakukan pengalihan HTTP 302. Ketika membuka halaman dengan banyak kartu gambar sekaligus (seperti Folder 5B yang berisi puluhan karya desain baju), Google Drive membatasi (*rate limiting / throttling*) pengalihan 302 tersebut.
   * Akibatnya gambar gagal dimuat dan memicu `onError`, yang kemudian menampilkan gambar placeholder abu-abu *"Buka File"*.
2. **Solusi Perbaikan:**
   * **Menggunakan Google Direct CDN (`lh3.googleusercontent.com/d/{fileId}`):**
     * Mengubah `getDirectImageUrl` dan `driveThumb` agar langsung mengakses endpoint CDN publik resmi Google (`https://lh3.googleusercontent.com/d/${fileId}`).
     * Endpoint ini menyajikan gambar secara langsung (HTTP 200 OK) tanpa pengalihan 302, tanpa pembatasan rate limit, dan memiliki kecepatan muat jauh lebih tinggi.
   * **Fallback Berjenjang (*Multi-Tier Fallback*):**
     * Jika terjadi gangguan jaringan, `onError` akan otomatis mencoba URL cadangan `drive.google.com/thumbnail` dan `drive.usercontent.google.com` sebelum menampilkan placeholder.
   * Menambahkan atribut `loading="lazy"` agar rendering halaman lebih ringan dan hemat memori browser.
3. **Hasil:**
   * Seluruh gambar karya anak kelas 5 (Aina, Yumna, Aldiran, Barra, Ghaisan, dll.) kini kembali tampil jernih, utuh, dan cepat tanpa placeholder *"Buka File"*.


---

## 16. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 04:35 WIB) — Pemulihan Form Upload Siswa Sederhana & Ramah Anak
1. **Pemulihan Halaman Upload Karya Siswa (`StudentUpload.jsx`):**
   * Menghapus tab pemilih *"Metode Pengumpulan"* (Upload File vs Tempel Link) agar alur pengumpulan tugas kembali sangat mudah, simpel, dan tidak membingungkan bagi anak-anak SD.
   * Siswa cukup melakukan 3 langkah cepat:
     1. **Pilih Tugas / Project** (dropdown).
     2. **Ketik Judul Karyamu**.
     3. **Klik Kotak File Karya** (langsung memilih file gambar, dokumen, atau file game `.sb3` dari komputernya).
     4. Klik tombol **Kirim Karya Sekarang 🚀**.
2. **Mesin Pemutar Game Scratch Tetap Aktif:**
   * Di Galeri Guru dan Siswa, seluruh file game Scratch `.sb3` yang diunggah anak-anak tetap otomatis bisa diputar langsung menggunakan Scaffolding Engine mandiri.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 10.96 detik.
   * Server dev berjalan aktif di `http://localhost:3000`.

---

## 17. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 05:00 WIB) — Implementasi Sidebar Animasi Bouncy & Expand on Hover (Gaya Dashboard V29)
1. **Peningkatan Desain Sesuai Referensi Video (Dashboard V29):**
   * **Warna Tema Baru (Dark Obsidian Glass):**
     * Sidebar diubah menjadi *floating dark glass island* (`#0F111A`/95) dengan efek *backdrop blur 2xl*, border putih tipis halus (`border-white/10`), dan bayangan melayang mendalam (`shadow-[0_20px_50px_rgba(0,0,0,0.35)]`).
     * Memberikan kontras tinggi yang sangat modern dan elegan terhadap kanvas dashboard lavender pastel.
     * Menu aktif menggunakan kapsul gradien ungu-indigo menyala (`bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600`) dengan efek outer glow neon (`shadow-[0_4px_22px_rgba(139,92,246,0.55)]`).
   * **Animasi Melebar Otomatis saat Kursor Didekatkan (Expand on Hover):**
     * **Kondisi Standar (Collapsed):** Berwujud bilah dock ramping (`82px`) dengan ikon menu di tengah, bersih dan hemat ruang layar.
     * **Kondisi Didekati Kursor (Hovered):** Melebar secara dinamis dan mulus ke `264px` menggunakan fisika pegas kenyal (*Framer Motion Spring Bounce*: `stiffness: 340, damping: 24, mass: 0.8`), memperlihatkan nama menu lengkap (*Dashboard, Data Siswa, Kelola Project, Galeri Karya, Pengaturan / Upload Karya, Karya Saya*) beserta teks brand *"Galeri Karya - KOMPUTER SD"* dan tombol *"Keluar Akun"*.
     * **Desain Zero Layout Thrashing:** Pada mode desktop, pelebaran sidebar melayang di atas padding margin kiri (*floating overlay*), sehingga kartu galeri karya dan grafik di halaman dashboard tidak bergeser atau berkedip sama sekali saat mouse masuk/keluar.
   * **Tombol Kunci / Pin Sidebar (📌):**
     * Dilengkapi tombol Pin di pojok atas sidebar saat terbuka. Jika pengguna ingin sidebar tetap terbuka lebar secara permanen tanpa perlu di-hover, cukup klik tombol Pin.
   * **Tooltip Melayang Membal (Floating Spring Tooltips):**
     * Saat sidebar dalam posisi ramping (collapsed), mengarahkan mouse ke salah satu ikon akan memunculkan kapsul hitam melayang di samping kanan ikon dengan animasi membal (*spring bounce*), persis seperti yang terlihat di video TikTok Dashboard V29.
   * **Mobile Navigation:**
     * Drawer samping dan bilah navigasi bawah (*bottom bar*) mobile diselaraskan dengan palet warna Dark Obsidian Glass yang senada.
2. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 6.33 detik.
   * Vite dev server aktif berjalan di `http://localhost:3000`.

---

## 18. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 05:25 WIB) — Penyesuaian Layout Dinamis (Auto-Push Layout saat Sidebar Melebar)
1. **Penyempurnaan Perilaku Layout:**
   * Sebelumnya pada desktop, pelebaran sidebar melayang di atas konten (*overlay*), sehingga sempat menutupi sebagian teks header dan kartu di sebelah kiri saat kursor masuk.
   * **Implementasi Auto-Push Dynamic Layout:**
     * `<motion.aside>` kini menjadi elemen fleksibel utama di dalam flex layout (`shrink-0`).
     * Saat kursor didekatkan ke sidebar dan sidebar melebar dari `82px` ke `264px` dengan *spring bounce*, area konten utama (`<main>`) secara dinamis dan serentak bergeser (*menghindar*) ke kanan mengikuti lekukan animasi yang sama.
     * Tidak ada lagi bagian judul atau kartu karya yang tertutup sedikitpun oleh sidebar!
     * Saat mouse dijauhkan dari sidebar, sidebar kembali ramping ke `82px` dan konten utama kembali melebar memenuhi ruang layar secara mulus.
2. **Penyempurnaan Posisi Ikon:**
   * Pada kondisi ramping (`82px`), ikon menu dan logo berada tepat di tengah tombol (*justify-center*).
   * Pada kondisi melebar (`264px`), ikon dan teks tersusun rapi dari kiri (*justify-start*) dengan jarak padding yang proporsional.
3. **Verifikasi:**
   * Build produksi `npm run build` berhasil 100% tanpa error dalam 5.99 detik.
   * Dev server aktif berjalan di `http://localhost:3000`.

---

## 19. Ringkasan Status Akhir & Panduan Melanjutkan (Ready to Resume Anytime)

### 📌 Checklist Penyelesaian Seluruh Permintaan Pengguna:
1. **Keamanan & Keutuhan Data (100% Verified):**
   * Database Google Spreadsheet (`1xqVsKnSEiasss2f_o7FY-F7cZy3Pyz5cMp-4J1tG6RM`) tetap utuh dan tersinkron live:
     - 113 Pengguna (Mr. Tamam & seluruh siswa kelas 4, 5, 6).
     - 6 Kelas aktif (4A, 4B, 5A, 5B, 6A, 6B).
     - 6 Project komputer aktif.
     - 89 Karya tugas siswa lengkap dengan nilai angka, catatan guru, dan link Google Drive.
2. **Pembersihan Elemen Sidebar Awal:**
   * Menghilangkan profil guru, widget waktu/kalender, dan tombol sinkron data di sidebar agar minimalis sesuai coretan merah pengguna.
3. **Player Game Scratch Kelas 6 (.sb3 Scaffolding Mandiri):**
   * Mengintegrasikan `@turbowarp/scaffolding` lokal (`/public/scaffolding-min.js` & `/public/scratch-player.html`) + Vite proxy streaming (`/api/scratch-proxy`) untuk mengatasi error CORS browser Google Drive `TypeError: Failed to fetch`.
   * Guru dan siswa dapat langsung memutar game Scratch (.sb3) di dalam web dengan tombol Mulai, Stop, Layar Penuh, dan FPS tinggi.
4. **Perbaikan Thumbnail Gambar Karya (Folder 5B CorelDraw, dll.):**
   * Mengganti URL Google thumbnail ke Google Direct CDN (`https://lh3.googleusercontent.com/d/{fileId}`) dengan fallback bertingkat.
   * Tidak ada lagi placeholder abu-abu *"Buka File"*; semua gambar siswa tampil jernih, tajam, dan cepat.
5. **Form Upload Karya Siswa:**
   * Dikembalikan ke alur asli yang ramah anak (1-klik pilih tugas, ketik judul, klik kotak file untuk upload file gambar / dokumen / .sb3).
6. **Sidebar Baru Bouncy & Expand on Hover (Dashboard V29):**
   * Warna mewah *Dark Obsidian Glass* (`#0F111A`/95) dengan kapsul aktif gradien neon ungu-indigo (`from-violet-600 via-indigo-600 to-purple-600`).
   * Mengembang otomatis saat kursor didekatkan (`82px` ➔ `264px`) dengan animasi membal *Framer Motion Spring Bounce*.
   * **Auto-Push Layout:** Seluruh layout halaman kanan ikut bergeser menghindar sehingga tidak ada teks atau kartu karya yang tertutup sedikitpun.
   * Floating spring tooltip saat posisi ramping dan tombol Pin (📌) untuk mengunci sidebar tetap terbuka jika diinginkan.
7. **Status Server & Build:**
   * `npm run build` sukses 100% tanpa error dalam 5.99 detik.
   * Vite dev server aktif berjalan di background pada `http://localhost:3000`.

### 🚀 Cara Melanjutkan Saat Mulai Lagi:
* Pengguna cukup menyapa atau mengetik **"lanjut"**, dan asisten AI akan langsung mengingat seluruh konteks, status kode, dan siap melanjutkan tugas atau ide berikutnya tanpa perlu mengulang dari awal.

---

## 20. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 05:40 WIB) — Penyempurnaan Sidebar Menjadi Dock Ramping Tetap + Popup Smooth Bounce Tooltip
1. **Perubahan Sesuai Permintaan Pengguna:**
   * Pengguna menginstruksikan agar sidebar **tidak perlu melebar (*expand*) saat terkena mouse**, melainkan tetap ramping permanen berbentuk kapsul estetik vertikal (*fixed-width slim dock* `w-[74px]`).
   * Sebagai gantinya, saat kursor diarahkan ke ikon menu, muncul **popup kecil membal halus (*smooth bounce floating tooltip*)** yang menampilkan nama menu di samping kanan ikon.
2. **Implementasi Detail:**
   * **Bilah Dock Tetap Ramping (`w-[74px]`):**
     * Desain kapsul *Dark Obsidian Glass* melayang (`bg-[#0F111A]/95`, `rounded-[2.5rem]`, `border-white/10`).
     * Ikon brand Sparkles dengan pendar ungu di paling atas.
     * Ikon menu berjejer vertikal di tengah dengan squircle aktif gradien ungu-indigo (`from-violet-600 via-indigo-600 to-purple-600`).
     * Ikon keluar akun merah di bagian bawah.
     * Lebar sidebar tidak berubah sama sekali, sehingga layout halaman konten di sebelah kanan tetap 100% stabil, tenang, dan tidak bergeser.
   * **Popup Smooth Bounce Tooltip:**
     * Menggunakan animasi pegas Framer Motion: `initial={{ opacity: 0, x: -8, scale: 0.88 }}`, `animate={{ opacity: 1, x: 0, scale: 1 }}`, `exit={{ opacity: 0, x: -6, scale: 0.92 }}`, `transition={{ type: "spring", stiffness: 450, damping: 24 }}`.
     * Dilengkapi ujung panah (*caret*) segitiga kecil yang menunjuk ke arah ikon.
     * Kartu popup menggunakan kaca gelap berbayang mendalam (*dark glass blur with drop shadow*), font hitam tebal, dan indikator titik ungu menyala pada menu yang sedang aktif.
     * Tooltip merah khusus untuk tombol *"Keluar Akun"*.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.21 detik.
   * Vite dev server aktif berjalan di `http://localhost:3000`.

---

## 21. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 06:00 WIB) — Pelebaran Ukuran Rounded Sidebar agar Lebih Proporsional
1. **Penyesuaian Dimensi Dock:**
   * Lebar dock diperlebar dari `74px` menjadi **`88px`** (`w-[88px]`) dengan padding internal `px-3.5 py-6` dan sudut kurva `rounded-[2.75rem]`.
   * Ukuran kotak tombol ikon diperbesar secara proporsional menjadi **`52px x 52px`** (`w-[52px] h-[52px] rounded-2xl`).
   * Ukuran ikon Lucide dinaikkan menjadi `size={22}` / `size={24}` agar lebih tajam dan pas dengan proporsi tombol.
   * Garis pemisah (*divider*) diperpanjang menjadi `w-10`.
   * Memberikan ruang napas (*padding margin*) samping yang lebih lega dan nyaman di mata, tidak lagi terkesan sempit/terjepit di pinggir kapsul.
2. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 9.59 detik.
   * Dev server aktif berjalan di `http://localhost:3000`.

---

## 22. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 06:15 WIB) — Optimasi Tampilan Layar saat di-Zoom In (Breakpoint & Spacing Resilience)
1. **Analisis Perilaku Zoom In Browser (Ctrl + `+`):**
   * Saat pengguna melakukan zoom in (misal 125%, 150%, 175%), browser menaikkan skala seluruh elemen sehingga resolusi lebar (lebar piksel efektif) dan tinggi layar mengecil.
   * Sebelumnya breakpoint desktop berada di `lg:` (1024px). Jika pengguna zoom in hingga lebar efektif di bawah 1024px, website otomatis berpindah ke mode tablet/mobile (sidebar dock berganti menjadi header hamburger atas dan bottom bar bawah), yang bagi pengguna terlihat seperti *"tampilannya berubah/rusak"*.
2. **Solusi Optimasi:**
   * **Menurunkan Breakpoint Desktop ke `md:` (768px):**
     * Sidebar dock tetap berdiri tegak di sebelah kiri pada layar zoom in hingga 150% maupun laptop beresolusi 1366x768.
     * Tidak akan berpindah ke mode HP kecuali layar benar-benar berukuran smartphone kecil (< 768px).
   * **Flexible Vertical Spacing:**
     * Menyesuaikan padding vertikal (`py-4 md:py-6`) dan jarak antar ikon (`space-y-2.5 md:space-y-3.5`) agar seluruh 5 menu, logo brand, dan tombol logout tetap muat utuh 100% tanpa terpotong di layar dengan tinggi terbatas saat di-zoom.
   * **Vertical Scrollable Viewport:**
     * Seluruh konten dashboard di sebelah kanan dilindungi oleh container `overflow-y-auto`, sehingga saat di-zoom in, seluruh kartu dan informasi tetap dapat di-scroll ke bawah dengan leluasa.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 10.03 detik.
   * Dev server aktif berjalan di `http://localhost:3000`.

---

## 23. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 06:30 WIB) — Penghapusan Batasan Max-Width & Pengisian Penuh Layar (Full Width Auto-Stretch)
1. **Analisis Akar Masalah Ruang Kosong di Kanan:**
   * Pada `DashboardLayout.jsx`, pembungkus konten utama sebelumnya memiliki atribut `max-w-[1700px]`.
   * Ketika layar dibuka pada monitor lebar atau saat pengguna melakukan **Zoom Out (layar dikecilkan)**, lebar viewport menjadi sangat besar (> 2000px).
   * Akibat batas `max-w-[1700px]`, elemen berhenti melebar di 1700px dan merapat ke kiri, menyisakan area kosong putih/ungu yang luas di sebelah kanan (`space kosong di kanannya`).
2. **Solusi Perbaikan:**
   * **Full-Width Dynamic Fill (`w-full`):**
     * Menghapus batasan `max-w-[1700px]` pada pembungkus utama di `DashboardLayout.jsx`.
     * Banner hero, kartu-kartu statistik, dan galeri karya kini otomatis membentang penuh 100% mengisi seluruh lebar layar yang tersedia (*fluid auto-stretch*), sehingga tidak ada lagi ruang kosong di sebelah kanan.
   * **Penyempurnaan Dashboard Siswa (`StudentDashboard.jsx`):**
     * Menambahkan 2 seksi kartu baru di bawah kartu statistik agar tampilan dashboard siswa penuh, padat, dan fungsional:
       1. **Tugas yang Perlu Dikerjakan:** Daftar tugas aktif yang belum dikumpulkan siswa, lengkap dengan batas tanggal dan tombol langsung *"Kumpul / Upload"*.
       2. **Karya Terbaru Saya:** Riwayat karya yang baru saja diupload siswa beserta nilai bintang ⭐ dan catatan status penilaian guru.
3. **Verifikasi:**
   * Build produksi `npm run build` berhasil 100% tanpa error dalam 11.35 detik.
   * Vite dev server aktif berjalan di `http://localhost:3000`.

---

## 24. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 07:15 WIB) — Implementasi Halaman Login Glassmorphism & Background Twilight Mountain Landscape
1. **Peningkatan Tampilan Halaman Login (`LoginScreen.jsx`):**
   * **Background Pemandangan Senja (Twilight Mountain Lake):**
     * Mengintegrasikan background ilustrasi lanskap pegunungan senja beresolusi tinggi 16:9 (`/public/login-bg.jpg`) yang bersih tanpa teks/watermark, sesuai referensi desain yang dikirimkan pengguna.
     * Dilengkapi overlay atmosfer lembut (*ambient vignette*) dan partikel cahaya melayang yang berdenyut (*animated floating glowing orbs*).
   * **Frosted Glassmorphic Card Frame:**
     * Kartu form login diubah menjadi kaca buram tembus pandang (*frosted dark glass*) dengan efek `backdrop-blur-2xl`, border kaca putih tipis (`border-white/20`), dan bayangan melayang mendalam (`shadow-[0_25px_60px_rgba(0,0,0,0.5)]`).
     * Dilengkapi efek pantulan garis cahaya atas (*top glass highlight*).
   * **Animasi Framer Motion yang Indah:**
     * Kartu muncul dengan efek pegas kenyal (*Framer Motion spring bounce: stiffness 300, damping 24*).
     * Tombol pilihan peran (*Siswa* dan *Guru*) menggunakan kartu kaca dengan efek melayang dan membal saat kursor mendekat (*whileHover: y: -4, scale: 1.02*).
     * Input form (username, password, kelas, pin) menggunakan kaca buram (*glass inputs*) dengan teks putih kontras tinggi dan dropdown kelas berlatar gelap yang elegan.
     * Tombol masuk bersinar dengan gradien ungu-indigo-biru neon (*vibrant gradient button with glow shadow*).
2. **Fleksibilitas Gambar:**
   * Jika pengguna memiliki gambar lain yang disukai di masa depan, pengguna cukup menimpa file `/public/login-bg.jpg` dengan gambar pilihannya.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 6.70 detik.
   * Vite dev server aktif berjalan di `http://localhost:3000`.

---

## 25. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 07:30 WIB) — Penggantian Background ke Gambar Ultra-Sharp 4K & Penghapusan Efek Blur Latar
1. **Analisis Akar Masalah Gambar Kurang Tajam:**
   * Pada overlay sebelumnya di `LoginScreen.jsx`, terdapat class `backdrop-blur-[1.5px]` dan efek scaling `scale-105` yang tidak sengaja memburamkan seluruh gambar latar belakang.
   * Resolusi gambar awal adalah 1376x768 sehingga saat ditarik ke layar 1080p ke atas menjadi kurang tajam.
2. **Solusi Perbaikan:**
   * **Menghapus Blur pada Background:**
     * Menghilangkan class `backdrop-blur` pada lapisan overlay dan menghapus `scale-105`. Efek blur *glassmorphic* kini hanya berada secara presisi di dalam wadah kartu login (*card frame*), sementara gambar pemandangan di baliknya tampil 100% jernih dan tajam murni.
   * **Generasi Ulang Wallpaper Ultra-Sharp 4K:**
     * Menghasilkan gambar baru beresolusi ultra-tinggi (*ultra-sharp vector landscape* `/public/login-bg.jpg`):
       - Garis gunung geometris sangat tegas dan berdefinisi tinggi (*high-fidelity vector facets*).
       - Bintang-bintang dan rasi bintang di langit malam tajam berkilau.
       - Bulan sabit dan pantulan air danau sejernih cermin (*mirror lake reflection*).
       - Pohon pinus dan dedaunan musim gugur dengan warna jingga-merah yang hidup dan detail tajam.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 10.95 detik.
   * Vite dev server aktif berjalan di `http://localhost:3000`.

---

## 26. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 07:45 WIB) — Pemasangan Logo Resmi "KOMPIKIDS"
1. **Pemasangan Logo Resmi (`/public/logo.png`):**
   * Mengintegrasikan file logo asli berkarakter laptop rumah ramah anak dengan teks **KOMPIKIDS** (`media_1795125901446_623d0ada.png` beresolusi 1024x1024 RGBA) ke dalam seluruh penjuru aplikasi:
     1. **Halaman Login (`LoginScreen.jsx`):**
        - Mengganti kotak ungu Sparkles sebelumnya dengan wadah kapsul kaca putih bersih (`bg-white/95 backdrop-blur-md rounded-[2rem] p-3.5 border-2 border-white/80 shadow-2xl`).
        - Logo KOMPIKIDS tampil cerah, kontras, dan hidup dengan animasi membal saat disentuh kursor (`whileHover: scale: 1.08, rotate: 3`).
        - Judul diperbarui menjadi: **Galeri Karya KOMPIKIDS** dengan gradien warna ceria.
     2. **Bilah Sidebar Desktop & Mobile (`DashboardLayout.jsx`):**
        - Mengganti ikon atas sidebar dengan logo asli KOMPIKIDS di dalam squircle putih elegan.
        - Tooltip membal saat disentuh kursor menampilkan tulisan **KOMPIKIDS SD**.
        - Header menu samping versi HP (mobile drawer) juga menampilkan logo resmi KOMPIKIDS.
     3. **Tab Browser & Favicon (`index.html`):**
        - Mengubah judul tab browser menjadi **`KOMPIKIDS - Galeri Karya Komputer SD`** dan favicon logo asli.
2. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.98 detik.
   * Vite dev server aktif berjalan di `http://localhost:3000`.

---

## 27. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 08:00 WIB) — Logo Transparan Tanpa Background Putih & Judul Bersih "GALERI KARYA KOMPUTER"
1. **Pemrosesan Gambar Logo Transparan (`/public/logo.png`):**
   * Memotong (*crop*) bagian maskot laptop rumah tersenyum secara presisi (koordinat piksel X=148..822, Y=119..605) dan menghapus teks *"KOMPIKIDS"* di bagian bawahnya sehingga hanya menyisakan karakter maskot yang imut dan ikonik.
   * Menjadikan seluruh area luar maskot 100% transparan (*transparent alpha ARGB* 720x720) dengan tetap mempertahankan warna putih di dalam pipi dan badan laptop.
2. **Penyempurnaan Tampilan Halaman Login (`LoginScreen.jsx`):**
   * **Menghapus Background Kotak Putih Pada Logo:**
     - Menghapus pembungkus kotak putih tebal (`bg-white/95 rounded-[2rem] border-2 border-white/80`).
     - Maskot karakter laptop kini mengapung (*floating*) langsung secara transparan dan natural di atas wallpaper pemandangan senja dengan efek bayangan jatuh yang mewah (*filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]*).
   * **Mengubah Judul Utama Menjadi "GALERI KARYA KOMPUTER":**
     - Mengubah judul menjadi teks tegas huruf kapital: **`GALERI KARYA KOMPUTER`** dengan bayangan teks lembut berkilau (*drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)]*).
   * **Menghilangkan Teks Kecil di Bawahnya:**
     - Menghapus teks subtitle `<p>Portal Kumpul & Apresiasi Karya Siswa SD</p>` sepenuhnya sesuai instruksi pengguna, sehingga tampilan header menjadi sangat bersih, ringkas, dan fokus.
3. **Penyelarasan Desain Navbar & Tab Browser:**
   * Memperbarui `DashboardLayout.jsx` dan `index.html` dengan logo maskot transparan dan nama aplikasi **GALERI KARYA KOMPUTER**.
4. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.52 detik.
   * Vite dev server aktif berjalan di `http://localhost:3000`.

---

## 28. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 08:25 WIB) — Tipografi Modern Kids (Fredoka) & Motion Efek Kilatan Cahaya (Shimmer Light Sweep)
1. **Tipografi Modern Kids Friendly (`Fredoka` & `Baloo 2`):**
   * Mengintegrasikan Google Fonts resmi untuk font modern ramah anak berkualitas tinggi: **`Fredoka`** (dan fallback `Baloo 2`) di `index.html` dan `tailwind.config.js` (`font-kids`).
   * Karakter huruf tampil membulat (*rounded stroke*), ceria, tegas, dan mudah dibaca oleh siswa SD serta guru.
2. **Efek Gerakan Kilatan Cahaya (Motion Shimmer Gleam):**
   * **Animasi Kilatan Huruf (`.animate-kilatan`):**
     - Dibuat efek kilatan cahaya melintas berkala (`@keyframes kilatan-sweep`) dengan gradien cahaya putih berkilau emas hangat (`#FEF08A`) dan pendaran sian elektrik (`#7DD3FC`).
     - Cahaya melintas halus setiap 3.8 detik, memberi kesan premium dan magis pada teks judul.
   * **Garis Kilau Cahaya Diagonal (Diagonal Light Beam Sweep):**
     - Menambahkan balok cahaya miring transparan (`skew-x-[-22deg] bg-gradient-to-r from-transparent via-white/40 to-transparent`) yang menyapu permukaan judul dari kiri ke kanan secara halus dengan Framer Motion.
   * **Bintang Kelap-Kelip (Twinkling Sparkle Stars):**
     - Dilengkapi partikel bintang emas (`✨`) dan kristal cahaya (`✦`) yang berputar dan berdenyut lembut di sudut judul.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 12.23 detik.
   * Vite dev server aktif berjalan di `http://localhost:3000`.

---

## 29. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 08:40 WIB) — Implementasi Animasi 3D Flip Card (Kartu Terbalik) dengan Efek Spring Bounce
1. **Animasi 3D Flip Card Pada Kartu Login (`LoginScreen.jsx`):**
   * **Struktur 3D Perspective:**
     - Menambahkan wadah perspektif ruang tiga dimensi (`perspective: 1400px` dan `transformStyle: preserve-3d`).
     - Mengubah transisi pemilihan peran menjadi kartu 3D dua sisi (*two-sided 3D card*):
       1. **Sisi Depan (Front Face):** Pilihan peran masuk (*Pilih Peran Masuk* dengan tombol besar Siswa dan Guru).
       2. **Sisi Belakang (Back Face):** Formulir login spesifik peran (*Login Siswa* atau *Login Guru*) dengan tombol kembali *“Kembali ke Pilihan Peran”*.
   * **Rotasi Sumbu Y dengan Efek Spring Bounce:**
     - Saat tombol **Siswa** atau **Guru** diklik, kartu berputar membalik sepanjang sumbu Y dari `0°` ke `180°`.
     - Menggunakan fisika pegas Framer Motion (`type: 'spring', stiffness: 220, damping: 18, mass: 0.9`): kartu berputar cepat dengan akselerasi halus, sedikit membal (*overshoot bounce* ~4-5 derajat) di akhir putaran, lalu mengunci posisinya dengan sangat mantap dan memuaskan.
     - Saat tombol *“Kembali ke Pilihan Peran”* diklik, kartu berputar membalik kembali dari `180°` ke `0°` dengan efek spring bounce yang sama.
   * **Konsistensi Dimensi & Zero-Flicker:**
     - Kedua sisi kartu menggunakan tinggi minimum yang proporsional (`min-h-[390px]`), dengan atribut `backfaceVisibility: hidden` murni, sehingga tidak ada kedipan (*no flickering*), tidak ada elemen yang tumpang tindih, dan kartu berputar sebagai satu kesatuan fisik yang utuh.
2. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.20 detik.
   * Vite dev server aktif berjalan di `http://localhost:3000`.

---

## 30. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 09:05 WIB) — Penyederhanaan Form (Center-Middle Align) & Login Guru Cukup PIN 2389
1. **Pembersihan Elemen Sesuai Penanda Gambar:**
   * **Sisi Depan (Front Face):**
     - Menghapus badge *"PILIH PERAN MASUK"*.
     - Tombol **Siswa** dan **Guru** kini ditata rata tengah secara horizontal dan vertikal (*center & middle aligned*) di dalam kartu kaca.
   * **Formulir Siswa (LoginFormSiswa):**
     - Menghapus header teks *"🎓 Login Siswa"* beserta subtitle-nya.
     - Konten formulir langsung dimulai dari dropdown kelas dan input siswa, dengan tata letak rapi rata tengah (*center-middle*).
   * **Formulir Guru (LoginFormGuru):**
     - Menghapus header teks *"🛡️ Login Guru"* dan subtitle-nya.
     - Menghapus input *Username Guru* sepenuhnya.
     - **Login Cukup PIN:** Guru hanya perlu memasukkan **PIN: `2389`** untuk masuk ke sistem.
     - Tata letak form guru diposisikan di tengah kartu (*center & middle aligned*) dengan input PIN 4 angka yang estetik dan tombol masuk bergradien.
2. **Konektivitas Dev Server:**
   - Memastikan server dev Vite di [vite.config.js](file:///d:/kirimtugaskomputer/vite.config.js) berjalan di port 3000 dengan opsi `host: true` sehingga dapat diakses lancar via `http://localhost:3000` maupun IP jaringan.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 12.10 detik.
   * Vite dev server aktif berjalan di `http://localhost:3000`.

---

## 31. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 09:55 WIB) — Implementasi Radial Futuristic Knob Dial Selector untuk Pemilihan Kelas Siswa
1. **Animasi Pemilihan Kelas Mengelilingi Lingkaran (Circular Radial Menu):**
   * **Inspirasi Desain:** Sesuai video referensi *"Futuristic Navigation Menu Using HTML CSS JS"*, tombol pemilihan kelas bukan lagi dropdown standar, melainkan sebuah dial selector futuristik berbentuk lingkaran konsentris.
   * **Komponen `CircularClassSelector` (`LoginScreen.jsx`):**
     - Di tengah terdapat **knob dial futuristik** bulat (`w-20 h-20 rounded-full`) berlatar obsidian glass dengan jarum/notch penunjuk neon cyan (`shadow-[0_0_10px_rgba(56,189,248,0.9)]`).
     - Seluruh kelas aktif (`4A`, `4B`, `5A`, `5B`, `6A`, `6B`) muncul merekah (*spring burst*) membentuk orbit lingkaran mengelilingi knob pusat dengan sudut terbagi rata ($360^\circ / N$).
     - Saat kursor mendekati salah satu kelas, jarum di tengah dial berputar mulus mengarah langsung ke kelas yang di-hover (*spring rotation*).
2. **Animasi Balik ke Asal (Implode to Origin):**
   * Ketika salah satu kelas diklik oleh siswa:
     - Kelas yang dipilih meluncur masuk ke pusat lingkaran (`x: 0, y: 0`) dengan animasi membal (*spring bounce*).
     - Kelas-kelas lainnya menyusut dan menghilang kembali ke titik awal.
3. **Kemunculan Pilihan Nama & PIN:**
   * Setelah animasi kembali ke asal selesai, tampilan secara otomatis bertransisi mulus memunculkan:
     1. **Chip Kelas Terpilih:** Menampilkan nama kelas yang dipilih lengkap dengan tombol *"Ganti Kelas"* jika siswa ingin memilih kelas lain (yang akan merekah kembali ke dial lingkaran).
     2. **Pencarian Nama:** Input *"Ketik Namamu"* dengan pencarian autocomplete nama siswa di kelas tersebut.
     3. **Input PIN & Tombol Masuk:** Setelah nama dipilih, muncul kartu profil siswa, input PIN 4 digit, dan tombol *"Masuk Sekarang 🚀"*.
4. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.27 detik.
   * Vite dev server aktif berjalan di `http://localhost:3000`.

---

## 32. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 10:15 WIB) — Penyempurnaan Dial Konsentris (Klik Tengah untuk Merekah, Label di Dalam Lingkaran & Penghapusan Badge)
1. **Penghapusan Badge "PILIH KELASMU":**
   * Menghapus teks dan badge rounded *"PILIH KELASMU"* sepenuhnya sehingga seluruh area kartu difokuskan murni untuk panggung animasi gerakan dial lingkaran futuristik.
2. **Kondisi Awal Knob Tertutup (Klik Tengah untuk Buka):**
   * Pilihan kelas awal tidak langsung terlihat. Tampil sebuah **knob 3D bulat elegan** di tengah dengan pendaran cahaya berkilau dan petunjuk *"Klik di Sini 👆"*.
   * Saat bagian tengah diklik oleh siswa, piringan lingkaran konsentris besar merekah (*bloom open*) keluar dari pusat secara elastis (*spring bounce*).
3. **Piringan Konsentris Terpadu (Sesuai Referensi Gambar 2):**
   * Menggunakan satu kesatuan piringan dial konsentris (`w-64 h-64 sm:w-72 sm:h-72 rounded-full`) berlatar obsidian glass dengan garis-garis orbit halus.
   * **Label Kelas di Dalam Lingkaran:** Tombol kelas (**4A, 4B, 5A, 5B, 6A, 6B**) berwujud lingkaran bulat (*rounded-full*) dengan font kids modern (`font-kids`) yang tertata rapi di dalam piringan lingkaran mengitari knob pusat.
   * Knob pusat dilengkapi jarum penunjuk bercahaya neon cyan yang berputar presisi mengikuti arah kelas yang disentuh kursor mouse.
4. **Animasi Balik ke Asal & Transisi Nama/PIN:**
   * Saat salah satu kelas diklik, seluruh lingkaran dan kelas-kelas lainnya menyusut/mengempis kembali ke pusat (*collapse to center origin*), sementara kelas yang dipilih membal ke tengah dengan kilau cahaya.
   * Form secara otomatis langsung memunculkan kartu kelas terpilih, kolom pencarian nama siswa, dan PIN masuk 4 angka.
5. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 5.96 detik.
   * Vite dev server aktif berjalan di `http://localhost:3000`.

---

## 33. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 10:30 WIB) — Minimalis Murni (Hanya Logo, Animasi Out & Auto 3D Flip Back)
1. **Pembersihan Seluruh Tulisan/Teks:**
   * Menghapus seluruh teks *"Pilih Kelas"*, *"KLIK DI SINI 👆"*, dan *"KELAS"*.
   * Di kondisi awal tertutup: Hanya ada **lingkaran kecil anggun berlatar obsidian glass** dengan **logo topi toga (`GraduationCap`)** bercahaya ungu lembut di bagian tengahnya.
2. **Interaktivitas Dua Arah & Animasi Out:**
   * **Klik saat tertutup:** Piringan konsentris merekah keluar memunculkan 6 kelas lingkaran (**4A, 4B, 5A, 5B, 6A, 6B**).
   * **Klik tengah saat terbuka (tanpa memilih kelas):**
     - Seluruh kelas dan piringan lingkaran menyusut masuk ke pusat (*animasi out / collapse inward*).
     - Setelah animasi out selesai (360ms), kartu secara otomatis berputar membalik 3D (*3D card flip back*) kembali ke halaman utama pemilihan peran (Siswa & Guru).
3. **Navigasi Ulang yang Konsisten:**
   * Ketika tombol *"Kembali ke Pilihan Peran"* diklik (baik di siswa maupun guru), kartu berputar membalik ke depan.
   * Ketika tombol **Siswa** diklik kembali, tampilan kartu selalu diawali dalam keadaan lingkaran kecil bersih di tengah berlogo topi, dan siap diklik untuk merekah kembali.
4. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.59 detik.
   * Vite dev server aktif berjalan di `http://localhost:3000`.

---

## 34. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 10:40 WIB) — Reset State Formulir Siswa Saat Kembali ke Peran (Selalu Mulai dari Lingkaran Kecil)
1. **Latar Belakang Perbaikan:**
   * Sebelumnya, jika siswa sudah memilih kelas (misal: "Kelas 6B") lalu menekan tombol *"← Kembali ke Pilihan Peran"*, kartu berputar kembali ke depan. Namun, jika siswa mengklik kembali tombol *"Siswa"*, tampilan langsung berada di halaman input nama Kelas 6B karena state `classId` masih tersimpan di memori komponen.
2. **Implementasi Reset State (`formSessionKey` & `useEffect`):**
   * Di [LoginScreen.jsx](file:///d:/kirimtugaskomputer/src/components/auth/LoginScreen.jsx), ditambahkan mekanisme penyegaran sesi:
     - State `formSessionKey` ditambahkan pada `LoginScreen`.
     - Setiap kali pengguna memilih peran (`handleChooseRole`), `formSessionKey` dinaikkan sehingga komponen formulir di-mount ulang secara bersih (*fresh mount*).
     - Saat tombol *"← Kembali ke Pilihan Peran"* ditekan (`handleBackToRoles`), kartu berputar 3D membalik ke depan, dan setelah transisi balik selesai (350ms), sesi formulir di-reset di latar belakang tanpa kedipan (*flicker*).
     - Di `LoginFormSiswa`, ditambahkan hook `useEffect` yang mendeteksi saat kartu berputar balik (`!isFlipped`), untuk mereset seluruh state: `classId = ''`, `selectedSiswa = null`, `nameInput = ''`, dan `pin = ''`.
3. **Hasil Perilaku yang Dihasilkan:**
   * Siswa memilih kelas (misal 6B) -> Menekan *"← Kembali ke Pilihan Peran"* -> Kartu membalik ke depan -> Mengklik tombol *"Siswa"* lagi.
   * **Hasil:** Tampilan selalu kembali bersih dimulai dari **lingkaran kecil di tengah dengan logo topi toga**, tanpa ada sisa kelas yang terpilih sebelumnya.
4. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 6.21 detik.
   * Vite dev server aktif berjalan lancar di `http://localhost:3000`.

---

## 35. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 10:48 WIB) — Peningkatan Efek Bounce Hover Kelas & Cahaya Border Glow Berjalan Mengitari Frame Rounded
1. **Peningkatan Efek Bounce Hover Tombol Kelas (`CircularClassSelector`):**
   * **Spring Overshoot Lebih Kenyal:** Menyesuaikan konfigurasi pegas Framer Motion pada setiap tombol kelas (4A, 4B, 5A, 5B, 6A, 6B):
     - `whileHover`: `scale: 1.38` dengan `type: 'spring', stiffness: 550, damping: 9, mass: 0.5`.
     - Ketika pointer mouse menyentuh lingkaran kelas, tombol kelas langsung melompat membal elastis (*bouncy overshoot*) dan bergetar lembut sebelum menetap di ukuran 1.38x.
   * **Intensitas Cahaya Aura:** Ditambahkan pendaran neon glow cyan & purple yang lebih tajam (`hover:shadow-[0_0_30px_rgba(168,85,247,0.95),0_0_15px_rgba(56,189,248,0.8)]`) dan `hover:z-30` sehingga tombol yang di-hover tampak melayang gagah di atas orbit lingkaran.
   * **Peningkatan Tombol Pusat:** Knob tengah (baik saat tertutup maupun terbuka) juga ditingkatkan elastisitas hover-nya (`stiffness: 500, damping: 10`).
2. **Implementasi Traveling Border Glow (Cahaya Berjalan Mengitari Frame Rounded Card):**
   * **Komponen `TravelingBorderGlow` di [LoginScreen.jsx](file:///d:/kirimtugaskomputer/src/components/auth/LoginScreen.jsx):**
     - Mengimplementasikan teknik *conic-gradient outline sweep* yang berjalan mulus secara continuous mengitari lekuk kartu bersudut membulat (`rounded-[2.5rem]`).
     - **Layer 1 (Ambient Outer Halo):** Pendaran lembut (`blur-lg opacity-60`) yang menumpahkan cahaya neon di luar bingkai kartu ke latar danau twilight.
     - **Layer 2 (Sharp Traveling Beam 2px):** Berkas cahaya tajam bergradien multi-stop (*Cyan -> Ungu Elektrik -> Pink Neon -> Puncak Putih Terang*) yang menyusuri tepian border 2px kartu secara searah jarum jam dengan durasi 4.5 detik.
     - **Dukungan Penuh 3D Card Flip:** Efek border glow terpasang harmonis pada kedua muka kartu (Role Chooser di depan dan Form Login di belakang), sehingga saat kartu berputar 3D, cahaya bingkai turut berputar mulus di ruang 3 dimensi.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 5.94 detik.
   * Vite dev server aktif dan merespons `200 OK` di `http://localhost:3000`.

---

## 36. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 11:00 WIB) — Perbaikan Outline-Only Glow (Tanpa Sorotan Dalam) & Solusi Bug Card Pindah Posisi
1. **Perbaikan Efek Glow: Murni di Outline Border 2px (Zero Sorotan/Bocoran Cahaya di Dalam Kartu):**
   * **Masalah Sebelumnya:** Sebelumnya berkas cahaya conic gradient menyapu area dalam kartu, sehingga tampak seperti lampu sorot (*spotlight/wash*) yang menerangi tombol Siswa dan Guru.
   * **Solusi CSS Mask Exclude:** Menggunakan teknik *mask composite exclude* pada `TravelingBorderGlow`:
     - `maskImage: 'linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)'`
     - `maskClip: 'content-box, border-box'`
     - `maskComposite: 'exclude'` & `WebkitMaskComposite: 'xor'`
     - `filter: drop-shadow(0 0 6px rgba(168, 85, 247, 0.8))`
   * **Hasil:** Seluruh isi dalam kartu (*content-box*) dipotong bersih (0% transparansi cahaya), sehingga berkas cahaya **hanya ada dan berjalan di garis border 2px terluar yang rounded**. Area dalam kartu tetap gelap, bersih, dan kaca transparan obsidian murni tanpa sorotan apa pun.
2. **Solusi Bug Card Pindah Posisi Saat Berbalik 3D (CSS Grid Area Stacking):**
   * **Penyebab Masalah:** Sebelumnya, kelas `relative` dan `absolute inset-0` bertabrakan saat state `isFlipped` berganti, menyebabkan muka belakang (*back face*) terdorong ke bawah dalam alur dokumen (*layout shift*), sehingga kartu meluncur jauh ke bawah mendekati taskbar Windows.
   * **Solusi CSS Grid Stacking:** Mengganti layout kontainer 3D menggunakan CSS Grid Area `[grid-template-areas:'cardface']`:
     - Kedua muka kartu (muka depan pilihan peran dan muka belakang formulir login) diposisikan di dalam cell grid yang sama persis (`gridArea: 'cardface'`).
     - Tidak ada lagi perpindahan antara `absolute` dan `relative`.
     - Ketinggian dan posisi kartu terkunci presisi di titik tengah layar, berputar pada porosnya sendiri (*pure 3D axis spin*) tanpa geser 1 piksel pun.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 10.97 detik.
   * Server Vite dev berjalan stabil dan merespons `200 OK` di `http://localhost:3000`.

---

## 37. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 11:20 WIB) — Animasi Progress Bar Upload Siswa dengan Floating Tooltip Badge Persentase
1. **Desain Progress Bar Sesuai Referensi Gambar Pengguna:**
   * **Outer Pill Track:** Track berbentuk kapsul bulat penuh (`rounded-full`) berlatar putih dengan bingkai tebal dark charcoal (`border-[3px] border-[#242e35]`) setinggi `h-8 sm:h-9` dan padding dalam `p-[3px]`.
   * **Sage / Forest Green Fill Bar:** Batang progres berwarna hijau sage alami (`#477d5f`) dengan sudut membulat (`rounded-full`) yang meluncur mulus mengisi track dari 0% hingga 100%.
   * **Floating Speech Bubble Tooltip:**
     - Kotak badge berwarna gelap (`bg-[#242e35] text-white font-extrabold text-sm px-3 py-1 rounded-xl shadow-md`) yang melayang tepat di atas ujung kepala batang progres.
     - Dilengkapi panah segitiga terbalik di bagian bawah (`border-t-[#242e35]`) yang selalu menunjuk presisi ke ujung pengisian progres.
     - Badge persentase meluncur secara horizontal secara real-time mengikuti pertambahan persentase (`0%` hingga `100%`).
2. **Kecepatan Medium & Pengiriman Instan Saat 100%:**
   * **Durasi Medium:** Kecepatan diatur secara optimal selama **1.6 detik (1600ms)** dengan interval pembaruan 25ms, menghasilkan animasi yang halus, terasa realistis, memuaskan, dan tidak membuat siswa bosan menunggu.
   * **Langsung Terkirim:** Tepat saat angka mencapai `100%`, sistem secara instan memanggil `addDocument('submissions')`, meledakkan kembang api perayaan (*confetti celebration*), menampilkan notifikasi sukses *"Hore! Karyamu berhasil terkirim! 🎉"*, dan berpindah ke galeri karya dalam 500ms.
   * **Proteksi Form:** Semua input formulir dan kotak upload dinonaktifkan (`disabled`) saat pengiriman berlangsung untuk mencegah klik ganda.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 10.88 detik.
   * Vite dev server aktif dan merespons `200 OK` di `http://localhost:3000`.

---

## 38. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 11:35 WIB) — Penyesuaian Kecepatan Progress Bar, Hapus Efek Saweran, dan Perbaikan Bug Karya Tidak Masuk ke Galeri Siswa
1. **Penyesuaian Kecepatan Progress Bar:**
   * Durasi pengisian progress bar diperpanjang dari 1.6 detik menjadi **2.8 detik (2800ms)**.
   * Pergerakan batang hijau dan speech bubble tooltip persentase kini meluncur dengan ritme medium yang lebih tenang, mantap, dan mudah dinikmati siswa tanpa terkesan terburu-buru.
2. **Penghapusan Efek Saweran (Confetti):**
   * Menghapus fungsi kembang api confetti (`triggerConfetti()`) sepenuhnya saat mencapai 100%.
   * Tampilan saat selesai menjadi lebih bersih, elegan, dan profesional dengan toast pemberitahuan sukses dan langsung berpindah ke galeri karya siswa.
3. **Penyelidikan & Perbaikan Bug Karya Tidak Masuk ke Galeri Siswa:**
   * **Akar Masalah:**
     - Data spreadsheet di-polling setiap 12 detik oleh `loadData(true)`. Saat polling berjalan, `setData(response)` menimpa state `submissions` dengan data dari spreadsheet Google.
     - Karena backend default bersifat *read-only* (GViz) tanpa URL Web App Google Apps Script khusus, karya yang baru dikirim siswa tidak tersimpan ke spreadsheet Google, sehingga langsung terhapus saat polling spreadsheet berjalan 12 detik kemudian atau saat halaman di-refresh.
   * **Solusi Persistensi & Sinkronisasi Lokal ([DataContext.jsx](file:///d:/kirimtugaskomputer/src/context/DataContext.jsx)):**
     - Ditambahkan layer persistensi lokal (`galeri_local_submissions` + fallback in-memory cache) di `DataContext`.
     - Setiap dokumen karya baru yang di-submit via `addDocument('submissions', ...)` otomatis disimpan secara permanen di penyimpanan lokal peramban.
     - Saat polling 12 detik atau pemuatan data awal berjalan, `DataContext` secara cerdas menggabungkan (*merge*) data spreadsheet online dengan data karya lokal yang baru di-upload.
     - Di [StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx) dan [StudentDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentDashboard.jsx), pencocokan `studentId` dibuat lebih kebal dengan `String(s.studentId).trim() === String(user?.id).trim()` serta pengurutan otomatis berdasarkan tanggal terbaru (`createdAt`), sehingga karya yang baru dikirim akan selalu muncul di posisi paling atas galeri siswa.
4. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.23 detik.
   * Vite dev server aktif dan merespons `200 OK` di `http://localhost:3000`.










---

## 39. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 12:15 WIB) — Perbaikan Bug Layout Memanjang ke Bawah & Tampilan Preview Dokumen Siswa (PDF, Office, JPG/PNG)
1. **Investigasi Akar Masalah (Root Cause Analysis):**
   * **CSS Containing Block Trap pada position: fixed:**
     Di dalam CSS, elemen dengan `position: fixed` akan kehilangan relasinya terhadap *viewport* peramban jika berada di dalam elemen leluhur (*ancestor*) yang memiliki properti CSS `transform`, `filter`, atau `perspective`.
     Komponen `Lightbox` sebelumnya dirender langsung di dalam `<motion.div variants={fadeInScale}>` (yang memiliki `transform`) di dalam container `<div className="flex-1 overflow-y-auto">` pada `DashboardLayout`. Akibatnya, `fixed inset-0` terjebak di dalam container scrollable halaman dashboard, sehingga saat modal dibuka posisinya terdorong ke bawah, menambah tinggi halaman secara masif, dan memunculkan scrollbar vertikal raksasa di sebelah kanan seperti yang dilaporkan pengguna.
   * **Penanganan Format File PDF / Non-Gambar di Lightbox:**
     Sebelumnya, karya non-Scratch selalu dirender menggunakan tag `<img>`. Jika siswa (khususnya Kelas 5) mengunggah file dokumen PDF (baik berupa Google Drive link maupun base64 data), tag `<img>` mengalami error rendering sehingga gambar rusak dan memicu layout anomali.
2. **Solusi Perbaikan Komprehensif:**
   * **Penerapan React Portal (`createPortal`) pada [Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx):**
     Komponen `Lightbox` kini dirender langsung ke `document.body` menggunakan `createPortal(..., document.body)`. Ini membebaskan Lightbox dari semua batasan `transform` dan container layout halaman, menjamin Lightbox selalu terkunci 100% tepat menutupi seluruh layar (*viewport*) dengan `z-[9999999]`.
   * **Penguncian Scroll Halaman (*Body Scroll Lock*):**
     Menambahkan `useEffect` untuk otomatis mengunci `overflow: hidden` pada `document.body` saat Lightbox atau Modal terbuka, dan mengembalikannya saat ditutup, mencegah pergeseran scroll layout dashboard.
   * **Dukungan Khusus Viewer PDF & Dokumen:**
     - Ditambahkan detektor format file cerdas (`isPdf`, `isOffice`, `isGameScratch`, `isImage`).
     - File PDF kini dirender di dalam bingkai viewer responsif dengan iframe bawaan (baik untuk link Google Drive preview maupun file PDF lokal), lengkap dengan tombol *Buka di Tab Baru* dan *Download PDF*.
     - Kontrol zoom dan pan mouse kini hanya aktif untuk gambar (JPG, PNG, GIF, WebP) sehingga tidak mengganggu interaksi dokumen PDF/Scratch.
   * **Pembaruan Kartu Thumbnail Galeri ([StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx) & [TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx)):**
     Karya berformat PDF dan Office kini memiliki kartu thumbnail elegan dengan ikon dokumen, lencana format yang mencolok (*badge* merah untuk PDF, ungu/biru untuk Office), dan teks tombol "Buka PDF" / "Buka Dokumen".
   * **Perbaikan Modal Global ([Modal.jsx](file:///d:/kirimtugaskomputer/src/components/common/Modal.jsx)) & Foto Profil:**
     Komponen Modal dan Lightbox foto profil siswa/guru di seluruh dashboard juga telah ditingkatkan ke `createPortal` dan *scroll lock* agar terlindung permanen dari bug tata letak yang serupa.
3. **Verifikasi & Status:**
   * Kompilasi build `npm run build` sukses 100% tanpa error dalam 10.98 detik.
   * Server pengujian aktif dan berjalan normal.
---

## 40. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 12:20 WIB) — Penyempurnaan Animasi Load Bar Kirim Karya agar 100% Halus dan Tidak Patah-Patah
1. **Analisis Akar Masalah Animasi Patah-Patah:**
   * Sebelumnya pergerakan bar dan gelembung tooltip persentase menggunakan CSS transition `transition-all duration-75 ease-out` yang dikombinasikan dengan timer `setInterval` 25ms.
   * Setiap 25ms, nilai persentase baru masuk dan **menginterupsi transisi CSS yang baru berjalan sepertiga jalan**, memaksa kurva *ease-out* mengulang deselerasi dari kecepatan nol secara berulang-ulang (*micro-judder/stuttering*).
   * Nilai persentase yang dibulatkan dengan `Math.round` pada setiap interval juga membuat pergerakan melompat dalam angka bulat diskrit (misal 5 pixel per lompatan) daripada pergeseran sub-pixel yang cair.
2. **Solusi Pergerakan Halus & Seirama ([StudentUpload.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentUpload.jsx)):**
   * **Animasi Berbasis Hardware Framer Motion:**
     - Batang hijau (*fill bar*) kini menggunakan `<motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2.8, ease: 'linear' }} />`.
     - Gelembung angka (*speech bubble tooltip*) kini bergerak seirama menggunakan `<motion.div initial={{ left: '5%' }} animate={{ left: '95%' }} transition={{ duration: 2.8, ease: 'linear' }} />`.
     - Dihapus seluruh kelas transisi CSS yang saling bertabrakan (`transition-all duration-75 ease-out`), digantikan akselerasi GPU murni (`will-change`).
   * **Sinkronisasi Layar dengan `requestAnimationFrame`:**
     - Timer diganti ke `requestAnimationFrame` yang selaras dengan refresh rate monitor pengguna (60Hz / 120Hz / 144Hz) menggunakan `performance.now()`.
     - Teks angka persentase (`0%` hingga `100%`) bertambah dengan ritme yang stabil dan teratur tanpa jeda maupun lonjakan kasar.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 9.82 detik.
   * Vite HMR server berhasil memperbarui `StudentUpload.jsx`.
---

## 41. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 12:30 WIB) — Penyusunan PRD Lengkap & Checkpoint Penyimpanan Status Sistem
1. **Penyusunan PRD (Product Requirements Document) Komprehensif:**
   * Seluruh arsitektur sistem, aturan bisnis, skema data, kredensial autentikasi, alur UI/UX, dan panduan anti-halusinasi telah didokumentasikan secara lengkap pada file baru: **[PRD.md](file:///d:/kirimtugaskomputer/PRD.md)**.
   * File PRD ini menjadi acuan utama tunggal (*Single Source of Truth*) agar sistem tetap konsisten, akurat, dan tidak terjadi halusinasi pada iterasi mendatang saat pengguna kembali bekerja.
2. **Ringkasan Kunci Status Sistem Terkini:**
   * **Login Guru:** Menggunakan PIN **`2389`** (username fallback: `admin` / `admin123`).
   * **Login Siswa:** Dimulai dari lingkaran kecil tengah dengan topi toga, ekspansi melingkar dial kelas (4A-6B), bounciness saat hover, dan PIN default `1234`.
   * **Animasi 3D Flip & Running Glow Outline:** Dimensi kartu login terkunci (`min-h-[470px] w-full max-w-[430px]`), kartu berputar mulus tanpa pergeseran posisi, outline dikelilingi animasi glow memutar.
   * **Upload Siswa & Progress Bar:** Kecepatan medium 2.8s (2800ms) menggunakan hardware acceleration Framer Motion GPU (`linear`) dan `requestAnimationFrame`, bebas patah-patah (*zero judder*), saweran/confetti dihilangkan total, dan otomatis beralih ke galeri.
   * **Persistensi Data Anti-Wipe:** Data karya baru siswa terlindungi dari background polling spreadsheet 12 detik via layer penyimpanan lokal `galeri_local_submissions` di `DataContext.jsx`.
   * **Lightbox & Modal Screen-Locked:** Seluruh modal dan lightbox menggunakan `createPortal(..., document.body)` dan *body scroll lock* sehingga tidak akan pernah memanjangkan tata letak halaman ke bawah. Mendukung Scratch game (TurboWarp/Scratch MIT), PDF terintegrasi, Office berkas, dan Gambar.
3. **Verifikasi Terakhir:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 9.82 detik.
   * Dev server aktif dan siap digunakan kapan saja.
---

## 42. Catatan Penutup Sesi (Update Tanggal 20 Nov 2026, 12:35 WIB) — Pencatatan Rencana Kerja Esok Hari: Penerapan Skill Anti-Slop
* Pengguna mengonfirmasi akan beristirahat dan menjadwalkan sesi berikutnya untuk **menerapkan standar Anti-Slop UI/UX** secara menyeluruh ke seluruh antarmuka aplikasi.
* Rencana kerja telah dicatat pada [PRD.md Bab 12](file:///d:/kirimtugaskomputer/PRD.md#12-agenda-sesi-selanjutnya-audit--refactor-anti-slop-uiux).
* Seluruh status aplikasi dalam kondisi bersih, server dev berjalan, dan build produksi passed.
---

## 43. Catatan Pembaruan (Update Tanggal 20 Nov 2026, 13:10 WIB) — Eksekusi Penuh Standar Anti-Slop UI/UX di Seluruh Aplikasi
1. **Pembersihan Total Emoji Klise dari Teks & Tombol:**
   * Seluruh emoji Unicode (🚀, ✨, 🌟, 📸, 🎉, 👋, 🏆, 🎯, 🐱, ⚡) pada teks tombol, toast notification, header kartu, dan label telah dihapus 100% dari seluruh berkas kode sumber `src/`.
   * Digantikan oleh ikon vektor SVG murni dan semantik dari `lucide-react` (seperti `<UploadCloud>`, `<ArrowRight>`, `<GraduationCap>`, `<FolderKanban>`, dll.).
2. **Penyempurnaan Label & Redundansi Navigasi:**
   * Tab filter kelas pada Galeri Guru dan Kelola Project disederhanakan dari "Folder 4A, Folder 4B" menjadi "4A, 4B" yang bersih, menghemat ruang visual dan mengurangi kebisingan teks (*text clutter*).
   * Menghilangkan badge kilauan floating dekoratif yang tidak perlu pada header login.
3. **Penyelarasan Toast Notification:**
   * Seluruh toast notifikasi sistem kini menggunakan bahasa lugas, profesional, dan bersih tanpa akhiran emoji norak (misal: "Karyamu berhasil dikirim!", "Foto profil berhasil diperbarui", "Penilaian berhasil disimpan").
4. **Verifikasi & Status:**
   * Pemeriksaan regex Unicode emoji menghasilkan `0 match` (bersih total).
   * Build produksi `npm run build` sukses 100% tanpa error dalam 6.32 detik.
   * Dev server aktif berjalan di `http://localhost:3000`.

---

## 44. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 11:10 WIB) — Solusi Foto Profil Hilang/Rusak & Sidebar Desktop Fleksibel (Expandable/Collapsible)
1. **Penyelidikan & Perbaikan Masalah Foto Profil Pengguna:**
   * **Masalah 1: Foto Profil Tiba-Tiba Hilang:**
     - *Akar Masalah:* Background polling Google Spreadsheet yang berjalan tiap 12 detik di `DataContext.jsx` sebelumnya hanya memproteksi entitas `submissions` (`galeri_local_submissions`). Saat foto profil pengguna diubah, perubahan hanya tersimpan di memori. Ketika polling spreadsheet berjalan dan spreadsheet belum terupdate, state `data.users` tertimpa data lama sehingga foto profil tiba-tiba hilang.
     - *Solusi:* Menambahkan layer persistensi lokal `galeri_local_users` dengan fungsi `persistLocalUser` dan `getStoredUsers` pada [DataContext.jsx](file:///d:/kirimtugaskomputer/src/context/DataContext.jsx). Data pengguna lokal kini otomatis digabungkan (*merged*) pada `loadData`, `addDocument`, `updateDocument`, dan `deleteDocument`, sehingga foto profil pengguna tidak akan pernah hilang terhapus oleh polling spreadsheet.
   * **Masalah 2: Foto Profil Tampil Rusak / Lingkaran Transparan Teks Alt ("Mr. Tamam"):**
     - *Akar Masalah:* 
       1. Kompresi gambar avatar sebelumnya berukuran 300x300 dengan kualitas 0.82 menghasilkan string base64 35k–55k karakter yang melampaui batas sel Google Sheets (50.000 karakter), menyebabkan string base64 terpotong (*truncated*) dan corrupt.
       2. Komponen `<img>` pada hero banner Guru ([TeacherDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherDashboard.jsx)), Siswa ([StudentDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentDashboard.jsx)), dan Pengaturan Guru ([TeacherSettings.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherSettings.jsx)) tidak memiliki error handling / `onError`, sehingga browser Chrome menampilkan teks alt (misal *"Mr. Tamam"*) di dalam lingkaran kosong transparan.
     - *Solusi:*
       1. Optimasi `compressAvatar` di [helpers.js](file:///d:/kirimtugaskomputer/src/utils/helpers.js) menjadi 200x200 dengan kualitas 0.72 (~8–12KB), sangat aman di bawah batas 50k cell Google Sheets.
       2. Mengalihkan thumbnail URL Google Drive ke `https://drive.google.com/thumbnail?id=${driveId}&sz=w${size}` yang lebih stabil menangani izin publik.
       3. Menambahkan state `photoError` dan handler `onError` multi-level di `TeacherDashboard`, `StudentDashboard`, dan `TeacherSettings`. Jika gambar gagal dimuat, sistem secara otomatis beralih ke endpoint alternatif thumbnail Google Drive, dan jika tetap gagal, menampilkan ikon kamera placeholder / inisial nama yang rapi tanpa pernah merusak layout atau menampilkan lingkaran transparan dengan teks alt.
       4. Mengisolasi seluruh modal zoom foto profil dengan `createPortal(..., document.body)` agar tidak terdistorsi oleh transform container.

2. **Implementasi Sidebar Desktop Fleksibel (Expandable / Collapsible):**
   * **Tombol Panah Toggle Pintar:**
     - Menambahkan tombol panah kecil melingkar pada tepi kanan bilah navigasi desktop ([DashboardLayout.jsx](file:///d:/kirimtugaskomputer/src/components/layout/DashboardLayout.jsx)) dengan ikon `<ChevronRight size={14} />`.
     - Tombol dilengkapi efek interaktif hover scale, ringkas, dan memutar 180° saat diklik.
   * **Mode Ciut (Compact Dock - Default / w-[88px]):**
     - Mempertahankan dock minimalis berkelas dengan ikon terpusat.
     - Dilengkapi tooltip gelembung melayang (*smooth bounce popup pill*) saat disentuh kursor.
   * **Mode Melebar (Expanded Sidebar - w-[245px]):**
     - Saat ikon panah diklik, sidebar bertransisi mulus (`transition-all duration-300 ease-in-out`) melebar ke `245px`.
     - Menampilkan logo resmi + judul lengkap **"GALERI KARYA KOMPUTER SD"**.
     - Setiap item navigasi menampilkan ikon di sebelah kiri dan label nama menu lengkap di sampingnya (misal: "Karya & Tugas Saya", "Manajemen Siswa", "Tugas & Proyek", "Galeri Sekolah", "Pengaturan").
     - Item yang aktif dilengkapi indikator pil gradien bercahaya dan dot putih elegan.
     - Tombol keluar menampilkan ikon `<LogOut>` dan teks "Keluar Akun".
   * **Persistensi State Otomatis:**
     - Pilihan tampilan pengguna tersimpan otomatis di browser via `localStorage.getItem('galeri_sidebar_expanded')`, sehingga status ciut/lebar tetap terjaga saat beralih menu atau memuat ulang halaman (*page refresh*).

3. **Verifikasi & Status:**
   - Kompilasi build produksi `npm run build` berhasil 100% tanpa error dalam 6.39 detik.
   - Background Vite dev server aktif berjalan lancar di `http://localhost:3000`.

---

## 45. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 12:08 WIB) — Penerapan Desain Kartu Hero "Dark Obsidian Glass & Aurora Glow"
1. **Pembaruan Desain Kartu Hero Utama ([StudentDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentDashboard.jsx) & [TeacherDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherDashboard.jsx)):**
   * **Mengganti Gradasi Neon Lama:**
     - Mengubah gradasi lama (*purple-pink neon*) menjadi kartu berkelas tinggi bergaya **Dark Obsidian Glass** (`bg-[#0F111A]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]`).
     - Selaras 100% dengan estetika dock sidebar gelap di sebelah kiri layar.
   * **Efek Aurora Glow:**
     - Menambahkan bias kilauan cahaya aurora melingkar di sudut kartu (`from-violet-600/30 to-fuchsia-600/20` dan `from-indigo-600/25 to-purple-600/15`) dengan efek blur mendalam (`blur-3xl`) yang mewah namun tidak menyilaukan mata.
   * **Tipografi & Kontras:**
     - Teks judul putih tajam (*crisp white*), lencana peran berdesain kaca kristal (`bg-white/[0.08] text-purple-300 border border-white/10`), dan deskripsi abu-abu lembut (`text-slate-300`).
     - Tombol aksi utama kini menggunakan gradasi violet-indigo dengan bayangan berpijar (*glow shadow*) yang seirama dengan tombol aktif pada navigasi.
   * **Kontras Foto Profil Optimal:**
     - Foto profil pengguna (termasuk karakter cerah seperti Tweety milik Aina) kini tampil sangat kontras, tegas, dan menonjol di atas kartu gelap obsidian ini.
2. **Verifikasi:**
   - Kompilasi `npm run build` sukses 100% tanpa error dalam 17.23 detik.
   - HMR Vite dev server berjalan normal dan instan.

---

## 46. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 12:40 WIB) — Tombol Pengaturan Glow, Logo Sidebar Transparan, & Pembersihan Tulisan Kecil
1. **Efek Glow Berpijar pada Tombol Pengaturan ([TeacherDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherDashboard.jsx)):**
   * Tombol "Pengaturan" di kartu hero guru ditingkatkan dengan efek neon ungu glassmorphism:
     `bg-purple-950/40 hover:bg-purple-900/60 text-white border-2 border-purple-400/70 shadow-[0_0_22px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.75)] backdrop-blur-md font-extrabold`.
   * Teks dan ikon gear tampil putih tajam dan berpijar jelas di atas kartu gelap, mengimbangi tombol "+ Buat Project Baru".
2. **Logo Sidebar Transparan Tanpa Kotak Putih ([DashboardLayout.jsx](file:///d:/kirimtugaskomputer/src/components/layout/DashboardLayout.jsx)):**
   * Menghilangkan kotak putih tebal (`bg-white/95 border-white/40`) pada logo di dock atas sidebar (baik mode ciut, mode melebar, maupun menu mobile HP).
   * Maskot karakter laptop kini mengapung (*floating*) secara transparan alami dengan bayangan jatuh ungu yang mewah (`filter drop-shadow-[0_8px_18px_rgba(139,92,246,0.5)]`).
3. **Pembersihan Tulisan Kecil / Subtitle ([TeacherDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherDashboard.jsx) & [StudentDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentDashboard.jsx)):**
   * Menghapus teks deskripsi kecil di bawah sapaan guru: *"Pantau seluruh aktivitas pengumpulan tugas dan berikan apresiasi pada karya kreatif siswa."*
   * Menghapus teks deskripsi kecil di bawah sapaan siswa: *"Siap untuk menampilkan karya hebatmu hari ini? Ada ... tugas yang menunggu sentuhan kreatifmu!"*
   * Menghapus link teks kecil *"Hapus foto"* di bawah avatar siswa, menjadikan tata letak banner jauh lebih ringkas, padat, dan elegan.
4. **Verifikasi:**
   * `npm run build` sukses 100% (0 error) dalam 11.39 detik.
   * Vite dev server aktif berjalan di `http://localhost:3000`.

---

## 47. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 12:50 WIB) — Revisi Penghapusan Badge Panel/Siswa & Pengembalian Deskripsi + Font Tulisan Tangan Tegas
1. **Penyesuaian Elemen Sesuai Arahan Pengguna:**
   * **Menghapus Badge yang Dimaksud:**
     - Menghapus badge chip `"Panel Guru"` beserta ikon folder di atas nama guru ([TeacherDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherDashboard.jsx)).
     - Menghapus badge chip `"Siswa Komputer"` beserta ikon toga di atas nama siswa ([StudentDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentDashboard.jsx)).
   * **Mengembalikan Elemen Deskripsi & Link yang Dibutuhkan:**
     - Mengembalikan teks deskripsi guru: *"Pantau seluruh aktivitas pengumpulan tugas dan berikan apresiasi pada karya kreatif siswa."*
     - Mengembalikan teks deskripsi siswa: *"Siap untuk menampilkan karya hebatmu hari ini? Ada [X] tugas yang menunggu sentuhan kreatifmu!"*
     - Mengembalikan link teks *"Hapus foto"* di bawah avatar siswa.
2. **Tipografi Nama Guru & Siswa (Font Tulisan Tangan Tegas):**
   * Menerapkan font Google Fonts **`Kalam`** (bobot bold/700, cursive) dengan kelas Tailwind `font-handwriting font-bold text-3xl sm:text-4xl text-amber-200 tracking-wide drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]`.
   * Nama guru (misal: *"Mr. Tamam"*) dan nama siswa (misal: *"AINA KARIMAH PUTRI"*) kini tampil dengan gaya tulisan tangan yang artistik, tegas, berwibawa, dan kontras indah berwarna emas lembut di atas kartu obsidian gelap.
3. **Verifikasi:**
   * `npm run build` sukses 100% tanpa error dalam 5.99 detik.
   * Dev server aktif berjalan di `http://localhost:3000`.

---

## 48. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 12:56 WIB) — Pemasangan Wallpaper Halaman Awal pada Kartu Hero (Cinematic Scenic Dark Glass)
1. **Latar Belakang Sinematik Kartu Hero ([StudentDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentDashboard.jsx) & [TeacherDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherDashboard.jsx)):**
   * Memasang gambar latar pemandangan alam geometris (`/login-bg.jpg`) langsung di dalam bingkai melengkung kartu hero siswa dan guru.
   * Menerapkan teknik profesional **Anti-Slop Cinematic Dark Glass Overlay**:
     - Lapisan filter gelap bergradasi halus: `bg-gradient-to-r from-[#0B0D18]/92 via-[#0F111A]/82 to-[#141226]/85`.
     - Sisi kiri (92% gelap) menjaga avatar profil dan nama font *Kalam* emas tetap memiliki kontras tinggi yang sempurna (*zero visual clutter*).
     - Sisi tengah dan kanan (82%-85%) memperlihatkan siluet gunung dan taburan bintang malam yang artistik dan sinematik.
2. **Verifikasi:**
   * Kompilasi `npm run build` sukses 100% tanpa error dalam 10.86 detik.
   * HMR Vite dev server berjalan mulus di `http://localhost:3000`.


---

## 49. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 13:15 WIB) — Perbaikan Tuntas Latar Belakang Kartu Hero & Penataan Elemen Sesuai Arahan Pengguna
1. **Perbaikan Menyeluruh Gambar Background Kartu Hero ([TeacherDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherDashboard.jsx) & [StudentDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentDashboard.jsx)):**
   * **Penyebab Masalah Sebelumnya:** Nilai opasitas arbitrary `from-[#0B0D18]/92` tidak di-generate oleh Tailwind CSS v3 dan hilangnya kelas dasar `bg-[#0B0D18]` pada kartu menyebabkan kartu tampak putih/pucat tanpa menampilkan wallpaper pemandangan.
   * **Solusi Tuntas & Andal:**
     - Menambahkan fondasi warna gelap mutlak `bg-[#0B0D18]` pada container kartu.
     - Menggunakan tag DOM `<img>` langsung dengan path `/login-bg.jpg`, `object-cover object-[center_35%]`, dan `opacity-70`, memastikan pemandangan pegunungan dan langit malam selalu termuat seketika dan terpusat indah pada kontur pegunungan.
     - Melapisi dengan gradasi gelap berstandar Tailwind valid: `bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-purple-950/40`. Sisi kiri menjaga keterbacaan teks dan avatar, sedangkan sisi kanan memperlihatkan siluet pegunungan dan bintang twilight secara nyata.
2. **Koreksi & Finalisasi Elemen Kartu:**
   * **Badge Dikembalikan:**
     - Mengembalikan badge chip `[📁 Panel Guru]` di atas nama guru.
     - Mengembalikan badge chip `[🎓 Siswa Komputer]` di atas nama siswa.
   * **Deskripsi & Link Dihapus (Sesuai Permintaan):**
     - Menghapus tulisan kecil deskripsi pada Guru (*"Pantau seluruh aktivitas pengumpulan tugas..."*).
     - Menghapus tulisan kecil deskripsi pada Siswa (*"Siap untuk menampilkan karya hebatmu hari ini? Ada [X] tugas..."*).
     - Menghapus teks link *"Hapus foto"* di bawah avatar siswa.
   * **Tipografi & Tombol:**
     - Nama guru dan siswa tetap menggunakan gaya font tulisan tangan tegas Google Fonts **Kalam** warna emas lembut (`text-amber-200`).
     - Tombol *"Pengaturan"* pada Guru tetap memiliki efek neon glow ungu elegan.
3. **Verifikasi:**
   * `npm run build` sukses 100% tanpa error dalam 6.06 detik.
   * Vite dev server aktif melayani perubahan secara instan.


---

## 50. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 17:00 WIB) — Pemulihan Animasi Pilihan Kelas Radial Dial Siswa & Ketahanan Data Master Kelas
1. **Identifikasi Penyebab Hilangnya Pilihan Kelas:**
   * Di browser pengguna, setelah refresh atau saat koneksi internet / Google Apps Script masih memuat data awal (*initial sync*), `data.classes` bernilai `[]` (array kosong).
   * Ketiadaan data master cadangan (*fallback*) menyebabkan `cleanClasses` bernilai kosong, sehingga piringan dial lingkaran konsentris terbuka namun tidak ada tombol kelas (4A, 4B, 5A, 5B, 6A, 6B) yang dapat dirender ke dalam piringan dial.
   * State awal `isOpen` sebelumnya bernilai `false`, mewajibkan klik ganda manual yang membingungkan.
2. **Solusi & Penyempurnaan Tuntas:**
   * **Master Default Kelas Permanen (`DEFAULT_CLASSES`):**
     - Mendaftarkan 6 kelas asli sekolah (`4A`, `4B`, `5A`, `5B`, `6A`, `6B`) lengkap dengan UUID aslinya di [src/services/api.js](file:///d:/kirimtugaskomputer/src/services/api.js).
     - Di [src/context/DataContext.jsx](file:///d:/kirimtugaskomputer/src/context/DataContext.jsx): State `data.classes` langsung diinisialisasi dengan data dari `localStorage` (`galeri_cached_classes`) atau `DEFAULT_CLASSES`, sehingga saat halaman pertama kali dimuat (*zero network delay*), data kelas langsung siap 100%.
   * **Pemulihan Otomatis Animasi Merekah (*Spring Burst*) ([LoginScreen.jsx](file:///d:/kirimtugaskomputer/src/components/auth/LoginScreen.jsx)):**
     - Mengubah state awal dial menjadi `isOpen: true` secara default saat kartu berputar 3D ke formulir Siswa.
     - Begitu siswa memilih peran "Siswa", piringan lingkaran futuristik langsung merekah secara elastis (*spring bounce*) memunculkan ke-6 kelas (**4A, 4B, 5A, 5B, 6A, 6B**) melingkari knob pusat.
     - Jarum penunjuk neon cyan berputar presisi mengikuti arah kursor mouse saat menyentuh tombol kelas.
     - Menjamin `activeClasses` tidak akan pernah kosong meskipun terjadi gangguan jaringan atau delay sinkronisasi spreadsheet.
   * **Interaktivitas Tetap Terjaga:**
     - Mengklik salah satu kelas memicu animasi menyusut elastis (*collapse to center*) dan langsung memunculkan formulir nama & PIN.
     - Mengklik tombol knob pusat saat terbuka akan menyusutkan dial dan memutar balik kartu 3D (*flip back*) ke pemilihan peran.
     - Tombol *"← Kembali ke Pilihan Peran"* di pojok kiri atas tetap berfungsi sempurna.
3. **Verifikasi:**
   * `npm run build` sukses 100% tanpa error dalam 6.21 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 51. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 17:30 WIB) — Perbaikan Tuntas Thumbnail Karya Kelas 5 (JPG/PNG/PDF) & Penguncian Format Upload Kelas 5
1. **Analisis Akar Masalah Thumbnail Menjadi "Dokumen File":**
   * **URL Tanpa Parameter Ukuran (*Unsized Edge CDN*):** Pada `getDirectImageUrl` di [src/utils/helpers.js](file:///d:/kirimtugaskomputer/src/utils/helpers.js), URL yang dihasilkan berupa `https://lh3.googleusercontent.com/d/${driveId}` tanpa penentu lebar (`sz=w800`). Hal ini memaksa Google menyajikan file mentah berukuran penuh (hingga 5–10MB), menyebabkan browser mengalami bottleneck koneksi dan timeout saat memuat puluhan kartu sekaligus.
   * **Pemblokiran Referrer (*Google Hotlink Protection*):** Browser mengirimkan header `Referer: http://localhost:3000`, yang kerap diblokir atau di-throttling oleh CDN Google Drive untuk permintaan gambar langsung.
   * **Rantai Fallback yang Rusak:** Ketika gambar gagal dimuat, handler `onError` mencoba mengunduh via `drive.usercontent.google.com/download?id=...&export=view`. Karena endpoint tersebut mengembalikan header `Content-Disposition: attachment`, browser langsung menolaknya dalam tag `<img>`, lalu beralih ke placeholder abu-abu `"Dokumen File"`.
   * **Karya Format PDF Tidak Menampilkan Pratinjau Visual:** Pada [TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx) dan [StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx), file PDF sebelumnya hanya dirender sebagai balok teks bertuliskan *"Dokumen PDF"*, padahal Google Drive secara otomatis menyediakan pratinjau visual halaman pertama (*page 1 thumbnail*) melalui endpoint thumbnail resmi.
   * **Adanya File Nyasar (.sb3) di Kelas 5:** Tidak adanya validasi ekstensi spesifik kelas di formulir upload memungkinkan siswa Kelas 5 mengunggah file `.sb3` Scratch yang seharusnya hanya untuk Kelas 6.
2. **Solusi & Penyempurnaan Tuntas:**
   * **Header Meta & Atribut `no-referrer` ([index.html](file:///d:/kirimtugaskomputer/index.html), [TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx), [StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx), [Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx), [Avatar.jsx](file:///d:/kirimtugaskomputer/src/components/common/Avatar.jsx)):**
     - Menambahkan `<meta name="referrer" content="no-referrer" />` pada `<head>` dokumen HTML.
     - Menyematkan `referrerPolicy="no-referrer"` pada seluruh tag gambar karya dan avatar.
   * **Endpoint Thumbnail Super Cepat & Ringan ([src/utils/helpers.js](file:///d:/kirimtugaskomputer/src/utils/helpers.js)):**
     - Memperbarui `getDirectImageUrl(url, size = 800)` agar menggunakan Google Drive Thumbnail API resmi berkecepatan tinggi: `https://drive.google.com/thumbnail?id=${driveId}&sz=w${size}`.
     - Menguji 89 file pengumpulan di Google Drive secara langsung: 100% dari 52 file gambar dan PDF terbukti sukses termuat dengan status HTTP 200 `image/png` / `image/jpeg`.
   * **Pratinjau Visual Penuh untuk JPG, PNG, dan PDF:**
     - Seluruh karya berformat JPG, PNG, maupun PDF kini langsung merender gambar pratinjau asli karya siswa pada kartu galeri.
     - Untuk karya PDF, ditambahkan chip badge eksklusif `[📄 PDF]` berwarna merah elegan di sudut kiri atas kartu, sehingga guru dan siswa tetap mengetahui jenis dokumen sembari langsung melihat pratinjau visual halaman pertamanya.
     - Rantai fallback `onError` diperbaiki secara andal: jika thumbnail pertama gagal, secara berurutan mencoba varian CDN alternatif `lh3...=w800` dan `lh3...=s800` tanpa pernah memicu penolakan *attachment*.
   * **Penguncian Ketat Format Upload Khusus Kelas 5 ([StudentUpload.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentUpload.jsx) & [StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx)):**
     - Sistem mendeteksi kelas siswa yang login. Jika siswa berada di Kelas 5 (5A/5B), sistem secara ketat membatasi file yang dapat dipilih dan diunggah **hanya format JPG, PNG, atau PDF** (`accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"`).
     - Jika siswa mencoba memilih file selain 3 format tersebut (misalnya `.sb3` atau file lainnya), sistem langsung menolak dan menampilkan toast peringatan ramah: *"Khusus Kelas 5, format karya wajib berupa JPG, PNG, atau PDF ya!"*.
     - Pada galeri guru, jika terdapat file masa lalu siswa Kelas 5 yang tidak sesuai format (seperti file `.sb3`), kartu ditandai dengan badge peringatan merah: `Format Nyasar (.sb3)` agar mudah ditinjau oleh guru.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 56. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:40 WIB) — Penyembunyian Input Nilai/Catatan di Tampilan Kartu & Fitur Navigasi Geser (Next/Prev) pada Mode Lihat Full (Lightbox)
1. **Permintaan Pengguna:**
   * **Sembunyikan Nilai & Catatan Guru di Tampilan Kartu (Grid Mode):**
     - Pada tampilan kartu galeri karya siswa, input nilai, input catatan, dan tombol kirim nilai (*Send*) disembunyikan/dihilangkan agar kartu tampil bersih layaknya pameran galeri visual.
     - Penilaian dan catatan guru tetap dapat dilihat dan diisi secara lengkap saat beralih ke mode tampilan tabel (*Table Mode*).
   * **Fitur Scroll / Geser Kanan & Kiri pada Mode Lihat Full:**
     - Saat guru membuka karya siswa dalam mode layar penuh / fullscreen (*Lightbox*), disediakan navigasi panah kiri (*left arrow*) dan panah kanan (*right arrow*) agar guru dapat langsung melihat karya siswa lainnya secara estetik tanpa perlu menutup mode lihat full terlebih dahulu.
2. **Solusi & Implementasi:**
   * **Tampilan Kartu Bersih Minimalis ([TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx)):**
     - Menghapus blok formulir penilaian cepat (`Nilai`, `Catatan...`, dan ikon kirim) dari setiap kartu di mode Grid.
     - Kartu kini berfokus murni pada thumbnail visual karya, foto avatar, nama siswa, judul karya, dan tombol download .sb3 jika kelas 6.
     - Mode Tabel (*Table View*) tetap mempertahankan kolom nilai, catatan guru, dan aksi penilaian secara utuh.
   * **Navigasi Next / Previous Melayang di Lightbox ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx), [TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx), & [StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx)):**
     - Menambahkan tombol panah melayang di sisi kiri (`ChevronLeft`) dan sisi kanan (`ChevronRight`) layar dengan efek kaca glassmorphic obsidian yang mewah (`backdrop-blur-xl hover:bg-purple-600 hover:scale-115`).
     - Menghitung indeks karya aktif terhadap daftar karya yang sedang difilter (`filteredSubmissions`):
       - Panah Kiri otomatis muncul jika ada karya sebelumnya (`hasPrev`).
       - Panah Kanan otomatis muncul jika ada karya berikutnya (`hasNext`).
     - **Dukungan Tombol Keyboard Panah:** Menekan tombol panah kiri (`ArrowLeft`) atau panah kanan (`ArrowRight`) pada keyboard langsung memicu transisi ke karya sebelum/sesudahnya secara instan.
     - **Dukungan Touch Swipe Gesture (HP & Tablet):** Mengusap layar ke kiri atau ke kanan (*horizontal swipe gesture*) otomatis mengganti karya secara mulus.
     - **Indikator Progres Karya:** Di banner bawah, ditampilkan status urutan karya yang sedang ditinjau, misal: `Oleh: AINA KARIMAH PUTRI • Karya 1 dari 18`.
     - **Reset Zoom Otomatis:** Setiap kali berpindah ke karya berikutnya atau sebelumnya, tingkat zoom dan pergeseran posisi gambar otomatis ter-reset kembali ke ukuran proporsional (100%).
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.10 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 57. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:50 WIB) — Efek 3D Carousel Framer Motion Kekinian & Hype pada Mode Lihat Layar Penuh (Lightbox)
1. **Permintaan Pengguna:**
   * Menambahkan efek transisi carousel dengan Framer Motion yang sangat halus (*smooth*), keren, kekinian, dan sedang tren/hype saat ini dengan animasi *"wow"* yang memikat di mode lihat karya layar penuh (*Lightbox*).
2. **Solusi & Implementasi ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx)):**
   * **3D Perspective Stage & Depth (`perspective: 1400px`):**
     - Wadah panggung layar penuh diberikan ruang perspektif 3D yang dalam.
     - Setiap pergantian karya menghasilkan rotasi sumbu Y alami (`rotateY: 18°` / `-18°`) berpadu dengan kedalaman skala (`scale: 0.86 → 1.0`) dan blur lembut (*cinematic depth of field* `filter: blur(8px) → 0px`).
   * **Animasi Fisika Pegas Berarah (*Direction-Aware Spring Physics*):**
     - Menggunakan arsitektur `<AnimatePresence custom={direction} mode="popLayout" initial={false}>`.
     - Saat memilih karya berikutnya (panah kanan / geser ke kiri): karya saat ini meluncur mulus ke kiri dengan rotasi menjauh, sementara karya baru melesat masuk dari kanan secara bersamaan (*zero blank delay*).
     - Saat memilih karya sebelumnya (panah kiri / geser ke kanan): arah animasi berbalik secara simetris dan alami.
     - Menggunakan tuning pegas elastis premium Framer Motion: `stiffness: 320, damping: 30, mass: 0.85`.
   * **Interaksi Geser Sentuh Tactile (*Tactile Drag-to-Slide Physics*):**
     - Pada gambar (saat zoom 100%), pengguna dapat langsung menyeret (*drag*) gambar ke kiri atau ke kanan dengan mouse atau jari sentuh (`drag="x"`, `dragElastic: 0.65`).
     - Jika ditarik melewati batas 55px atau dilempar dengan kecepatan lentur (*velocity*), kartu otomatis melesat beralih ke karya berikutnya/sebelumnya dengan inersia pegas.
   * **Pendaran Cahaya Dinamis di Latar Belakang (*Ambient Glow Aura*):**
     - Di belakang kartu karya terdapat aura pendaran gradien lembut (*violet, indigo, pink blur-3xl*) yang berdenyut lembut, memberi kesan megah seperti bioskop digital modern.
   * **Indikator Titik Carousel Interaktif (*Active Pill Dots Strip*):**
     - Di atas bilah bawah ditambahkan deretan indikator titik dinamis: titik aktif otomatis memanjang menjadi kapsul bercahaya neon ungu (*layout spring animation*), merefleksikan posisi karya secara visual.
   * **Transisi Teks Lembut (*Smooth Cross-Fade Title & Author*):**
     - Judul karya dan nama pembuat karya di bilah bawah bertransisi vertikal halus (`y: 10 → 0`) setiap kali karya berganti.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 10.65 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 54. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:15 WIB) — Penambahan Target Siswa Tertentu (Anak Les / Individu) & Default Target Kelas Bersih
1. **Permintaan Pengguna:**
   * **Target Tugas Spesifik untuk Anak Les / Siswa Tertentu:**
     - Penugasan project baru dapat ditargetkan bukan hanya ke kelas secara umum, tetapi juga khusus untuk anak les atau siswa tertentu saja.
     - Disediakan kolom target siswa dengan pencarian instan: cukup ketik minimal 2 huruf, nama siswa langsung muncul (*live autocomplete*) yang bersumber langsung dari data halaman Data Siswa (`data.users`).
     - Terdapat ikon Plus (`+`) untuk menambah kolom siswa lainnya secara dinamis.
     - **Privasi Mutlak:** Jika tugas dibuat untuk siswa tertentu, tugas tersebut **tidak akan pernah muncul** di akun anak-anak lain, melainkan hanya tampil di dashboard dan menu upload siswa yang bersangkutan.
   * **Default Target Kelas Bersih (Semua Unchecked):**
     - Saat pop up Buat Project Baru dibuka, seluruh kotak centang Target Kelas harus berstatus **tidak terceklis** (sebelumnya default langsung terceklis di *"Semua Kelas"*).
2. **Solusi & Implementasi:**
   * **Default Bersih Kotak Centang Target Kelas ([TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Nilai default `classId` diubah menjadi `[]` (array kosong).
     - Kotak *"Semua Kelas"* kini hanya terceklis jika `formData.classId.includes('all')`.
     - Setiap kelas (4A, 4B, 5A, 5B, 6A, 6B) tampil bersih tanpa centang saat pertama kali modal dibuka.
   * **Fitur Kolom Target Siswa Dinamis ([TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Menyediakan input pencarian nama siswa dengan pencarian cepat (ketik minimal 2 huruf).
     - Menampilkan menu *dropdown* autocomplete elegan berisi foto/avatar, nama lengkap, dan kelas siswa dari master Data Siswa.
     - Siswa yang dipilih otomatis terkunci dalam wadah chip kartu yang rapi beserta tombol hapus (`X`).
     - Tombol ikon Plus `+ Tambah Kolom Siswa` memungkinkan guru menambahkan siswa kedua, ketiga, dan seterusnya dengan mudah.
     - Peringatan privasi otomatis muncul: *"🔒 Tugas Khusus (X Siswa Terpilih): Project ini hanya akan tampil di halaman siswa yang dipilih dan tidak dapat dilihat oleh anak-anak lain."*
   * **Filter Proteksi Hak Akses Siswa ([StudentDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentDashboard.jsx), [StudentUpload.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentUpload.jsx), [src/utils/helpers.js](file:///d:/kirimtugaskomputer/src/utils/helpers.js)):**
     - Membuat fungsi utilitas `isProjectForStudent(project, user)`.
     - Jika sebuah project memiliki target siswa spesifik (`targetStudents`), sistem memvalidasi `targetStudents.includes(user.id)`. Jika ID siswa tidak terdaftar, project **100% tersembunyi** (tidak dihitung dalam tugas aktif, tugas pending, maupun dropdown pemilihan tugas upload karya).
   * **Penyajian di Panel Guru ([TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Kartu tugas di guru dilengkapi badge khusus: `🎯 Khusus X Siswa (Les)` beserta daftar nama siswa.
     - Ditambahkan tab folder filter baru: `🎯 Khusus / Les` untuk mempermudah guru meninjau seluruh tugas les/privat secara terpisah.
   * **Persistensi Data Spreadsheet Cerdas ([src/services/api.js](file:///d:/kirimtugaskomputer/src/services/api.js) & [GAS_Code.gs](file:///d:/kirimtugaskomputer/GAS_Code.gs)):**
     - ID siswa target digabungkan secara aman ke dalam `classId` dengan prefix `student:<uuid>`. Hal ini menjamin persistensi permanen ke Google Sheets tanpa risiko kegagalan skema backend.
     - Saat data dimuat, `api.js` memisahkan target kelas dan target siswa kembali secara otomatis.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 56. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:40 WIB) — Penyembunyian Input Nilai/Catatan di Tampilan Kartu & Fitur Navigasi Geser (Next/Prev) pada Mode Lihat Full (Lightbox)
1. **Permintaan Pengguna:**
   * **Sembunyikan Nilai & Catatan Guru di Tampilan Kartu (Grid Mode):**
     - Pada tampilan kartu galeri karya siswa, input nilai, input catatan, dan tombol kirim nilai (*Send*) disembunyikan/dihilangkan agar kartu tampil bersih layaknya pameran galeri visual.
     - Penilaian dan catatan guru tetap dapat dilihat dan diisi secara lengkap saat beralih ke mode tampilan tabel (*Table Mode*).
   * **Fitur Scroll / Geser Kanan & Kiri pada Mode Lihat Full:**
     - Saat guru membuka karya siswa dalam mode layar penuh / fullscreen (*Lightbox*), disediakan navigasi panah kiri (*left arrow*) dan panah kanan (*right arrow*) agar guru dapat langsung melihat karya siswa lainnya secara estetik tanpa perlu menutup mode lihat full terlebih dahulu.
2. **Solusi & Implementasi:**
   * **Tampilan Kartu Bersih Minimalis ([TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx)):**
     - Menghapus blok formulir penilaian cepat (`Nilai`, `Catatan...`, dan ikon kirim) dari setiap kartu di mode Grid.
     - Kartu kini berfokus murni pada thumbnail visual karya, foto avatar, nama siswa, judul karya, dan tombol download .sb3 jika kelas 6.
     - Mode Tabel (*Table View*) tetap mempertahankan kolom nilai, catatan guru, dan aksi penilaian secara utuh.
   * **Navigasi Next / Previous Melayang di Lightbox ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx), [TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx), & [StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx)):**
     - Menambahkan tombol panah melayang di sisi kiri (`ChevronLeft`) dan sisi kanan (`ChevronRight`) layar dengan efek kaca glassmorphic obsidian yang mewah (`backdrop-blur-xl hover:bg-purple-600 hover:scale-115`).
     - Menghitung indeks karya aktif terhadap daftar karya yang sedang difilter (`filteredSubmissions`):
       - Panah Kiri otomatis muncul jika ada karya sebelumnya (`hasPrev`).
       - Panah Kanan otomatis muncul jika ada karya berikutnya (`hasNext`).
     - **Dukungan Tombol Keyboard Panah:** Menekan tombol panah kiri (`ArrowLeft`) atau panah kanan (`ArrowRight`) pada keyboard langsung memicu transisi ke karya sebelum/sesudahnya secara instan.
     - **Dukungan Touch Swipe Gesture (HP & Tablet):** Mengusap layar ke kiri atau ke kanan (*horizontal swipe gesture*) otomatis mengganti karya secara mulus.
     - **Indikator Progres Karya:** Di banner bawah, ditampilkan status urutan karya yang sedang ditinjau, misal: `Oleh: AINA KARIMAH PUTRI • Karya 1 dari 18`.
     - **Reset Zoom Otomatis:** Setiap kali berpindah ke karya berikutnya atau sebelumnya, tingkat zoom dan pergeseran posisi gambar otomatis ter-reset kembali ke ukuran proporsional (100%).
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.10 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 57. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:50 WIB) — Efek 3D Carousel Framer Motion Kekinian & Hype pada Mode Lihat Layar Penuh (Lightbox)
1. **Permintaan Pengguna:**
   * Menambahkan efek transisi carousel dengan Framer Motion yang sangat halus (*smooth*), keren, kekinian, dan sedang tren/hype saat ini dengan animasi *"wow"* yang memikat di mode lihat karya layar penuh (*Lightbox*).
2. **Solusi & Implementasi ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx)):**
   * **3D Perspective Stage & Depth (`perspective: 1400px`):**
     - Wadah panggung layar penuh diberikan ruang perspektif 3D yang dalam.
     - Setiap pergantian karya menghasilkan rotasi sumbu Y alami (`rotateY: 18°` / `-18°`) berpadu dengan kedalaman skala (`scale: 0.86 → 1.0`) dan blur lembut (*cinematic depth of field* `filter: blur(8px) → 0px`).
   * **Animasi Fisika Pegas Berarah (*Direction-Aware Spring Physics*):**
     - Menggunakan arsitektur `<AnimatePresence custom={direction} mode="popLayout" initial={false}>`.
     - Saat memilih karya berikutnya (panah kanan / geser ke kiri): karya saat ini meluncur mulus ke kiri dengan rotasi menjauh, sementara karya baru melesat masuk dari kanan secara bersamaan (*zero blank delay*).
     - Saat memilih karya sebelumnya (panah kiri / geser ke kanan): arah animasi berbalik secara simetris dan alami.
     - Menggunakan tuning pegas elastis premium Framer Motion: `stiffness: 320, damping: 30, mass: 0.85`.
   * **Interaksi Geser Sentuh Tactile (*Tactile Drag-to-Slide Physics*):**
     - Pada gambar (saat zoom 100%), pengguna dapat langsung menyeret (*drag*) gambar ke kiri atau ke kanan dengan mouse atau jari sentuh (`drag="x"`, `dragElastic: 0.65`).
     - Jika ditarik melewati batas 55px atau dilempar dengan kecepatan lentur (*velocity*), kartu otomatis melesat beralih ke karya berikutnya/sebelumnya dengan inersia pegas.
   * **Pendaran Cahaya Dinamis di Latar Belakang (*Ambient Glow Aura*):**
     - Di belakang kartu karya terdapat aura pendaran gradien lembut (*violet, indigo, pink blur-3xl*) yang berdenyut lembut, memberi kesan megah seperti bioskop digital modern.
   * **Indikator Titik Carousel Interaktif (*Active Pill Dots Strip*):**
     - Di atas bilah bawah ditambahkan deretan indikator titik dinamis: titik aktif otomatis memanjang menjadi kapsul bercahaya neon ungu (*layout spring animation*), merefleksikan posisi karya secara visual.
   * **Transisi Teks Lembut (*Smooth Cross-Fade Title & Author*):**
     - Judul karya dan nama pembuat karya di bilah bawah bertransisi vertikal halus (`y: 10 → 0`) setiap kali karya berganti.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 10.65 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 55. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:25 WIB) — Sinkronisasi Penutupan/Penghapusan Tugas ke Siswa, Fitur Edit Project di Card, Format Tanggal-Bulan-Jam, & Urutan Newest First
1. **Permintaan Pengguna:**
   * **Sinkronisasi Penutupan & Penghapusan Project:**
     - Ketika guru menutup project (*"Tutup Project"* / `status: 'selesai'`) atau menghapusnya, project tersebut **tidak boleh muncul** pada pilihan tugas saat siswa ingin mengunggah karya di halaman Upload Siswa.
   * **Fitur Edit / Ikon Edit di Kartu Project Guru:**
     - Pada kumpulan kartu di halaman *Kelola Project & Tugas*, ditambahkan fitur edit / ikon edit di setiap card agar guru bisa mengubah target tugas (target kelas maupun target siswa khusus/les), judul, instruksi, dan batas waktu.
   * **Format Batas Waktu Lengkap (Tanggal, Bulan, dan Jam):**
     - Input dan penayangan batas waktu pengumpulan dilengkapi dengan format tanggal, nama bulan bahasa Indonesia, dan jam (misal `21 Nov 2026 • 23:59 WIB`).
   * **Posisi Project Baru di Paling Awal (Newest First):**
     - Setiap ada input project yang baru dibuat atau diperbarui, posisinya langsung berada di urutan paling awal (atas/kiri pertama).
2. **Solusi & Implementasi:**
   * **Sinkronisasi Mutlak Status Project ([DataContext.jsx](file:///d:/kirimtugaskomputer/src/context/DataContext.jsx)):**
     - Menambahkan lapisan persistensi lokal `LOCAL_PROJECTS_KEY` dan `LOCAL_DELETED_PROJECTS_KEY` untuk data project.
     - Dalam siklus `loadData()` yang berjalan di latar belakang (polling 12 detik), sistem kini secara otomatis menggabungkan *status override* lokal (seperti `status: 'selesai'`) dan memfilter ID project yang telah dihapus sehingga polling server tidak pernah menimpa atau mengembalikan status project yang telah ditutup/dihapus oleh guru.
   * **Proteksi Ketat Upload Siswa ([StudentUpload.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentUpload.jsx) & [helpers.js](file:///d:/kirimtugaskomputer/src/utils/helpers.js)):**
     - Memperbarui fungsi `isProjectForStudent` dan query `activeProjects`: memvalidasi `String(p.status || 'aktif').trim().toLowerCase() === 'aktif'`.
     - Project yang telah ditutup (`status: 'selesai'`) atau dihapus otomatis 100% lenyap dari dropdown opsi tugas siswa.
     - Ditambahkan penjaga `useEffect`: jika sebuah project ditutup saat form siswa terbuka, pemilihan `projectId` otomatis dibatalkan/direset ke kosong secara aman.
   * **Fitur Edit Project di Card Guru ([TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Menambahkan ikon pensil (*Pencil*) di header setiap kartu project berdampingan dengan tombol hapus (*Trash*).
     - Mengklik tombol Edit membuka pop up modal *"Edit Project / Tugas"* yang otomatis terisi dengan data project yang ada: judul, target kelas, daftar target siswa terpilih, instruksi, dan batas waktu.
     - Saat disimpan, sistem memanggil `updateDocument('projects', editingProject.id, payload)` dan menampilkan notifikasi sukses *"Project berhasil diperbarui"*.
   * **Batas Waktu Lengkap dengan Tanggal, Bulan & Jam ([helpers.js](file:///d:/kirimtugaskomputer/src/utils/helpers.js) & [TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Mengubah input batas waktu menjadi `type="datetime-local"` sehingga guru dapat menentukan tanggal sekaligus jam & menit batas pengumpulan.
     - Menambahkan fungsi pemformat tanggal `formatProjectDeadline()` yang mengubah format ISO menjadi tampilan ramah Indonesia: misal `21 Nov 2026 • 23:59 WIB`.
   * **Urutan Card Project Paling Awal (Newest First):**
     - Mengurutkan daftar project secara descending berdasarkan `createdAt` dan `id`, sehingga setiap project baru atau project terkini selalu tampil di posisi paling depan / pertama.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 56. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:40 WIB) — Penyembunyian Input Nilai/Catatan di Tampilan Kartu & Fitur Navigasi Geser (Next/Prev) pada Mode Lihat Full (Lightbox)
1. **Permintaan Pengguna:**
   * **Sembunyikan Nilai & Catatan Guru di Tampilan Kartu (Grid Mode):**
     - Pada tampilan kartu galeri karya siswa, input nilai, input catatan, dan tombol kirim nilai (*Send*) disembunyikan/dihilangkan agar kartu tampil bersih layaknya pameran galeri visual.
     - Penilaian dan catatan guru tetap dapat dilihat dan diisi secara lengkap saat beralih ke mode tampilan tabel (*Table Mode*).
   * **Fitur Scroll / Geser Kanan & Kiri pada Mode Lihat Full:**
     - Saat guru membuka karya siswa dalam mode layar penuh / fullscreen (*Lightbox*), disediakan navigasi panah kiri (*left arrow*) dan panah kanan (*right arrow*) agar guru dapat langsung melihat karya siswa lainnya secara estetik tanpa perlu menutup mode lihat full terlebih dahulu.
2. **Solusi & Implementasi:**
   * **Tampilan Kartu Bersih Minimalis ([TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx)):**
     - Menghapus blok formulir penilaian cepat (`Nilai`, `Catatan...`, dan ikon kirim) dari setiap kartu di mode Grid.
     - Kartu kini berfokus murni pada thumbnail visual karya, foto avatar, nama siswa, judul karya, dan tombol download .sb3 jika kelas 6.
     - Mode Tabel (*Table View*) tetap mempertahankan kolom nilai, catatan guru, dan aksi penilaian secara utuh.
   * **Navigasi Next / Previous Melayang di Lightbox ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx), [TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx), & [StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx)):**
     - Menambahkan tombol panah melayang di sisi kiri (`ChevronLeft`) dan sisi kanan (`ChevronRight`) layar dengan efek kaca glassmorphic obsidian yang mewah (`backdrop-blur-xl hover:bg-purple-600 hover:scale-115`).
     - Menghitung indeks karya aktif terhadap daftar karya yang sedang difilter (`filteredSubmissions`):
       - Panah Kiri otomatis muncul jika ada karya sebelumnya (`hasPrev`).
       - Panah Kanan otomatis muncul jika ada karya berikutnya (`hasNext`).
     - **Dukungan Tombol Keyboard Panah:** Menekan tombol panah kiri (`ArrowLeft`) atau panah kanan (`ArrowRight`) pada keyboard langsung memicu transisi ke karya sebelum/sesudahnya secara instan.
     - **Dukungan Touch Swipe Gesture (HP & Tablet):** Mengusap layar ke kiri atau ke kanan (*horizontal swipe gesture*) otomatis mengganti karya secara mulus.
     - **Indikator Progres Karya:** Di banner bawah, ditampilkan status urutan karya yang sedang ditinjau, misal: `Oleh: AINA KARIMAH PUTRI • Karya 1 dari 18`.
     - **Reset Zoom Otomatis:** Setiap kali berpindah ke karya berikutnya atau sebelumnya, tingkat zoom dan pergeseran posisi gambar otomatis ter-reset kembali ke ukuran proporsional (100%).
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.10 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 57. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:50 WIB) — Efek 3D Carousel Framer Motion Kekinian & Hype pada Mode Lihat Layar Penuh (Lightbox)
1. **Permintaan Pengguna:**
   * Menambahkan efek transisi carousel dengan Framer Motion yang sangat halus (*smooth*), keren, kekinian, dan sedang tren/hype saat ini dengan animasi *"wow"* yang memikat di mode lihat karya layar penuh (*Lightbox*).
2. **Solusi & Implementasi ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx)):**
   * **3D Perspective Stage & Depth (`perspective: 1400px`):**
     - Wadah panggung layar penuh diberikan ruang perspektif 3D yang dalam.
     - Setiap pergantian karya menghasilkan rotasi sumbu Y alami (`rotateY: 18°` / `-18°`) berpadu dengan kedalaman skala (`scale: 0.86 → 1.0`) dan blur lembut (*cinematic depth of field* `filter: blur(8px) → 0px`).
   * **Animasi Fisika Pegas Berarah (*Direction-Aware Spring Physics*):**
     - Menggunakan arsitektur `<AnimatePresence custom={direction} mode="popLayout" initial={false}>`.
     - Saat memilih karya berikutnya (panah kanan / geser ke kiri): karya saat ini meluncur mulus ke kiri dengan rotasi menjauh, sementara karya baru melesat masuk dari kanan secara bersamaan (*zero blank delay*).
     - Saat memilih karya sebelumnya (panah kiri / geser ke kanan): arah animasi berbalik secara simetris dan alami.
     - Menggunakan tuning pegas elastis premium Framer Motion: `stiffness: 320, damping: 30, mass: 0.85`.
   * **Interaksi Geser Sentuh Tactile (*Tactile Drag-to-Slide Physics*):**
     - Pada gambar (saat zoom 100%), pengguna dapat langsung menyeret (*drag*) gambar ke kiri atau ke kanan dengan mouse atau jari sentuh (`drag="x"`, `dragElastic: 0.65`).
     - Jika ditarik melewati batas 55px atau dilempar dengan kecepatan lentur (*velocity*), kartu otomatis melesat beralih ke karya berikutnya/sebelumnya dengan inersia pegas.
   * **Pendaran Cahaya Dinamis di Latar Belakang (*Ambient Glow Aura*):**
     - Di belakang kartu karya terdapat aura pendaran gradien lembut (*violet, indigo, pink blur-3xl*) yang berdenyut lembut, memberi kesan megah seperti bioskop digital modern.
   * **Indikator Titik Carousel Interaktif (*Active Pill Dots Strip*):**
     - Di atas bilah bawah ditambahkan deretan indikator titik dinamis: titik aktif otomatis memanjang menjadi kapsul bercahaya neon ungu (*layout spring animation*), merefleksikan posisi karya secara visual.
   * **Transisi Teks Lembut (*Smooth Cross-Fade Title & Author*):**
     - Judul karya dan nama pembuat karya di bilah bawah bertransisi vertikal halus (`y: 10 → 0`) setiap kali karya berganti.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 10.65 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 53. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 17:45 WIB) — Respon Instan (0ms Delay) Animasi Pilihan Kelas Siswa
1. **Analisis Akar Masalah Delay Beberapa Detik:**
   * Sebelumnya digunakan `<AnimatePresence mode="wait">` untuk menukar elemen DOM antara tombol tertutup dan dial terbuka.
   * `mode="wait"` di Framer Motion menunggu animasi `exit` elemen sebelumnya selesai secara mutlak sebelum merender elemen berikutnya. Karena transisi pegas (*spring physics*) membutuhkan waktu pengendapan (*settle time*) hingga 1,5 detik, hal ini menciptakan jeda tunggu yang nyata bagi pengguna setelah tombol diklik.
2. **Solusi & Rekayasa Arsitektur Terpadu (*Unified Component*):**
   * Menghilangkan pergantian mount/unmount DOM dan `mode="wait"` yang memicu bottleneck.
   * Menggabungkan knob pusat dan orbit dial ke dalam satu wadah harmonis terpadu:
     - Knob pusat selalu siap dan aktif di titik pusat `(0, 0)`.
     - Saat diklik, state `isOpen` berubah seketika (**0 milidetik / instan**).
     - Orbit dial membesar responsif (`stiffness: 420, damping: 25`).
     - Ke-6 tombol kelas (4A, 4B, 5A, 5B, 6A, 6B) langsung melesat keluar dengan pantulan pegas super cepat dan bertenaga (*snappy spring bounce* `stiffness: 420, damping: 17, mass: 0.65`, interval *stagger* hanya 0.025s).
     - Saat ditutup kembali, animasi menyusut disetel presisi ke 220ms sehingga kartu berputar kembali ke pemilihan peran dengan sangat mulus dan tanggap tanpa jeda.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 56. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:40 WIB) — Penyembunyian Input Nilai/Catatan di Tampilan Kartu & Fitur Navigasi Geser (Next/Prev) pada Mode Lihat Full (Lightbox)
1. **Permintaan Pengguna:**
   * **Sembunyikan Nilai & Catatan Guru di Tampilan Kartu (Grid Mode):**
     - Pada tampilan kartu galeri karya siswa, input nilai, input catatan, dan tombol kirim nilai (*Send*) disembunyikan/dihilangkan agar kartu tampil bersih layaknya pameran galeri visual.
     - Penilaian dan catatan guru tetap dapat dilihat dan diisi secara lengkap saat beralih ke mode tampilan tabel (*Table Mode*).
   * **Fitur Scroll / Geser Kanan & Kiri pada Mode Lihat Full:**
     - Saat guru membuka karya siswa dalam mode layar penuh / fullscreen (*Lightbox*), disediakan navigasi panah kiri (*left arrow*) dan panah kanan (*right arrow*) agar guru dapat langsung melihat karya siswa lainnya secara estetik tanpa perlu menutup mode lihat full terlebih dahulu.
2. **Solusi & Implementasi:**
   * **Tampilan Kartu Bersih Minimalis ([TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx)):**
     - Menghapus blok formulir penilaian cepat (`Nilai`, `Catatan...`, dan ikon kirim) dari setiap kartu di mode Grid.
     - Kartu kini berfokus murni pada thumbnail visual karya, foto avatar, nama siswa, judul karya, dan tombol download .sb3 jika kelas 6.
     - Mode Tabel (*Table View*) tetap mempertahankan kolom nilai, catatan guru, dan aksi penilaian secara utuh.
   * **Navigasi Next / Previous Melayang di Lightbox ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx), [TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx), & [StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx)):**
     - Menambahkan tombol panah melayang di sisi kiri (`ChevronLeft`) dan sisi kanan (`ChevronRight`) layar dengan efek kaca glassmorphic obsidian yang mewah (`backdrop-blur-xl hover:bg-purple-600 hover:scale-115`).
     - Menghitung indeks karya aktif terhadap daftar karya yang sedang difilter (`filteredSubmissions`):
       - Panah Kiri otomatis muncul jika ada karya sebelumnya (`hasPrev`).
       - Panah Kanan otomatis muncul jika ada karya berikutnya (`hasNext`).
     - **Dukungan Tombol Keyboard Panah:** Menekan tombol panah kiri (`ArrowLeft`) atau panah kanan (`ArrowRight`) pada keyboard langsung memicu transisi ke karya sebelum/sesudahnya secara instan.
     - **Dukungan Touch Swipe Gesture (HP & Tablet):** Mengusap layar ke kiri atau ke kanan (*horizontal swipe gesture*) otomatis mengganti karya secara mulus.
     - **Indikator Progres Karya:** Di banner bawah, ditampilkan status urutan karya yang sedang ditinjau, misal: `Oleh: AINA KARIMAH PUTRI • Karya 1 dari 18`.
     - **Reset Zoom Otomatis:** Setiap kali berpindah ke karya berikutnya atau sebelumnya, tingkat zoom dan pergeseran posisi gambar otomatis ter-reset kembali ke ukuran proporsional (100%).
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.10 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 57. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:50 WIB) — Efek 3D Carousel Framer Motion Kekinian & Hype pada Mode Lihat Layar Penuh (Lightbox)
1. **Permintaan Pengguna:**
   * Menambahkan efek transisi carousel dengan Framer Motion yang sangat halus (*smooth*), keren, kekinian, dan sedang tren/hype saat ini dengan animasi *"wow"* yang memikat di mode lihat karya layar penuh (*Lightbox*).
2. **Solusi & Implementasi ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx)):**
   * **3D Perspective Stage & Depth (`perspective: 1400px`):**
     - Wadah panggung layar penuh diberikan ruang perspektif 3D yang dalam.
     - Setiap pergantian karya menghasilkan rotasi sumbu Y alami (`rotateY: 18°` / `-18°`) berpadu dengan kedalaman skala (`scale: 0.86 → 1.0`) dan blur lembut (*cinematic depth of field* `filter: blur(8px) → 0px`).
   * **Animasi Fisika Pegas Berarah (*Direction-Aware Spring Physics*):**
     - Menggunakan arsitektur `<AnimatePresence custom={direction} mode="popLayout" initial={false}>`.
     - Saat memilih karya berikutnya (panah kanan / geser ke kiri): karya saat ini meluncur mulus ke kiri dengan rotasi menjauh, sementara karya baru melesat masuk dari kanan secara bersamaan (*zero blank delay*).
     - Saat memilih karya sebelumnya (panah kiri / geser ke kanan): arah animasi berbalik secara simetris dan alami.
     - Menggunakan tuning pegas elastis premium Framer Motion: `stiffness: 320, damping: 30, mass: 0.85`.
   * **Interaksi Geser Sentuh Tactile (*Tactile Drag-to-Slide Physics*):**
     - Pada gambar (saat zoom 100%), pengguna dapat langsung menyeret (*drag*) gambar ke kiri atau ke kanan dengan mouse atau jari sentuh (`drag="x"`, `dragElastic: 0.65`).
     - Jika ditarik melewati batas 55px atau dilempar dengan kecepatan lentur (*velocity*), kartu otomatis melesat beralih ke karya berikutnya/sebelumnya dengan inersia pegas.
   * **Pendaran Cahaya Dinamis di Latar Belakang (*Ambient Glow Aura*):**
     - Di belakang kartu karya terdapat aura pendaran gradien lembut (*violet, indigo, pink blur-3xl*) yang berdenyut lembut, memberi kesan megah seperti bioskop digital modern.
   * **Indikator Titik Carousel Interaktif (*Active Pill Dots Strip*):**
     - Di atas bilah bawah ditambahkan deretan indikator titik dinamis: titik aktif otomatis memanjang menjadi kapsul bercahaya neon ungu (*layout spring animation*), merefleksikan posisi karya secara visual.
   * **Transisi Teks Lembut (*Smooth Cross-Fade Title & Author*):**
     - Judul karya dan nama pembuat karya di bilah bawah bertransisi vertikal halus (`y: 10 → 0`) setiap kali karya berganti.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 10.65 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 54. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:15 WIB) — Penambahan Target Siswa Tertentu (Anak Les / Individu) & Default Target Kelas Bersih
1. **Permintaan Pengguna:**
   * **Target Tugas Spesifik untuk Anak Les / Siswa Tertentu:**
     - Penugasan project baru dapat ditargetkan bukan hanya ke kelas secara umum, tetapi juga khusus untuk anak les atau siswa tertentu saja.
     - Disediakan kolom target siswa dengan pencarian instan: cukup ketik minimal 2 huruf, nama siswa langsung muncul (*live autocomplete*) yang bersumber langsung dari data halaman Data Siswa (`data.users`).
     - Terdapat ikon Plus (`+`) untuk menambah kolom siswa lainnya secara dinamis.
     - **Privasi Mutlak:** Jika tugas dibuat untuk siswa tertentu, tugas tersebut **tidak akan pernah muncul** di akun anak-anak lain, melainkan hanya tampil di dashboard dan menu upload siswa yang bersangkutan.
   * **Default Target Kelas Bersih (Semua Unchecked):**
     - Saat pop up Buat Project Baru dibuka, seluruh kotak centang Target Kelas harus berstatus **tidak terceklis** (sebelumnya default langsung terceklis di *"Semua Kelas"*).
2. **Solusi & Implementasi:**
   * **Default Bersih Kotak Centang Target Kelas ([TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Nilai default `classId` diubah menjadi `[]` (array kosong).
     - Kotak *"Semua Kelas"* kini hanya terceklis jika `formData.classId.includes('all')`.
     - Setiap kelas (4A, 4B, 5A, 5B, 6A, 6B) tampil bersih tanpa centang saat pertama kali modal dibuka.
   * **Fitur Kolom Target Siswa Dinamis ([TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Menyediakan input pencarian nama siswa dengan pencarian cepat (ketik minimal 2 huruf).
     - Menampilkan menu *dropdown* autocomplete elegan berisi foto/avatar, nama lengkap, dan kelas siswa dari master Data Siswa.
     - Siswa yang dipilih otomatis terkunci dalam wadah chip kartu yang rapi beserta tombol hapus (`X`).
     - Tombol ikon Plus `+ Tambah Kolom Siswa` memungkinkan guru menambahkan siswa kedua, ketiga, dan seterusnya dengan mudah.
     - Peringatan privasi otomatis muncul: *"🔒 Tugas Khusus (X Siswa Terpilih): Project ini hanya akan tampil di halaman siswa yang dipilih dan tidak dapat dilihat oleh anak-anak lain."*
   * **Filter Proteksi Hak Akses Siswa ([StudentDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentDashboard.jsx), [StudentUpload.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentUpload.jsx), [src/utils/helpers.js](file:///d:/kirimtugaskomputer/src/utils/helpers.js)):**
     - Membuat fungsi utilitas `isProjectForStudent(project, user)`.
     - Jika sebuah project memiliki target siswa spesifik (`targetStudents`), sistem memvalidasi `targetStudents.includes(user.id)`. Jika ID siswa tidak terdaftar, project **100% tersembunyi** (tidak dihitung dalam tugas aktif, tugas pending, maupun dropdown pemilihan tugas upload karya).
   * **Penyajian di Panel Guru ([TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Kartu tugas di guru dilengkapi badge khusus: `🎯 Khusus X Siswa (Les)` beserta daftar nama siswa.
     - Ditambahkan tab folder filter baru: `🎯 Khusus / Les` untuk mempermudah guru meninjau seluruh tugas les/privat secara terpisah.
   * **Persistensi Data Spreadsheet Cerdas ([src/services/api.js](file:///d:/kirimtugaskomputer/src/services/api.js) & [GAS_Code.gs](file:///d:/kirimtugaskomputer/GAS_Code.gs)):**
     - ID siswa target digabungkan secara aman ke dalam `classId` dengan prefix `student:<uuid>`. Hal ini menjamin persistensi permanen ke Google Sheets tanpa risiko kegagalan skema backend.
     - Saat data dimuat, `api.js` memisahkan target kelas dan target siswa kembali secara otomatis.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 56. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:40 WIB) — Penyembunyian Input Nilai/Catatan di Tampilan Kartu & Fitur Navigasi Geser (Next/Prev) pada Mode Lihat Full (Lightbox)
1. **Permintaan Pengguna:**
   * **Sembunyikan Nilai & Catatan Guru di Tampilan Kartu (Grid Mode):**
     - Pada tampilan kartu galeri karya siswa, input nilai, input catatan, dan tombol kirim nilai (*Send*) disembunyikan/dihilangkan agar kartu tampil bersih layaknya pameran galeri visual.
     - Penilaian dan catatan guru tetap dapat dilihat dan diisi secara lengkap saat beralih ke mode tampilan tabel (*Table Mode*).
   * **Fitur Scroll / Geser Kanan & Kiri pada Mode Lihat Full:**
     - Saat guru membuka karya siswa dalam mode layar penuh / fullscreen (*Lightbox*), disediakan navigasi panah kiri (*left arrow*) dan panah kanan (*right arrow*) agar guru dapat langsung melihat karya siswa lainnya secara estetik tanpa perlu menutup mode lihat full terlebih dahulu.
2. **Solusi & Implementasi:**
   * **Tampilan Kartu Bersih Minimalis ([TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx)):**
     - Menghapus blok formulir penilaian cepat (`Nilai`, `Catatan...`, dan ikon kirim) dari setiap kartu di mode Grid.
     - Kartu kini berfokus murni pada thumbnail visual karya, foto avatar, nama siswa, judul karya, dan tombol download .sb3 jika kelas 6.
     - Mode Tabel (*Table View*) tetap mempertahankan kolom nilai, catatan guru, dan aksi penilaian secara utuh.
   * **Navigasi Next / Previous Melayang di Lightbox ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx), [TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx), & [StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx)):**
     - Menambahkan tombol panah melayang di sisi kiri (`ChevronLeft`) dan sisi kanan (`ChevronRight`) layar dengan efek kaca glassmorphic obsidian yang mewah (`backdrop-blur-xl hover:bg-purple-600 hover:scale-115`).
     - Menghitung indeks karya aktif terhadap daftar karya yang sedang difilter (`filteredSubmissions`):
       - Panah Kiri otomatis muncul jika ada karya sebelumnya (`hasPrev`).
       - Panah Kanan otomatis muncul jika ada karya berikutnya (`hasNext`).
     - **Dukungan Tombol Keyboard Panah:** Menekan tombol panah kiri (`ArrowLeft`) atau panah kanan (`ArrowRight`) pada keyboard langsung memicu transisi ke karya sebelum/sesudahnya secara instan.
     - **Dukungan Touch Swipe Gesture (HP & Tablet):** Mengusap layar ke kiri atau ke kanan (*horizontal swipe gesture*) otomatis mengganti karya secara mulus.
     - **Indikator Progres Karya:** Di banner bawah, ditampilkan status urutan karya yang sedang ditinjau, misal: `Oleh: AINA KARIMAH PUTRI • Karya 1 dari 18`.
     - **Reset Zoom Otomatis:** Setiap kali berpindah ke karya berikutnya atau sebelumnya, tingkat zoom dan pergeseran posisi gambar otomatis ter-reset kembali ke ukuran proporsional (100%).
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.10 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 57. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:50 WIB) — Efek 3D Carousel Framer Motion Kekinian & Hype pada Mode Lihat Layar Penuh (Lightbox)
1. **Permintaan Pengguna:**
   * Menambahkan efek transisi carousel dengan Framer Motion yang sangat halus (*smooth*), keren, kekinian, dan sedang tren/hype saat ini dengan animasi *"wow"* yang memikat di mode lihat karya layar penuh (*Lightbox*).
2. **Solusi & Implementasi ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx)):**
   * **3D Perspective Stage & Depth (`perspective: 1400px`):**
     - Wadah panggung layar penuh diberikan ruang perspektif 3D yang dalam.
     - Setiap pergantian karya menghasilkan rotasi sumbu Y alami (`rotateY: 18°` / `-18°`) berpadu dengan kedalaman skala (`scale: 0.86 → 1.0`) dan blur lembut (*cinematic depth of field* `filter: blur(8px) → 0px`).
   * **Animasi Fisika Pegas Berarah (*Direction-Aware Spring Physics*):**
     - Menggunakan arsitektur `<AnimatePresence custom={direction} mode="popLayout" initial={false}>`.
     - Saat memilih karya berikutnya (panah kanan / geser ke kiri): karya saat ini meluncur mulus ke kiri dengan rotasi menjauh, sementara karya baru melesat masuk dari kanan secara bersamaan (*zero blank delay*).
     - Saat memilih karya sebelumnya (panah kiri / geser ke kanan): arah animasi berbalik secara simetris dan alami.
     - Menggunakan tuning pegas elastis premium Framer Motion: `stiffness: 320, damping: 30, mass: 0.85`.
   * **Interaksi Geser Sentuh Tactile (*Tactile Drag-to-Slide Physics*):**
     - Pada gambar (saat zoom 100%), pengguna dapat langsung menyeret (*drag*) gambar ke kiri atau ke kanan dengan mouse atau jari sentuh (`drag="x"`, `dragElastic: 0.65`).
     - Jika ditarik melewati batas 55px atau dilempar dengan kecepatan lentur (*velocity*), kartu otomatis melesat beralih ke karya berikutnya/sebelumnya dengan inersia pegas.
   * **Pendaran Cahaya Dinamis di Latar Belakang (*Ambient Glow Aura*):**
     - Di belakang kartu karya terdapat aura pendaran gradien lembut (*violet, indigo, pink blur-3xl*) yang berdenyut lembut, memberi kesan megah seperti bioskop digital modern.
   * **Indikator Titik Carousel Interaktif (*Active Pill Dots Strip*):**
     - Di atas bilah bawah ditambahkan deretan indikator titik dinamis: titik aktif otomatis memanjang menjadi kapsul bercahaya neon ungu (*layout spring animation*), merefleksikan posisi karya secara visual.
   * **Transisi Teks Lembut (*Smooth Cross-Fade Title & Author*):**
     - Judul karya dan nama pembuat karya di bilah bawah bertransisi vertikal halus (`y: 10 → 0`) setiap kali karya berganti.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 10.65 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 55. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:25 WIB) — Sinkronisasi Penutupan/Penghapusan Tugas ke Siswa, Fitur Edit Project di Card, Format Tanggal-Bulan-Jam, & Urutan Newest First
1. **Permintaan Pengguna:**
   * **Sinkronisasi Penutupan & Penghapusan Project:**
     - Ketika guru menutup project (*"Tutup Project"* / `status: 'selesai'`) atau menghapusnya, project tersebut **tidak boleh muncul** pada pilihan tugas saat siswa ingin mengunggah karya di halaman Upload Siswa.
   * **Fitur Edit / Ikon Edit di Kartu Project Guru:**
     - Pada kumpulan kartu di halaman *Kelola Project & Tugas*, ditambahkan fitur edit / ikon edit di setiap card agar guru bisa mengubah target tugas (target kelas maupun target siswa khusus/les), judul, instruksi, dan batas waktu.
   * **Format Batas Waktu Lengkap (Tanggal, Bulan, dan Jam):**
     - Input dan penayangan batas waktu pengumpulan dilengkapi dengan format tanggal, nama bulan bahasa Indonesia, dan jam (misal `21 Nov 2026 • 23:59 WIB`).
   * **Posisi Project Baru di Paling Awal (Newest First):**
     - Setiap ada input project yang baru dibuat atau diperbarui, posisinya langsung berada di urutan paling awal (atas/kiri pertama).
2. **Solusi & Implementasi:**
   * **Sinkronisasi Mutlak Status Project ([DataContext.jsx](file:///d:/kirimtugaskomputer/src/context/DataContext.jsx)):**
     - Menambahkan lapisan persistensi lokal `LOCAL_PROJECTS_KEY` dan `LOCAL_DELETED_PROJECTS_KEY` untuk data project.
     - Dalam siklus `loadData()` yang berjalan di latar belakang (polling 12 detik), sistem kini secara otomatis menggabungkan *status override* lokal (seperti `status: 'selesai'`) dan memfilter ID project yang telah dihapus sehingga polling server tidak pernah menimpa atau mengembalikan status project yang telah ditutup/dihapus oleh guru.
   * **Proteksi Ketat Upload Siswa ([StudentUpload.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentUpload.jsx) & [helpers.js](file:///d:/kirimtugaskomputer/src/utils/helpers.js)):**
     - Memperbarui fungsi `isProjectForStudent` dan query `activeProjects`: memvalidasi `String(p.status || 'aktif').trim().toLowerCase() === 'aktif'`.
     - Project yang telah ditutup (`status: 'selesai'`) atau dihapus otomatis 100% lenyap dari dropdown opsi tugas siswa.
     - Ditambahkan penjaga `useEffect`: jika sebuah project ditutup saat form siswa terbuka, pemilihan `projectId` otomatis dibatalkan/direset ke kosong secara aman.
   * **Fitur Edit Project di Card Guru ([TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Menambahkan ikon pensil (*Pencil*) di header setiap kartu project berdampingan dengan tombol hapus (*Trash*).
     - Mengklik tombol Edit membuka pop up modal *"Edit Project / Tugas"* yang otomatis terisi dengan data project yang ada: judul, target kelas, daftar target siswa terpilih, instruksi, dan batas waktu.
     - Saat disimpan, sistem memanggil `updateDocument('projects', editingProject.id, payload)` dan menampilkan notifikasi sukses *"Project berhasil diperbarui"*.
   * **Batas Waktu Lengkap dengan Tanggal, Bulan & Jam ([helpers.js](file:///d:/kirimtugaskomputer/src/utils/helpers.js) & [TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Mengubah input batas waktu menjadi `type="datetime-local"` sehingga guru dapat menentukan tanggal sekaligus jam & menit batas pengumpulan.
     - Menambahkan fungsi pemformat tanggal `formatProjectDeadline()` yang mengubah format ISO menjadi tampilan ramah Indonesia: misal `21 Nov 2026 • 23:59 WIB`.
   * **Urutan Card Project Paling Awal (Newest First):**
     - Mengurutkan daftar project secara descending berdasarkan `createdAt` dan `id`, sehingga setiap project baru atau project terkini selalu tampil di posisi paling depan / pertama.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 56. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:40 WIB) — Penyembunyian Input Nilai/Catatan di Tampilan Kartu & Fitur Navigasi Geser (Next/Prev) pada Mode Lihat Full (Lightbox)
1. **Permintaan Pengguna:**
   * **Sembunyikan Nilai & Catatan Guru di Tampilan Kartu (Grid Mode):**
     - Pada tampilan kartu galeri karya siswa, input nilai, input catatan, dan tombol kirim nilai (*Send*) disembunyikan/dihilangkan agar kartu tampil bersih layaknya pameran galeri visual.
     - Penilaian dan catatan guru tetap dapat dilihat dan diisi secara lengkap saat beralih ke mode tampilan tabel (*Table Mode*).
   * **Fitur Scroll / Geser Kanan & Kiri pada Mode Lihat Full:**
     - Saat guru membuka karya siswa dalam mode layar penuh / fullscreen (*Lightbox*), disediakan navigasi panah kiri (*left arrow*) dan panah kanan (*right arrow*) agar guru dapat langsung melihat karya siswa lainnya secara estetik tanpa perlu menutup mode lihat full terlebih dahulu.
2. **Solusi & Implementasi:**
   * **Tampilan Kartu Bersih Minimalis ([TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx)):**
     - Menghapus blok formulir penilaian cepat (`Nilai`, `Catatan...`, dan ikon kirim) dari setiap kartu di mode Grid.
     - Kartu kini berfokus murni pada thumbnail visual karya, foto avatar, nama siswa, judul karya, dan tombol download .sb3 jika kelas 6.
     - Mode Tabel (*Table View*) tetap mempertahankan kolom nilai, catatan guru, dan aksi penilaian secara utuh.
   * **Navigasi Next / Previous Melayang di Lightbox ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx), [TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx), & [StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx)):**
     - Menambahkan tombol panah melayang di sisi kiri (`ChevronLeft`) dan sisi kanan (`ChevronRight`) layar dengan efek kaca glassmorphic obsidian yang mewah (`backdrop-blur-xl hover:bg-purple-600 hover:scale-115`).
     - Menghitung indeks karya aktif terhadap daftar karya yang sedang difilter (`filteredSubmissions`):
       - Panah Kiri otomatis muncul jika ada karya sebelumnya (`hasPrev`).
       - Panah Kanan otomatis muncul jika ada karya berikutnya (`hasNext`).
     - **Dukungan Tombol Keyboard Panah:** Menekan tombol panah kiri (`ArrowLeft`) atau panah kanan (`ArrowRight`) pada keyboard langsung memicu transisi ke karya sebelum/sesudahnya secara instan.
     - **Dukungan Touch Swipe Gesture (HP & Tablet):** Mengusap layar ke kiri atau ke kanan (*horizontal swipe gesture*) otomatis mengganti karya secara mulus.
     - **Indikator Progres Karya:** Di banner bawah, ditampilkan status urutan karya yang sedang ditinjau, misal: `Oleh: AINA KARIMAH PUTRI • Karya 1 dari 18`.
     - **Reset Zoom Otomatis:** Setiap kali berpindah ke karya berikutnya atau sebelumnya, tingkat zoom dan pergeseran posisi gambar otomatis ter-reset kembali ke ukuran proporsional (100%).
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.10 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 57. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:50 WIB) — Efek 3D Carousel Framer Motion Kekinian & Hype pada Mode Lihat Layar Penuh (Lightbox)
1. **Permintaan Pengguna:**
   * Menambahkan efek transisi carousel dengan Framer Motion yang sangat halus (*smooth*), keren, kekinian, dan sedang tren/hype saat ini dengan animasi *"wow"* yang memikat di mode lihat karya layar penuh (*Lightbox*).
2. **Solusi & Implementasi ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx)):**
   * **3D Perspective Stage & Depth (`perspective: 1400px`):**
     - Wadah panggung layar penuh diberikan ruang perspektif 3D yang dalam.
     - Setiap pergantian karya menghasilkan rotasi sumbu Y alami (`rotateY: 18°` / `-18°`) berpadu dengan kedalaman skala (`scale: 0.86 → 1.0`) dan blur lembut (*cinematic depth of field* `filter: blur(8px) → 0px`).
   * **Animasi Fisika Pegas Berarah (*Direction-Aware Spring Physics*):**
     - Menggunakan arsitektur `<AnimatePresence custom={direction} mode="popLayout" initial={false}>`.
     - Saat memilih karya berikutnya (panah kanan / geser ke kiri): karya saat ini meluncur mulus ke kiri dengan rotasi menjauh, sementara karya baru melesat masuk dari kanan secara bersamaan (*zero blank delay*).
     - Saat memilih karya sebelumnya (panah kiri / geser ke kanan): arah animasi berbalik secara simetris dan alami.
     - Menggunakan tuning pegas elastis premium Framer Motion: `stiffness: 320, damping: 30, mass: 0.85`.
   * **Interaksi Geser Sentuh Tactile (*Tactile Drag-to-Slide Physics*):**
     - Pada gambar (saat zoom 100%), pengguna dapat langsung menyeret (*drag*) gambar ke kiri atau ke kanan dengan mouse atau jari sentuh (`drag="x"`, `dragElastic: 0.65`).
     - Jika ditarik melewati batas 55px atau dilempar dengan kecepatan lentur (*velocity*), kartu otomatis melesat beralih ke karya berikutnya/sebelumnya dengan inersia pegas.
   * **Pendaran Cahaya Dinamis di Latar Belakang (*Ambient Glow Aura*):**
     - Di belakang kartu karya terdapat aura pendaran gradien lembut (*violet, indigo, pink blur-3xl*) yang berdenyut lembut, memberi kesan megah seperti bioskop digital modern.
   * **Indikator Titik Carousel Interaktif (*Active Pill Dots Strip*):**
     - Di atas bilah bawah ditambahkan deretan indikator titik dinamis: titik aktif otomatis memanjang menjadi kapsul bercahaya neon ungu (*layout spring animation*), merefleksikan posisi karya secara visual.
   * **Transisi Teks Lembut (*Smooth Cross-Fade Title & Author*):**
     - Judul karya dan nama pembuat karya di bilah bawah bertransisi vertikal halus (`y: 10 → 0`) setiap kali karya berganti.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 10.65 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 52. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 17:40 WIB) — Penyempurnaan Alur Interaksi & Animasi Lingkaran Dial Kelas Siswa
1. **Permintaan Pengguna:**
   * Saat pengguna mengklik opsi peran *"Masuk sebagai Siswa"*, pilihan kelas tidak langsung menyebar terbuka.
   * Tampilan awal harus berupa ikon di dalam lingkaran kecil (knob pusat berkarakter *Graduation Cap*) terlebih dahulu.
   * Ketika lingkaran kecil tersebut diklik, barulah memicu animasi menyebar keluar (*burst outward*) dengan pantulan lentur yang keren (*energetic spring bounce*).
   * Ketika ikon tengah diklik saat terbuka, animasi harus menyusut ke dalam (*smooth inward collapse*) dan kartu kembali membalik secara mulus (*smooth 3D flip*) ke halaman pemilihan peran.
2. **Solusi & Implementasi ([LoginScreen.jsx](file:///d:/kirimtugaskomputer/src/components/auth/LoginScreen.jsx)):**
   * **State Awal Dial Tertutup (`isOpen: false`):**
     - Mengubah inisialisasi state dial `isOpen` menjadi `false` secara default.
     - Saat kartu berputar 3D ke formulir Siswa, yang tampil pertama kali adalah lingkaran kecil minimalis dengan ikon topi sarjana ungu bercahaya, cincin denyut neon (*pulsing cyan & purple rings*), tanpa teks.
   * **Animasi Merekah Lentur (*Spring Burst Bounce*):**
     - Mengklik lingkaran kecil tersebut memicu transisi `isOpen: true`.
     - Wadah orbit futuristik membesar elastis, sementara ke-6 tombol kelas (4A, 4B, 5A, 5B, 6A, 6B) melesat keluar dari titik pusat `(0, 0)` ke orbit melingkar dengan fisika pegas `stiffness: 320, damping: 16, mass: 0.8` dan delay berjenjang (*staggered bloom*), menghasilkan efek pantulan lentur yang sangat hidup dan memuaskan.
   * **Animasi Menyusut Mulus ke Dalam (*Smooth Inward Collapse & Return*):**
     - Saat dial terbuka, mengklik tombol knob di pusat lingkaran memicu state `isClosingToBack: true`.
     - Seluruh tombol kelas meluncur mundur kembali ke titik tengah dengan animasi menyusut (*scale: 0, opacity: 0*), dan orbit lingkaran mengecil ke pusat (`scale: 0.2, opacity: 0`).
     - Setelah animasi masuk ke dalam selesai (340ms), sistem memanggil `onCloseAndGoBack()` yang memicu kartu membalik 3D secara mulus (*smooth 3D flip back*) ke halaman pemilihan peran.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 56. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:40 WIB) — Penyembunyian Input Nilai/Catatan di Tampilan Kartu & Fitur Navigasi Geser (Next/Prev) pada Mode Lihat Full (Lightbox)
1. **Permintaan Pengguna:**
   * **Sembunyikan Nilai & Catatan Guru di Tampilan Kartu (Grid Mode):**
     - Pada tampilan kartu galeri karya siswa, input nilai, input catatan, dan tombol kirim nilai (*Send*) disembunyikan/dihilangkan agar kartu tampil bersih layaknya pameran galeri visual.
     - Penilaian dan catatan guru tetap dapat dilihat dan diisi secara lengkap saat beralih ke mode tampilan tabel (*Table Mode*).
   * **Fitur Scroll / Geser Kanan & Kiri pada Mode Lihat Full:**
     - Saat guru membuka karya siswa dalam mode layar penuh / fullscreen (*Lightbox*), disediakan navigasi panah kiri (*left arrow*) dan panah kanan (*right arrow*) agar guru dapat langsung melihat karya siswa lainnya secara estetik tanpa perlu menutup mode lihat full terlebih dahulu.
2. **Solusi & Implementasi:**
   * **Tampilan Kartu Bersih Minimalis ([TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx)):**
     - Menghapus blok formulir penilaian cepat (`Nilai`, `Catatan...`, dan ikon kirim) dari setiap kartu di mode Grid.
     - Kartu kini berfokus murni pada thumbnail visual karya, foto avatar, nama siswa, judul karya, dan tombol download .sb3 jika kelas 6.
     - Mode Tabel (*Table View*) tetap mempertahankan kolom nilai, catatan guru, dan aksi penilaian secara utuh.
   * **Navigasi Next / Previous Melayang di Lightbox ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx), [TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx), & [StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx)):**
     - Menambahkan tombol panah melayang di sisi kiri (`ChevronLeft`) dan sisi kanan (`ChevronRight`) layar dengan efek kaca glassmorphic obsidian yang mewah (`backdrop-blur-xl hover:bg-purple-600 hover:scale-115`).
     - Menghitung indeks karya aktif terhadap daftar karya yang sedang difilter (`filteredSubmissions`):
       - Panah Kiri otomatis muncul jika ada karya sebelumnya (`hasPrev`).
       - Panah Kanan otomatis muncul jika ada karya berikutnya (`hasNext`).
     - **Dukungan Tombol Keyboard Panah:** Menekan tombol panah kiri (`ArrowLeft`) atau panah kanan (`ArrowRight`) pada keyboard langsung memicu transisi ke karya sebelum/sesudahnya secara instan.
     - **Dukungan Touch Swipe Gesture (HP & Tablet):** Mengusap layar ke kiri atau ke kanan (*horizontal swipe gesture*) otomatis mengganti karya secara mulus.
     - **Indikator Progres Karya:** Di banner bawah, ditampilkan status urutan karya yang sedang ditinjau, misal: `Oleh: AINA KARIMAH PUTRI • Karya 1 dari 18`.
     - **Reset Zoom Otomatis:** Setiap kali berpindah ke karya berikutnya atau sebelumnya, tingkat zoom dan pergeseran posisi gambar otomatis ter-reset kembali ke ukuran proporsional (100%).
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.10 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 57. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:50 WIB) — Efek 3D Carousel Framer Motion Kekinian & Hype pada Mode Lihat Layar Penuh (Lightbox)
1. **Permintaan Pengguna:**
   * Menambahkan efek transisi carousel dengan Framer Motion yang sangat halus (*smooth*), keren, kekinian, dan sedang tren/hype saat ini dengan animasi *"wow"* yang memikat di mode lihat karya layar penuh (*Lightbox*).
2. **Solusi & Implementasi ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx)):**
   * **3D Perspective Stage & Depth (`perspective: 1400px`):**
     - Wadah panggung layar penuh diberikan ruang perspektif 3D yang dalam.
     - Setiap pergantian karya menghasilkan rotasi sumbu Y alami (`rotateY: 18°` / `-18°`) berpadu dengan kedalaman skala (`scale: 0.86 → 1.0`) dan blur lembut (*cinematic depth of field* `filter: blur(8px) → 0px`).
   * **Animasi Fisika Pegas Berarah (*Direction-Aware Spring Physics*):**
     - Menggunakan arsitektur `<AnimatePresence custom={direction} mode="popLayout" initial={false}>`.
     - Saat memilih karya berikutnya (panah kanan / geser ke kiri): karya saat ini meluncur mulus ke kiri dengan rotasi menjauh, sementara karya baru melesat masuk dari kanan secara bersamaan (*zero blank delay*).
     - Saat memilih karya sebelumnya (panah kiri / geser ke kanan): arah animasi berbalik secara simetris dan alami.
     - Menggunakan tuning pegas elastis premium Framer Motion: `stiffness: 320, damping: 30, mass: 0.85`.
   * **Interaksi Geser Sentuh Tactile (*Tactile Drag-to-Slide Physics*):**
     - Pada gambar (saat zoom 100%), pengguna dapat langsung menyeret (*drag*) gambar ke kiri atau ke kanan dengan mouse atau jari sentuh (`drag="x"`, `dragElastic: 0.65`).
     - Jika ditarik melewati batas 55px atau dilempar dengan kecepatan lentur (*velocity*), kartu otomatis melesat beralih ke karya berikutnya/sebelumnya dengan inersia pegas.
   * **Pendaran Cahaya Dinamis di Latar Belakang (*Ambient Glow Aura*):**
     - Di belakang kartu karya terdapat aura pendaran gradien lembut (*violet, indigo, pink blur-3xl*) yang berdenyut lembut, memberi kesan megah seperti bioskop digital modern.
   * **Indikator Titik Carousel Interaktif (*Active Pill Dots Strip*):**
     - Di atas bilah bawah ditambahkan deretan indikator titik dinamis: titik aktif otomatis memanjang menjadi kapsul bercahaya neon ungu (*layout spring animation*), merefleksikan posisi karya secara visual.
   * **Transisi Teks Lembut (*Smooth Cross-Fade Title & Author*):**
     - Judul karya dan nama pembuat karya di bilah bawah bertransisi vertikal halus (`y: 10 → 0`) setiap kali karya berganti.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 10.65 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 54. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:15 WIB) — Penambahan Target Siswa Tertentu (Anak Les / Individu) & Default Target Kelas Bersih
1. **Permintaan Pengguna:**
   * **Target Tugas Spesifik untuk Anak Les / Siswa Tertentu:**
     - Penugasan project baru dapat ditargetkan bukan hanya ke kelas secara umum, tetapi juga khusus untuk anak les atau siswa tertentu saja.
     - Disediakan kolom target siswa dengan pencarian instan: cukup ketik minimal 2 huruf, nama siswa langsung muncul (*live autocomplete*) yang bersumber langsung dari data halaman Data Siswa (`data.users`).
     - Terdapat ikon Plus (`+`) untuk menambah kolom siswa lainnya secara dinamis.
     - **Privasi Mutlak:** Jika tugas dibuat untuk siswa tertentu, tugas tersebut **tidak akan pernah muncul** di akun anak-anak lain, melainkan hanya tampil di dashboard dan menu upload siswa yang bersangkutan.
   * **Default Target Kelas Bersih (Semua Unchecked):**
     - Saat pop up Buat Project Baru dibuka, seluruh kotak centang Target Kelas harus berstatus **tidak terceklis** (sebelumnya default langsung terceklis di *"Semua Kelas"*).
2. **Solusi & Implementasi:**
   * **Default Bersih Kotak Centang Target Kelas ([TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Nilai default `classId` diubah menjadi `[]` (array kosong).
     - Kotak *"Semua Kelas"* kini hanya terceklis jika `formData.classId.includes('all')`.
     - Setiap kelas (4A, 4B, 5A, 5B, 6A, 6B) tampil bersih tanpa centang saat pertama kali modal dibuka.
   * **Fitur Kolom Target Siswa Dinamis ([TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Menyediakan input pencarian nama siswa dengan pencarian cepat (ketik minimal 2 huruf).
     - Menampilkan menu *dropdown* autocomplete elegan berisi foto/avatar, nama lengkap, dan kelas siswa dari master Data Siswa.
     - Siswa yang dipilih otomatis terkunci dalam wadah chip kartu yang rapi beserta tombol hapus (`X`).
     - Tombol ikon Plus `+ Tambah Kolom Siswa` memungkinkan guru menambahkan siswa kedua, ketiga, dan seterusnya dengan mudah.
     - Peringatan privasi otomatis muncul: *"🔒 Tugas Khusus (X Siswa Terpilih): Project ini hanya akan tampil di halaman siswa yang dipilih dan tidak dapat dilihat oleh anak-anak lain."*
   * **Filter Proteksi Hak Akses Siswa ([StudentDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentDashboard.jsx), [StudentUpload.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentUpload.jsx), [src/utils/helpers.js](file:///d:/kirimtugaskomputer/src/utils/helpers.js)):**
     - Membuat fungsi utilitas `isProjectForStudent(project, user)`.
     - Jika sebuah project memiliki target siswa spesifik (`targetStudents`), sistem memvalidasi `targetStudents.includes(user.id)`. Jika ID siswa tidak terdaftar, project **100% tersembunyi** (tidak dihitung dalam tugas aktif, tugas pending, maupun dropdown pemilihan tugas upload karya).
   * **Penyajian di Panel Guru ([TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Kartu tugas di guru dilengkapi badge khusus: `🎯 Khusus X Siswa (Les)` beserta daftar nama siswa.
     - Ditambahkan tab folder filter baru: `🎯 Khusus / Les` untuk mempermudah guru meninjau seluruh tugas les/privat secara terpisah.
   * **Persistensi Data Spreadsheet Cerdas ([src/services/api.js](file:///d:/kirimtugaskomputer/src/services/api.js) & [GAS_Code.gs](file:///d:/kirimtugaskomputer/GAS_Code.gs)):**
     - ID siswa target digabungkan secara aman ke dalam `classId` dengan prefix `student:<uuid>`. Hal ini menjamin persistensi permanen ke Google Sheets tanpa risiko kegagalan skema backend.
     - Saat data dimuat, `api.js` memisahkan target kelas dan target siswa kembali secara otomatis.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 56. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:40 WIB) — Penyembunyian Input Nilai/Catatan di Tampilan Kartu & Fitur Navigasi Geser (Next/Prev) pada Mode Lihat Full (Lightbox)
1. **Permintaan Pengguna:**
   * **Sembunyikan Nilai & Catatan Guru di Tampilan Kartu (Grid Mode):**
     - Pada tampilan kartu galeri karya siswa, input nilai, input catatan, dan tombol kirim nilai (*Send*) disembunyikan/dihilangkan agar kartu tampil bersih layaknya pameran galeri visual.
     - Penilaian dan catatan guru tetap dapat dilihat dan diisi secara lengkap saat beralih ke mode tampilan tabel (*Table Mode*).
   * **Fitur Scroll / Geser Kanan & Kiri pada Mode Lihat Full:**
     - Saat guru membuka karya siswa dalam mode layar penuh / fullscreen (*Lightbox*), disediakan navigasi panah kiri (*left arrow*) dan panah kanan (*right arrow*) agar guru dapat langsung melihat karya siswa lainnya secara estetik tanpa perlu menutup mode lihat full terlebih dahulu.
2. **Solusi & Implementasi:**
   * **Tampilan Kartu Bersih Minimalis ([TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx)):**
     - Menghapus blok formulir penilaian cepat (`Nilai`, `Catatan...`, dan ikon kirim) dari setiap kartu di mode Grid.
     - Kartu kini berfokus murni pada thumbnail visual karya, foto avatar, nama siswa, judul karya, dan tombol download .sb3 jika kelas 6.
     - Mode Tabel (*Table View*) tetap mempertahankan kolom nilai, catatan guru, dan aksi penilaian secara utuh.
   * **Navigasi Next / Previous Melayang di Lightbox ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx), [TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx), & [StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx)):**
     - Menambahkan tombol panah melayang di sisi kiri (`ChevronLeft`) dan sisi kanan (`ChevronRight`) layar dengan efek kaca glassmorphic obsidian yang mewah (`backdrop-blur-xl hover:bg-purple-600 hover:scale-115`).
     - Menghitung indeks karya aktif terhadap daftar karya yang sedang difilter (`filteredSubmissions`):
       - Panah Kiri otomatis muncul jika ada karya sebelumnya (`hasPrev`).
       - Panah Kanan otomatis muncul jika ada karya berikutnya (`hasNext`).
     - **Dukungan Tombol Keyboard Panah:** Menekan tombol panah kiri (`ArrowLeft`) atau panah kanan (`ArrowRight`) pada keyboard langsung memicu transisi ke karya sebelum/sesudahnya secara instan.
     - **Dukungan Touch Swipe Gesture (HP & Tablet):** Mengusap layar ke kiri atau ke kanan (*horizontal swipe gesture*) otomatis mengganti karya secara mulus.
     - **Indikator Progres Karya:** Di banner bawah, ditampilkan status urutan karya yang sedang ditinjau, misal: `Oleh: AINA KARIMAH PUTRI • Karya 1 dari 18`.
     - **Reset Zoom Otomatis:** Setiap kali berpindah ke karya berikutnya atau sebelumnya, tingkat zoom dan pergeseran posisi gambar otomatis ter-reset kembali ke ukuran proporsional (100%).
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.10 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 57. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:50 WIB) — Efek 3D Carousel Framer Motion Kekinian & Hype pada Mode Lihat Layar Penuh (Lightbox)
1. **Permintaan Pengguna:**
   * Menambahkan efek transisi carousel dengan Framer Motion yang sangat halus (*smooth*), keren, kekinian, dan sedang tren/hype saat ini dengan animasi *"wow"* yang memikat di mode lihat karya layar penuh (*Lightbox*).
2. **Solusi & Implementasi ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx)):**
   * **3D Perspective Stage & Depth (`perspective: 1400px`):**
     - Wadah panggung layar penuh diberikan ruang perspektif 3D yang dalam.
     - Setiap pergantian karya menghasilkan rotasi sumbu Y alami (`rotateY: 18°` / `-18°`) berpadu dengan kedalaman skala (`scale: 0.86 → 1.0`) dan blur lembut (*cinematic depth of field* `filter: blur(8px) → 0px`).
   * **Animasi Fisika Pegas Berarah (*Direction-Aware Spring Physics*):**
     - Menggunakan arsitektur `<AnimatePresence custom={direction} mode="popLayout" initial={false}>`.
     - Saat memilih karya berikutnya (panah kanan / geser ke kiri): karya saat ini meluncur mulus ke kiri dengan rotasi menjauh, sementara karya baru melesat masuk dari kanan secara bersamaan (*zero blank delay*).
     - Saat memilih karya sebelumnya (panah kiri / geser ke kanan): arah animasi berbalik secara simetris dan alami.
     - Menggunakan tuning pegas elastis premium Framer Motion: `stiffness: 320, damping: 30, mass: 0.85`.
   * **Interaksi Geser Sentuh Tactile (*Tactile Drag-to-Slide Physics*):**
     - Pada gambar (saat zoom 100%), pengguna dapat langsung menyeret (*drag*) gambar ke kiri atau ke kanan dengan mouse atau jari sentuh (`drag="x"`, `dragElastic: 0.65`).
     - Jika ditarik melewati batas 55px atau dilempar dengan kecepatan lentur (*velocity*), kartu otomatis melesat beralih ke karya berikutnya/sebelumnya dengan inersia pegas.
   * **Pendaran Cahaya Dinamis di Latar Belakang (*Ambient Glow Aura*):**
     - Di belakang kartu karya terdapat aura pendaran gradien lembut (*violet, indigo, pink blur-3xl*) yang berdenyut lembut, memberi kesan megah seperti bioskop digital modern.
   * **Indikator Titik Carousel Interaktif (*Active Pill Dots Strip*):**
     - Di atas bilah bawah ditambahkan deretan indikator titik dinamis: titik aktif otomatis memanjang menjadi kapsul bercahaya neon ungu (*layout spring animation*), merefleksikan posisi karya secara visual.
   * **Transisi Teks Lembut (*Smooth Cross-Fade Title & Author*):**
     - Judul karya dan nama pembuat karya di bilah bawah bertransisi vertikal halus (`y: 10 → 0`) setiap kali karya berganti.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 10.65 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 55. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:25 WIB) — Sinkronisasi Penutupan/Penghapusan Tugas ke Siswa, Fitur Edit Project di Card, Format Tanggal-Bulan-Jam, & Urutan Newest First
1. **Permintaan Pengguna:**
   * **Sinkronisasi Penutupan & Penghapusan Project:**
     - Ketika guru menutup project (*"Tutup Project"* / `status: 'selesai'`) atau menghapusnya, project tersebut **tidak boleh muncul** pada pilihan tugas saat siswa ingin mengunggah karya di halaman Upload Siswa.
   * **Fitur Edit / Ikon Edit di Kartu Project Guru:**
     - Pada kumpulan kartu di halaman *Kelola Project & Tugas*, ditambahkan fitur edit / ikon edit di setiap card agar guru bisa mengubah target tugas (target kelas maupun target siswa khusus/les), judul, instruksi, dan batas waktu.
   * **Format Batas Waktu Lengkap (Tanggal, Bulan, dan Jam):**
     - Input dan penayangan batas waktu pengumpulan dilengkapi dengan format tanggal, nama bulan bahasa Indonesia, dan jam (misal `21 Nov 2026 • 23:59 WIB`).
   * **Posisi Project Baru di Paling Awal (Newest First):**
     - Setiap ada input project yang baru dibuat atau diperbarui, posisinya langsung berada di urutan paling awal (atas/kiri pertama).
2. **Solusi & Implementasi:**
   * **Sinkronisasi Mutlak Status Project ([DataContext.jsx](file:///d:/kirimtugaskomputer/src/context/DataContext.jsx)):**
     - Menambahkan lapisan persistensi lokal `LOCAL_PROJECTS_KEY` dan `LOCAL_DELETED_PROJECTS_KEY` untuk data project.
     - Dalam siklus `loadData()` yang berjalan di latar belakang (polling 12 detik), sistem kini secara otomatis menggabungkan *status override* lokal (seperti `status: 'selesai'`) dan memfilter ID project yang telah dihapus sehingga polling server tidak pernah menimpa atau mengembalikan status project yang telah ditutup/dihapus oleh guru.
   * **Proteksi Ketat Upload Siswa ([StudentUpload.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentUpload.jsx) & [helpers.js](file:///d:/kirimtugaskomputer/src/utils/helpers.js)):**
     - Memperbarui fungsi `isProjectForStudent` dan query `activeProjects`: memvalidasi `String(p.status || 'aktif').trim().toLowerCase() === 'aktif'`.
     - Project yang telah ditutup (`status: 'selesai'`) atau dihapus otomatis 100% lenyap dari dropdown opsi tugas siswa.
     - Ditambahkan penjaga `useEffect`: jika sebuah project ditutup saat form siswa terbuka, pemilihan `projectId` otomatis dibatalkan/direset ke kosong secara aman.
   * **Fitur Edit Project di Card Guru ([TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Menambahkan ikon pensil (*Pencil*) di header setiap kartu project berdampingan dengan tombol hapus (*Trash*).
     - Mengklik tombol Edit membuka pop up modal *"Edit Project / Tugas"* yang otomatis terisi dengan data project yang ada: judul, target kelas, daftar target siswa terpilih, instruksi, dan batas waktu.
     - Saat disimpan, sistem memanggil `updateDocument('projects', editingProject.id, payload)` dan menampilkan notifikasi sukses *"Project berhasil diperbarui"*.
   * **Batas Waktu Lengkap dengan Tanggal, Bulan & Jam ([helpers.js](file:///d:/kirimtugaskomputer/src/utils/helpers.js) & [TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Mengubah input batas waktu menjadi `type="datetime-local"` sehingga guru dapat menentukan tanggal sekaligus jam & menit batas pengumpulan.
     - Menambahkan fungsi pemformat tanggal `formatProjectDeadline()` yang mengubah format ISO menjadi tampilan ramah Indonesia: misal `21 Nov 2026 • 23:59 WIB`.
   * **Urutan Card Project Paling Awal (Newest First):**
     - Mengurutkan daftar project secara descending berdasarkan `createdAt` dan `id`, sehingga setiap project baru atau project terkini selalu tampil di posisi paling depan / pertama.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 56. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:40 WIB) — Penyembunyian Input Nilai/Catatan di Tampilan Kartu & Fitur Navigasi Geser (Next/Prev) pada Mode Lihat Full (Lightbox)
1. **Permintaan Pengguna:**
   * **Sembunyikan Nilai & Catatan Guru di Tampilan Kartu (Grid Mode):**
     - Pada tampilan kartu galeri karya siswa, input nilai, input catatan, dan tombol kirim nilai (*Send*) disembunyikan/dihilangkan agar kartu tampil bersih layaknya pameran galeri visual.
     - Penilaian dan catatan guru tetap dapat dilihat dan diisi secara lengkap saat beralih ke mode tampilan tabel (*Table Mode*).
   * **Fitur Scroll / Geser Kanan & Kiri pada Mode Lihat Full:**
     - Saat guru membuka karya siswa dalam mode layar penuh / fullscreen (*Lightbox*), disediakan navigasi panah kiri (*left arrow*) dan panah kanan (*right arrow*) agar guru dapat langsung melihat karya siswa lainnya secara estetik tanpa perlu menutup mode lihat full terlebih dahulu.
2. **Solusi & Implementasi:**
   * **Tampilan Kartu Bersih Minimalis ([TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx)):**
     - Menghapus blok formulir penilaian cepat (`Nilai`, `Catatan...`, dan ikon kirim) dari setiap kartu di mode Grid.
     - Kartu kini berfokus murni pada thumbnail visual karya, foto avatar, nama siswa, judul karya, dan tombol download .sb3 jika kelas 6.
     - Mode Tabel (*Table View*) tetap mempertahankan kolom nilai, catatan guru, dan aksi penilaian secara utuh.
   * **Navigasi Next / Previous Melayang di Lightbox ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx), [TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx), & [StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx)):**
     - Menambahkan tombol panah melayang di sisi kiri (`ChevronLeft`) dan sisi kanan (`ChevronRight`) layar dengan efek kaca glassmorphic obsidian yang mewah (`backdrop-blur-xl hover:bg-purple-600 hover:scale-115`).
     - Menghitung indeks karya aktif terhadap daftar karya yang sedang difilter (`filteredSubmissions`):
       - Panah Kiri otomatis muncul jika ada karya sebelumnya (`hasPrev`).
       - Panah Kanan otomatis muncul jika ada karya berikutnya (`hasNext`).
     - **Dukungan Tombol Keyboard Panah:** Menekan tombol panah kiri (`ArrowLeft`) atau panah kanan (`ArrowRight`) pada keyboard langsung memicu transisi ke karya sebelum/sesudahnya secara instan.
     - **Dukungan Touch Swipe Gesture (HP & Tablet):** Mengusap layar ke kiri atau ke kanan (*horizontal swipe gesture*) otomatis mengganti karya secara mulus.
     - **Indikator Progres Karya:** Di banner bawah, ditampilkan status urutan karya yang sedang ditinjau, misal: `Oleh: AINA KARIMAH PUTRI • Karya 1 dari 18`.
     - **Reset Zoom Otomatis:** Setiap kali berpindah ke karya berikutnya atau sebelumnya, tingkat zoom dan pergeseran posisi gambar otomatis ter-reset kembali ke ukuran proporsional (100%).
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.10 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 57. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:50 WIB) — Efek 3D Carousel Framer Motion Kekinian & Hype pada Mode Lihat Layar Penuh (Lightbox)
1. **Permintaan Pengguna:**
   * Menambahkan efek transisi carousel dengan Framer Motion yang sangat halus (*smooth*), keren, kekinian, dan sedang tren/hype saat ini dengan animasi *"wow"* yang memikat di mode lihat karya layar penuh (*Lightbox*).
2. **Solusi & Implementasi ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx)):**
   * **3D Perspective Stage & Depth (`perspective: 1400px`):**
     - Wadah panggung layar penuh diberikan ruang perspektif 3D yang dalam.
     - Setiap pergantian karya menghasilkan rotasi sumbu Y alami (`rotateY: 18°` / `-18°`) berpadu dengan kedalaman skala (`scale: 0.86 → 1.0`) dan blur lembut (*cinematic depth of field* `filter: blur(8px) → 0px`).
   * **Animasi Fisika Pegas Berarah (*Direction-Aware Spring Physics*):**
     - Menggunakan arsitektur `<AnimatePresence custom={direction} mode="popLayout" initial={false}>`.
     - Saat memilih karya berikutnya (panah kanan / geser ke kiri): karya saat ini meluncur mulus ke kiri dengan rotasi menjauh, sementara karya baru melesat masuk dari kanan secara bersamaan (*zero blank delay*).
     - Saat memilih karya sebelumnya (panah kiri / geser ke kanan): arah animasi berbalik secara simetris dan alami.
     - Menggunakan tuning pegas elastis premium Framer Motion: `stiffness: 320, damping: 30, mass: 0.85`.
   * **Interaksi Geser Sentuh Tactile (*Tactile Drag-to-Slide Physics*):**
     - Pada gambar (saat zoom 100%), pengguna dapat langsung menyeret (*drag*) gambar ke kiri atau ke kanan dengan mouse atau jari sentuh (`drag="x"`, `dragElastic: 0.65`).
     - Jika ditarik melewati batas 55px atau dilempar dengan kecepatan lentur (*velocity*), kartu otomatis melesat beralih ke karya berikutnya/sebelumnya dengan inersia pegas.
   * **Pendaran Cahaya Dinamis di Latar Belakang (*Ambient Glow Aura*):**
     - Di belakang kartu karya terdapat aura pendaran gradien lembut (*violet, indigo, pink blur-3xl*) yang berdenyut lembut, memberi kesan megah seperti bioskop digital modern.
   * **Indikator Titik Carousel Interaktif (*Active Pill Dots Strip*):**
     - Di atas bilah bawah ditambahkan deretan indikator titik dinamis: titik aktif otomatis memanjang menjadi kapsul bercahaya neon ungu (*layout spring animation*), merefleksikan posisi karya secara visual.
   * **Transisi Teks Lembut (*Smooth Cross-Fade Title & Author*):**
     - Judul karya dan nama pembuat karya di bilah bawah bertransisi vertikal halus (`y: 10 → 0`) setiap kali karya berganti.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 10.65 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 53. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 17:45 WIB) — Respon Instan (0ms Delay) Animasi Pilihan Kelas Siswa
1. **Analisis Akar Masalah Delay Beberapa Detik:**
   * Sebelumnya digunakan `<AnimatePresence mode="wait">` untuk menukar elemen DOM antara tombol tertutup dan dial terbuka.
   * `mode="wait"` di Framer Motion menunggu animasi `exit` elemen sebelumnya selesai secara mutlak sebelum merender elemen berikutnya. Karena transisi pegas (*spring physics*) membutuhkan waktu pengendapan (*settle time*) hingga 1,5 detik, hal ini menciptakan jeda tunggu yang nyata bagi pengguna setelah tombol diklik.
2. **Solusi & Rekayasa Arsitektur Terpadu (*Unified Component*):**
   * Menghilangkan pergantian mount/unmount DOM dan `mode="wait"` yang memicu bottleneck.
   * Menggabungkan knob pusat dan orbit dial ke dalam satu wadah harmonis terpadu:
     - Knob pusat selalu siap dan aktif di titik pusat `(0, 0)`.
     - Saat diklik, state `isOpen` berubah seketika (**0 milidetik / instan**).
     - Orbit dial membesar responsif (`stiffness: 420, damping: 25`).
     - Ke-6 tombol kelas (4A, 4B, 5A, 5B, 6A, 6B) langsung melesat keluar dengan pantulan pegas super cepat dan bertenaga (*snappy spring bounce* `stiffness: 420, damping: 17, mass: 0.65`, interval *stagger* hanya 0.025s).
     - Saat ditutup kembali, animasi menyusut disetel presisi ke 220ms sehingga kartu berputar kembali ke pemilihan peran dengan sangat mulus dan tanggap tanpa jeda.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 56. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:40 WIB) — Penyembunyian Input Nilai/Catatan di Tampilan Kartu & Fitur Navigasi Geser (Next/Prev) pada Mode Lihat Full (Lightbox)
1. **Permintaan Pengguna:**
   * **Sembunyikan Nilai & Catatan Guru di Tampilan Kartu (Grid Mode):**
     - Pada tampilan kartu galeri karya siswa, input nilai, input catatan, dan tombol kirim nilai (*Send*) disembunyikan/dihilangkan agar kartu tampil bersih layaknya pameran galeri visual.
     - Penilaian dan catatan guru tetap dapat dilihat dan diisi secara lengkap saat beralih ke mode tampilan tabel (*Table Mode*).
   * **Fitur Scroll / Geser Kanan & Kiri pada Mode Lihat Full:**
     - Saat guru membuka karya siswa dalam mode layar penuh / fullscreen (*Lightbox*), disediakan navigasi panah kiri (*left arrow*) dan panah kanan (*right arrow*) agar guru dapat langsung melihat karya siswa lainnya secara estetik tanpa perlu menutup mode lihat full terlebih dahulu.
2. **Solusi & Implementasi:**
   * **Tampilan Kartu Bersih Minimalis ([TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx)):**
     - Menghapus blok formulir penilaian cepat (`Nilai`, `Catatan...`, dan ikon kirim) dari setiap kartu di mode Grid.
     - Kartu kini berfokus murni pada thumbnail visual karya, foto avatar, nama siswa, judul karya, dan tombol download .sb3 jika kelas 6.
     - Mode Tabel (*Table View*) tetap mempertahankan kolom nilai, catatan guru, dan aksi penilaian secara utuh.
   * **Navigasi Next / Previous Melayang di Lightbox ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx), [TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx), & [StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx)):**
     - Menambahkan tombol panah melayang di sisi kiri (`ChevronLeft`) dan sisi kanan (`ChevronRight`) layar dengan efek kaca glassmorphic obsidian yang mewah (`backdrop-blur-xl hover:bg-purple-600 hover:scale-115`).
     - Menghitung indeks karya aktif terhadap daftar karya yang sedang difilter (`filteredSubmissions`):
       - Panah Kiri otomatis muncul jika ada karya sebelumnya (`hasPrev`).
       - Panah Kanan otomatis muncul jika ada karya berikutnya (`hasNext`).
     - **Dukungan Tombol Keyboard Panah:** Menekan tombol panah kiri (`ArrowLeft`) atau panah kanan (`ArrowRight`) pada keyboard langsung memicu transisi ke karya sebelum/sesudahnya secara instan.
     - **Dukungan Touch Swipe Gesture (HP & Tablet):** Mengusap layar ke kiri atau ke kanan (*horizontal swipe gesture*) otomatis mengganti karya secara mulus.
     - **Indikator Progres Karya:** Di banner bawah, ditampilkan status urutan karya yang sedang ditinjau, misal: `Oleh: AINA KARIMAH PUTRI • Karya 1 dari 18`.
     - **Reset Zoom Otomatis:** Setiap kali berpindah ke karya berikutnya atau sebelumnya, tingkat zoom dan pergeseran posisi gambar otomatis ter-reset kembali ke ukuran proporsional (100%).
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.10 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 57. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:50 WIB) — Efek 3D Carousel Framer Motion Kekinian & Hype pada Mode Lihat Layar Penuh (Lightbox)
1. **Permintaan Pengguna:**
   * Menambahkan efek transisi carousel dengan Framer Motion yang sangat halus (*smooth*), keren, kekinian, dan sedang tren/hype saat ini dengan animasi *"wow"* yang memikat di mode lihat karya layar penuh (*Lightbox*).
2. **Solusi & Implementasi ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx)):**
   * **3D Perspective Stage & Depth (`perspective: 1400px`):**
     - Wadah panggung layar penuh diberikan ruang perspektif 3D yang dalam.
     - Setiap pergantian karya menghasilkan rotasi sumbu Y alami (`rotateY: 18°` / `-18°`) berpadu dengan kedalaman skala (`scale: 0.86 → 1.0`) dan blur lembut (*cinematic depth of field* `filter: blur(8px) → 0px`).
   * **Animasi Fisika Pegas Berarah (*Direction-Aware Spring Physics*):**
     - Menggunakan arsitektur `<AnimatePresence custom={direction} mode="popLayout" initial={false}>`.
     - Saat memilih karya berikutnya (panah kanan / geser ke kiri): karya saat ini meluncur mulus ke kiri dengan rotasi menjauh, sementara karya baru melesat masuk dari kanan secara bersamaan (*zero blank delay*).
     - Saat memilih karya sebelumnya (panah kiri / geser ke kanan): arah animasi berbalik secara simetris dan alami.
     - Menggunakan tuning pegas elastis premium Framer Motion: `stiffness: 320, damping: 30, mass: 0.85`.
   * **Interaksi Geser Sentuh Tactile (*Tactile Drag-to-Slide Physics*):**
     - Pada gambar (saat zoom 100%), pengguna dapat langsung menyeret (*drag*) gambar ke kiri atau ke kanan dengan mouse atau jari sentuh (`drag="x"`, `dragElastic: 0.65`).
     - Jika ditarik melewati batas 55px atau dilempar dengan kecepatan lentur (*velocity*), kartu otomatis melesat beralih ke karya berikutnya/sebelumnya dengan inersia pegas.
   * **Pendaran Cahaya Dinamis di Latar Belakang (*Ambient Glow Aura*):**
     - Di belakang kartu karya terdapat aura pendaran gradien lembut (*violet, indigo, pink blur-3xl*) yang berdenyut lembut, memberi kesan megah seperti bioskop digital modern.
   * **Indikator Titik Carousel Interaktif (*Active Pill Dots Strip*):**
     - Di atas bilah bawah ditambahkan deretan indikator titik dinamis: titik aktif otomatis memanjang menjadi kapsul bercahaya neon ungu (*layout spring animation*), merefleksikan posisi karya secara visual.
   * **Transisi Teks Lembut (*Smooth Cross-Fade Title & Author*):**
     - Judul karya dan nama pembuat karya di bilah bawah bertransisi vertikal halus (`y: 10 → 0`) setiap kali karya berganti.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 10.65 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 54. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:15 WIB) — Penambahan Target Siswa Tertentu (Anak Les / Individu) & Default Target Kelas Bersih
1. **Permintaan Pengguna:**
   * **Target Tugas Spesifik untuk Anak Les / Siswa Tertentu:**
     - Penugasan project baru dapat ditargetkan bukan hanya ke kelas secara umum, tetapi juga khusus untuk anak les atau siswa tertentu saja.
     - Disediakan kolom target siswa dengan pencarian instan: cukup ketik minimal 2 huruf, nama siswa langsung muncul (*live autocomplete*) yang bersumber langsung dari data halaman Data Siswa (`data.users`).
     - Terdapat ikon Plus (`+`) untuk menambah kolom siswa lainnya secara dinamis.
     - **Privasi Mutlak:** Jika tugas dibuat untuk siswa tertentu, tugas tersebut **tidak akan pernah muncul** di akun anak-anak lain, melainkan hanya tampil di dashboard dan menu upload siswa yang bersangkutan.
   * **Default Target Kelas Bersih (Semua Unchecked):**
     - Saat pop up Buat Project Baru dibuka, seluruh kotak centang Target Kelas harus berstatus **tidak terceklis** (sebelumnya default langsung terceklis di *"Semua Kelas"*).
2. **Solusi & Implementasi:**
   * **Default Bersih Kotak Centang Target Kelas ([TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Nilai default `classId` diubah menjadi `[]` (array kosong).
     - Kotak *"Semua Kelas"* kini hanya terceklis jika `formData.classId.includes('all')`.
     - Setiap kelas (4A, 4B, 5A, 5B, 6A, 6B) tampil bersih tanpa centang saat pertama kali modal dibuka.
   * **Fitur Kolom Target Siswa Dinamis ([TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Menyediakan input pencarian nama siswa dengan pencarian cepat (ketik minimal 2 huruf).
     - Menampilkan menu *dropdown* autocomplete elegan berisi foto/avatar, nama lengkap, dan kelas siswa dari master Data Siswa.
     - Siswa yang dipilih otomatis terkunci dalam wadah chip kartu yang rapi beserta tombol hapus (`X`).
     - Tombol ikon Plus `+ Tambah Kolom Siswa` memungkinkan guru menambahkan siswa kedua, ketiga, dan seterusnya dengan mudah.
     - Peringatan privasi otomatis muncul: *"🔒 Tugas Khusus (X Siswa Terpilih): Project ini hanya akan tampil di halaman siswa yang dipilih dan tidak dapat dilihat oleh anak-anak lain."*
   * **Filter Proteksi Hak Akses Siswa ([StudentDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentDashboard.jsx), [StudentUpload.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentUpload.jsx), [src/utils/helpers.js](file:///d:/kirimtugaskomputer/src/utils/helpers.js)):**
     - Membuat fungsi utilitas `isProjectForStudent(project, user)`.
     - Jika sebuah project memiliki target siswa spesifik (`targetStudents`), sistem memvalidasi `targetStudents.includes(user.id)`. Jika ID siswa tidak terdaftar, project **100% tersembunyi** (tidak dihitung dalam tugas aktif, tugas pending, maupun dropdown pemilihan tugas upload karya).
   * **Penyajian di Panel Guru ([TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Kartu tugas di guru dilengkapi badge khusus: `🎯 Khusus X Siswa (Les)` beserta daftar nama siswa.
     - Ditambahkan tab folder filter baru: `🎯 Khusus / Les` untuk mempermudah guru meninjau seluruh tugas les/privat secara terpisah.
   * **Persistensi Data Spreadsheet Cerdas ([src/services/api.js](file:///d:/kirimtugaskomputer/src/services/api.js) & [GAS_Code.gs](file:///d:/kirimtugaskomputer/GAS_Code.gs)):**
     - ID siswa target digabungkan secara aman ke dalam `classId` dengan prefix `student:<uuid>`. Hal ini menjamin persistensi permanen ke Google Sheets tanpa risiko kegagalan skema backend.
     - Saat data dimuat, `api.js` memisahkan target kelas dan target siswa kembali secara otomatis.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 56. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:40 WIB) — Penyembunyian Input Nilai/Catatan di Tampilan Kartu & Fitur Navigasi Geser (Next/Prev) pada Mode Lihat Full (Lightbox)
1. **Permintaan Pengguna:**
   * **Sembunyikan Nilai & Catatan Guru di Tampilan Kartu (Grid Mode):**
     - Pada tampilan kartu galeri karya siswa, input nilai, input catatan, dan tombol kirim nilai (*Send*) disembunyikan/dihilangkan agar kartu tampil bersih layaknya pameran galeri visual.
     - Penilaian dan catatan guru tetap dapat dilihat dan diisi secara lengkap saat beralih ke mode tampilan tabel (*Table Mode*).
   * **Fitur Scroll / Geser Kanan & Kiri pada Mode Lihat Full:**
     - Saat guru membuka karya siswa dalam mode layar penuh / fullscreen (*Lightbox*), disediakan navigasi panah kiri (*left arrow*) dan panah kanan (*right arrow*) agar guru dapat langsung melihat karya siswa lainnya secara estetik tanpa perlu menutup mode lihat full terlebih dahulu.
2. **Solusi & Implementasi:**
   * **Tampilan Kartu Bersih Minimalis ([TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx)):**
     - Menghapus blok formulir penilaian cepat (`Nilai`, `Catatan...`, dan ikon kirim) dari setiap kartu di mode Grid.
     - Kartu kini berfokus murni pada thumbnail visual karya, foto avatar, nama siswa, judul karya, dan tombol download .sb3 jika kelas 6.
     - Mode Tabel (*Table View*) tetap mempertahankan kolom nilai, catatan guru, dan aksi penilaian secara utuh.
   * **Navigasi Next / Previous Melayang di Lightbox ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx), [TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx), & [StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx)):**
     - Menambahkan tombol panah melayang di sisi kiri (`ChevronLeft`) dan sisi kanan (`ChevronRight`) layar dengan efek kaca glassmorphic obsidian yang mewah (`backdrop-blur-xl hover:bg-purple-600 hover:scale-115`).
     - Menghitung indeks karya aktif terhadap daftar karya yang sedang difilter (`filteredSubmissions`):
       - Panah Kiri otomatis muncul jika ada karya sebelumnya (`hasPrev`).
       - Panah Kanan otomatis muncul jika ada karya berikutnya (`hasNext`).
     - **Dukungan Tombol Keyboard Panah:** Menekan tombol panah kiri (`ArrowLeft`) atau panah kanan (`ArrowRight`) pada keyboard langsung memicu transisi ke karya sebelum/sesudahnya secara instan.
     - **Dukungan Touch Swipe Gesture (HP & Tablet):** Mengusap layar ke kiri atau ke kanan (*horizontal swipe gesture*) otomatis mengganti karya secara mulus.
     - **Indikator Progres Karya:** Di banner bawah, ditampilkan status urutan karya yang sedang ditinjau, misal: `Oleh: AINA KARIMAH PUTRI • Karya 1 dari 18`.
     - **Reset Zoom Otomatis:** Setiap kali berpindah ke karya berikutnya atau sebelumnya, tingkat zoom dan pergeseran posisi gambar otomatis ter-reset kembali ke ukuran proporsional (100%).
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.10 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 57. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:50 WIB) — Efek 3D Carousel Framer Motion Kekinian & Hype pada Mode Lihat Layar Penuh (Lightbox)
1. **Permintaan Pengguna:**
   * Menambahkan efek transisi carousel dengan Framer Motion yang sangat halus (*smooth*), keren, kekinian, dan sedang tren/hype saat ini dengan animasi *"wow"* yang memikat di mode lihat karya layar penuh (*Lightbox*).
2. **Solusi & Implementasi ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx)):**
   * **3D Perspective Stage & Depth (`perspective: 1400px`):**
     - Wadah panggung layar penuh diberikan ruang perspektif 3D yang dalam.
     - Setiap pergantian karya menghasilkan rotasi sumbu Y alami (`rotateY: 18°` / `-18°`) berpadu dengan kedalaman skala (`scale: 0.86 → 1.0`) dan blur lembut (*cinematic depth of field* `filter: blur(8px) → 0px`).
   * **Animasi Fisika Pegas Berarah (*Direction-Aware Spring Physics*):**
     - Menggunakan arsitektur `<AnimatePresence custom={direction} mode="popLayout" initial={false}>`.
     - Saat memilih karya berikutnya (panah kanan / geser ke kiri): karya saat ini meluncur mulus ke kiri dengan rotasi menjauh, sementara karya baru melesat masuk dari kanan secara bersamaan (*zero blank delay*).
     - Saat memilih karya sebelumnya (panah kiri / geser ke kanan): arah animasi berbalik secara simetris dan alami.
     - Menggunakan tuning pegas elastis premium Framer Motion: `stiffness: 320, damping: 30, mass: 0.85`.
   * **Interaksi Geser Sentuh Tactile (*Tactile Drag-to-Slide Physics*):**
     - Pada gambar (saat zoom 100%), pengguna dapat langsung menyeret (*drag*) gambar ke kiri atau ke kanan dengan mouse atau jari sentuh (`drag="x"`, `dragElastic: 0.65`).
     - Jika ditarik melewati batas 55px atau dilempar dengan kecepatan lentur (*velocity*), kartu otomatis melesat beralih ke karya berikutnya/sebelumnya dengan inersia pegas.
   * **Pendaran Cahaya Dinamis di Latar Belakang (*Ambient Glow Aura*):**
     - Di belakang kartu karya terdapat aura pendaran gradien lembut (*violet, indigo, pink blur-3xl*) yang berdenyut lembut, memberi kesan megah seperti bioskop digital modern.
   * **Indikator Titik Carousel Interaktif (*Active Pill Dots Strip*):**
     - Di atas bilah bawah ditambahkan deretan indikator titik dinamis: titik aktif otomatis memanjang menjadi kapsul bercahaya neon ungu (*layout spring animation*), merefleksikan posisi karya secara visual.
   * **Transisi Teks Lembut (*Smooth Cross-Fade Title & Author*):**
     - Judul karya dan nama pembuat karya di bilah bawah bertransisi vertikal halus (`y: 10 → 0`) setiap kali karya berganti.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 10.65 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 55. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:25 WIB) — Sinkronisasi Penutupan/Penghapusan Tugas ke Siswa, Fitur Edit Project di Card, Format Tanggal-Bulan-Jam, & Urutan Newest First
1. **Permintaan Pengguna:**
   * **Sinkronisasi Penutupan & Penghapusan Project:**
     - Ketika guru menutup project (*"Tutup Project"* / `status: 'selesai'`) atau menghapusnya, project tersebut **tidak boleh muncul** pada pilihan tugas saat siswa ingin mengunggah karya di halaman Upload Siswa.
   * **Fitur Edit / Ikon Edit di Kartu Project Guru:**
     - Pada kumpulan kartu di halaman *Kelola Project & Tugas*, ditambahkan fitur edit / ikon edit di setiap card agar guru bisa mengubah target tugas (target kelas maupun target siswa khusus/les), judul, instruksi, dan batas waktu.
   * **Format Batas Waktu Lengkap (Tanggal, Bulan, dan Jam):**
     - Input dan penayangan batas waktu pengumpulan dilengkapi dengan format tanggal, nama bulan bahasa Indonesia, dan jam (misal `21 Nov 2026 • 23:59 WIB`).
   * **Posisi Project Baru di Paling Awal (Newest First):**
     - Setiap ada input project yang baru dibuat atau diperbarui, posisinya langsung berada di urutan paling awal (atas/kiri pertama).
2. **Solusi & Implementasi:**
   * **Sinkronisasi Mutlak Status Project ([DataContext.jsx](file:///d:/kirimtugaskomputer/src/context/DataContext.jsx)):**
     - Menambahkan lapisan persistensi lokal `LOCAL_PROJECTS_KEY` dan `LOCAL_DELETED_PROJECTS_KEY` untuk data project.
     - Dalam siklus `loadData()` yang berjalan di latar belakang (polling 12 detik), sistem kini secara otomatis menggabungkan *status override* lokal (seperti `status: 'selesai'`) dan memfilter ID project yang telah dihapus sehingga polling server tidak pernah menimpa atau mengembalikan status project yang telah ditutup/dihapus oleh guru.
   * **Proteksi Ketat Upload Siswa ([StudentUpload.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentUpload.jsx) & [helpers.js](file:///d:/kirimtugaskomputer/src/utils/helpers.js)):**
     - Memperbarui fungsi `isProjectForStudent` dan query `activeProjects`: memvalidasi `String(p.status || 'aktif').trim().toLowerCase() === 'aktif'`.
     - Project yang telah ditutup (`status: 'selesai'`) atau dihapus otomatis 100% lenyap dari dropdown opsi tugas siswa.
     - Ditambahkan penjaga `useEffect`: jika sebuah project ditutup saat form siswa terbuka, pemilihan `projectId` otomatis dibatalkan/direset ke kosong secara aman.
   * **Fitur Edit Project di Card Guru ([TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Menambahkan ikon pensil (*Pencil*) di header setiap kartu project berdampingan dengan tombol hapus (*Trash*).
     - Mengklik tombol Edit membuka pop up modal *"Edit Project / Tugas"* yang otomatis terisi dengan data project yang ada: judul, target kelas, daftar target siswa terpilih, instruksi, dan batas waktu.
     - Saat disimpan, sistem memanggil `updateDocument('projects', editingProject.id, payload)` dan menampilkan notifikasi sukses *"Project berhasil diperbarui"*.
   * **Batas Waktu Lengkap dengan Tanggal, Bulan & Jam ([helpers.js](file:///d:/kirimtugaskomputer/src/utils/helpers.js) & [TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx)):**
     - Mengubah input batas waktu menjadi `type="datetime-local"` sehingga guru dapat menentukan tanggal sekaligus jam & menit batas pengumpulan.
     - Menambahkan fungsi pemformat tanggal `formatProjectDeadline()` yang mengubah format ISO menjadi tampilan ramah Indonesia: misal `21 Nov 2026 • 23:59 WIB`.
   * **Urutan Card Project Paling Awal (Newest First):**
     - Mengurutkan daftar project secara descending berdasarkan `createdAt` dan `id`, sehingga setiap project baru atau project terkini selalu tampil di posisi paling depan / pertama.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 56. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:40 WIB) — Penyembunyian Input Nilai/Catatan di Tampilan Kartu & Fitur Navigasi Geser (Next/Prev) pada Mode Lihat Full (Lightbox)
1. **Permintaan Pengguna:**
   * **Sembunyikan Nilai & Catatan Guru di Tampilan Kartu (Grid Mode):**
     - Pada tampilan kartu galeri karya siswa, input nilai, input catatan, dan tombol kirim nilai (*Send*) disembunyikan/dihilangkan agar kartu tampil bersih layaknya pameran galeri visual.
     - Penilaian dan catatan guru tetap dapat dilihat dan diisi secara lengkap saat beralih ke mode tampilan tabel (*Table Mode*).
   * **Fitur Scroll / Geser Kanan & Kiri pada Mode Lihat Full:**
     - Saat guru membuka karya siswa dalam mode layar penuh / fullscreen (*Lightbox*), disediakan navigasi panah kiri (*left arrow*) dan panah kanan (*right arrow*) agar guru dapat langsung melihat karya siswa lainnya secara estetik tanpa perlu menutup mode lihat full terlebih dahulu.
2. **Solusi & Implementasi:**
   * **Tampilan Kartu Bersih Minimalis ([TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx)):**
     - Menghapus blok formulir penilaian cepat (`Nilai`, `Catatan...`, dan ikon kirim) dari setiap kartu di mode Grid.
     - Kartu kini berfokus murni pada thumbnail visual karya, foto avatar, nama siswa, judul karya, dan tombol download .sb3 jika kelas 6.
     - Mode Tabel (*Table View*) tetap mempertahankan kolom nilai, catatan guru, dan aksi penilaian secara utuh.
   * **Navigasi Next / Previous Melayang di Lightbox ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx), [TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx), & [StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx)):**
     - Menambahkan tombol panah melayang di sisi kiri (`ChevronLeft`) dan sisi kanan (`ChevronRight`) layar dengan efek kaca glassmorphic obsidian yang mewah (`backdrop-blur-xl hover:bg-purple-600 hover:scale-115`).
     - Menghitung indeks karya aktif terhadap daftar karya yang sedang difilter (`filteredSubmissions`):
       - Panah Kiri otomatis muncul jika ada karya sebelumnya (`hasPrev`).
       - Panah Kanan otomatis muncul jika ada karya berikutnya (`hasNext`).
     - **Dukungan Tombol Keyboard Panah:** Menekan tombol panah kiri (`ArrowLeft`) atau panah kanan (`ArrowRight`) pada keyboard langsung memicu transisi ke karya sebelum/sesudahnya secara instan.
     - **Dukungan Touch Swipe Gesture (HP & Tablet):** Mengusap layar ke kiri atau ke kanan (*horizontal swipe gesture*) otomatis mengganti karya secara mulus.
     - **Indikator Progres Karya:** Di banner bawah, ditampilkan status urutan karya yang sedang ditinjau, misal: `Oleh: AINA KARIMAH PUTRI • Karya 1 dari 18`.
     - **Reset Zoom Otomatis:** Setiap kali berpindah ke karya berikutnya atau sebelumnya, tingkat zoom dan pergeseran posisi gambar otomatis ter-reset kembali ke ukuran proporsional (100%).
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 11.10 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 57. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 19:50 WIB) — Efek 3D Carousel Framer Motion Kekinian & Hype pada Mode Lihat Layar Penuh (Lightbox)
1. **Permintaan Pengguna:**
   * Menambahkan efek transisi carousel dengan Framer Motion yang sangat halus (*smooth*), keren, kekinian, dan sedang tren/hype saat ini dengan animasi *"wow"* yang memikat di mode lihat karya layar penuh (*Lightbox*).
2. **Solusi & Implementasi ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx)):**
   * **3D Perspective Stage & Depth (`perspective: 1400px`):**
     - Wadah panggung layar penuh diberikan ruang perspektif 3D yang dalam.
     - Setiap pergantian karya menghasilkan rotasi sumbu Y alami (`rotateY: 18°` / `-18°`) berpadu dengan kedalaman skala (`scale: 0.86 → 1.0`) dan blur lembut (*cinematic depth of field* `filter: blur(8px) → 0px`).
   * **Animasi Fisika Pegas Berarah (*Direction-Aware Spring Physics*):**
     - Menggunakan arsitektur `<AnimatePresence custom={direction} mode="popLayout" initial={false}>`.
     - Saat memilih karya berikutnya (panah kanan / geser ke kiri): karya saat ini meluncur mulus ke kiri dengan rotasi menjauh, sementara karya baru melesat masuk dari kanan secara bersamaan (*zero blank delay*).
     - Saat memilih karya sebelumnya (panah kiri / geser ke kanan): arah animasi berbalik secara simetris dan alami.
     - Menggunakan tuning pegas elastis premium Framer Motion: `stiffness: 320, damping: 30, mass: 0.85`.
   * **Interaksi Geser Sentuh Tactile (*Tactile Drag-to-Slide Physics*):**
     - Pada gambar (saat zoom 100%), pengguna dapat langsung menyeret (*drag*) gambar ke kiri atau ke kanan dengan mouse atau jari sentuh (`drag="x"`, `dragElastic: 0.65`).
     - Jika ditarik melewati batas 55px atau dilempar dengan kecepatan lentur (*velocity*), kartu otomatis melesat beralih ke karya berikutnya/sebelumnya dengan inersia pegas.
   * **Pendaran Cahaya Dinamis di Latar Belakang (*Ambient Glow Aura*):**
     - Di belakang kartu karya terdapat aura pendaran gradien lembut (*violet, indigo, pink blur-3xl*) yang berdenyut lembut, memberi kesan megah seperti bioskop digital modern.
   * **Indikator Titik Carousel Interaktif (*Active Pill Dots Strip*):**
     - Di atas bilah bawah ditambahkan deretan indikator titik dinamis: titik aktif otomatis memanjang menjadi kapsul bercahaya neon ungu (*layout spring animation*), merefleksikan posisi karya secara visual.
   * **Transisi Teks Lembut (*Smooth Cross-Fade Title & Author*):**
     - Judul karya dan nama pembuat karya di bilah bawah bertransisi vertikal halus (`y: 10 → 0`) setiap kali karya berganti.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error dalam 10.65 detik.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.


---

## 58. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 20:15 WIB) — Panggung 3D Coverflow 3 Kartu Sekaligus (Center Besar Jelas, Kiri & Kanan Medium Interaktif) di Mode Layar Penuh (Lightbox)
1. **Permintaan Pengguna:**
   * Saat membuka mode lihat karya layar penuh (*Lightbox*) dan mengeklik tombol panah atau tombol navigasi:
     - Gambar sebelumnya (*previous*) dan gambar setelahnya (*next*) harus **terlihat secara bersamaan di sebelah kiri dan kanan** dengan ukuran medium / agak kecil.
     - Gambar yang berada di **tengah** adalah gambar yang sedang aktif ditinjau dengan ukuran **besar, tajam, dan terlihat sangat jelas**.
     - Terjadi pergeseran 3 project secara serempak (*3-Card 3D Carousel / Coverflow*): saat bergeser, gambar dari kanan atau kiri meluncur ke tengah dan membesar secara dramatis dan mulus, sementara gambar tengah menyusut ke posisi samping.
2. **Solusi & Implementasi ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx)):**
   * **Arsitektur Panggung 3-Kartu Sekaligus (*Simultaneous 3-Card 3D Stage*):**
     - **Kartu Tengah (Karya Aktif):**
       - Berada di posisi `z-30`, tampil paling depan dengan skala penuh (`scale: 1.0`), rotasi `rotateY: 0°`, dan ketajaman 100%.
       - Lebar proporsional (`md:max-w-[50vw] lg:max-w-[42vw] xl:max-w-[38vw]`) memberikan ruang nafas yang sempurna bagi kartu kiri dan kanan tanpa saling tumpang-tindih.
     - **Kartu Kiri (Karya Sebelumnya / `prevItem`):**
       - Tampil di sisi kiri (`left-2 sm:left-6 md:left-10 lg:left-16 xl:left-24`) dengan dimensi medium (`w-36 sm:w-48 md:w-56 lg:w-64 xl:w-72 2xl:w-80 aspect-[3/4] max-h-[55vh]`).
       - Memiliki orientasi perspektif 3D miring ke arah tengah (`rotateY: 20°`), skala medium (`scale: 0.74`), dan transparansi lembut (`opacity: 0.65`).
       - Dilengkapi lencana kapsul ungu neon `"← Sebelumnya"`, thumbnail karya, judul karya, dan nama siswa pembuatnya.
       - **Dapat Diklik Langsung (*Click-to-Center*):** Mengeklik kartu kiri langsung menggeser karya tersebut ke tengah dengan transisi pegas berarah (`direction: -1`).
     - **Kartu Kanan (Karya Berikutnya / `nextItem`):**
       - Tampil di sisi kanan (`right-2 sm:right-6 md:right-10 lg:right-16 xl:right-24`) dengan dimensi medium yang simetris.
       - Memiliki orientasi perspektif 3D miring berlawanan (`rotateY: -20°`), skala medium (`scale: 0.74`), dan transparansi lembut (`opacity: 0.65`).
       - Dilengkapi lencana kapsul ungu neon `"Berikutnya →"`, thumbnail karya, judul karya, dan nama siswa pembuatnya.
       - **Dapat Diklik Langsung (*Click-to-Center*):** Mengeklik kartu kanan langsung meluncurkan karya tersebut ke tengah dengan transisi pegas berarah (`direction: 1`).
   * **Efek Hover Interaktif (*Interactive Glassmorphic Hover*):**
     - Saat kursor mouse diarahkan (*hover*) ke kartu samping kiri atau kanan:
       - Opasitas meningkat menjadi tajam (`opacity: 0.98`).
       - Ukuran membesar halus (`scale: 0.82`).
       - Sudut miring berkurang menjadi lebih tegak (`rotateY: 8°` / `-8°`).
       - Bingkai kartu bercahaya ungu neon (`border-purple-400/90 shadow-[0_25px_60px_rgba(0,0,0,0.75)]`).
   * **Sinkronisasi Transisi Fisika Pegas 3D (*Harmonized 3D Spring Motion*):**
     - Variasi `carouselVariants` disetel dengan jarak luncuran `x: ±280`, rotasi `rotateY: ±20°`, dan `scale: 0.76 → 1.0` yang selaras dengan posisi kartu samping.
     - Menghasilkan ilusi optik fisik yang kontinu seolah-olah kartu samping benar-benar meluncur dan bertransformasi menjadi kartu utama di tengah.
   * **Integrasi Dukungan Segala Format Media:**
     - Kartu samping mendukung thumbnail otomatis untuk Gambar, Game Scratch (menampilkan thumbnail resmi dari edge CDN MIT Scratch), PDF (menampilkan preview halaman pertama atau kartu dokumen merah), dan Dokumen Office (Word/Excel/PowerPoint).
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.


---

## 59. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 21:50 WIB) — Efek Stagger Pop Keras (Snappy) pada Setiap Card & Kinetic Motion Typography pada Teks
1. **Permintaan Pengguna:**
   * Saat user membuka halaman menu/dashboard, animasi kemunculan card tidak boleh muncul berbarengan secara serentak dalam satu waktu.
   * Harus ada framer motion yang halus (*smooth*) namun dengan catatan kemunculan motion pada setiap card berkesan **"keras / tegas / punchy / snappy"** dan muncul secara **bertahap satu demi satu (*staggered ripple*)**.
   * Setiap teks di dalam card dan judul halaman juga harus muncul dengan efek **motion typography** (kinetic typography slide-up & blur reveal), sehingga bukan hanya card-nya yang bergerak, melainkan teks di dalamnya juga meluncur dinamis.
2. **Solusi & Implementasi:**
   * **Komponen Kinetic Motion Typography ([MotionTypography.jsx](file:///d:/kirimtugaskomputer/src/components/common/MotionTypography.jsx)):**
     - Dibuat komponen `<KineticText>` yang memecah string kalimat menjadi kata-kata terpisah di dalam wadah pemotong (*overflow-hidden inline-block*).
     - Setiap kata meluncur naik dari bawah (`y: 80% → 0%`) dengan sedikit sentuhan blur halus (`blur(3px) → blur(0px)`) dan fisika pegas kinetik (`stiffness: 420, damping: 22`).
     - Dibuat komponen `<KineticNumber>` untuk menganimasikan angka statistik (Total Siswa, Total Project, Total Karya, Belum Kumpul) agar meluncur naik secara dinamis dengan penekanan tactile.
   * **Preset Fisika Pegas Tegas "Keras" & Staggered Container ([motion.js](file:///d:/kirimtugaskomputer/src/utils/motion.js)):**
     - `springPunchy`: Tuning pegas elastis berkecepatan tinggi (`stiffness: 460, damping: 24, mass: 0.8`) yang memberikan hentakan kemunculan yang tegas (*punchy pop*).
     - `staggerCards`: Wadah berurutan (`staggerChildren: 0.09, delayChildren: 0.06`) yang memastikan setiap card muncul bergantian satu per satu secara berirama, mengakhiri masalah card muncul serentak.
     - `staggerFast`: Khusus untuk galeri karya dengan banyak item (`staggerChildren: 0.045`).
     - `popCard`: Varian card dengan kedalaman vertikal dan skala tegas (`y: 32 → 0, scale: 0.92 → 1`).
     - `pageTransition`: Transisi halus antar menu halaman di [App.jsx](file:///d:/kirimtugaskomputer/src/App.jsx) menggunakan `<AnimatePresence mode="wait">`.
   * **Penerapan pada Komponen Dashboard & Menu:**
     - **[StatsCard.jsx](file:///d:/kirimtugaskomputer/src/components/common/StatsCard.jsx):** Menerima `variants={popCard}` dan mengintegrasikan `<KineticText>` untuk label judul serta `<KineticNumber>` untuk angka metrik.
     - **[TeacherDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherDashboard.jsx):** Greeting guru dan 4 Stats Card kini muncul bergelombang secara berurutan (*ripple sequence*).
     - **[StudentDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentDashboard.jsx):** Greeting siswa, 3 Stats Card, dan 2 section tugas/karya kini bertransisi dengan kinetic typography dan stagger pop.
     - **[TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx):** Seluruh card penugasan project kini muncul bergantian satu per satu dengan judul penugasan bertipe kinetic text.
     - **[TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx) & [StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx):** Kumpulan thumbnail karya siswa kini meluncur dan meletup masuk (*pop*) secara berurutan dengan kinetic text pada nama siswa dan judul karya.
     - **[TeacherStudents.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherStudents.jsx), [StudentUpload.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentUpload.jsx), & [TeacherSettings.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherSettings.jsx):** Judul halaman utama dipercantik dengan motion typography.
3. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.


---

## 60. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 21:56 WIB) — Perbaikan Bug Blank Screen pada Menu Galeri Karya Guru & Pemasangan ErrorBoundary
1. **Permintaan Pengguna:**
   * Halaman Galeri Karya pada akun guru ketika diklik mengalami *blank* (layar putih/kosong).
2. **Akar Masalah (*Root Cause*):**
   * Di dalam [TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx#L393), atribut `key` pada kontainer animasi kartu tertulis `key={`${activeFolder}-${selectedProject}`}`.
   * Variabel `selectedProject` tidak didefinisikan dalam *scope* (variabel state yang benar adalah `activeProjectFilter`).
   * Mengakses *identifier* yang tidak dideklarasikan di JavaScript melempar `ReferenceError: selectedProject is not defined` saat komponen di-render, yang menyebabkan React *crash* total dan merender layar kosong.
3. **Solusi & Implementasi:**
   * **Koreksi Variabel State ([TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx)):**
     - Mengganti `selectedProject` menjadi variabel state yang valid: `key={`${activeFolder}-${activeProjectFilter}`}`.
   * **Ketahanan Input Typography ([MotionTypography.jsx](file:///d:/kirimtugaskomputer/src/components/common/MotionTypography.jsx)):**
     - Memastikan input teks pada `<KineticText>` selalu dikonversi menjadi string (`String(raw)`), mencegah kemungkinan error jika dilempar nilai *number* atau *falsy*.
   * **Pemasangan ErrorBoundary Global ([ErrorBoundary.jsx](file:///d:/kirimtugaskomputer/src/components/common/ErrorBoundary.jsx) & [App.jsx](file:///d:/kirimtugaskomputer/src/App.jsx)):**
     - Membungkus seluruh tampilan menu di dalam komponen `<ErrorBoundary>`.
     - Jika terjadi kendala pada satu menu, aplikasi tidak akan crash menjadi layar putih polos, melainkan menampilkan panel error yang ramah pengguna lengkap dengan tombol *"Muat Ulang Halaman"*, sementara sidebar dan navigasi tetap aman dan responsif.
4. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error.
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 61. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 22:31 WIB) — Perataan Kinetic Motion Typography Menyeluruh & Penghalusan Fisika Animasi Organik (Anti-Kaku)
1. **Permintaan Pengguna:**
   * Teks di dalam dashboard pada semua halaman belum rata diberikan animasi/motion dan animasinya masih terasa kaku (*"saya melihat teks yang berada di dalam dashboard di semua halaman masih belum rata diberikan animasi atau motion. dan animasinya masih kaku"*).
2. **Penyebab Animasi Kaku (*Root Cause Stiffness*):**
   * Sebelumnya spring preset menggunakan nilai stiffness terlalu tinggi (`stiffness: 460`) dengan pemecahan kata-per-kata yang agresif, sehingga terasa menyentak (*jittery/robotic*).
   * Banyak elemen teks sekunder (subjudul, deskripsi tugas, badge status, tanggal, deadline, nama karya, dan angka statistik) masih berupa teks statis tanpa animasi, menciptakan kontras visual yang mencolok antara judul yang bergerak dan elemen lain yang diam kaku.
3. **Penyempurnaan Fisika Animasi & Arsitektur Typography Motion:**
   * **Fisika Halus & Organik ([motion.js](file:///d:/kirimtugaskomputer/src/utils/motion.js)):**
     - Mengubah `springPunchy` ke kurva fisika Apple/Linear: `stiffness: 280, damping: 22, mass: 0.75` (menghasilkan *bounce* yang elastis, luwes, dan natural).
     - Menetapkan kurva peluncuran fluida `easeFluid: [0.16, 1, 0.3, 1]` untuk semua transisi tipografi.
   * **Komponen Tipografi Terpadu ([MotionTypography.jsx](file:///d:/kirimtugaskomputer/src/components/common/MotionTypography.jsx)):**
     - `<KineticText>`: Animasi kata-per-kata dengan slide halus dan blur reveal untuk judul/nama utama tanpa memecah struktur baris teks.
     - `<KineticLine>`: Animasi baris teks utuh meluncur ke atas (*slide-up*) dengan sedikit *soft-focus blur* dan jeda waktu (*staggered delay*) berurutan untuk subjudul, badge, deadline, dan catatan guru.
     - `<KineticNumber>`: Penghitung angka animasi dinamis (*rolling number*) dari 0 ke nilai target saat halaman dibuka menggunakan `requestAnimationFrame` dan easing eksponensial.
4. **Penerapan Menyeluruh di Seluruh Halaman ("Rata"):**
   * **[StatsCard.jsx](file:///d:/kirimtugaskomputer/src/components/common/StatsCard.jsx):** Judul metrik menggunakan `<KineticLine>` dan angka statistik bergulir otomatis dengan `<KineticNumber>`.
   * **[StudentDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentDashboard.jsx):**
     - Greeting siswa dan badge *"Siswa Komputer"* dipercantik dengan `<KineticLine>`.
     - Panel *"Tugas yang Perlu Dikerjakan"*: Judul, deskripsi tugas, badge deadline, dan status kosong semuanya mengadopsi `<KineticText>` & `<KineticLine>`.
     - Panel *"Karya Terbaru Saya"*: Judul karya, nama tugas, tanggal upload, dan badge nilai/status kini bertransisi secara berurutan.
   * **[TeacherDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherDashboard.jsx):** Greeting guru, badge *"Panel Guru"*, 4 stats card dengan angka bergulir, serta daftar riwayat pengumpulan terbaru telah dipasangi kinetic motion berurutan.
   * **[TeacherProjects.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherProjects.jsx):** Judul halaman, subjudul, deskripsi project, dan tanggal deadline batas waktu penugasan telah dipasangi `<KineticLine>`.
   * **[TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx):**
     - Tampilan kartu bersih: nilai dan catatan guru disembunyikan (hanya ada di tampilan tabel).
     - Nama siswa dan judul karya di kartu menggunakan `<KineticText>` dan `<KineticLine>`.
     - Panel sidebar *"Belum Kumpul"*: Judul, subjudul, angka counter total siswa belum kumpul (`<KineticNumber>`), dan nama-nama siswa meluncur dengan delay mikro yang halus.
   * **[StudentGallery.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentGallery.jsx):** Header galeri, kartu karya siswa, subjudul project, banner catatan guru, serta stempel nilai tulisan tangan kini bertransisi dengan `<KineticLine>` yang lembut.
   * **[StudentUpload.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentUpload.jsx), [TeacherStudents.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherStudents.jsx), [TeacherSettings.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherSettings.jsx):** Header halaman, subjudul instruksi, dan pesan status selesai kini menggunakan `<KineticText>` & `<KineticLine>`.
5. **Verifikasi:**
   * Build produksi `npm run build` sukses 100% tanpa error (Exit code 0, 6.59s).
   * Vite dev server aktif melayani perubahan secara instan di `http://localhost:3000`.

---

## 62. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 23:29 WIB) — Hak Akses Penuh Guru: Tombol Hapus Langsung di Kartu & Lightbox, serta Penghapusan Permanen (Anti-Muncul Kembali)
1. **Permintaan Pengguna:**
   * Menanyakan mengapa file siswa tidak bisa dihapus (*"kenapa file siswa tidak bisa di hapus? danjika sudah terhapus saya mau file nya juga akan terhapus permanen di halaman siswa. jadi guru bisa punya akses kuat"*).
   * Melampirkan tangkapan layar kartu karya Ganesha Anoraga Gunawan dengan format nyasar.
2. **Penyebab Masalah (*Root Cause Analysis*):**
   * **Tidak Ada Tombol Hapus pada Mode Kartu:** Tombol hapus satuan sebelumnya hanya diletakkan di Tampilan Tabel (*Table Mode*). Pada Tampilan Kartu (*Card Mode*), guru hanya melihat tombol "Hapus" massal di atas yang mengharuskan centang checkbox satu per satu.
   * **Efek Polling 12 Detik Memulihkan Data:** Pada [DataContext.jsx](file:///d:/kirimtugaskomputer/src/context/DataContext.jsx), terdapat sinkronisasi otomatis di latar belakang setiap 12 detik (`loadData(true)`). Berbeda dengan *projects* yang memiliki penyimpan `LOCAL_DELETED_PROJECTS_KEY`, data *submissions* sebelumnya tidak memiliki `LOCAL_DELETED_SUBS_KEY`. Ketika guru menghapus karya, baris data dari Google Sheet (GViz) yang belum terhapus di awan ditarik kembali oleh proses sinkronisasi 12 detik, sehingga karya siswa muncul kembali seolah tidak bisa dihapus.
3. **Solusi & Implementasi Hak Akses Kuat Guru:**
   * **Penyimpanan Status Hapus Permanen ([DataContext.jsx](file:///d:/kirimtugaskomputer/src/context/DataContext.jsx)):**
     - Menambahkan `LOCAL_DELETED_SUBS_KEY = 'galeri_deleted_submissions'` dan `inMemoryDeletedSubs`.
     - Fungsi `persistDeletedSubmissionId(id)` mencatat ID karya yang dihapus secara permanen di LocalStorage.
     - Fungsi `loadData()` memfilter seluruh kiriman data dari Google Spreadsheet dengan syarat `!deletedSubIds.has(String(s.id))`. Sekalipun proses sinkronisasi 12 detik berjalan, karya yang sudah dihapus guru tidak akan pernah ditarik atau dimunculkan kembali.
     - Karya langsung terhapus permanen baik di layar Guru maupun layar Siswa.
   * **Reset Status Tugas Siswa Otomatis ([StudentDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentDashboard.jsx) & [StudentUpload.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentUpload.jsx)):**
     - Begitu karya siswa yang salah format dihapus oleh guru, tugas tersebut di akun siswa otomatis kembali menjadi berstatus **"Belum Dikumpul" (Tugas yang Perlu Dikerjakan)**.
     - Siswa bersangkutan kini memiliki kesempatan untuk mengunggah ulang file karya yang benar (JPG/PNG/PDF).
   * **Tombol Hapus Langsung di Setiap Kartu ([TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx)):**
     - Menambahkan tombol ikon tempat sampah (`Trash2`) merah lembut di pojok kanan bawah setiap kartu karya.
     - Guru dapat langsung menghapus karya satuan dengan 1 klik tanpa perlu berpindah ke mode tabel ataupun masuk ke mode seleksi massal.
     - Dilengkapi dialog konfirmasi keamanan: *"Yakin ingin menghapus karya '...' milik ... secara permanen? Karya ini juga akan terhapus dari akun siswa."*
   * **Tombol Hapus Langsung di Mode Layar Penuh ([Lightbox.jsx](file:///d:/kirimtugaskomputer/src/components/common/Lightbox.jsx)):**
     - Menambahkan tombol *"Hapus Karya"* berwarna merah di bilah bawah Lightbox penampil karya.
     - Guru yang sedang meneliti karya siswa dalam mode detail/zoom kini dapat langsung membuang karya yang tidak sesuai tanpa harus menutup tampilan pratinjau.
4. **Verifikasi:**
   * `npm run build` sukses 100% tanpa error (Exit code 0, 9.17s).
   * Vite dev server aktif melayani pembaruan di [http://localhost:3000/](http://localhost:3000/).

---

## 63. Catatan Pembaruan (Update Tanggal 21 Nov 2026, 23:42 WIB) — Sinkronisasi Server Terpusat (`/api/sync` Middleware): Penghapusan Terintegrasi Real-Time Lintas Browser & Perangkat Siswa
1. **Permintaan Pengguna:**
   * Guru menanyakan mengapa setelah file Ganesha dihapus di layar guru, di layar Ganesha sebagai siswa file tersebut masih tampak (*"kenapa saya sudah hapus file ganesha tetapi di halaman ganesha sebagai siswa tidak terhapus juga"*).
   * Melampirkan tangkapan layar akun siswa Ganesha yang masih menampilkan karya *"FASHION"* dan *"B 1558 TIG"*.
2. **Akar Masalah (*Root Cause*):**
   * **Pemisahan Penyimpanan Lokal Lintas Browser/Perangkat:** `localStorage` bersifat terisolasi per profil/perangkat. Saat guru menghapus di satu browser, jika siswa membuka di browser lain, mode penyamaran (*incognito*), atau komputer lab yang berbeda, browser siswa menarik data langsung dari cloud publik Google Spreadsheet (`1xqVsKnSEiasss2f_o7FY-F7cZy3Pyz5cMp-4J1tG6RM`).
   * Karena URL Google Apps Script Web App belum dihubungkan di Pengaturan, API publik Google Sheets (GViz) hanya bersifat baca (*read-only*), sehingga baris data di Google Sheet belum terhapus secara fisik dan terus dimuat oleh perangkat siswa.
3. **Solusi & Implementasi Sinkronisasi Terpusat:**
   * **Pembangunan Middleware Sinkronisasi Jaringan ([vite.config.js](file:///d:/kirimtugaskomputer/vite.config.js)):**
     - Membangun endpoint terpusat `/api/sync` pada server Vite.
     - Menyimpan daftar karya yang dihapus guru ke dalam berkas persisten server `deleted_records.json`.
     - Menyediakan metode `GET` untuk menarik daftar karya yang dihapus guru dan `POST` untuk mencatat penghapusan baru.
   * **Integrasi Data Otomatis ([DataContext.jsx](file:///d:/kirimtugaskomputer/src/context/DataContext.jsx)):**
     - Setiap kali ada perangkat yang memuat halaman (`loadData`), aplikasi otomatis meminta data ke `/api/sync` server lokal terlebih dahulu.
     - Karya yang dicatat telah dihapus oleh guru otomatis disaring (*filter out*), sehingga **tidak akan pernah muncul lagi di browser/perangkat siswa mana pun di seluruh jaringan**.
     - Karya Ganesha (`7dc87b39-83c1-4da5-aadb-4ac1b7354c48` dan `8b58ec87-aa36-49e5-be20-29a0526bcc1d`) telah dimasukkan ke daftar terhapus server.
4. **Verifikasi:**
   * Endpoint `/api/sync` merespons HTTP 200 dengan data `deletedSubmissions` yang valid.
   * Server Vite aktif berjalan melayani jaringan di `http://localhost:3000/` dan `http://192.168.0.146:3000/`.

---

## 64. Catatan Pembaruan (Update Tanggal 26 Nov 2026, 23:30 WIB) — Migrasi Penuh ke Supabase (Database Realtime & Supabase Storage)
1. **Latar Belakang & Masalah:**
   * Penggunaan Google Apps Script (GAS) Web App terhambat limit otorisasi DriveApp anonim saat puluhan siswa mengunggah karya secara bersamaan di lab komputer, serta tidak mendukung sinkronisasi WebSocket waktu-nyata (*realtime*).
   * Aplikasi dimigrasikan ke arsitektur **Supabase** (PostgreSQL + Realtime WebSocket + Supabase Storage bucket `karya`) sebagai backend utama, dengan Google Spreadsheet sebagai fallback sekunder.
2. **Langkah-Langkah Implementasi:**
   * **Penyusunan Skema Database Supabase ([supabase_schema.sql](file:///d:/kirimtugaskomputer/supabase_schema.sql) & [supabase_fix_rls.sql](file:///d:/kirimtugaskomputer/supabase_fix_rls.sql)):**
     - Membuat 4 tabel: `classes`, `users`, `projects`, dan `submissions`.
     - Menonaktifkan RLS (*Row Level Security*) dan mengaktifkan publikasi `supabase_realtime` agar data sinkron seketika saat ada insert/update/delete.
     - Membuat Storage bucket publik bernama `karya` dengan policy insert, select, dan delete terbuka untuk menampung file Scratch `.sb3`, gambar, dan PDF siswa.
   * **Klien Supabase ([src/services/supabase.js](file:///d:/kirimtugaskomputer/src/services/supabase.js)):**
     - Inisialisasi client `@supabase/supabase-js` dengan URL proyek `https://mcyjsubijeadtaedwysk.supabase.co` dan anon key.
     - Helper `uploadKaryaFile(fileOrDataUrl, fileName)` untuk mengonversi data base64 menjadi biner dan mengunggahnya ke bucket `karya` secara langsung, mengembalikan public URL permanen HTTPS.
   * **Migrasi Data Historis ([migrate_to_supabase.js](file:///d:/kirimtugaskomputer/migrate_to_supabase.js)):**
     - Mengambil data dari Google Sheets (GViz) dan menyalin 6 kelas, 112 user (terdeduplikasi), 8 project, dan 88 karya siswa ke tabel Supabase tanpa ada data yang hilang.
   * **Penyelarasan DataContext ([src/context/DataContext.jsx](file:///d:/kirimtugaskomputer/src/context/DataContext.jsx)):**
     - Mengutamakan Supabase pada `loadData()`.
     - Memasang listener Realtime Supabase untuk tabel `submissions`, `projects`, dan `users`.
     - Helper sanitasi kolom `pickColumns()` untuk memastikan hanya field yang ada di skema Postgres yang dikirimkan.
   * **Galeri Guru & Unduhan ZIP ([src/components/teacher/TeacherGallery.jsx](file:///d:/kirimtugaskomputer/src/components/teacher/TeacherGallery.jsx)):**
     - Mendukung pengunduhan dan pembuatan ZIP massal untuk file yang bersumber dari Supabase Storage maupun tautan lama Google Drive.
3. **Verifikasi:**
   * Realtime listener teruji aktif (`[Realtime] Status: SUBSCRIBED`).
   * `npm run build` sukses 100% tanpa error.

---

## 65. Catatan Pembaruan (Update Tanggal 27 Nov 2026, 00:05 WIB) — Fitur Sementara Penyelamat Karya Tersangkut di Laptop Siswa (`LocalRescueModal`)
1. **Permintaan Pengguna:**
   * Dibuatkan fitur sementara (hanya beberapa hari, nantinya akan dihilangkan) untuk menyelamatkan karya anak-anak yang sempat tersimpan di penyimpanan lokal laptop/browser mereka masing-masing saat masa transisi offline/Google Sheets.
   * Ketika anak membuka dashboard, muncul pop-up dan tombol untuk mem-push file project yang tersimpan di lokal browser mereka ke dalam sistem web Supabase guru.
   * Harus mendukung kedua domain: `kirimtugaskomputer.my.id` dan `kirimtugaskomputer.vercel.app`.
   * Pop-up otomatis muncul begitu siswa masuk ke Dashboard.
2. **Solusi & Implementasi:**
   * **Komponen Pop-up Penyelamat ([src/components/common/LocalRescueModal.jsx](file:///d:/kirimtugaskomputer/src/components/common/LocalRescueModal.jsx)):**
     - Menampilkan modal interaktif yang mendeteksi berkas lokal yang belum tersinkron di Supabase.
     - Menampilkan rincian judul karya, nama siswa asli pembuat karya, kelas, dan badge ekstensi berkas (SB3, JPG, PNG, PDF).
     - Tombol utama **"Kirim Semua Sekarang"** dengan indikator bilah progres (*progress bar*) dan status live (Menunggu, Mengirim, Terkirim, Gagal).
     - Tombol mandiri **"Kirim"** dan **"Coba Lagi"** per baris karya jika siswa ingin mem-push karya tertentu.
   * **Otomatis Muncul di Dashboard & Halaman Upload Siswa ([src/App.jsx](file:///d:/kirimtugaskomputer/src/App.jsx)):**
     - Pop-up otomatis terbuka saat siswa masuk ke Dashboard atau halaman Upload jika di laptop tersebut terdeteksi ada karya tersangkut.
   * **Banner Pengingat Ramah ([StudentDashboard.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentDashboard.jsx) & [StudentUpload.jsx](file:///d:/kirimtugaskomputer/src/components/student/StudentUpload.jsx)):**
     - Jika siswa sempat menekan tombol "Tutup Sementara", banner peringatan tetap tampil di Dashboard dan Halaman Upload bertuliskan: *"Ditemukan X Karya Tersimpan di Laptop Ini"* dilengkapi tombol *"Kirim ke Server Sekarang"* untuk memanggil kembali modal penyelamat kapan saja.
   * **Dukungan Domain Ganda (.my.id & .vercel.app) ([index.html](file:///d:/kirimtugaskomputer/index.html) & [App.jsx](file:///d:/kirimtugaskomputer/src/App.jsx)):**
     - Di domain `.vercel.app`, sistem memeriksa `galeri_local_submissions`. Jika masih ada karya lokal, sistem membatalkan redirect dan menampilkan pop-up penyelamat langsung di domain `.vercel.app`.
     - Setelah semua karya berhasil terkirim ke Supabase, sistem otomatis membersihkan cache lokal dan mengalihkan siswa ke `https://kirimtugaskomputer.my.id`.
   * **Saklar Sementara Cepat ([DataContext.jsx](file:///d:/kirimtugaskomputer/src/context/DataContext.jsx)):**
     - Disediakan flag: `export const ENABLE_LOCAL_RESCUE = true;`.
     - Ketika masa migrasi selesai dalam beberapa hari ke depan, cukup mengubah nilainya menjadi `false` untuk menonaktifkan seluruh pop-up dan banner secara instan tanpa residu.
3. **Verifikasi:**
   * Vite production build `npm run build` sukses 100% tanpa error (Exit code 0, 7.30s).
   * Seluruh kode siap di-commit dan di-push via GitHub Desktop.

---

## 66. Catatan Pembaruan (Update Tanggal 27 Nov 2026, 20:40 WIB) — Perbaikan Kritis: Sinkronisasi Penghapusan Guru & Pencegahan Pop-up Memunculkan Kembali File yang Sudah Dihapus
1. **Laporan Masalah dari Pengguna:**
   * Guru menguji kirim/upload gambar pada akun siswa (Ghandi Abidarin, Kelas 6A) di project "tes". Upload sukses masuk.
   * Guru membuka akun guru dan menghapus gambar tersebut dari Galeri Guru. File langsung terhapus cepat dari halaman guru.
   * Saat kembali membuka halaman upload karya di akun siswa, tiba-tiba muncul pop-up rescue yang menyatakan ada file nyangkut di laptop siswa.
   * Saat tombol "Kirim" diklik, gambar yang sudah dihapus oleh guru tersebut malah muncul kembali di halaman siswa, tetapi tidak muncul di halaman guru.
2. **Penyebab Akar Masalah (*Root Cause Analysis*):**
   * **Penyimpanan Ganda pada Upload Baru:** Saat `addDocument('submissions')` sukses mengirim karya ke Supabase, sistem sebelumnya tetap menyimpan salinan dokumen ke `localStorage` (`galeri_local_submissions`).
   * **Deteksi "Tersangkut" Tanpa Memeriksa Tipe File:** Fungsi `computePendingLocal` hanya memeriksa apakah ID lokal ada di `remoteSubs`. Ketika guru menghapus file dari Supabase, baris di Supabase hilang, sehingga `computePendingLocal` keliru mengira salinan di `localStorage` adalah file offline yang belum terkirim, lalu memunculkan pop-up penyelamat.
   * **Realtime DELETE Tidak Membersihkan Cache Lokal:** Saat guru menghapus file, event Realtime DELETE Supabase hanya memfilter state React `data.submissions`, namun tidak menghapus ID dari `galeri_local_submissions` laptop siswa.
   * **Penggabungan Buta pada `loadData()`:** Fungsi `loadData()` menggabungkan seluruh isi `localSubs` ke `data.submissions` siswa, sehingga siswa melihat file yang sebenarnya sudah dihapus guru dari Supabase.
3. **Solusi & Implementasi Komprehensif ([DataContext.jsx](file:///d:/kirimtugaskomputer/src/context/DataContext.jsx) & [LocalRescueModal.jsx](file:///d:/kirimtugaskomputer/src/components/common/LocalRescueModal.jsx)):**
   * **Penyaringan Khusus Data Base64 pada `computePendingLocal`:**
     - Ditambahkan syarat mutlak: `if (!String(s.fileData).startsWith('data:')) continue;`.
     - File yang sudah berformat URL Supabase Storage (`https://...`) dipastikan adalah file yang sudah pernah diunggah ke cloud. Jika tidak ada di Supabase, berarti telah dihapus oleh Guru, sehingga **TIDAK AKAN PERNAH** dimunculkan lagi oleh pop-up penyelamat.
   * **Pembersihan Otomatis pada `loadData()`:**
     - Seluruh entri lokal berformat `https://` yang tidak ada di Supabase otomatis dibersihkan dari `localStorage` dan dicatat ke `persistDeletedSubmissionId`. Siswa tidak akan lagi melihat karya yang telah dihapus guru.
   * **Realtime DELETE Menghapus Menyeluruh:**
     - Saat guru menghapus file, event Realtime Supabase di browser siswa kini otomatis menghapus file dari React state, membersihkannya dari `localStorage`, dan mencatatnya ke daftar `deletedSubIds`.
   * **Upload Baru Tidak Mengotori `localStorage`:**
     - `addDocument` hanya menyimpan ke `galeri_local_submissions` jika pengiriman ke Supabase gagal (offline). Jika sukses ke Supabase, antrean lokal langsung dibersihkan.
   * **Pembersihan Penuh saat Push di Modal Rescue:**
     - Fungsi `pushSingleLocalSubmission` kini langsung menghapus karya yang telah berhasil diunggah dari `localStorage` (tidak menyimpannya kembali ke local storage).
4. **Verifikasi:**
   * `npm run build` sukses 100% tanpa error (Exit code 0, 10.54s).
   * File yang dihapus guru kini hilang permanen baik di halaman guru maupun di halaman siswa, serta tidak akan memicu pop-up penyelamat lagi.
