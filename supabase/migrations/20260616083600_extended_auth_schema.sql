-- Migration: 20260616083600_extended_auth_schema.sql
-- Purpose: Extend auth layer with role management, sessions, and audit trail

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── EXTENDED AUTH USER METADATA ──────────────────────────────────────────────
-- Stores extended profile data linked to auth.users
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'PARENT' CHECK (role IN ('ADMIN', 'STAFF', 'DRIVER', 'PARENT')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'PENDING')),
  email_verified BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ── ROLE PERMISSIONS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'STAFF', 'DRIVER', 'PARENT')),
  permission TEXT NOT NULL,
  resource TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(role, permission, resource)
);

-- ── AUTH SESSIONS / TOKENS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.auth_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_token ON auth_sessions(token);

-- ── AUTH AUDIT LOG ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.auth_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_auth_audit_user_id ON auth_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_audit_created_at ON auth_audit_log(created_at);

-- ── PASSWORD RESET TOKENS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ── ORGANIZATION / SCHOOL SETTINGS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.organization (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT 'ChildTrack School',
  email TEXT,
  phone TEXT,
  address TEXT,
  logo_url TEXT,
  timezone TEXT DEFAULT 'Africa/Johannesburg',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default organization if none exists
INSERT INTO public.organization (name, email, phone)
SELECT 'ChildTrack School', 'info@allbright.com', '+27777141047'
WHERE NOT EXISTS (SELECT 1 FROM public.organization);

-- ── ENABLE ROW LEVEL SECURITY ────────────────────────────────────────────────
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization ENABLE ROW LEVEL SECURITY;

-- ── SECURITY POLICIES: user_profiles ─────────────────────────────────────────
CREATE POLICY "Users view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin manage all profiles" ON user_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- ── SECURITY POLICIES: role_permissions ──────────────────────────────────────
CREATE POLICY "Anyone can view permissions" ON role_permissions FOR SELECT USING (true);
CREATE POLICY "Admin manage permissions" ON role_permissions FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- ── SECURITY POLICIES: auth_sessions ─────────────────────────────────────────
CREATE POLICY "Users view own sessions" ON auth_sessions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admin view all sessions" ON auth_sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- ── SECURITY POLICIES: auth_audit_log ────────────────────────────────────────
CREATE POLICY "Users view own audit log" ON auth_audit_log FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admin view all audit logs" ON auth_audit_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- ── SECURITY POLICIES: organization ──────────────────────────────────────────
CREATE POLICY "Anyone can view organization" ON organization FOR SELECT USING (true);
CREATE POLICY "Admin update organization" ON organization FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'ADMIN')
);

-- ── SEED DEFAULT ROLE PERMISSIONS ────────────────────────────────────────────
-- Pre-check: only insert if the table/column shape exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'role_permissions'
      AND column_name  = 'permission'
  ) THEN
    INSERT INTO public.role_permissions (role, permission, resource) VALUES
    ('ADMIN', 'read',   'all'),
    ('ADMIN', 'write',  'all'),
    ('ADMIN', 'delete', 'all'),
    ('ADMIN', 'manage', 'users'),
    ('STAFF', 'read',   'children'),
    ('STAFF', 'write',  'attendance'),
    ('STAFF', 'read',   'finance'),
    ('STAFF', 'read',   'classes'),
    ('STAFF', 'read',   'transport'),
    ('DRIVER', 'read',  'routes'),
    ('DRIVER', 'update','transport_tracking'),
    ('DRIVER', 'read',  'child_transport'),
    ('PARENT', 'read',  'children'),
    ('PARENT', 'read',  'messages'),
    ('PARENT', 'read',  'payments')
    ON CONFLICT (role, permission, resource) DO NOTHING;
  END IF;
END $$;

-- ── SEED TEST USERS (idempotent) ────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@allbright.com') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
    VALUES (gen_random_uuid(), 'admin@allbright.com', crypt('money1', gen_salt('bf')), now());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'tmawaro25@gmail.com') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
    VALUES (gen_random_uuid(), 'tmawaro25@gmail.com', crypt('money1', gen_salt('bf')), now());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'driver@allbright.com') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
    VALUES (gen_random_uuid(), 'driver@allbright.com', crypt('money1', gen_salt('bf')), now());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'mabuto@allbright.com') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
    VALUES (gen_random_uuid(), 'mabuto@allbright.com', crypt('money1', gen_salt('bf')), now());
  END IF;
END $$;

-- ── LINK USERS TO PROFILES ─────────────────────────────────────────────────────
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email,
  CASE email
    WHEN 'admin@allbright.com' THEN 'System Admin'
    WHEN 'tmawaro25@gmail.com' THEN 'Parent User'
    WHEN 'driver@allbright.com' THEN 'Driver User'
    WHEN 'mabuto@allbright.com' THEN 'Staff User'
  END,
  CASE email
    WHEN 'admin@allbright.com' THEN 'ADMIN'
    WHEN 'tmawaro25@gmail.com' THEN 'PARENT'
    WHEN 'driver@allbright.com' THEN 'DRIVER'
    WHEN 'mabuto@allbright.com' THEN 'STAFF'
  END
FROM auth.users
WHERE email IN (
  'admin@allbright.com',
  'tmawaro25@gmail.com',
  'driver@allbright.com',
  'mabuto@allbright.com'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role      = EXCLUDED.role;

-- ── ROLE UPDATES BY EMAIL ──────────────────────────────────────────────────────
UPDATE profiles SET role = 'ADMIN'   WHERE email = 'admin@allbright.com';
UPDATE profiles SET role = 'PARENT'  WHERE email = 'tmawaro25@gmail.com';
UPDATE profiles SET role = 'DRIVER'  WHERE email = 'driver@allbright.com';
UPDATE profiles SET role = 'STAFF'   WHERE email = 'mabuto@allbright.com';

-- ⚠️ Users must reset 'money1' after first login
