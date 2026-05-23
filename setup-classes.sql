-- Sample Classes Data
-- Run this in Supabase SQL Editor after running supabase-schema.sql

-- Insert sample classes
INSERT INTO public.classes (id, name, age_group, teacher_id, capacity, curriculum) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Sunbeam', '3-4 years', 
   (SELECT id FROM profiles WHERE email = 'mabuto@allbright.com' LIMIT 1), 15, 'Cambridge'),
  ('22222222-2222-2222-2222-222222222222', 'Rainbow', '4-5 years', 
   (SELECT id FROM profiles WHERE email = 'admin@allbright.com' LIMIT 1), 15, 'Zimsec'),
  ('33333333-3333-3333-3333-333333333333', 'Starlight', '2-3 years', 
   NULL, 10, 'Cambridge'),
  ('44444444-4444-4444-4444-444444444444', 'Butterfly', '3-4 years', 
   NULL, 12, 'Cambridge')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Verify
SELECT c.id, c.name, c.age_group, c.capacity, c.curriculum, p.full_name as teacher
FROM classes c
LEFT JOIN profiles p ON c.teacher_id = p.id
ORDER BY c.name;