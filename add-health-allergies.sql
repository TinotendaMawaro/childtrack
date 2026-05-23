-- Add Health & Allergies to children table (run in Supabase SQL Editor)

-- Add health_status field
ALTER TABLE public.children 
ADD COLUMN IF NOT EXISTS health_status text DEFAULT 'Good' CHECK (health_status IN ('Excellent', 'Good', 'Fair', 'Poor'));

-- Add allergies field (text array)
ALTER TABLE public.children 
ADD COLUMN IF NOT EXISTS allergies text[] DEFAULT '{}';

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_children_health_status ON public.children USING btree (health_status);

-- Verify
SELECT health_status, allergies FROM public.children LIMIT 5;

-- RLS policies (if needed for authenticated access)
-- CREATE POLICY "Users can view own children" ON public.children FOR SELECT USING (auth.uid() = parent_id);

