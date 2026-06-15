-- Run in Supabase SQL Editor. Adjust RLS for your security model.

create extension if not exists "pgcrypto";

-- Site-wide stats (single row)
create table if not exists public.site_statistics (
  id int primary key default 1,
  total_students int not null default 120,
  updated_at timestamptz default now(),
  constraint site_statistics_single_row check (id = 1)
);

insert into public.site_statistics (id, total_students)
values (1, 120)
on conflict (id) do nothing;

-- Testimonials
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  content text not null,
  role text,
  status text not null default 'pending',
  created_at timestamptz default now(),
  constraint testimonials_status check (status in ('pending', 'approved', 'rejected'))
);

-- Blogs
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  slug text not null unique,
  excerpt text,
  body text,
  cover_url text,
  file_url text,
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Existing DBs: add cover_url if table predates this column
alter table public.blogs add column if not exists cover_url text;

-- Resources
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  file_url text,
  files jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  constraint resources_subject check (
    subject in ('English', 'Sociology', 'General')
  )
);

-- Existing DBs: add multi-file support
alter table public.resources add column if not exists files jsonb not null default '[]'::jsonb;
-- Backfill the new files array from any legacy single file_url
update public.resources
set files = jsonb_build_array(jsonb_build_object('name', name, 'url', file_url))
where (files is null or files = '[]'::jsonb) and file_url is not null;
-- file_url is now optional (kept populated with the first file for back-compat)
alter table public.resources alter column file_url drop not null;

-- Notice board announcements
create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- Demo / enrolment leads (moderated via status)
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  message text,
  source text default 'demo_session',
  subject text,
  status text not null default 'pending',
  created_at timestamptz default now(),
  constraint enrollments_status check (
    status in ('pending', 'approved', 'rejected')
  )
);

-- Existing DBs: add status + constraint if table predates this column
alter table public.enrollments add column if not exists status text default 'pending';
update public.enrollments
set status = 'pending'
where status is null or trim(status) = '';
alter table public.enrollments alter column status set default 'pending';
alter table public.enrollments alter column status set not null;
alter table public.enrollments drop constraint if exists enrollments_status;
alter table public.enrollments add constraint enrollments_status check (
  status in ('pending', 'approved', 'rejected')
);

-- RLS
alter table public.site_statistics enable row level security;
alter table public.testimonials enable row level security;
alter table public.blogs enable row level security;
alter table public.resources enable row level security;
alter table public.notices enable row level security;
alter table public.enrollments enable row level security;

-- Public reads
drop policy if exists "stats_select_public" on public.site_statistics;
create policy "stats_select_public" on public.site_statistics for select using (true);

drop policy if exists "testimonials_select_approved" on public.testimonials;
create policy "testimonials_select_approved" on public.testimonials
  for select using (status = 'approved');

drop policy if exists "testimonials_insert_public" on public.testimonials;
create policy "testimonials_insert_public" on public.testimonials
  for insert
  to anon
  with check (status = 'pending');

drop policy if exists "blogs_select_public" on public.blogs;
create policy "blogs_select_public" on public.blogs for select using (true);

drop policy if exists "resources_select_public" on public.resources;
create policy "resources_select_public" on public.resources for select using (true);

drop policy if exists "notices_select_active" on public.notices;
create policy "notices_select_active" on public.notices
  for select using (is_active = true);

drop policy if exists "enrollments_insert_public" on public.enrollments;
create policy "enrollments_insert_public" on public.enrollments
  for insert
  with check (status = 'pending');

-- Authenticated admin (full access)
drop policy if exists "stats_admin_all" on public.site_statistics;
create policy "stats_admin_all" on public.site_statistics for all to authenticated using (true) with check (true);

drop policy if exists "testimonials_admin_all" on public.testimonials;
create policy "testimonials_admin_all" on public.testimonials for all to authenticated using (true) with check (true);

drop policy if exists "blogs_admin_all" on public.blogs;
create policy "blogs_admin_all" on public.blogs for all to authenticated using (true) with check (true);

drop policy if exists "resources_admin_all" on public.resources;
create policy "resources_admin_all" on public.resources for all to authenticated using (true) with check (true);

drop policy if exists "notices_admin_all" on public.notices;
create policy "notices_admin_all" on public.notices for all to authenticated using (true) with check (true);

drop policy if exists "enrollments_admin_select" on public.enrollments;
drop policy if exists "enrollments_admin_all" on public.enrollments;
create policy "enrollments_admin_all" on public.enrollments
  for all to authenticated
  using (true)
  with check (true);

