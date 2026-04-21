-- ============================================================
-- Migration: Remove full_name, ensure profile columns match app
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Drop full_name column (no longer used by the app)
ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS full_name;

-- 2. Ensure all required columns exist (safe to run multiple times)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_title text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- 3. Update the handle_new_user trigger to NOT reference full_name anymore
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  metadata_first_name text;
  metadata_last_name  text;
BEGIN
  metadata_first_name := nullif(trim(coalesce(new.raw_user_meta_data->>'first_name', '')), '');
  metadata_last_name  := nullif(trim(coalesce(new.raw_user_meta_data->>'last_name',  '')), '');

  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    avatar_url,
    job_title,
    company_name,
    bio,
    terms_accepted_at
  )
  VALUES (
    new.id,
    new.email,
    metadata_first_name,
    metadata_last_name,
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'job_title',
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'bio',
    CASE
      WHEN coalesce(new.raw_user_meta_data->>'terms_accepted', 'false') = 'true'
      THEN now()
      ELSE null
    END
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email        = excluded.email,
    first_name   = coalesce(public.profiles.first_name, excluded.first_name),
    last_name    = coalesce(public.profiles.last_name,  excluded.last_name),
    avatar_url   = coalesce(public.profiles.avatar_url, excluded.avatar_url),
    job_title    = coalesce(public.profiles.job_title,  excluded.job_title),
    company_name = coalesce(public.profiles.company_name, excluded.company_name),
    bio          = coalesce(public.profiles.bio,         excluded.bio),
    terms_accepted_at = coalesce(public.profiles.terms_accepted_at, excluded.terms_accepted_at);

  INSERT INTO public.user_settings (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$;

-- Verify the columns are correct after migration:
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'profiles'
-- ORDER BY ordinal_position;
