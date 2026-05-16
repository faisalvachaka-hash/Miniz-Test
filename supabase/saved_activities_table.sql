-- Saved activities — tracks which curated activities a user has saved to their library
-- Run once in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS saved_activities (
  user_id      UUID         NOT NULL REFERENCES auth.users(id)  ON DELETE CASCADE,
  activity_id  UUID         NOT NULL REFERENCES activities(id)  ON DELETE CASCADE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, activity_id)
);

CREATE INDEX IF NOT EXISTS saved_activities_user_id_idx ON saved_activities(user_id);

-- Row Level Security: users can only see and manage their own saves
ALTER TABLE saved_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own saves" ON saved_activities;
CREATE POLICY "Users can read own saves"
  ON saved_activities FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own saves" ON saved_activities;
CREATE POLICY "Users can insert own saves"
  ON saved_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own saves" ON saved_activities;
CREATE POLICY "Users can delete own saves"
  ON saved_activities FOR DELETE
  USING (auth.uid() = user_id);
