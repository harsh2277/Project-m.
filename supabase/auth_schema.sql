-- ProFlow Supabase Auth/Profile Schema
-- Run this in the Supabase SQL editor after enabling Email auth.
--
-- Supabase manages auth.users, passwords, email verification, and sessions.
-- This file creates only the public app tables needed by the current
-- signup, signin, profile, and settings screens.

create extension if not exists pgcrypto;

-- App-facing profile for each authenticated user.
-- Matches:
-- - Sign up form: first name, last name, email, terms accepted
-- - Profile page: avatar, full name, job title, bio
-- Email is copied from auth.users for convenient UI reads. Supabase auth.users
-- remains the source of truth for login email and password.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  full_name text,
  avatar_url text,
  job_title text,
  company_name text,
  bio text,
  terms_accepted_at timestamptz,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep this file reusable if an earlier version of the table already exists.
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists last_name text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists job_title text;
alter table public.profiles add column if not exists company_name text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists terms_accepted_at timestamptz;
alter table public.profiles add column if not exists onboarding_completed boolean not null default false;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

-- Per-user app preferences used by the Settings screen.
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  theme text not null default 'light' check (theme in ('light', 'dark')),
  email_notifications boolean not null default true,
  push_notifications boolean not null default false,
  two_factor_enabled boolean not null default false,
  timezone text not null default 'Asia/Kolkata',
  language text not null default 'en-US',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_settings add column if not exists theme text not null default 'light';
alter table public.user_settings add column if not exists email_notifications boolean not null default true;
alter table public.user_settings add column if not exists push_notifications boolean not null default false;
alter table public.user_settings add column if not exists two_factor_enabled boolean not null default false;
alter table public.user_settings add column if not exists timezone text not null default 'Asia/Kolkata';
alter table public.user_settings add column if not exists language text not null default 'en-US';
alter table public.user_settings add column if not exists created_at timestamptz not null default now();
alter table public.user_settings add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_settings_theme_check'
  ) then
    alter table public.user_settings
      add constraint user_settings_theme_check check (theme in ('light', 'dark'));
  end if;
end $$;

-- Shared updated_at trigger function.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists user_settings_set_updated_at on public.user_settings;
create trigger user_settings_set_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

-- Creates profile/settings rows automatically after signup.
-- Send this metadata from the frontend during signUp:
-- {
--   first_name: "John",
--   last_name: "Doe",
--   full_name: "John Doe",
--   terms_accepted: true
-- }
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  metadata_first_name text;
  metadata_last_name text;
  metadata_full_name text;
begin
  metadata_first_name := nullif(trim(coalesce(new.raw_user_meta_data->>'first_name', '')), '');
  metadata_last_name := nullif(trim(coalesce(new.raw_user_meta_data->>'last_name', '')), '');
  metadata_full_name := nullif(
    trim(
      coalesce(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        concat_ws(' ', metadata_first_name, metadata_last_name)
      )
    ),
    ''
  );

  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    full_name,
    avatar_url,
    job_title,
    company_name,
    bio,
    terms_accepted_at
  )
  values (
    new.id,
    new.email,
    metadata_first_name,
    metadata_last_name,
    metadata_full_name,
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'job_title',
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'bio',
    case
      when coalesce(new.raw_user_meta_data->>'terms_accepted', 'false') = 'true'
      then now()
      else null
    end
  )
  on conflict (id) do update
  set
    email = excluded.email,
    first_name = coalesce(public.profiles.first_name, excluded.first_name),
    last_name = coalesce(public.profiles.last_name, excluded.last_name),
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
    job_title = coalesce(public.profiles.job_title, excluded.job_title),
    company_name = coalesce(public.profiles.company_name, excluded.company_name),
    bio = coalesce(public.profiles.bio, excluded.bio),
    terms_accepted_at = coalesce(public.profiles.terms_accepted_at, excluded.terms_accepted_at);

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Optional helper for email changes made inside Supabase auth.
create or replace function public.handle_user_email_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set email = new.email
  where id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
after update of email on auth.users
for each row
when (old.email is distinct from new.email)
execute function public.handle_user_email_update();

-- Enable row level security.
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;

-- Profiles policies: users can read/update/insert only their own profile.
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- Settings policies: users can read/update/insert only their own settings.
drop policy if exists "Users can read own settings" on public.user_settings;
create policy "Users can read own settings"
on public.user_settings
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own settings" on public.user_settings;
create policy "Users can insert own settings"
on public.user_settings
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own settings" on public.user_settings;
create policy "Users can update own settings"
on public.user_settings
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- Helpful indexes for profile/settings reads.
create index if not exists profiles_email_idx on public.profiles(email);
create index if not exists profiles_created_at_idx on public.profiles(created_at desc);
create index if not exists user_settings_created_at_idx on public.user_settings(created_at desc);
