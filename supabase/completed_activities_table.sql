-- Completed activities — tracks when a child has done a particular activity
-- Powers the "Today's adventure" card and the future progress timeline
-- Run once in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS completed_activities (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id      UUID         NOT NULL REFERENCES children(id)   ON DELETE CASCADE,
  activity_id   UUID         NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  completed_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS completed_activities_user_id_idx ON completed_activities(user_id);
CREATE INDEX IF NOT EXISTS completed_activities_child_id_idx ON completed_activities(child_id);
CREATE INDEX IF NOT EXISTS completed_activities_completed_at_idx ON completed_activities(completed_at DESC);

-- Row Level Security: users can only see and manage their own completions
ALTER TABLE completed_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own completions" ON completed_activities;
CREATE POLICY "Users can read own completions"
  ON completed_activities FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own completions" ON completed_activities;
CREATE POLICY "Users can insert own completions"
  ON completed_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own completions" ON completed_activities;
CREATE POLICY "Users can delete own completions"
  ON completed_activities FOR DELETE
  USING (auth.uid() = user_id);
