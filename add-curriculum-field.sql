-- Class Curriculum Support - Run in Supabase SQL Editor

-- 1. Create curriculum enum type
CREATE TYPE public.curriculum_enum AS ENUM ('Cambridge', 'Zimsec');

-- 2. Add curriculum column to classes table
ALTER TABLE public.classes 
ADD COLUMN IF NOT EXISTS curriculum public.curriculum
