-- Check and fix user profiles
-- Run in Supabase SQL Editor

-- View all users in auth.users
select id, email from auth.users;

-- View all profiles
select id, email, role from profiles;

-- If no profiles exist, check trigger
-- View the trigger
select trigger_name, action_statement from information_schema.triggers 
where event_object_table = 'users' AND event_manipulation = 'INSERT';

-- Manual insert if trigger not working
-- First get the user ID from auth.users
-- Then insert into profiles:
-- INSERT INTO profiles (id, email, role) VALUES ('USER_ID_HERE', 'email@domain.com', 'ADMIN');
