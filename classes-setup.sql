-- Safe classes setup (idempotent - handles existing constraints)

-- Drop constraint if exists, recreate (safe way)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'classes_curriculum_check') THEN
    ALTER TABLE public.classes DROP CONSTRAINT classes_curriculum_check;
  END IF;
END $$;

-- Add curriculum column if missing
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS curriculum text DEFAULT 'Cambridge';

-- Add safe CHECK constraint
ALTER TABLE public.classes 
ADD CONSTRAINT classes_curriculum_check 
CHECK (curriculum IN ('Cambridge', 'Zimsec'));

-- Insert realistic ECD/nursery classes (idempotent)
INSERT INTO public.classes (name, curriculum) 
VALUES 
  ('ECDA', 'Cambridge'),
  ('ECDB', 'Cambridge'),
  ('Pre-Grade 1', 'Cambridge'),
  ('Grade 1', 'Cambridge'),
  ('Grade 2', 'Cambridge'),
  ('ECD A', 'Zimsec'),
  ('ECD B', 'Zimsec'),
  ('Grade 3', 'Zimsec'),
  ('Grade 4', 'Zimsec'),
  ('Form 1', 'Zimsec')
ON CONFLICT (name) DO NOTHING;

-- Verify setup
SELECT name, curriculum FROM public.classes ORDER BY curriculum, name;

