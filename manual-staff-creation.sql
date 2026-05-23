-- MANUAL STAFF CREATION (Run this if Add Staff button fails)
-- This bypasses auth and creates staff directly in the database
-- Useful for testing when RLS/session issues occur

-- First, find an existing staff profile's ID or use the test admin
-- Check existing profiles:
-- SELECT id, full_name, email, role FROM profiles WHERE role = 'STAFF' OR role = 'ADMIN';

-- Example 1: Add Robin (already exists as profile, just link to staff table)
INSERT INTO public.staff (id, role_title, assigned_class, status)
VALUES (
  '95c672e5-cf1d-4fe3-b602-ce03ec8eb55f'::uuid,
  'Teacher Assistant',
  NULL,
  'ACTIVE'
)
ON CONFLICT (id) DO UPDATE 
SET role_title = EXCLUDED.role_title, status = EXCLUDED.status;

-- Example 2: Add a completely new staff member manually
-- First, create the auth user (run in Supabase Auth section or via SQL):
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
-- VALUES (
--   gen_random_uuid(),
--   'new.teacher@childtrack.com',
--   crypt('password123', gen_salt('bf')),
--   now(),
--   '{"provider":"email"}',
--   '{"full_name":"New Teacher"}'
-- );
-- Then get the new user's ID and insert into staff:
-- INSERT INTO public.staff (id, role_title, assigned_class, status)
-- VALUES ('new-user-uuid-here', 'Teacher', NULL, 'ACTIVE');

-- Example 3: Create a staff member using the existing profile (if you have one)
-- Update an existing profile's role to STAFF and link to staff table:
-- INSERT INTO public.staff (id, role_title, assigned_class, status, created_at)
-- SELECT id, 'Teacher', NULL, 'ACTIVE', now()
-- FROM public.profiles
-- WHERE email = 'some-existing-user@example.com' AND role = 'PARENT'
-- ON CONFLICT (id) DO NOTHING;

-- Verify result:
-- SELECT s.id, p.full_name, p.email, p.role, s.role_title, s.status
-- FROM staff s
-- JOIN profiles p ON s.id = p.id
-- ORDER BY s.created_at DESC;

-- NOTE: After manual insertion, the user can log in with:
-- Email: [the email you created]
-- Password: 'password123' (or whatever you set)
-- They MUST have role='STAFF' in profiles table to access staff dashboard
