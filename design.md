# Design System — Galeri Karya Digital

> Dokumen ini mencatat seluruh keputusan desain UI/UX aplikasi Galeri Karya Digital.
> Dibuat: Nov 25, 2026 | Versi: 1.0

---

## 1. Referensi Desain

- **Inspirasi utama:** "Dashboard V20" oleh @paulcodes4 (TikTok)
- **Gaya:** Glassmorphism modern, motion-first, soft purple palette
- **Framework:** React + Tailwind CSS + Framer Motion

---

## 2. Color Palette

| Nama | Hex | Penggunaan |
|---|---|---|
| Soft Lavender | `#F7F5FF` | Background utama halaman |
| Purple Primary | `#7C3AED` | Tombol utama, aksen aktif, badge |
| Indigo | `#6366F1` | Gradient sekunder, hover state |
| White Glass | `rgba(255,255,255,0.8)` | Card glassmorphism |
| Charcoal | `#242e35` | Load bar track |
| Sage Green | `#477d5f` | Load bar fill (progress) |
| Dark Sidebar | `#1e1b2e` | Background sidebar |

---

## 3. Komponen Glassmorphism

Kelas Tailwind standar untuk card/panel efek kaca:

```
bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-lg
```

Untuk card yang lebih solid (modal, panel penilaian):

```
bg-white/90 backdrop-blur-2xl border border-purple-100/60 rounded-3xl shadow-2xl
```

---

## 4. Animasi & Motion

### Spring Physics (Framer Motion default)

```js
transition: { type: "spring", stiffness: 400, damping: 15 }
```

### Hover & Tap Card Karya

```js
whileHover={{ y: -7, scale: 1.02 }}
whileTap={{ scale: 0.96 }}
```

### Fade In + Slide Up (item list)

```js
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: index * 0.05 }}
```

---

## 5. Tipografi

| Peran | Font | Class Tailwind |
|---|---|---|
| UI utama | Plus Jakarta Sans | `font-sans` |
| Catatan guru | Kalam (Google Fonts) | `font-['Kalam']` |
| Nilai siswa (rapor-style) | Comic Sans MS | `font-['Comic_Sans_MS']` |

---

## 6. Running Glow Border

Efek border berputar bercahaya (digunakan di card highlight / card aktif guru):

```css
@keyframes spinGlow {
  from { --angle: 0deg; }
  to   { --angle: 360deg; }
}

.glow-border {
  background: conic-gradient(
    from var(--angle),
    #7C3AED, #6366F1, #a855f7, #7C3AED
  );
  animation: spinGlow 6s linear infinite;
  border-radius: 1.5rem;
  padding: 2px;
}
```

---

## 7. Load Bar (StudentUpload)

> GOLDEN RULE: Jangan gunakan `transition-all` CSS. Gunakan RAF + Framer Motion.

**Spesifikasi:**
- Track: `#242e35` (charcoal), rounded-full, h-2
- Fill: `#477d5f` (sage green), animated via `requestAnimationFrame`
- Duration: ~2.8 detik untuk mencapai 95% (sisa diisi saat upload selesai)
- Implementasi: `useRef` + RAF loop, `motion.div` width dari 0% → 100%

---

## 8. Lightbox Viewer

> GOLDEN RULE: Wajib menggunakan `createPortal(..., document.body)`.

**Spesifikasi:**
- Z-index: `z-[9999999]` (di atas semua overlay lain)
- Dimensi: `100vw × 100dvh` (gunakan `dvh` agar aman di mobile browser)
- Mode yang didukung: Image viewer, Scratch `.sb3` iframe, PDF viewer
- Backdrop: `bg-black/80 backdrop-blur-sm`
- Keluar: klik backdrop atau tekan `Escape`

---

## 9. Login Screen

### 3D Flip Card (Guru vs Siswa)

```
Sisi Depan: Pilih peran (Guru / Siswa)
Sisi Belakang: Form login sesuai peran
Animasi: rotateY 0deg → 180deg, perspective 1200px
```

### Circular Dial Selector (Login Siswa — Pilih Kelas)

- Lingkaran berputar dengan item kelas 4A, 4B, 5A, 5B, 6A, 6B
- Swipe/drag putar dial, item aktif di tengah bawah
- Item aktif skala besar + warna solid, item pasif transparan

---

## 10. Sidebar (TeacherDashboard)

**Lebar:**
- Collapsed: `w-[88px]` — hanya ikon
- Expanded: `w-[245px]` — ikon + label teks

**Persistensi:** `localStorage` kunci `galeri_sidebar_expanded`

**Transisi:** `transition-width duration-300 ease-in-out`

**Item aktif:** Titik putih kecil di sisi kiri ikon + background `bg-white/10`

---

## 11. Filter Tugas (TeacherGallery)

> GOLDEN RULE: JANGAN batasi lebar dropdown filter tugas di bawah 200px.

**Spesifikasi:**
- Min-width: `min-w-[220px]`
- Tampilkan jumlah karya: `Membuat Design T-Shirt (13 karya)`
- Jika tugas yang dipilih 0 karya: tampilkan empty state + tombol "Lihat Semua Karya [Kelas] ([N] Karya)"

---

## 12. Aturan Tanpa Emoji

Seluruh antarmuka **tidak menggunakan emoji** di:
- Tombol (button)
- Toast notification
- Label menu
- Judul halaman

Gunakan ikon SVG / Lucide React sebagai pengganti emoji.

---

## 13. Responsivitas

| Breakpoint | Perilaku |
|---|---|
| Mobile (`< 768px`) | Sidebar collapse otomatis, grid karya 1 kolom |
| Tablet (`768–1024px`) | Sidebar collapse, grid karya 2 kolom |
| Desktop (`> 1024px`) | Sidebar expanded default, grid karya 3–4 kolom |

---

## 14. Komponen Foto Profil

- **Kompresi:** Max 200×200px, quality 0.72 (JPEG), ~8–12KB
- **Handler error wajib:** `onError` → fallback ke placeholder kamera atau inisial nama
- **Multi-endpoint Drive:** `drive.google.com/thumbnail?id=...&sz=w400`
- **Tidak pernah** menampilkan lingkaran transparan atau broken image

---

*Dokumen ini diperbarui otomatis setiap sesi development. Untuk menambah seksi baru, append di bagian bawah dengan heading `## N. Judul (Tanggal)`.*
