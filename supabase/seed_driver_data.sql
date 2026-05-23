/**
 * supabase/seed_driver_data.sql
 *
 * Full-stack relationship seed — run this in Supabase SQL Editor.
 *
 * Creates realistic data for the three roles:
 *   ADMIN  → Allbright Learners  (already in DB, just referenced)
 *   PARENT → Parent User        (already in DB, just extended)
 *   DRIVER → Driver User        (already in DB, just extended)
 *
 * ### What this script does
 * 1. Adds missing columns to profiles (license_number, license_class, years_experience)
 *    — idempotent: only added if they don't already exist
 * 2. Populates driver profile with licence / phone data
 * 3. Creates 5 transport routes  (driver → driver_id)
 * 4. Creates 8 children          (each parent_id → Parent User)
 * 5. Creates 8 child_transport   (each child → a route, driver_id → Driver User)
 * 6. Refreshes child_transport so RLS policies take effect
 *
 * ### Parent ↔ Admin relationship
 *   The parent's children are visible to:
 *     · the parent themselves (via parent_id = auth.uid())
 *     · all staff  (RLS: role IN ('ADMIN','STAFF'))
 *     · all admins (RLS: role = 'ADMIN')
 *     · the driver assigned to the child's route (via child_transport.driver_id)
 *
 *   No direct parent→admin link needed; access flows through child records.
 */

-- ── 1. Extend profiles if columns are missing ─────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='license_number') THEN
    ALTER TABLE public.profiles ADD COLUMN license_number TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='license_class') THEN
    ALTER TABLE public.profiles ADD COLUMN license_class TEXT DEFAULT 'Code B';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='years_experience') THEN
    ALTER TABLE public.profiles ADD COLUMN years_experience INT DEFAULT 0;
  END IF;
END $$;

-- ── 2. Driver user — complete profile ─────────────────────────────────────────
UPDATE public.profiles
SET
  license_number     = 'DL-2020-4512-ZW',
  license_class      = 'Code B',
  years_experience   = 5,
  phone              = '+263 77 234 5678',
  avatar_url         = 'https://lzkhjmtfvksxobxdjytb.supabase.co/storage/v1/object/public/pro_pic/driver-avatar.png'
WHERE id = '9fb245d5-a5e6-41b8-921e-c45dfde2559f'::uuid
  AND role = 'DRIVER';

-- ── 3. Transport routes ────────────────────────────────────────────────────────
INSERT INTO public.transport_routes
  (id, name, description, driver_id, vehicle, status, created_at)
VALUES
  ('a1b2c3d4-1111-1111-1111-111111111111', 'Morning Route A', 'Sandton to Allbright Learners via Oak Street',  '9fb245d5-a5e6-41b8-921e-c45dfde2559f'::uuid, 'Toyota Hiace 2019 (AB 12 CD)', 'scheduled', now()),
  ('a1b2c3d4-2222-2222-2222-222222222222', 'Morning Route B', 'Rosebank to Allbright Learners via Pine Street',  '9fb245d5-a5e6-41b8-921e-c45dfde2559f'::uuid, 'Toyota Hiace 2019 (AB 34 EF)', 'scheduled', now()),
  ('a1b2c3d4-3333-3333-3333-333333333333', 'Afternoon Route A', 'Allbright Learners to Sandton — drop-off',        '9fb245d5-a5e6-41b8-921e-c45dfde2559f'::uuid, 'Toyota Hiace 2019 (AB 56 GH)', 'scheduled', now()),
  ('a1b2c3d4-4444-4444-4444-444444444444', 'Afternoon Route B', 'Allbright Learners to Rosebank — drop-off',      '9fb245d5-a5e6-41b8-921e-c45dfde2559f'::uuid, 'Toyota Hiace 2019 (AB 78 IJ)', 'scheduled', now()),
  ('a1b2c3d4-5555-5555-5555-555555555555', 'Saturday Activity', 'Optional weekend trips — approved parents only', '9fb245d5-a5e6-41b8-921e-c45dfde2559f'::uuid, 'Minibus (KL 90 MN)',             'active',    now())
ON CONFLICT (id) DO NOTHING;

-- ── 4. Children  — all belong to parent "Parent User" ─────────────────────────
INSERT INTO public.children
  (id, full_name, dob, parent_id, class_id, photo_url, pickup_location, created_at)
