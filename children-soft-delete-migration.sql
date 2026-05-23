-- ============================================
-- CHILDREN SOFT DELETE MIGRATION
-- ============================================
-- Purpose: Replace hard delete with status-based lifecycle management
-- Affects: children table, adds status column, audit logging
-- Date: 2026-05-08
-- ============================================

BEGIN;

-- Step 1: Add updated_at column (needed for ordering deactivated children)
ALTER TABLE public.children
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Step 2: Add status column with default
ALTER TABLE public.children
  ADD COLUMN IF NOT EXISTS status TEXT
    DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED'));

-- Step 3: Backfill existing records
UPDATE public.children
  SET status = 'ACTIVE',
      updated_at = created_at
  WHERE status IS NULL;

-- Step 4: Create audit/history table
CREATE TABLE IF NOT EXISTS public.child_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT,
  notes TEXT,
  CONSTRAINT valid_status_transition CHECK (
    (old_status IS NULL AND new_status IN ('ACTIVE')) OR
    (old_status = 'ACTIVE' AND new_status IN ('INACTIVE', 'ARCHIVED')) OR
    (old_status = 'INACTIVE' AND new_status IN ('ACTIVE', 'ARCHIVED')) OR
    (old_status = 'ARCHIVED' AND new_status = 'ARCHIVED')
  )
);

-- Step 5: Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_children_status ON public.children(status);
CREATE INDEX IF NOT EXISTS idx_children_parent_id ON public.children(parent_id);
CREATE INDEX IF NOT EXISTS idx_children_updated_at ON public.children(updated_at);
CREATE INDEX IF NOT EXISTS idx_child_status_history_child_id
  ON child_status_history(child_id);

-- Step 6: RLS policies (allow admin/staff to update status)
CREATE POLICY "Admins can update child status" ON public.children
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Step 7: Audit trigger
CREATE OR REPLACE FUNCTION log_child_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO child_status_history (
      child_id, old_status, new_status, changed_by
    ) VALUES (
      NEW.id, OLD.status, NEW.status, auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_child_status_change ON children;
CREATE TRIGGER trg_child_status_change
  BEFORE UPDATE OF status ON children
  FOR EACH ROW EXECUTE PROCEDURE log_child_status_change();

-- Step 10: Add updated_at trigger for all updates
CREATE OR REPLACE FUNCTION update_children_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_children_updated_at ON children;
CREATE TRIGGER trg_children_updated_at
  BEFORE UPDATE ON children
  FOR EACH ROW EXECUTE PROCEDURE update_children_updated_at();

-- Step 8: View for active children (optimize queries)
CREATE OR REPLACE VIEW active_children AS
  SELECT * FROM children
  WHERE status = 'ACTIVE'
  ORDER BY full_name;

-- Step 9: View for deactivated children
CREATE OR REPLACE VIEW deactivated_children AS
  SELECT
    c.*,
    COUNT(ft.id) AS transaction_count,
    SUM(ft.amount) FILTER (WHERE ft.status = 'PAID') AS total_paid,
    SUM(ft.amount) FILTER (WHERE ft.status IN ('PENDING', 'OVERDUE')) AS balance_due
  FROM children c
  LEFT JOIN financial_transactions ft ON c.id = ft.child_id
  WHERE c.status IN ('INACTIVE', 'ARCHIVED')
  GROUP BY c.id
  ORDER BY c.updated_at DESC;

COMMIT;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Next steps:
-- 1. Update application code to use status column
-- 2. Replace DELETE calls with status update API
-- 3. Add Deactivated tab to Children module UI
-- 4. Test all status transitions
-- ============================================