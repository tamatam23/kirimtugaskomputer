# Galeri Karya Komputer - Dashboard V20

Aplikasi Galeri Karya Komputer SD dengan desain ultra-modern, glassmorphism, claymorphism, dan animasi membal (*spring bounce physics*) menggunakan **React, Vite, Tailwind CSS, Framer Motion, dan Lucide Icons**.

---

## 🚀 Fitur Utama

### 👨‍🏫 Panel Guru (5 Menu):
1. **Dashboard**: Statistik ringkas (Siswa terdaftar, Total project, Total karya, Belum kumpul), sapaan guru, foto profil dinamis, dan riwayat upload terbaru.
2. **Data Siswa**: Pencarian siswa, Hapus massal dengan konfirmasi interaktif, Export Template Excel, Import data siswa dari Excel (`.xlsx`), Tambah & Edit siswa lengkap dengan foto profil.
3. **Kelola Project**: Tab folder kelas dengan slider kapsul animasi (`layoutId`), kartu project tugas, modal buat project, dan tombol buka/tutup project.
4. **Galeri Karya**:
   * Filter per folder kelas, per tugas, dan pencarian nama siswa.
   * Mode tampilan ganda: **Mode Kartu (Grid)** & **Mode Tabel**.
   * Penilaian langsung: Input nilai angka dan catatan guru.
   * Unduh seluruh karya kelas dalam satu klik sebagai **ZIP**.
   * Unduh file coding Scratch (`.sb3`).
   * Lightbox interaktif dengan fitur Zoom In, Zoom Out, Pan/Drag, dan Reset.
   * Sidebar tracker siswa yang **Belum Kumpul**.
5. **Pengaturan**: Edit nama guru, username login, password baru, foto profil, dan pengaturan URL Google Apps Script Web App.

### 🎒 Panel Siswa (3 Menu):
1. **Dashboard**: Kartu sapaan hero personal dengan avatar, hitungan tugas menunggu, dan 3 kartu status (Tugas Aktif, Sudah Dikumpul, Belum Dikumpul).
2. **Upload Karya**: Pemilihan tugas, input judul karya, kotak upload *drag-and-drop* (mendukung gambar JPG/PNG, dokumen PDF/Word/PPT/Excel, dan game Scratch `.sb3`), serta efek selebrasi kembang api (*confetti*) saat sukses terkirim.
3. **Karya Saya**:
   * Mode Kartu & Tabel.
   * Tampilan nilai merah khas tulisan tangan (*handwritten style font*).
   * Catatan motivasi dari guru.
   * Tombol ganti file karya (sebelum dinilai oleh guru).
   * Khusus kelas 6: Pemutar game Scratch langsung di layar menggunakan **TurboWarp Player**.

---

## 🛠️ Cara Menjalankan di Komputer Lokal

1. Buka terminal di folder project `d:\kirimtugaskomputer`
2. Jalankan perintah:
   ```bash
   npm run dev
   ```
3. Buka browser di [http://localhost:3000](http://localhost:3000)

---

## 🔗 Cara Menghubungkan ke Google Spreadsheet & Drive Anda

1. Buka Google Spreadsheet database Anda:
   [Link Spreadsheet](https://docs.google.com/spreadsheets/d/1xqVsKnSEiasss2f_o7FY-F7cZy3Pyz5cMp-4J1tG6RM/edit?usp=sharing)
2. Buka menu **Ekstensi > Apps Script**.
3. Salin seluruh isi file `GAS_Code.gs` yang ada di folder ini dan tempelkan ke editor Apps Script Anda.
4. Klik **Deploy > Kelola Deployment (Manage Deployments)** atau **Deployment Baru (New Deployment)**:
   * **Jenis:** Aplikasi Web (Web App)
   * **Jalankan sebagai:** Saya (email Anda)
   * **Yang memiliki akses:** Siapa saja (Anyone)
5. Salin URL Web App yang dihasilkan (berakhiran `/exec`).
6. Masuk ke aplikasi Galeri Karya Komputer sebagai Guru:
   * **Username:** `admin`
   * **Password:** `admin123`
7. Buka menu **Pengaturan**, tempelkan URL Web App tersebut pada kotak **Google Apps Script Web App URL**, lalu klik **Simpan & Tes Koneksi**.
8. Selesai! Semua data siswa, tugas, nilai, dan file di Google Drive Anda langsung terhubung secara real-time.
