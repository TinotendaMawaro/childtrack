-- Migrate STAFF role user from profiles to staff table
-- Run this in Supabase SQL Editor

INSERT INTO public.staff (
    id,
    role_title,
    assigned_class,
    status,
    created_at
) VALUES (
    '95c672e5-cf1d-4fe3-b602-ce03ec8eb55f'::uuid,
    'Teacher Assistant',  -- Default role title for staff
    NULL,  -- assigned_class (can be set later)
    'ACTIVE',
    '2026-03-21 19:16:09.628402+00'::timestamptz
);

-- Verify the insertion
SELECT
    s.id,
    p.full_name,
    p.email,
    s.role_title,
    s.assigned_class,
    s.status,
    s.created_at
FROM public.staff s
JOIN public.profiles p ON s.id = p.id
WHERE s.id = '95c672e5-cf1d-4fe3-b602-ce03ec8eb55f'::uuid;