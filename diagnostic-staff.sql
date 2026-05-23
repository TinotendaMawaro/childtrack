-- Diagnostic: Check RLS Policies and Permissions for Staff Management
-- Run this in Supabase SQL Editor to verify everything is set up correctly

-- 1. Check if RLS is enabled
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('profiles', 'staff', 'classes')
ORDER BY tablename, policyname;

-- 2. Verify admin user exists and has correct role
SELECT 
  id, 
  email, 
  role 
FROM profiles 
WHERE role = 'ADMIN';

-- 3. Check test staff user (Robin)
SELECT 
  s.id,
  p.full_name,
  p.email,
  p.role,
  s.role_title,
  s.assigned_class,
  s.status,
  c.name as class_name
FROM staff s
JOIN profiles p ON s.id = p.id
LEFT JOIN classes c ON s.assigned_class = c.id
WHERE p.email = 'mabuto@allbright.com';

-- 4. Check classes exist (for dropdown)
SELECT id, name FROM classes ORDER BY name;

-- 5. Test: Can current admin user insert into staff? (run as admin)
-- First get your admin user ID, then replace 'YOUR-ADMIN-UUID' below:
-- INSERT INTO staff (id, role_title, assigned_class, status) 
-- VALUES ('YOUR-ADMIN-UUID', 'Test', NULL, 'ACTIVE')
-- ON CONFLICT (id) DO NOTHING;

-- 6. Check if trigger is working (profiles auto-created on signup)
-- When you sign up a new user via supabase.auth.signUp(), 
-- the trigger should automatically create a profile with role='PARENT'.
-- You can verify by checking the profiles table after signup.

-- 7. Indexes for performance
SELECT 
  tablename, 
  indexname, 
  indexdef 
FROM pg_indexes 
WHERE tablename IN ('profiles', 'staff', 'classes')
ORDER BY tablename, indexname;

-- Quick test: Count records
SELECT 
  (SELECT COUNT(*) FROM profiles WHERE role = 'STAFF') as staff_profiles,
  (SELECT COUNT(*) FROM staff) as staff_records,
  (SELECT COUNT(*) FROM classes) as classes_count;

-- If you get "permission denied" errors, ensure you're running as admin (postgres or service_role)
-- RLS policies are bypassed for superusers.
