-- ==========================================================
-- SCRIPT PERBAIKAN PERMISSION & RLS SUPABASE
-- Salin semua kode ini dan Jalankan (RUN) di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/mcyjsubijeadtaedwysk/sql/new
-- ==========================================================

-- 1. Beri hak akses penuh untuk tabel classes
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_classes" ON public.classes;
CREATE POLICY "anon_all_classes" ON public.classes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 2. Beri hak akses penuh untuk tabel users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_users" ON public.users;
CREATE POLICY "anon_all_users" ON public.users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 3. Beri hak akses penuh untuk tabel projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_projects" ON public.projects;
CREATE POLICY "anon_all_projects" ON public.projects FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 4. Beri hak akses penuh untuk tabel submissions (agar siswa bisa kirim tugas & realtime muncul di guru)
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_submissions" ON public.submissions;
CREATE POLICY "anon_all_submissions" ON public.submissions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 5. Aktifkan Realtime Replication untuk semua tabel
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'classes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.classes;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'users'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'projects'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'submissions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;
  END IF;
END $$;

-- 6. Setup Bucket Storage 'karya' dan hak akses upload siswa
INSERT INTO storage.buckets (id, name, public) 
VALUES ('karya', 'karya', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "anon_karya_select" ON storage.objects;
CREATE POLICY "anon_karya_select" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'karya');

DROP POLICY IF EXISTS "anon_karya_insert" ON storage.objects;
CREATE POLICY "anon_karya_insert" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'karya');

DROP POLICY IF EXISTS "anon_karya_update" ON storage.objects;
CREATE POLICY "anon_karya_update" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'karya');

DROP POLICY IF EXISTS "anon_karya_delete" ON storage.objects;
CREATE POLICY "anon_karya_delete" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'karya');
