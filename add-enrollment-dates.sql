-- Add enrollment and withdrawal dates to children table
-- Run in Supabase SQL Editor

ALTER TABLE public.children
ADD COLUMN IF NOT EXISTS enrollment_date DATE,
ADD COLUMN IF NOT EXISTS withdrawal_date DATE;

-- Update existing records to set enrollment_date to created_at date
UPDATE public.children
SET enrollment_date = created_at::DATE
WHERE enrollment_date IS NULL AND status IN ('ACTIVE', 'INACTIVE');

-- Add check constraint to ensure withdrawal_date is after enrollment_date
ALTER TABLE public.children
ADD CONSTRAINT check_withdrawal_after_enrollment
CHECK (withdrawal_date IS NULL OR enrollment_date IS NULL OR withdrawal_date >= enrollment_date);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_children_enrollment_date ON public.children(enrollment_date);
CREATE INDEX IF NOT EXISTS idx_children_withdrawal_date ON public.children(withdrawal_date);

-- Update RLS policies to include new fields
-- The existing admin policy should cover these new fields