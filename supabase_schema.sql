-- ==========================================================
-- SKEMA DATABASE REALTIME SUPABASE - GALERI KARYA KOMPUTER
-- Jalankan di SQL Editor Supabase:
-- https://supabase.com/dashboard/project/mcyjsubijeadtaedwysk/sql/new
-- ==========================================================

-- 1. Tabel classes
CREATE TABLE IF NOT EXISTS public.classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "createdAt" TEXT DEFAULT CURRENT_TIMESTAMP::text
);

-- 2. Tabel users
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'siswa',
  name TEXT NOT NULL,
  username TEXT,
  password TEXT,
  "classId" TEXT,
  pin TEXT,
  photo TEXT,
  "createdAt" TEXT DEFAULT CURRENT_TIMESTAMP::text
);

-- 3. Tabel projects
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "desc" TEXT,
  "classId" TEXT[],
  deadline TEXT,
  status TEXT DEFAULT 'aktif',
  "targetStudents" TEXT[],
  "createdAt" TEXT DEFAULT CURRENT_TIMESTAMP::text
);

-- 4. Tabel submissions
CREATE TABLE IF NOT EXISTS public.submissions (
  id TEXT PRIMARY KEY,
  "projectId" TEXT,
  "studentId" TEXT,
  title TEXT,
  "fileData" TEXT,
  "fileExt" TEXT,
  nilai TEXT,
  catatan TEXT,
  feedback TEXT,
  "studentName" TEXT,
  "className" TEXT,
  "createdAt" TEXT DEFAULT CURRENT_TIMESTAMP::text
);

-- Nonaktifkan RLS agar dapat dibaca & ditulis oleh siswa & guru tanpa batasan
ALTER TABLE public.classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions DISABLE ROW LEVEL SECURITY;

-- Aktifkan Realtime WebSocket untuk sinkronisasi otomatis
ALTER PUBLICATION supabase_realtime ADD TABLE public.classes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;

-- 5. Buat Storage Bucket untuk File Karya (Scratch .sb3, Gambar, PDF, Dokumen)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('karya', 'karya', true)
ON CONFLICT (id) DO NOTHING;

-- Kebijakan Storage agar siapa saja bisa membaca & mengunggah karya
DROP POLICY IF EXISTS "Public Uploads Karya" ON storage.objects;
CREATE POLICY "Public Uploads Karya" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'karya');

DROP POLICY IF EXISTS "Public Reads Karya" ON storage.objects;
CREATE POLICY "Public Reads Karya" ON storage.objects FOR SELECT USING (bucket_id = 'karya');

DROP POLICY IF EXISTS "Public Deletes Karya" ON storage.objects;
CREATE POLICY "Public Deletes Karya" ON storage.objects FOR DELETE USING (bucket_id = 'karya');
