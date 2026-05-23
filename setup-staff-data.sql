-- Ensure staff data is properly migrated
-- Run this in Supabase SQL Editor to set up staff data

-- Insert staff record if it doesn't exist (using the data provided)
INSERT INTO public.staff (
    id,
    role_title,
    assigned_class,
    status,
    created_at
) VALUES (
    '95c672e5-cf1d-4fe3-b602-ce03ec8eb55f'::uuid,
    'Teacher Assistant',
    NULL,
    'ACTIVE',
    '2026-03-21 19:16:09.628402+00'::timestamptz
) ON CONFLICT (id) DO NOTHING;

-- Insert a few more test staff members for demonstration
-- These are additional staff members to populate the system

-- Insert additional staff profiles if they don't exist
INSERT INTO public.profiles (id, full_name, email, role, phone, created_at, updated_at)
VALUES
    (gen_random_uuid(), 'Maria Garcia', 'maria.garcia@childtrack.com', 'STAFF', '(555) 234-5678', now(), now()),
    (gen_random_uuid(), 'John Smith', 'john.smith@childtrack.com', 'STAFF', '(555) 345-6789', now(), now()),
    (gen_random_uuid(), 'Sarah Johnson', 'sarah.johnson@childtrack.com', 'STAFF', '(555) 456-7890', now(), now())
ON CONFLICT (email) DO NOTHING;

-- Insert corresponding staff records
INSERT INTO public.staff (id, role_title, status, created_at)
SELECT
    p.id,
    CASE
        WHEN p.email = 'maria.garcia@childtrack.com' THEN 'Lead Teacher'
        WHEN p.email = 'john.smith@childtrack.com' THEN 'Teacher'
        WHEN p.email = 'sarah.johnson@childtrack.com' THEN 'Assistant Teacher'
        ELSE 'Staff Member'
    END as role_title,
    'ACTIVE',
    now()
FROM public.profiles p
WHERE p.role = 'STAFF'
AND p.id NOT IN (SELECT id FROM public.staff)
AND p.email IN ('maria.garcia@childtrack.com', 'john.smith@childtrack.com', 'sarah.johnson@childtrack.com', 'mabuto@allbright.com');

-- Verify the setup
SELECT
    'Setup Complete' as status,
    (SELECT COUNT(*) FROM public.staff) as staff_count,
    (SELECT COUNT(*) FROM public.profiles WHERE role = 'STAFF') as staff_profiles_count;