-- Messaging System Migration
-- Creates conversations, messages tables and storage for attachments

-- 0. Drop existing tables if they exist (to avoid schema conflicts)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;

-- 1. Ensure child_parent_links exists (linking children to parents)
CREATE TABLE IF NOT EXISTS child_parent_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  relation TEXT DEFAULT 'parent',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, parent_id)
);

-- 2. Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  last_message TEXT DEFAULT '',
  last_message_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(staff_id, parent_id, child_id)
);

-- 3. Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT DEFAULT '',
  audio_url TEXT,
  image_url TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 5. Drop old policies
DROP POLICY IF EXISTS "Staff can view own conversations" ON conversations;
DROP POLICY IF EXISTS "Staff can create conversations" ON conversations;
DROP POLICY IF EXISTS "Staff can update own conversations" ON conversations;
DROP POLICY IF EXISTS "Staff can view messages in own conversations" ON messages;
DROP POLICY IF EXISTS "Staff can send messages" ON messages;
DROP POLICY IF EXISTS "Parent can view own conversations" ON conversations;
DROP POLICY IF EXISTS "Parent can view messages in own conversations" ON messages;

-- 6. RLS Policies for conversations (Staff)
CREATE POLICY "Staff can view own conversations"
  ON conversations FOR SELECT
  USING (staff_id = auth.uid());

CREATE POLICY "Staff can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (
    staff_id = auth.uid()
    AND child_id IN (
      SELECT id FROM children
      WHERE class_id::TEXT IN (
        SELECT assigned_class::TEXT FROM staff WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Staff can update own conversations"
  ON conversations FOR UPDATE
  USING (staff_id = auth.uid());

-- 7. RLS Policies for conversations (Parent)
CREATE POLICY "Parent can view own conversations"
  ON conversations FOR SELECT
  USING (parent_id = auth.uid());

CREATE POLICY "Parent can update own conversations"
  ON conversations FOR UPDATE
  USING (parent_id = auth.uid());

-- 8. RLS Policies for messages
CREATE POLICY "Staff can view messages in own conversations"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE staff_id = auth.uid()
    )
  );

CREATE POLICY "Parent can view messages in own conversations"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Staff can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND conversation_id IN (
      SELECT id FROM conversations WHERE staff_id = auth.uid()
    )
  );

CREATE POLICY "Parent can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND conversation_id IN (
      SELECT id FROM conversations WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Staff can update own messages"
  ON messages FOR UPDATE
  USING (
    sender_id = auth.uid()
    AND conversation_id IN (
      SELECT id FROM conversations WHERE staff_id = auth.uid()
    )
  );

-- 9. Create storage bucket for message attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-attachments', 'message-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- 10. Storage policies
DROP POLICY IF EXISTS "Public can view message attachments" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload message attachments" ON storage.objects;

CREATE POLICY "Public can view message attachments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'message-attachments');

CREATE POLICY "Authenticated users can upload message attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'message-attachments'
    AND auth.uid() IS NOT NULL
    AND (LOWER(right(name, 4)) = '.jpg' OR LOWER(right(name, 4)) = '.png' OR LOWER(right(name, 4)) = '.m4a')
  );

-- 11. Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_staff ON conversations(staff_id);
CREATE INDEX IF NOT EXISTS idx_conversations_parent ON conversations(parent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_child ON conversations(child_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_unread ON messages(receiver_id, read) WHERE read = false;

-- 12. Trigger to update conversation's last_message_time
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET
    last_message = CASE
      WHEN NEW.message IS NOT NULL AND trim(both from NEW.message) != '' THEN NEW.message
      WHEN NEW.image_url IS NOT NULL THEN '📷 Photo'
      WHEN NEW.audio_url IS NOT NULL THEN '🎤 Voice message'
      ELSE ''
    END,
    last_message_time = NEW.created_at,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_conversation_timestamp ON messages;
CREATE TRIGGER trigger_update_conversation_timestamp
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();
