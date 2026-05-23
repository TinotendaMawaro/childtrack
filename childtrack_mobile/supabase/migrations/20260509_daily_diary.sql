-- Daily Diary Tables Migration
-- Run this in Supabase SQL Editor

-- 1. Create daily_diaries table
CREATE TABLE IF NOT EXISTS daily_diaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id TEXT NOT NULL,
  date DATE NOT NULL,
  breakfast TEXT DEFAULT '',
  lunch TEXT DEFAULT '',
  snacks TEXT DEFAULT '',
  nap_start TEXT,
  nap_end TEXT,
  mood TEXT DEFAULT 'happy',
  notes TEXT DEFAULT '',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, date)
);

-- 2. Create diary_photos table
CREATE TABLE IF NOT EXISTS diary_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id UUID REFERENCES daily_diaries(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE daily_diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_photos ENABLE ROW LEVEL SECURITY;

-- 4. Drop old policies (if any)
DROP POLICY IF EXISTS "Staff can view own class diaries" ON daily_diaries;
DROP POLICY IF EXISTS "Staff can insert own class diaries" ON daily_diaries;
DROP POLICY IF EXISTS "Staff can update own class diaries" ON daily_diaries;
DROP POLICY IF EXISTS "Staff can view own diary photos" ON diary_photos;
DROP POLICY IF EXISTS "Staff can insert own diary photos" ON diary_photos;

-- 5. RLS Policies for daily_diaries
CREATE POLICY "Staff can view own class diaries"
  ON daily_diaries FOR SELECT
  USING (
    class_id IN (
      SELECT assigned_class::TEXT FROM staff WHERE id = auth.uid()
    )
  );

CREATE POLICY "Staff can insert own class diaries"
  ON daily_diaries FOR INSERT
  WITH CHECK (
    class_id IN (
      SELECT assigned_class::TEXT FROM staff WHERE id = auth.uid()
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "Staff can update own class diaries"
  ON daily_diaries FOR UPDATE
  USING (
    class_id IN (
      SELECT assigned_class::TEXT FROM staff WHERE id = auth.uid()
    )
  );

-- 6. RLS Policies for diary_photos
CREATE POLICY "Staff can view own diary photos"
  ON diary_photos FOR SELECT
  USING (
    diary_id IN (
      SELECT id FROM daily_diaries
      WHERE class_id IN (
        SELECT assigned_class::TEXT FROM staff WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Staff can insert own diary photos"
  ON diary_photos FOR INSERT
  WITH CHECK (
    diary_id IN (
      SELECT id FROM daily_diaries
      WHERE class_id IN (
        SELECT assigned_class::TEXT FROM staff WHERE id = auth.uid()
      )
    )
  );

-- 7. Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('diary-photos', 'diary-photos', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Storage object policies
DROP POLICY IF EXISTS "Public can view diary photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated staff can upload diary photos" ON storage.objects;

CREATE POLICY "Public can view diary photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'diary-photos');

CREATE POLICY "Authenticated staff can upload diary photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'diary-photos' AND auth.uid() IS NOT NULL);

-- 9. Indexes
CREATE INDEX IF NOT EXISTS idx_daily_diaries_class_date ON daily_diaries(class_id, date);
CREATE INDEX IF NOT EXISTS idx_diary_photos_diary_id ON diary_photos(diary_id);