-- Storage buckets (public read for simplicity; tighten for production)
insert into storage.buckets (id, name, public)
values ('resources-bucket', 'resources-bucket', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('blogs-bucket', 'blogs-bucket', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('testimonials-images', 'testimonials-images', true)
on conflict (id) do nothing;

-- Storage policies: public read
drop policy if exists "resources_public_read" on storage.objects;
create policy "resources_public_read" on storage.objects for select using (bucket_id = 'resources-bucket');

drop policy if exists "blogs_public_read" on storage.objects;
create policy "blogs_public_read" on storage.objects for select using (bucket_id = 'blogs-bucket');

drop policy if exists "testimonials_img_public_read" on storage.objects;
create policy "testimonials_img_public_read" on storage.objects for select using (bucket_id = 'testimonials-images');

-- Authenticated upload
drop policy if exists "resources_auth_upload" on storage.objects;
create policy "resources_auth_upload" on storage.objects for insert to authenticated with check (bucket_id = 'resources-bucket');

drop policy if exists "blogs_auth_upload" on storage.objects;
create policy "blogs_auth_upload" on storage.objects for insert to authenticated with check (bucket_id = 'blogs-bucket');

drop policy if exists "testimonials_auth_upload" on storage.objects;
create policy "testimonials_auth_upload" on storage.objects for insert to authenticated with check (bucket_id = 'testimonials-images');

-- Optional seed for testing testimonial moderation (uncomment to run):
-- insert into public.testimonials (name, content, role, status)
-- values ('Sample Parent', 'Wonderful experience with the academy.', 'Parent', 'pending');


-- ════════════════════════════════════════════════════════════════════════
-- SECURITY HARDENING — admin allowlist (run this whole section)
-- ════════════════════════════════════════════════════════════════════════
-- Problem: the policies above granted full access to ANY authenticated user.
-- If Supabase sign-ups are enabled (the default), a stranger could register
-- with the public anon key and gain admin access to all data, including
-- enrollment PII. This section restricts admin access to an explicit allowlist.
--
-- ALSO REQUIRED (dashboard, cannot be done in SQL):
--   Supabase → Authentication → Providers/Sign In → DISABLE "Allow new users
--   to sign up". Create admin users via the Supabase dashboard only.
-- ────────────────────────────────────────────────────────────────────────

-- 1) Allowlist table: which auth users are admins.
create table if not exists public.admins (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz default now()
);
alter table public.admins enable row level security;

-- 2) Seed it with your CURRENT users so you are not locked out.
--    On a fresh project this is just you. Verify afterwards:
--      select id from public.admins;   -- should list only trusted admins
insert into public.admins (id)
select id from auth.users
on conflict (id) do nothing;

-- 3) Helper: is the current request an allowlisted admin?
--    SECURITY DEFINER so it can read public.admins regardless of RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a where a.id = auth.uid()
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- 4) Re-create every admin policy to require is_admin() instead of any
--    authenticated user. (Recreated by name, so this overrides the versions
--    defined earlier in this file.)
drop policy if exists "stats_admin_all" on public.site_statistics;
create policy "stats_admin_all" on public.site_statistics
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "testimonials_admin_all" on public.testimonials;
create policy "testimonials_admin_all" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "blogs_admin_all" on public.blogs;
create policy "blogs_admin_all" on public.blogs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "resources_admin_all" on public.resources;
create policy "resources_admin_all" on public.resources
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "notices_admin_all" on public.notices;
create policy "notices_admin_all" on public.notices
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "enrollments_admin_all" on public.enrollments;
create policy "enrollments_admin_all" on public.enrollments
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Admins can see the allowlist; nobody else can.
drop policy if exists "admins_self_select" on public.admins;
create policy "admins_self_select" on public.admins
  for select to authenticated using (public.is_admin());

-- 5) Storage uploads also limited to admins (was any authenticated user).
drop policy if exists "resources_auth_upload" on storage.objects;
create policy "resources_auth_upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'resources-bucket' and public.is_admin());

drop policy if exists "blogs_auth_upload" on storage.objects;
create policy "blogs_auth_upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'blogs-bucket' and public.is_admin());

drop policy if exists "testimonials_auth_upload" on storage.objects;
create policy "testimonials_auth_upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'testimonials-images' and public.is_admin());

-- Allow admins to delete their own bucket objects (used by resource/blog delete).
drop policy if exists "resources_admin_delete" on storage.objects;
create policy "resources_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'resources-bucket' and public.is_admin());

drop policy if exists "blogs_admin_delete" on storage.objects;
create policy "blogs_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'blogs-bucket' and public.is_admin());


-- ════════════════════════════════════════════════════════════════════════
-- WORKSHOPS — table was created outside this file (schema drift); defined
-- here so a fresh database is complete and the policies are version-controlled.
-- ════════════════════════════════════════════════════════════════════════
create table if not exists public.workshops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  date_time timestamptz not null,
  details text,
  description text,
  course text not null default 'General',
  is_active boolean not null default true,
  created_at timestamptz default now()
);
alter table public.workshops enable row level security;

drop policy if exists "workshops_select_active" on public.workshops;
create policy "workshops_select_active" on public.workshops
  for select using (is_active = true);

drop policy if exists "workshops_admin_all" on public.workshops;
create policy "workshops_admin_all" on public.workshops
  for all to authenticated using (public.is_admin()) with check (public.is_admin());


-- ════════════════════════════════════════════════════════════════════════
-- PERFORMANCE — indexes on frequently filtered / ordered columns
-- ════════════════════════════════════════════════════════════════════════
create index if not exists enrollments_source_status_idx
  on public.enrollments (source, status, created_at desc);
create index if not exists testimonials_status_idx
  on public.testimonials (status, created_at desc);
create index if not exists blogs_published_at_idx
  on public.blogs (published_at desc);
create index if not exists resources_created_at_idx
  on public.resources (created_at desc);
create index if not exists notices_active_idx
  on public.notices (is_active, created_at desc);
create index if not exists workshops_active_idx
  on public.workshops (is_active, date_time);
