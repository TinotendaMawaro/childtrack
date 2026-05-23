-- Create test users in Supabase Auth (skip if exists)
-- Run this in Supabase SQL Editor

-- ADMIN (skip if exists)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
SELECT gen_random_uuid(), 'admin@allbright.com', crypt('money1', gen_salt('bf')), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@allbright.com');

-- PARENT (skip if exists)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
SELECT gen_random_uuid(), 'tmawaro25@gmail.com', crypt('money1', gen_salt('bf')), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tmawaro25@gmail.com');

-- DRIVER (skip if exists)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
SELECT gen_random_uuid(), 'driver@allbright.com', crypt('money1', gen_salt('bf')), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'driver@allbright.com');

-- STAFF (skip if exists)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
SELECT gen_random_uuid(), 'mabuto@allbright.com', crypt('money1', gen_salt('bf')), now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mabuto@allbright.com');

-- Update profiles with roles (or insert if not exists)
UPDATE profiles SET 
  role = CASE
    WHEN email = 'admin@allbright.com' THEN 'ADMIN'
    WHEN email = 'tmawaro25@gmail.com' THEN 'PARENT'
    WHEN email = 'driver@allbright.com' THEN 'DRIVER'
    WHEN email = 'mabuto@allbright.com' THEN 'STAFF'
  END,
  full_name = CASE
    WHEN email = 'admin@allbright.com' THEN 'System Admin'
    WHEN email = 'tmawaro25@gmail.com' THEN 'Parent User'
    WHEN email = 'driver@allbright.com' THEN 'Driver User'
    WHEN email = 'mabuto@allbright.com' THEN 'Staff User'
  END
WHERE email IN ('admin@allbright.com', 'tmawaro25@gmail.com', 'driver@allbright.com', 'mabuto@allbright.com');
