-- Photo Management Schema for Parents
-- Run in Supabase SQL Editor

-- Albums table
CREATE TABLE public.albums (
  id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  parent_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  cover_photo_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Photos table
CREATE TABLE public.photos (
  id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  album_id uuid REFERENCES albums(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  child_id uuid REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  filename text NOT NULL,
  original_url text NOT NULL, -- Supabase Storage URL
  thumbnail_url text, -- Generated thumbnail
  description text,
  uploaded_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies (Admin full access, Parent own data only)
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Albums RLS
CREATE POLICY "Parents can manage own albums" ON public.albums
  FOR ALL USING (auth.uid() = parent_id)
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Admins can manage all albums" ON public.albums
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- Photos RLS
CREATE POLICY "Parents can manage own photos" ON public.photos
  FOR ALL USING (auth.uid() = parent_id)
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Admins can manage all photos" ON public.photos
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- Indexes
CREATE INDEX idx_albums_parent_id ON public.albums(parent_id);
CREATE INDEX idx_albums_child_id ON public.albums(child_id);
CREATE INDEX idx_photos_album_id ON public.photos(album_id);
CREATE INDEX idx_photos_parent_id ON public.photos(parent_id);
CREATE INDEX idx_photos_child_id ON public.photos(child_id);

-- Functions for thumbnails (optional - use Supabase Edge Functions)
-- Trigger for updated_at
CREATE OR REPLACE FUNCTION handle_album_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_albums_updated_at
  BEFORE UPDATE ON public.albums
  FOR EACH ROW EXECUTE FUNCTION handle_album_updated_at();

-- Sample data
INSERT INTO albums (parent_id, child_id, name, description) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Emma''s First Year', 'Photos from Emma''s first year at nursery'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'School Events', 'Special school events and activities');

-- Usage queries:
-- Parent's albums: SELECT * FROM albums WHERE parent_id = auth.uid()
-- Album photos: SELECT * FROM photos WHERE album_id = 'uuid'
-- Child photos: SELECT p.*, a.name FROM photos p JOIN albums a ON p.album_id = a.id WHERE p.child_id = 'uuid' AND a.parent_id = auth.uid()
