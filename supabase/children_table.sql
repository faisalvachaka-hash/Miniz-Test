-- Children table — stores child profiles linked to user accounts
-- Run once in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS children (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT         NOT NULL,
  age         SMALLINT     NOT NULL CHECK (age >= 0 AND age <= 5),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS children_user_id_idx ON children(user_id);

-- Row Level Security: users can only see and manage their own children
ALTER TABLE children ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own children" ON children;
CREATE POLICY "Users can read own children"
  ON children FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own children" ON children;
CREATE POLICY "Users can insert own children"
  ON children FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own children" ON children;
CREATE POLICY "Users can update own children"
  ON children FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own children" ON children;
CREATE POLICY "Users can delete own children"
  ON children FOR DELETE
  USING (auth.uid() = user_id);
