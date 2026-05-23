-- Insert profiles from existing auth.users
-- Run in Supabase SQL Editor

-- This creates profiles for all users in auth.users with default role PARENT
INSERT INTO profiles (id, email, role)
SELECT id, email, 'PARENT'
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles);

-- Update specific users with correct roles (replace with actual IDs)
-- First get IDs: select id, email from auth.users;
-- Then update:
-- UPDATE profiles SET role = 'ADMIN' WHERE email = 'admin@allbright.com';
-- UPDATE profiles SET role = 'STAFF' WHERE email = 'mabuto@allbright.com';
-- UPDATE profiles SET role = 'DRIVER' WHERE email = 'driver@allbright.com';
-- UPDATE profiles SET role = 'PARENT' WHERE email = 'tmawaro25@gmail.com';

-- Verify
SELECT email, role FROM profiles;
