-- Add Child Fields Migration
-- Run in Supabase SQL Editor

-- Add new columns to children table (safe - won't error if exist)
ALTER TABLE public.children 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS middle_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS performance text DEFAULT 'Good',
ADD COLUMN IF NOT EXISTS attendance_average numeric DEFAULT 0 CHECK (attendance_average BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS awards text[],
ADD COLUMN IF NOT EXISTS location_coordinates jsonb DEFAULT '{}'::jsonb; -- {lat: 0, lng: 0}

-- Update RLS for new fields (admin full access)
-- Remove IF NOT EXISTS (Postgres syntax - run ENABLE RLS first if needed)
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage children" ON public.children;
CREATE POLICY "Admins can manage children" ON public.children
FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_children_first_name ON public.children(first_name);
CREATE INDEX IF NOT EXISTS idx_children_last_name ON public.children(last_name);
CREATE INDEX IF NOT EXISTS idx_children_class_id ON public.children(class_id);

-- Sample data update (optional)
-- UPDATE public.children SET first_name = 'Emma', last_name = 'Johnson', performance = 'Excellent', attendance_average = 95, awards = ARRAY['Best Artist'];

-- Usage query
-- SELECT first_name, last_name, performance, attendance_average, awards FROM children ORDER BY full_name;
