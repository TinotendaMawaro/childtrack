-- Create attendance system
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.attendance_records (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id uuid REFERENCES public.children(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text CHECK (status IN ('present', 'absent', 'late')) DEFAULT 'present',
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Index for fast queries
CREATE INDEX IF NOT EXISTS idx_attendance_child_date ON public.attendance_records(child_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance_records(date);

-- RLS policy
CREATE POLICY "Staff can manage attendance" ON public.attendance_records
FOR ALL USING (true);

-- Trigger to update attendance_average
CREATE OR REPLACE FUNCTION update_attendance_average()
RETURNS trigger AS $$
BEGIN
  UPDATE public.children c
  SET attendance_average = (
    SELECT CASE WHEN COUNT(ar.id) > 0 
      THEN ROUND((SUM(CASE WHEN ar.status = 'present' THEN 100.0 ELSE 0 END) * 1.0 / COUNT(ar.id)), 1)
      ELSE 0 
    END
    FROM public.attendance_records ar 
    WHERE ar.child_id = c.id AND ar.date >= CURRENT_DATE - INTERVAL '30 days'
  )
  WHERE c.id = NEW.child_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_update_attendance_average
  AFTER INSERT OR UPDATE ON public.attendance_records
  FOR EACH ROW EXECUTE FUNCTION update_attendance_average();

-- Verify
SELECT 'Attendance table ready' as status;

