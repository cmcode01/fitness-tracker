-- ============================================================
-- FitLife — Migration v2
-- Run this in your Supabase project's SQL Editor AFTER the original schema.sql
-- ============================================================

-- ── 1. Profiles table ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  profile_id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name                  TEXT NOT NULL DEFAULT 'Me',
  avatar_emoji          TEXT DEFAULT '🏃',
  age                   INT,
  height_inches         NUMERIC,
  start_weight          NUMERIC,
  goal_weight           NUMERIC,
  dietary_restrictions  JSONB DEFAULT '[]',
  start_date            TEXT,
  current_phase         INT DEFAULT 1,
  is_default            BOOLEAN DEFAULT false,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_profiles" ON profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Migrate existing user_settings into default profiles
INSERT INTO profiles (user_id, name, avatar_emoji, start_date, current_phase, is_default)
SELECT user_id, 'Me', '🏃', start_date, current_phase, true
FROM user_settings
ON CONFLICT DO NOTHING;

-- Create a default profile for users who have no user_settings
INSERT INTO profiles (user_id, name, avatar_emoji, is_default)
SELECT id, 'Me', '🏃', true
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM profiles)
ON CONFLICT DO NOTHING;

-- ── 2. Add profile_id to existing data tables ────────────────────────────────
ALTER TABLE weight_logs        ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES profiles(profile_id);
ALTER TABLE measurement_logs   ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES profiles(profile_id);
ALTER TABLE workout_logs       ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES profiles(profile_id);
ALTER TABLE nutrition_logs     ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES profiles(profile_id);
ALTER TABLE meal_feedback      ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES profiles(profile_id);

-- Backfill profile_id using each user's default profile
UPDATE weight_logs SET profile_id = (
  SELECT profile_id FROM profiles WHERE profiles.user_id = weight_logs.user_id AND is_default = true LIMIT 1
) WHERE profile_id IS NULL;

UPDATE measurement_logs SET profile_id = (
  SELECT profile_id FROM profiles WHERE profiles.user_id = measurement_logs.user_id AND is_default = true LIMIT 1
) WHERE profile_id IS NULL;

UPDATE workout_logs SET profile_id = (
  SELECT profile_id FROM profiles WHERE profiles.user_id = workout_logs.user_id AND is_default = true LIMIT 1
) WHERE profile_id IS NULL;

UPDATE nutrition_logs SET profile_id = (
  SELECT profile_id FROM profiles WHERE profiles.user_id = nutrition_logs.user_id AND is_default = true LIMIT 1
) WHERE profile_id IS NULL;

UPDATE meal_feedback SET profile_id = (
  SELECT profile_id FROM profiles WHERE profiles.user_id = meal_feedback.user_id AND is_default = true LIMIT 1
) WHERE profile_id IS NULL;

-- Update UNIQUE constraint on nutrition_logs to be profile-scoped
ALTER TABLE nutrition_logs DROP CONSTRAINT IF EXISTS nutrition_logs_user_id_date_key;
ALTER TABLE nutrition_logs ADD CONSTRAINT nutrition_logs_profile_id_date_key UNIQUE (profile_id, date);

-- ── 3. Oura connection table ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS oura_connections (
  user_id                UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  personal_access_token  TEXT NOT NULL,
  last_synced_at         TIMESTAMPTZ,
  created_at             TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE oura_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_oura_connections" ON oura_connections
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── 4. Health data logs ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS health_data_logs (
  id                    TEXT PRIMARY KEY,
  profile_id            UUID REFERENCES profiles(profile_id) ON DELETE CASCADE NOT NULL,
  user_id               UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date                  TEXT NOT NULL,
  sleep_score           INT,
  readiness_score       INT,
  activity_score        INT,
  hrv_avg               NUMERIC,
  sleep_duration_hours  NUMERIC,
  calories_burned       INT,
  steps                 INT,
  oura_synced           BOOLEAN DEFAULT false,
  notes                 TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (profile_id, date)
);
ALTER TABLE health_data_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_health_data_logs" ON health_data_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
