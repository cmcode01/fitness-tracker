-- ============================================================
-- FitLife — Migration v3
-- Run in Supabase SQL Editor AFTER migration_v2.sql
-- Changes: one profile per auth user (profiles are now 1:1 with accounts)
-- ============================================================

-- Keep only each user's default profile (drop extra ones if any exist)
DELETE FROM profiles
WHERE profile_id NOT IN (
  SELECT DISTINCT ON (user_id) profile_id
  FROM profiles
  ORDER BY user_id, is_default DESC, created_at ASC
);

-- Enforce one profile per user going forward
ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
