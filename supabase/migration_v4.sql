-- ============================================================
-- FitLife — Migration v4
-- Run in Supabase SQL Editor AFTER migration_v3.sql
-- Changes: adds fitness_goal and activity_level to profiles
-- ============================================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS fitness_goal    TEXT DEFAULT 'weight_loss';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS activity_level  TEXT DEFAULT 'moderately_active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS health_concerns TEXT DEFAULT '';
