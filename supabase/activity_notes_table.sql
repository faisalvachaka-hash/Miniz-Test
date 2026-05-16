-- Activity notes — private memory journal entries per (child, activity)
-- Run once in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS activity_notes (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id     UUID         NOT NULL REFERENCES children(id)   ON DELETE CASCADE,
  activity_id  UUID         NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  body         TEXT         NOT NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS activity_notes_user_id_idx ON activity_notes(user_id);
CREATE INDEX IF NOT EXISTS activity_notes_child_activity_idx
  ON activity_notes(child_id, activity_id, created_at DESC);

-- Row Level Security: users can only see and manage their own notes
ALTER TABLE activity_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own notes" ON activity_notes;
CREATE POLICY "Users can read own notes"
  ON activity_notes FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own notes" ON activity_notes;
CREATE POLICY "Users can insert own notes"
  ON activity_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notes" ON activity_notes;
CREATE POLICY "Users can update own notes"
  ON activity_notes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own notes" ON activity_notes;
CREATE POLICY "Users can delete own notes"
  ON activity_notes FOR DELETE
  USING (auth.uid() = user_id);
