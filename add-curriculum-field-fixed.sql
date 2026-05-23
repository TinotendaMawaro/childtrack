-- Cambridge/Zimsec Class Support for Children Form
-- Supabase-compatible (no custom ENUM - uses TEXT + CHECK)

-- Add curriculum column to classes (no superuser needed)
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS curriculum text DEFAULT 'Cambridge';

-- Add CHECK constraint
ALTER TABLE public.classes 
ADD CONSTRAINT classes_curriculum_check 
CHECK (curriculum IN ('Cambridge', 'Zimsec'));

-- Create sample classes if table empty
INSERT INTO public.classes (name, curriculum) 
SELECT * FROM (VALUES 
  ('ECDA', 'Cambridge'),
  ('ECDB', 'Cambridge'),
  ('Grade 1', 'Cambridge'),
  ('Grade 2', 'Cambridge'),
  ('Grade 3', 'Zimsec'),
  ('Grade 4', 'Zimsec'),
  ('Form 1', 'Zimsec'),
  ('Form 2', 'Zimsec')
) AS t(name, curriculum)
ON CONFLICT (name) DO NOTHING;

-- Verify
SELECT name, curriculum FROM public.classes ORDER BY curriculum, name;

-- Update existing classes (optional)
-- UPDATE public.classes SET curriculum = 'Cambridge' WHERE curriculum IS NULL;

