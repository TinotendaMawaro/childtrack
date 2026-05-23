-- ============================================
-- SOFT DELETE MIGRATION VERIFICATION QUERIES
-- Run these in Supabase SQL Editor AFTER migration
-- ============================================

-- 1. Check status and updated_at columns exist
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'children' AND column_name IN ('status', 'updated_at')
ORDER BY column_name;

-- Expected results:
-- status | text | 'ACTIVE'::text | YES
-- updated_at | timestamp with time zone | timezone('utc'::text, now()) | NO

-- 2. Check audit table exists
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'child_status_history';

-- Expected: child_status_history

-- 3. Check views exist
SELECT table_name FROM information_schema.views
WHERE table_schema = 'public' AND table_name IN ('active_children', 'deactivated_children');

-- Expected: active_children, deactivated_children

-- 4. Check RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'children' AND policyname LIKE '%status%';

-- Expected: Admins can update child status

-- 5. Check triggers exist
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers
WHERE event_object_table = 'children'
ORDER BY trigger_name;

-- Expected:
-- trg_child_status_change | UPDATE | BEFORE
-- trg_children_updated_at | UPDATE | BEFORE

-- 6. Check indexes exist
SELECT indexname, tablename
FROM pg_indexes
WHERE tablename = 'children' AND indexname LIKE '%children%'
ORDER BY indexname;

-- Expected indexes:
-- idx_children_parent_id
-- idx_children_status
-- idx_children_updated_at

-- 7. Verify data backfill
SELECT status, COUNT(*) as count
FROM children
GROUP BY status;

-- Expected: ACTIVE | [number of children]

-- 8. Test views work
SELECT 'Active Children' as view_type, COUNT(*) as count FROM active_children
UNION ALL
SELECT 'Deactivated Children' as view_type, COUNT(*) as count FROM deactivated_children;

-- Expected: Shows counts for both views

-- 9. Test ordering in deactivated view
SELECT id, full_name, status, updated_at
FROM deactivated_children
ORDER BY updated_at DESC
LIMIT 5;

-- Expected: Proper ordering by updated_at (should be empty initially)

-- 10. Test audit table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'child_status_history'
ORDER BY ordinal_position;

-- Expected columns:
-- id (uuid, not null)
-- child_id (uuid, not null)
-- old_status (text, nullable)
-- new_status (text, not null)
-- changed_by (uuid, nullable)
-- changed_at (timestamp with time zone, not null)
-- reason (text, nullable)
-- notes (text, nullable)