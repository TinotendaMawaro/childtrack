-- Complete Supabase Migration Script
-- Run in Supabase SQL Editor: https://lzkhjmtfvksxobxdjytb.supabase.co/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 🔷 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT CHECK (role IN ('ADMIN', 'STAFF', 'DRIVER', 'PARENT')) NOT NULL DEFAULT 'PARENT',
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 🔷 2. CHILDREN TABLE
CREATE TABLE IF NOT EXISTS public.children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  dob DATE,
  parent_id UUID REFERENCES profiles(id),
  class_id UUID,
  photo_url TEXT,
  pickup_location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 🔷 3. CLASSES TABLE
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  age_group TEXT,
  teacher_id UUID,
  capacity INT DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 🔷 4. STAFF TABLE
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  role_title TEXT,
  assigned_class UUID,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 🔷 5. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  class_id UUID,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED')) NOT NULL,
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 🔷 6. DAILY DIARY TABLE
CREATE TABLE IF NOT EXISTS public.daily_diary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  meals TEXT,
  naps TEXT,
  activities TEXT,
  mood TEXT,
  photos TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 🔷 7. TRANSPORT ROUTES
CREATE TABLE IF NOT EXISTS public.transport_routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  driver_id UUID REFERENCES profiles(id),
  vehicle TEXT,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 🔷 8. TRANSPORT TRACKING
CREATE TABLE IF NOT EXISTS public.transport_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  route_id UUID REFERENCES transport_routes(id) ON DELETE CASCADE,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 🔷 9. CHILD TRANSPORT STATUS
CREATE TABLE IF NOT EXISTS public.child_transport (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  route_id UUID REFERENCES transport_routes(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES profiles(id),
  status TEXT CHECK (status IN ('NOT_PICKED', 'ONBOARD', 'DROPPED')) DEFAULT 'NOT_PICKED',
  pickup_time TIMESTAMP WITH TIME ZONE,
  dropoff_time TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 🔷 10. MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 🔷 11. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES profiles(id),
  child_id UUID REFERENCES children(id),
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED')) DEFAULT 'PENDING',
  due_date DATE,
  paid_date DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 🔷 12. RECRUITMENT
CREATE TABLE IF NOT EXISTS public.recruitment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT NOT NULL,
  cv_url TEXT,
  status TEXT CHECK (status IN ('PENDING', 'REVIEWING', 'INTERVIEWED', 'REJECTED', 'HIRED')) DEFAULT 'PENDING',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 🔐 ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_diary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_transport ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment ENABLE ROW LEVEL SECURITY;

-- 🛡️ SECURITY POLICIES

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Admin full access" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Children
CREATE POLICY "Parents can view their children" ON children FOR SELECT USING (parent_id = auth.uid());
CREATE POLICY "Staff can view children" ON children FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF'))
);
CREATE POLICY "Parents can manage their children" ON children FOR ALL USING (parent_id = auth.uid());

-- Staff
CREATE POLICY "Staff can manage staff" ON staff FOR ALL USING (
  id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Classes
CREATE POLICY "Anyone can view classes" ON classes FOR SELECT USING (true);
CREATE POLICY "Admin can manage classes" ON classes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Attendance
CREATE POLICY "Attendance view" ON attendance FOR SELECT USING (
  recorded_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF'))
);
CREATE POLICY "Attendance insert" ON attendance FOR INSERT WITH CHECK (
  recorded_by = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF'))
);

-- Daily Diary
CREATE POLICY "Diary view" ON daily_diary FOR SELECT USING (
  EXISTS (SELECT 1 FROM children WHERE id = child_id AND parent_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF'))
);
CREATE POLICY "Diary insert" ON daily_diary FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF'))
);

-- Transport Routes
CREATE POLICY "Routes view" ON transport_routes FOR SELECT USING (true);
CREATE POLICY "Routes manage" ON transport_routes FOR ALL USING (
  driver_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF'))
);

-- Transport Tracking
CREATE POLICY "Tracking view" ON transport_tracking FOR SELECT USING (
  driver_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF', 'PARENT'))
);
CREATE POLICY "Tracking update" ON transport_tracking FOR UPDATE USING (
  driver_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Child Transport
CREATE POLICY "Child transport view" ON child_transport FOR SELECT USING (
  EXISTS (SELECT 1 FROM children WHERE id = child_id AND parent_id = auth.uid()) OR
  driver_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF'))
);
CREATE POLICY "Child transport update" ON child_transport FOR ALL USING (
  driver_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF'))
);

-- Messages
CREATE POLICY "Messages view" ON messages FOR SELECT USING (
  sender_id = auth.uid() OR receiver_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);
CREATE POLICY "Messages insert" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Payments
CREATE POLICY "Payments view" ON payments FOR SELECT USING (
  parent_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF'))
);
CREATE POLICY "Payments manage" ON payments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'STAFF'))
);

-- Recruitment
CREATE POLICY "Recruitment view" ON recruitment FOR SELECT USING (true);
CREATE POLICY "Recruitment manage" ON recruitment FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- 🔄 AUTO CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION create_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (new.id, new.email, 'PARENT');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE create_profile();

-- ✅ CREATE TEST USERS (Run these AFTER tables are created)

-- ADMIN
insert into auth.users (id, email, encrypted_password, email_confirmed_at)
values (
  gen_random_uuid(),
  'admin@allbright.com',
  crypt('money1', gen_salt('bf')),
  now()
);

-- PARENT
insert into auth.users (id, email, encrypted_password, email_confirmed_at)
values (
  gen_random_uuid(),
  'tmawaro25@gmail.com',
  crypt('money1', gen_salt('bf')),
  now()
);

-- DRIVER
insert into auth.users (id, email, encrypted_password, email_confirmed_at)
values (
  gen_random_uuid(),
  'driver@allbright.com',
  crypt('money1', gen_salt('bf')),
  now()
);

-- STAFF
insert into auth.users (id, email, encrypted_password, email_confirmed_at)
values (
  gen_random_uuid(),
  'mabuto@allbright.com',
  crypt('money1', gen_salt('bf')),
  now()
);

-- 🔗 LINK USERS TO PROFILES
insert into profiles (id, email, full_name, role)
select id, email,
case
  when email = 'admin@allbright.com' then 'System Admin'
  when email = 'tmawaro25@gmail.com' then 'Parent User'
  when email = 'driver@allbright.com' then 'Driver User'
  when email = 'mabuto@allbright.com' then 'Staff User'
end,
case
  when email = 'admin@allbright.com' then 'ADMIN'
  when email = 'tmawaro25@gmail.com' then 'PARENT'
  when email = 'driver@allbright.com' then 'DRIVER'
  when email = 'mabuto@allbright.com' then 'STAFF'
end
from auth.users
where email in (
  'admin@allbright.com',
  'tmawaro25@gmail.com',
  'driver@allbright.com',
  'mabuto@allbright.com'
);

-- ⚠️ IMPORTANT: Force password reset later - users should not keep 'money1' as password

-- Add indexes for performance
create index if not exists idx_profiles_id on profiles(id);
create index if not exists idx_children_parent_id on children(parent_id);
create index if not exists idx_attendance_child_id on attendance(child_id);
