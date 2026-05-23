-- Add profile fields for full functionality
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- Add columns if not exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Verify columns added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('phone', 'bio', 'full_name', 'avatar_url');

-- RLS policy for users to update own profile (add if missing)
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Test with current user (replace with your user ID)
-- UPDATE profiles SET phone = '+1 (555) 123-4567', bio = 'School administrator' WHERE id = 'your-user-id-here';
