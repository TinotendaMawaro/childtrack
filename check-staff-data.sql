-- Check if staff table has data and verify migration
-- Run this in Supabase SQL Editor to verify staff data

-- Check staff table contents
SELECT
    s.id,
    p.full_name,
    p.email,
    s.role_title,
    s.assigned_class,
    s.status,
    s.created_at as staff_created_at,
    p.created_at as profile_created_at
FROM public.staff s
JOIN public.profiles p ON s.id = p.id
ORDER BY s.created_at DESC;

-- Check if the specific user exists in staff table
SELECT * FROM public.staff
WHERE id = '95c672e5-cf1d-4fe3-b602-ce03ec8eb55f'::uuid;

-- Check profiles with STAFF role
SELECT id, full_name, email, role FROM public.profiles
WHERE role = 'STAFF';

-- Count records in each table
SELECT 'profiles' as table_name, COUNT(*) as count FROM public.profiles WHERE role = 'STAFF'
UNION ALL
SELECT 'staff' as table_name, COUNT(*) as count FROM public.staff;