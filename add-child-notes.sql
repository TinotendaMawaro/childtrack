-- Child Notes Migration
-- Purpose: Store behavior observations and general notes about children
-- Staff can add notes with timestamps for tracking progress and incidents
-- Date: 2026-05-09

-- 1. Create child_notes table
CREATE TABLE IF NOT EXISTS public.child_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  note_type TEXT CHECK (note_type IN ('behavior', 'general', 'progress', 'incident', 'achievement')) DEFAULT 'general',
  note TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false, -- Private notes only visible to admin/staff, not parents
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_child_notes_child_id ON child_notes(child_id);
CREATE INDEX IF NOT EXISTS idx_child_notes_staff_id ON child_notes(staff_id);
CREATE INDEX IF NOT EXISTS idx_child_notes_created_at ON child_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_child_notes_type ON child_notes(note_type);

-- 3. Enable Row Level Security
ALTER TABLE public.child_notes ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Staff can view notes for children in their assigned classes
CREATE POLICY "Staff can view child notes"
  ON child_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children c
      JOIN staff s ON c.class_id = s.assigned_class
      WHERE c.id = child_id AND s.id = auth.uid()
    )
    OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- Staff can insert notes for children in their classes
CREATE POLICY "Staff can insert child notes"
  ON child_notes FOR INSERT
  WITH CHECK (
    staff_id = auth.uid()
    AND
    EXISTS (
      SELECT 1 FROM children c
      JOIN staff s ON c.class_id = s.assigned_class
      WHERE c.id = child_id AND s.id = auth.uid()
    )
  );

-- Staff can update their own notes (within time limit, e.g., 15 min) or admin can update any
CREATE POLICY "Staff can update own child notes"
  ON child_notes FOR UPDATE
  USING (
    staff_id = auth.uid()
    AND created_at > (now() - interval '15 minutes')
  )
  WITH CHECK (
    staff_id = auth.uid()
  );

CREATE POLICY "Admin can update any child notes"
  ON child_notes FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- Staff can delete their own notes (recent) or admin can delete
CREATE POLICY "Staff can delete own recent notes"
  ON child_notes FOR DELETE
  USING (
    staff_id = auth.uid()
    AND created_at > (now() - interval '15 minutes')
  );

CREATE POLICY "Admin can delete any child notes"
  ON child_notes FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- 5. Trigger to update updated_at on note modification
CREATE OR REPLACE FUNCTION update_child_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_child_notes_updated_at ON child_notes;
CREATE TRIGGER trg_child_notes_updated_at
  BEFORE UPDATE ON child_notes
  FOR EACH ROW EXECUTE FUNCTION update_child_notes_updated_at();

-- 6. View for recent behavior notes (for dashboard/profile)
CREATE OR REPLACE VIEW recent_child_behavior_notes AS
SELECT
  cn.id,
  cn.child_id,
  cn.staff_id,
  cn.note_type,
  cn.note,
  cn.is_private,
  cn.created_at,
  p.full_name as staff_name,
  c.full_name as child_name
FROM child_notes cn
JOIN profiles p ON cn.staff_id = p.id
JOIN children c ON cn.child_id = c.id
WHERE cn.note_type IN ('behavior', 'incident')
ORDER BY cn.created_at DESC;

-- 7. Sample query to fetch notes for a child
-- SELECT * FROM child_notes WHERE child_id = 'child-uuid' ORDER BY created_at DESC LIMIT 10;

COMMIT;
