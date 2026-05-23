-- ============================================
-- ADD PICKUP_LOCATION TO CHILDREN TABLE
-- ============================================
-- Purpose: Add missing pickup_address column to children table
-- Date: 2026-05-23
-- Fixes: PostgrestException(42703) - column children.pickup_location does not exist
-- ============================================

-- Step 1: Add pickup_location column to children (must come before any VIEWs reference it)
ALTER TABLE public.children
  ADD COLUMN IF NOT EXISTS pickup_location TEXT;

-- Step 2: Recreate active_children view (SELECT * captures all current children columns including pickup_location)
CREATE OR REPLACE VIEW public.active_children AS
  SELECT * FROM public.children
  WHERE status = 'ACTIVE'
  ORDER BY full_name;

-- Step 3: Recreate deactivated_children view (SELECT * captures all current children columns including pickup_location)
CREATE OR REPLACE VIEW public.deactivated_children AS
  SELECT
    c.*,
    COUNT(ft.id) AS transaction_count,
    SUM(ft.amount) FILTER (WHERE ft.status = 'PAID') AS total_paid,
    SUM(ft.amount) FILTER (WHERE ft.status IN ('PENDING', 'OVERDUE')) AS balance_due
  FROM public.children c
  LEFT JOIN financial_transactions ft ON c.id = ft.child_id
  WHERE c.status IN ('INACTIVE', 'ARCHIVED')
  GROUP BY c.id
  ORDER BY c.updated_at DESC;
