-- Profile Picture - Bucket 'pro_pic'
-- Supabase SQL Editor

-- 1. Add columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Create bucket 'pro_pic'
INSERT INTO storage.buckets (id, name, public)
VALUES ('pro_pic', 'pro_pic', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Public read access
CREATE POLICY "Public pro_pic access" ON storage.objects
FOR SELECT USING (bucket_id = 'pro_pic');

-- 4. User upload own pics
CREATE POLICY "Users upload own pro_pic" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'pro_pic' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users update own pro_pic" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'pro_pic' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. Verify
SELECT * FROM storage.buckets WHERE name = 'pro_pic';
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name IN ('full_name', 'avatar_url');

