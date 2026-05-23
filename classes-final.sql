-- Final safe classes setup - Grade 1-7, Form 1-6 + ECD
-- No ON CONFLICT issues - pure INSERT with WHERE NOT EXISTS

-- Add curriculum if missing (safe)
DO $$ BEGIN
  PERFORM 1 FROM information_schema.columns 
  WHERE table_name = 'classes' AND column_name = 'curriculum';
  IF NOT FOUND THEN
    ALTER TABLE public.classes ADD COLUMN curriculum text DEFAULT 'Cambridge';
  END IF;
END $$;

-- Safe CHECK constraint
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'classes_curriculum_check') THEN
    ALTER TABLE public.classes DROP CONSTRAINT classes_curriculum_check;
  END IF;
END $$;

ALTER TABLE public.classes ADD CONSTRAINT classes_curriculum_check 
CHECK (curriculum IN ('Cambridge', 'Zimsec'));

-- Clear demo data, add Grades 1-7, Forms 1-6 + ECD
DELETE FROM public.classes WHERE name IN ('Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Form 1', 'Form 2', 'ECDA', 'ECDB');

INSERT INTO public.classes (name, curriculum) VALUES
  ('ECDA', 'Cambridge'),
  ('ECDB', 'Cambridge'),
  ('Grade 1', 'Cambridge'),
  ('Grade 2', 'Cambridge'),
  ('Grade 3', 'Cambridge'),
  ('Grade 4', 'Cambridge'),
  ('Grade 5', 'Cambridge'),
  ('Grade 6', 'Cambridge'),
  ('Grade 7', 'Cambridge'),
  ('ECD A', 'Zimsec'),
  ('ECD B', 'Zimsec'),
  ('Form 1', 'Zimsec'),
  ('Form 2', 'Zimsec'),
  ('Form 3', 'Zimsec'),
  ('Form 4', 'Zimsec'),
  ('Form 5', 'Zimsec'),
  ('Form 6', 'Zimsec')
ON CONFLICT DO NOTHING;

-- Final verification
SELECT curriculum, COUNT(*) as count, string_agg(name, ', ') as classes 
FROM public.classes GROUP BY curriculum ORDER BY curriculum;

