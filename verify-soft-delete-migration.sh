#!/bin/bash
# Soft Delete Migration Verification Script
# Run this after executing the SQL migration in Supabase

echo "🔍 SOFT DELETE MIGRATION VERIFICATION"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "📋 STEP 1: Verify Database Schema Changes"
echo "------------------------------------------"

# These commands should be run in Supabase SQL Editor
echo "Run these queries in Supabase SQL Editor:"
echo ""

cat << 'SQL_EOF'
-- 1. Check status and updated_at columns exist
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'children' AND column_name IN ('status', 'updated_at')
ORDER BY column_name;

-- Expected:
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

-- 6. Verify data backfill
SELECT status, COUNT(*) as count
FROM children
GROUP BY status;

-- Expected: ACTIVE | [number of children]
SQL_EOF

echo ""
echo "📋 STEP 2: Application Testing Checklist"
echo "----------------------------------------"

echo "After starting the app (http://localhost:5174):"
echo ""

echo "1. ${YELLOW}Navigate to Children module${NC}"
echo "   ✅ Should see 'Active Students' and 'Deactivated Students' tabs"
echo ""

echo "2. ${YELLOW}Test Active Students tab${NC}"
echo "   ✅ Shows children with ACTIVE status"
echo "   ✅ Child cards show 'Active' status badge"
echo "   ✅ Edit and Deactivate buttons visible"
echo ""

echo "3. ${YELLOW}Test Deactivate functionality${NC}"
echo "   ✅ Click child card → drawer opens"
echo "   ✅ Click 'Deactivate' button (trash icon)"
echo "   ✅ Custom confirmation modal appears (not browser confirm)"
echo "   ✅ Modal shows warning about data preservation"
echo "   ✅ Click 'Deactivate Child' → success message"
echo "   ✅ Child disappears from Active tab"
echo ""

echo "4. ${YELLOW}Test Deactivated Students tab${NC}"
echo "   ✅ Click 'Deactivated Students' tab"
echo "   ✅ Shows previously deactivated child"
echo "   ✅ Child cards have muted styling (opacity-75)"
echo "   ✅ Status badge shows 'Inactive'"
echo ""

echo "5. ${YELLOW}Test Reactivate functionality${NC}"
echo "   ✅ Click deactivated child card"
echo "   ✅ Drawer shows 'Reactivate' and 'Archive Permanently' buttons"
echo "   ✅ Click 'Reactivate' button (rotate icon)"
echo "   ✅ Success message appears"
echo "   ✅ Child disappears from Deactivated tab"
echo "   ✅ Child reappears in Active Students tab"
echo ""

echo "6. ${YELLOW}Test Archive functionality${NC}"
echo "   ✅ Deactivate a child first (if needed)"
echo "   ✅ Go to Deactivated tab"
echo "   ✅ Click child card"
echo "   ✅ Click 'Archive Permanently' button"
echo "   ✅ Success message appears"
echo "   ✅ Child disappears from Deactivated tab"
echo "   ✅ Child no longer appears anywhere (archived/read-only)"
echo ""

echo "📋 STEP 3: Data Integrity Verification"
echo "--------------------------------------"

echo "Run these queries to verify data preservation:"
echo ""

cat << 'SQL_EOF'
-- 1. Check financial transactions are preserved
SELECT
  c.full_name,
  c.status,
  COUNT(ft.id) as transaction_count,
  SUM(ft.amount) as total_amount
FROM children c
LEFT JOIN financial_transactions ft ON c.id = ft.child_id
GROUP BY c.id, c.full_name, c.status
HAVING COUNT(ft.id) > 0
ORDER BY transaction_count DESC;

-- Expected: Transactions remain linked to children regardless of status

-- 2. Check audit trail
SELECT
  c.full_name,
  h.old_status,
  h.new_status,
  h.changed_at,
  p.full_name as changed_by
FROM child_status_history h
JOIN children c ON h.child_id = c.id
LEFT JOIN profiles p ON h.changed_by = p.id
ORDER BY h.changed_at DESC;

-- Expected: Shows all status changes with timestamps and user info

-- 3. Test views
SELECT 'Active Children' as view_type, COUNT(*) as count FROM active_children
UNION ALL
SELECT 'Deactivated Children' as view_type, COUNT(*) as count FROM deactivated_children;

-- Expected: Shows counts for both views
SQL_EOF

echo ""
echo "📋 STEP 4: Performance Verification"
echo "-----------------------------------"

echo "Monitor these metrics:"
echo "✅ Query performance (should be < 500ms for child lists)"
echo "✅ No N+1 queries in Network tab"
echo "✅ Status filtering works efficiently"
echo ""

echo "📋 STEP 5: Error Handling Verification"
echo "---------------------------------------"

echo "Test these error scenarios:"
echo "✅ Try to delete child with FK constraints (should use deactivate)"
echo "✅ Try to reactivate archived child (should fail gracefully)"
echo "✅ Check network errors are handled properly"
echo ""

echo "🎯 SUCCESS CRITERIA"
echo "==================="

echo "${GREEN}✅ Database:${NC} status column exists, audit table created, views work"
echo "${GREEN}✅ UI:${NC} Two tabs visible, status badges correct, appropriate buttons"
echo "${GREEN}✅ Functionality:${NC} Deactivate/Reactivate/Archive work without errors"
echo "${GREEN}✅ Data Integrity:${NC} Financial transactions preserved, audit trail complete"
echo "${GREEN}✅ Performance:${NC} No performance degradation, efficient queries"
echo ""

echo "🚀 MIGRATION COMPLETE - Ready for production!"
echo "=============================================="