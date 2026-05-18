-- ============================================================
-- FitLife — Supabase Schema
-- Run this in your Supabase project's SQL Editor (supabase.com → SQL Editor)
-- ============================================================

-- weight_logs
CREATE TABLE IF NOT EXISTS weight_logs (
  id          TEXT PRIMARY KEY,
  user_id     UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date        TEXT NOT NULL,
  weight      NUMERIC NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_weight_logs" ON weight_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- measurement_logs
CREATE TABLE IF NOT EXISTS measurement_logs (
  id           TEXT PRIMARY KEY,
  user_id      UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date         TEXT NOT NULL,
  chest        NUMERIC,
  waist        NUMERIC,
  hips         NUMERIC,
  right_arm    NUMERIC,
  left_arm     NUMERIC,
  right_thigh  NUMERIC,
  left_thigh   NUMERIC,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE measurement_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_measurement_logs" ON measurement_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- workout_logs
CREATE TABLE IF NOT EXISTS workout_logs (
  id                   TEXT PRIMARY KEY,
  user_id              UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date                 TEXT NOT NULL,
  workout_name         TEXT NOT NULL,
  phase                INT NOT NULL,
  duration             INT NOT NULL,
  completed_exercises  JSONB DEFAULT '[]',
  mood                 TEXT,
  notes                TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_workout_logs" ON workout_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- nutrition_logs  (one row per user per date)
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id               TEXT PRIMARY KEY,
  user_id          UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date             TEXT NOT NULL,
  meals            JSONB DEFAULT '[]',
  water_intake     INT DEFAULT 0,
  total_calories   INT DEFAULT 0,
  total_protein    INT DEFAULT 0,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, date)
);
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_nutrition_logs" ON nutrition_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- meal_feedback
CREATE TABLE IF NOT EXISTS meal_feedback (
  meal_id     TEXT NOT NULL,
  user_id     UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  reaction    TEXT,
  rating      INT DEFAULT 0,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (meal_id, user_id)
);
ALTER TABLE meal_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_meal_feedback" ON meal_feedback
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- user_settings  (one row per user)
CREATE TABLE IF NOT EXISTS user_settings (
  user_id        UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  start_date     TEXT,
  current_phase  INT DEFAULT 1,
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_user_settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
