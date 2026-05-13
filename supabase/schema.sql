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
  file_url text,
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Resources
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  file_url text not null,
  created_at timestamptz default now(),
  constraint resources_subject check (
    subject in ('English', 'Sociology', 'General')
  )
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
