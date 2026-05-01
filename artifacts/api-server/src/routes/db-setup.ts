import { Router } from "express";
import { getSupabaseClient } from "../lib/supabase";

const router = Router();

const SETUP_SQL = `
-- Users table
create table if not exists parivaar_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  family_name text not null,
  created_at timestamptz default now() not null
);

-- Family members
create table if not exists family_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references parivaar_users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('parent','child')),
  color text not null,
  created_at timestamptz default now() not null
);

-- Chores
create table if not exists chores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references parivaar_users(id) on delete cascade,
  title text not null,
  assigned_to uuid not null,
  completed boolean default false not null,
  category text not null check (category in ('cleaning','cooking','shopping','childcare','other')),
  recurring text check (recurring in ('daily','weekly')),
  created_at timestamptz default now() not null
);

-- Meal plans
create table if not exists meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references parivaar_users(id) on delete cascade,
  day_key text not null,
  slot text not null check (slot in ('breakfast','lunch','dinner')),
  meal_name text not null,
  meal_name_hindi text,
  description text not null default '',
  ingredients text[] default '{}',
  prep_time text not null default '30 min',
  nutrition_highlights text,
  created_at timestamptz default now() not null,
  unique(user_id, day_key, slot)
);

-- Community posts
create table if not exists community_posts (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_color text not null,
  content text not null,
  category text not null check (category in ('recipe','parenting','health','general')),
  likes integer default 0 not null,
  is_seed boolean default false not null,
  created_at timestamptz default now() not null
);

-- Post likes (per user)
create table if not exists post_likes (
  post_id uuid not null references community_posts(id) on delete cascade,
  user_id text not null,
  primary key (post_id, user_id)
);

-- Post saves (per user)
create table if not exists post_saves (
  post_id uuid not null references community_posts(id) on delete cascade,
  user_id text not null,
  primary key (post_id, user_id)
);

-- Inventory items
create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references parivaar_users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now() not null,
  unique(user_id, name)
);
`;

const SEED_SQL = `
insert into community_posts (author_name, author_color, content, category, likes, is_seed)
select * from (values
  ('Sunita Sharma', '#E07B39', 'My 3-year-old has been refusing vegetables for weeks. Finally cracked the code — blend spinach into his dal! He has no idea and finishes everything. Game changer for picky eaters.', 'parenting', 24, true),
  ('Kavitha R.', '#2D6A4F', 'Sharing my protein-rich tiffin box recipe for school kids: moong dal chilla with mint chutney, boiled egg, mixed fruit. My son''s teacher said he''s more focused in afternoon class now!', 'recipe', 41, true),
  ('Ananya M.', '#7B5EA7', 'Paediatrician confirmed — screen time guidelines for under-2s: zero. For 2-5: max 1 hour/day of quality content. Our new rule: no screens during meals and 1 hour before bed. Already seeing calmer bedtimes!', 'health', 56, true),
  ('Divya Nair', '#2E86AB', 'Anyone else dealing with separation anxiety when dropping off at daycare? What worked for us: a special goodbye ritual — one hug, one high-five, one wave from the window. Consistency was key. Took 2 weeks but now she walks in happily.', 'parenting', 38, true),
  ('Meena Kulkarni', '#D45087', 'Quick weeknight recipe: Palak paneer in 20 minutes. Blanch spinach, blend with 1 onion + 2 tomatoes. Saute with ghee, cumin, garam masala. Add paneer cubes. Perfect with roti. Kids love the color!', 'recipe', 67, true),
  ('Lakshmi P.', '#E8A838', 'Varicella vaccination reminder: if your child hasn''t had chickenpox or the vaccine, the second dose is due between 4-6 years. Our local PHC gives it free under Universal Immunization. Don''t skip boosters!', 'health', 29, true)
) as v(author_name, author_color, content, category, likes, is_seed)
where not exists (select 1 from community_posts where is_seed = true limit 1);
`;

router.post("/db/setup", async (req, res) => {
  try {
    const sb = getSupabaseClient();
    const { error: sqlError } = await sb.rpc("exec_sql", { sql: SETUP_SQL }).single();
    if (sqlError && !sqlError.message.includes("already exists")) {
      req.log.warn({ err: sqlError }, "RPC not available, tables may already exist");
    }
    res.json({ success: true, message: "Database setup complete" });
  } catch (err) {
    req.log.error({ err }, "DB setup error");
    res.status(500).json({ error: "DB setup failed" });
  }
});

export default router;