VALUES
  ('c001-0001-0001-0001-000000000001', 'Emma Johnson',       '2019-03-15', '641abb74-f523-4da9-b847-3a8a3f41dbeb'::uuid, NULL,
   'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=150&h=150&fit=crop&crop=face',
   '-26.1076,28.0590', now()),
  ('c001-0001-0001-0001-000000000002', 'Noah Williams',       '2019-07-22', '641abb74-f523-4da9-b847-3a8a3f41dbeb'::uuid, NULL,
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
   '-26.1082,28.0610', now()),
  ('c001-0001-0001-0001-000000000003', 'Sofia Chen',          '2018-11-04', '641abb74-f523-4da9-b847-3a8a3f41dbeb'::uuid, NULL,
   'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
   '-26.1090,28.0570', now()),
  ('c001-0001-0001-0001-000000000004', 'Liam Okafor',         '2018-05-30', '641abb74-f523-4da9-b847-3a8a3f41dbeb'::uuid, NULL,
   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
   '-26.1065,28.0635', now()),
  ('c001-0001-0001-0001-000000000005', 'Ava Patel',           '2019-01-18', '641abb74-f523-4da9-b847-3a8a3f41dbeb'::uuid, NULL,
   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
   '-26.1110,28.0550', now()),
  ('c001-0001-0001-0001-000000000006', 'Lucas Nkosi',         '2019-09-12', '641abb74-f523-4da9-b847-3a8a3f41dbeb'::uuid, NULL,
   'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
   '-26.1085,28.0600', now()),
  ('c001-0001-0001-0001-000000000007', 'Mia Schreiber',       '2018-08-03', '641abb74-f523-4da9-b847-3a8a3f41dbeb'::uuid, NULL,
   'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
   '-26.1070,28.0580', now()),
  ('c001-0001-0001-0001-000000000008', 'James Moyo',          '2019-04-27', '641abb74-f523-4da9-b847-3a8a3f41dbeb'::uuid, NULL,
   'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
   '-26.1095,28.0620', now())
ON CONFLICT (id) DO NOTHING;

-- ── 5. child_transport — link each child to a route ──────────────────────────
INSERT INTO public.child_transport
  (id, child_id, route_id, driver_id, status, pickup_time, created_at)
VALUES
  ('ct-0001-0001-0001-000000000001', 'c001-0001-0001-0001-000000000001', 'a1b2c3d4-1111-1111-1111-111111111111', '9fb245d5-a5e6-41b8-921e-c45dfde2559f'::uuid, 'ONBOARD',    NULL, now()),
  ('ct-0001-0001-0001-000000000002', 'c001-0001-0001-0001-000000000002', 'a1b2c3d4-1111-1111-1111-111111111111', '9fb245d5-a5e6-41b8-921e-c45dfde2559f'::uuid, 'ONBOARD',    NULL, now()),
  ('ct-0001-0001-0001-000000000003', 'c001-0001-0001-0001-000000000003', 'a1b2c3d4-1111-1111-1111-111111111111', '9fb245d5-a5e6-41b8-921e-c45dfde2559f'::uuid, 'NOT_PICKED', NULL, now()),
  ('ct-0001-0001-0001-000000000004', 'c001-0001-0001-0001-000000000004', 'a1b2c3d4-2222-2222-2222-222222222222', '9fb245d5-a5e6-41b8-921e-c45dfde2559f'::uuid, 'ONBOARD',    NULL, now()),
  ('ct-0001-0001-0001-000000000005', 'c001-0001-0001-0001-000000000005', 'a1b2c3d4-2222-2222-2222-222222222222', '9fb245d5-a5e6-41b8-921e-c45dfde2559f'::uuid, 'NOT_PICKED', NULL, now()),
  ('ct-0001-0001-0001-000000000006', 'c001-0001-0001-0001-000000000006', 'a1b2c3d4-3333-3333-3333-333333333333', '9fb245d5-a5e6-41b8-921e-c45dfde2559f'::uuid, 'NOT_PICKED', NULL, now()),
  ('ct-0001-0001-0001-000000000007', 'c001-0001-0001-0001-000000000007', 'a1b2c3d4-3333-3333-3333-333333333333', '9fb245d5-a5e6-41b8-921e-c45dfde2559f'::uuid, 'NOT_PICKED', NULL, now()),
  ('ct-0001-0001-0001-000000000008', 'c001-0001-0001-0001-000000000008', 'a1b2c3d4-4444-4444-4444-444444444444', '9fb245d5-a5e6-41b8-921e-c45dfde2559f'::uuid, 'NOT_PICKED', NULL, now())
ON CONFLICT (id) DO NOTHING;

-- ── 6. Seed first GPS ping for active route so Live Route map has a starting point ──
INSERT INTO public.transport_tracking (driver_id, route_id, latitude, longitude, updated_at)
VALUES
  ('9fb245d5-a5e6-41b8-921e-c45dfde2559f'::uuid,
   'a1b2c3d4-1111-1111-1111-111111111111',
   -26.1076, 28.0590, now())
ON CONFLICT DO NOTHING;

-- ── 7. Summary ────────────────────────────────────────────────────────────────
SELECT
  'Parents'   AS entity, (SELECT COUNT(*) FROM public.profiles    WHERE role='PARENT')  AS count UNION ALL
  SELECT 'Drivers',   (SELECT COUNT(*) FROM public.profiles    WHERE role='DRIVER') UNION ALL
  SELECT 'Staff',     (SELECT COUNT(*) FROM public.profiles    WHERE role='STAFF') UNION ALL
  SELECT 'Children',  (SELECT COUNT(*) FROM public.children)                     UNION ALL
  SELECT 'Routes',    (SELECT COUNT(*) FROM public.transport_routes)              UNION ALL
  SELECT 'TransLinks',(SELECT COUNT(*) FROM public.child_transport);
