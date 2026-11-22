-- Realwood Furnishers — initial schema, RLS and storage.
-- Run in Supabase Dashboard → SQL Editor (or via `supabase db push`).

-- ───────────────────────── helpers ─────────────────────────

-- Admin = a Supabase Auth user whose app_metadata contains {"role":"admin"}.
-- app_metadata can only be changed server-side (SQL editor / service role),
-- never by the user themselves, so this is safe to trust in RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ───────────────────────── tables ─────────────────────────

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 80),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  image_url   text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  category_id    uuid references public.categories(id) on delete set null,
  name           text not null check (char_length(name) between 2 and 160),
  slug           text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description    text,
  price          numeric(12,2) not null check (price >= 0),
  images         text[] not null default '{}',
  specifications jsonb not null default '{}'::jsonb,
  materials      text,
  dimensions     text,
  is_featured    boolean not null default false,
  is_active      boolean not null default true,
  in_stock       boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_featured_idx on public.products (is_featured) where is_featured;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create table if not exists public.contact_enquiries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null check (char_length(name) between 2 and 120),
  phone        text not null check (char_length(phone) between 7 and 20),
  email        text check (email is null or char_length(email) <= 200),
  subject      text check (subject is null or char_length(subject) <= 200),
  message      text not null check (char_length(message) between 5 and 4000),
  product_name text check (product_name is null or char_length(product_name) <= 200),
  status       text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at   timestamptz not null default now()
);

create table if not exists public.custom_furniture_requests (
  id                  uuid primary key default gen_random_uuid(),
  request_type        text not null default 'custom_furniture'
                      check (request_type in ('custom_furniture', 'upholstery_repair')),
  name                text not null check (char_length(name) between 2 and 120),
  phone               text not null check (char_length(phone) between 7 and 20),
  email               text check (email is null or char_length(email) <= 200),
  location            text check (location is null or char_length(location) <= 200),
  furniture_type      text not null check (char_length(furniture_type) between 2 and 120),
  dimensions          text check (dimensions is null or char_length(dimensions) <= 300),
  material            text check (material is null or char_length(material) <= 200),
  colour              text check (colour is null or char_length(colour) <= 120),
  description         text not null check (char_length(description) between 10 and 4000),
  budget_kes          numeric(12,2) check (budget_kes is null or budget_kes >= 0),
  reference_image_url text check (reference_image_url is null or char_length(reference_image_url) <= 1000),
  status              text not null default 'new'
                      check (status in ('new', 'quoted', 'in_progress', 'completed', 'closed')),
  created_at          timestamptz not null default now()
);

create index if not exists contact_enquiries_created_idx on public.contact_enquiries (created_at desc);
create index if not exists custom_requests_created_idx on public.custom_furniture_requests (created_at desc);

-- ───────────────────────── Row Level Security ─────────────────────────

alter table public.categories                enable row level security;
alter table public.products                  enable row level security;
alter table public.contact_enquiries         enable row level security;
alter table public.custom_furniture_requests enable row level security;

-- categories: public read, admin write
drop policy if exists "categories public read" on public.categories;
create policy "categories public read" on public.categories
  for select to anon, authenticated using (true);

drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- products: public sees active only, admin sees/writes everything
drop policy if exists "products public read active" on public.products;
create policy "products public read active" on public.products
  for select to anon, authenticated using (is_active or public.is_admin());

drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- contact_enquiries: anyone can submit (status must be 'new'), only admin can read/manage
drop policy if exists "enquiries public insert" on public.contact_enquiries;
create policy "enquiries public insert" on public.contact_enquiries
  for insert to anon, authenticated with check (status = 'new');

drop policy if exists "enquiries admin manage" on public.contact_enquiries;
create policy "enquiries admin manage" on public.contact_enquiries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- custom_furniture_requests: same pattern
drop policy if exists "requests public insert" on public.custom_furniture_requests;
create policy "requests public insert" on public.custom_furniture_requests
  for insert to anon, authenticated with check (status = 'new');

drop policy if exists "requests admin manage" on public.custom_furniture_requests;
create policy "requests admin manage" on public.custom_furniture_requests
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ───────────────────────── Storage ─────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-images', 'product-images', true, 5242880,
   array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('request-references', 'request-references', true, 5242880,
   array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

-- product-images: admin uploads/edits/deletes (public URLs work because the bucket is public)
drop policy if exists "product images admin insert" on storage.objects;
create policy "product images admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product images admin update" on storage.objects;
create policy "product images admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product images admin delete" on storage.objects;
create policy "product images admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- request-references: customers may upload a reference photo; only admin can list/delete
drop policy if exists "request refs public upload" on storage.objects;
create policy "request refs public upload" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'request-references');

drop policy if exists "request refs admin read" on storage.objects;
create policy "request refs admin read" on storage.objects
  for select to authenticated
  using (bucket_id = 'request-references' and public.is_admin());

drop policy if exists "request refs admin delete" on storage.objects;
create policy "request refs admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'request-references' and public.is_admin());

-- ───────────────────────── Starter categories ─────────────────────────

insert into public.categories (name, slug, description, sort_order) values
  ('Sofas & Couches',        'sofas',       'Handcrafted sofas, sectionals and couches built to order.', 1),
  ('Beds & Headboards',      'beds',        'Solid frames and upholstered headboards for every bedroom.', 2),
  ('Dining Tables & Chairs', 'dining',      'Dining sets and tables that gather the whole family.', 3),
  ('TV Stands & Units',      'tv-stands',   'Entertainment units and TV stands in quality finishes.', 4),
  ('Coffee & Side Tables',   'tables',      'Coffee tables, side tables and console tables.', 5),
  ('Armchairs & Seating',    'armchairs',   'Accent chairs, ottomans and statement seating.', 6),
  ('Wardrobes & Storage',    'storage',     'Wardrobes, shoe racks and storage solutions.', 7),
  ('Office Furniture',       'office',      'Desks and office seating for work-from-home and business.', 8)
on conflict (slug) do nothing;
