-- Parivaar — Supabase Database Setup
-- Run this entire script in your Supabase SQL Editor:
-- Dashboard → SQL Editor → New query → Paste → Run

-- ─── Users ───────────────────────────────────────────────────────────────────
create table if not exists parivaar_users (
  id        uuid primary key default gen_random_uuid(),
  name      text not null,
  family_name text not null,
  created_at timestamptz default now() not null
);

-- ─── Family Members ───────────────────────────────────────────────────────────
create table if not exists family_members (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references parivaar_users(id) on delete cascade,
  name       text not null,
  role       text not null check (role in ('parent','child')),
  color      text not null,
  created_at timestamptz default now() not null
);

-- ─── Chores ───────────────────────────────────────────────────────────────────
create table if not exists chores (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references parivaar_users(id) on delete cascade,
  title       text not null,
  assigned_to uuid not null,
  completed   boolean default false not null,
  category    text not null check (category in ('cleaning','cooking','shopping','childcare','other')),
  recurring   text check (recurring in ('daily','weekly')),
  created_at  timestamptz default now() not null
);

-- ─── Meal Plans ───────────────────────────────────────────────────────────────
create table if not exists meal_plans (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references parivaar_users(id) on delete cascade,
  day_key             text not null,
  slot                text not null check (slot in ('breakfast','lunch','dinner')),
  meal_name           text not null,
  meal_name_hindi     text,
  description         text not null default '',
  ingredients         text[] default '{}',
  prep_time           text not null default '30 min',
  nutrition_highlights text,
  created_at          timestamptz default now() not null,
  unique(user_id, day_key, slot)
);

-- ─── Community Posts ──────────────────────────────────────────────────────────
create table if not exists community_posts (
  id           uuid primary key default gen_random_uuid(),
  author_name  text not null,
  author_color text not null,
  content      text not null,
  category     text not null check (category in ('recipe','parenting','health','general')),
  likes        integer default 0 not null,
  is_seed      boolean default false not null,
  created_at   timestamptz default now() not null
);

-- ─── Post Likes & Saves (per device/user) ─────────────────────────────────────
create table if not exists post_likes (
  post_id uuid not null references community_posts(id) on delete cascade,
  user_id text not null,
  primary key (post_id, user_id)
);

create table if not exists post_saves (
  post_id uuid not null references community_posts(id) on delete cascade,
  user_id text not null,
  primary key (post_id, user_id)
);

-- ─── Pantry Inventory ─────────────────────────────────────────────────────────
create table if not exists inventory_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references parivaar_users(id) on delete cascade,
  name       text not null,
  created_at timestamptz default now() not null,
  unique(user_id, name)
);

-- ─── Row Level Security (allow all for now — tighten post-auth) ───────────────
alter table parivaar_users    enable row level security;
alter table family_members    enable row level security;
alter table chores            enable row level security;
alter table meal_plans        enable row level security;
alter table community_posts   enable row level security;
alter table post_likes        enable row level security;
alter table post_saves        enable row level security;
alter table inventory_items   enable row level security;

-- Allow anon key full access (since we're using user_id from the app, not Supabase Auth)
-- Drop first so this script is safe to re-run
drop policy if exists "anon_all_parivaar_users"  on parivaar_users;
drop policy if exists "anon_all_family_members"  on family_members;
drop policy if exists "anon_all_chores"          on chores;
drop policy if exists "anon_all_meal_plans"      on meal_plans;
drop policy if exists "anon_all_community_posts" on community_posts;
drop policy if exists "anon_all_post_likes"      on post_likes;
drop policy if exists "anon_all_post_saves"      on post_saves;
drop policy if exists "anon_all_inventory_items" on inventory_items;

create policy "anon_all_parivaar_users"  on parivaar_users  for all using (true) with check (true);
create policy "anon_all_family_members"  on family_members  for all using (true) with check (true);
create policy "anon_all_chores"          on chores          for all using (true) with check (true);
create policy "anon_all_meal_plans"      on meal_plans      for all using (true) with check (true);
create policy "anon_all_community_posts" on community_posts for all using (true) with check (true);
create policy "anon_all_post_likes"      on post_likes      for all using (true) with check (true);
create policy "anon_all_post_saves"      on post_saves      for all using (true) with check (true);
create policy "anon_all_inventory_items" on inventory_items for all using (true) with check (true);

-- ─── Seed community posts ─────────────────────────────────────────────────────
insert into community_posts (author_name, author_color, content, category, likes, is_seed)
select * from (values
  ('Sunita Sharma','#E07B39','My 3-year-old has been refusing vegetables for weeks. Finally cracked the code - blend spinach into his dal! He has no idea and finishes everything. Game changer for picky eaters.','parenting',24,true),
  ('Kavitha R.','#2D6A4F','Sharing my protein-rich tiffin box recipe for school kids: moong dal chilla with mint chutney, boiled egg, mixed fruit. My son''s teacher said he''s more focused in afternoon class now!','recipe',41,true),
  ('Ananya M.','#7B5EA7','Paediatrician confirmed - screen time guidelines for under-2s: zero. For 2-5: max 1 hour/day of quality content. Our new rule: no screens during meals and 1 hour before bed. Already seeing calmer bedtimes!','health',56,true),
  ('Divya Nair','#2E86AB','Anyone else dealing with separation anxiety when dropping off at daycare? What worked for us: a special goodbye ritual - one hug, one high-five, one wave from the window. Consistency was key. Took 2 weeks but now she walks in happily.','parenting',38,true),
  ('Meena Kulkarni','#D45087','Quick weeknight recipe: Palak paneer in 20 minutes. Blanch spinach, blend with 1 onion + 2 tomatoes. Saute with ghee, cumin, garam masala. Add paneer cubes. Perfect with roti. Kids love the color!','recipe',67,true),
  ('Lakshmi P.','#E8A838','Varicella vaccination reminder: if your child hasn''t had chickenpox or the vaccine, the second dose is due between 4-6 years. Our local PHC gives it free under Universal Immunization. Don''t skip boosters!','health',29,true)
) as v(author_name, author_color, content, category, likes, is_seed)
where not exists (select 1 from community_posts where is_seed = true limit 1);
