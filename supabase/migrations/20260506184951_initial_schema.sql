-- Skogstorp-Gunntorps Samfällighetsförening
-- Databasschema för Supabase

-- === AUTH (hanteras av Supabase Auth) ===

-- === PROFILER / MEDLEMMAR ===
create table profiles (
  id uuid primary key default gen_random_uuid() references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  phone text,
  role text not null default 'medlem' check (role in ('admin', 'styrelse', 'medlem')),
  property_designation text not null,
  address text,
  postal_code text,
  city text,
  share_value numeric(6,2) not null default 0,
  has_paid_fee boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table profiles enable row level security;

create policy "Medlemmar kan se alla profiler"
  on profiles for select
  to authenticated
  using (true);

create policy "Admin kan redigera profiler"
  on profiles for all
  to authenticated
  using (role = 'admin');

create policy "Varje användare kan uppdatera sin egen profil"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

-- === NYHETER ===
create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  is_urgent boolean not null default false,
  is_public boolean not null default false,
  author_id uuid not null references profiles(id) on delete cascade,
  author_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table posts enable row level security;

create policy "Alla kan se nyheter"
  on posts for select
  to authenticated
  using (true);

create policy "Admin/styrelse kan skriva nyheter"
  on posts for insert
  to authenticated
  with check (exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'styrelse')));

create policy "Admin/styrelse kan uppdatera nyheter"
  on posts for update
  to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'styrelse')));

create policy "Admin kan radera nyheter"
  on posts for delete
  to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- === PROBLEMRAPPORTER ===
create table issues (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  user_name text not null,
  category text not null,
  description text not null,
  location text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  photo_url text,
  status text not null default 'Mottagen' check (status in ('Mottagen', 'Pågående', 'Åtgärdad')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table issues enable row level security;

create policy "Alla inloggade kan se problemrapporter"
  on issues for select
  to authenticated
  using (true);

create policy "Alla inloggade kan skapa problemrapporter"
  on issues for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Admin/styrelse kan uppdatera status"
  on issues for update
  to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'styrelse')));

-- === DOKUMENT ===
create table documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('protocol', 'financial', 'bylaws', 'budget', 'agenda', 'minutes', 'other')),
  file_url text not null,
  file_size bigint,
  is_public boolean not null default true,
  uploaded_by uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table documents enable row level security;

create policy "Medlemmar kan se dokument"
  on documents for select
  to authenticated
  using (true);

create policy "Admin/styrelse kan ladda upp"
  on documents for insert
  to authenticated
  with check (exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'styrelse')));

create policy "Admin kan radera dokument"
  on documents for delete
  to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- === MÖTEN ===
create table meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  time text,
  location text not null,
  type text not null default 'annual' check (type in ('annual', 'extra', 'board')),
  status text not null default 'planning' check (status in ('planning', 'notice_sent', 'completed', 'archived')),
  fee_per_share numeric(8,2),
  notice_sent_at timestamptz,
  notice_method text check (notice_method in ('post', 'email', 'both')),
  attendance_personal integer,
  attendance_proxy integer,
  created_at timestamptz not null default now()
);

alter table meetings enable row level security;

create policy "Medlemmar kan se möten"
  on meetings for select
  to authenticated
  using (true);

create policy "Admin/styrelse kan hantera möten"
  on meetings for all
  to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'styrelse')));

-- === ENTREPRENÖRER ===
create table contractors (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_person text not null,
  email text not null,
  phone text not null,
  specialties text,
  notes text,
  created_at timestamptz not null default now()
);

-- === UNDERHÅLLSPLAN ===
create table maintenance_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  year integer not null,
  estimated_cost numeric(10,2),
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'completed', 'deferred')),
  contractor_id uuid references contractors(id),
  created_at timestamptz not null default now()
);

alter table contractors enable row level security;

create policy "Medlemmar kan se entreprenörer"
  on contractors for select
  to authenticated
  using (true);

create policy "Admin kan hantera entreprenörer"
  on contractors for all
  to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- === AVGIFTER ===
create table fee_settings (
  id integer primary key default 1,
  year integer not null,
  unit_cost numeric(8,2) not null
);

alter table fee_settings enable row level security;

create policy "Medlemmar kan se avgifter"
  on fee_settings for select
  to authenticated
  using (true);

create policy "Admin kan ändra avgifter"
  on fee_settings for all
  to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- === KARTKONFIGURATION ===
create table map_config (
  id integer primary key default 1,
  center jsonb not null default '[57.9737, 12.2596]',
  zoom integer not null default 15,
  road_path jsonb,
  markers jsonb,
  embed_url text
);

alter table map_config enable row level security;

create policy "Alla kan se kartkonfiguration"
  on map_config for select
  using (true);

create policy "Admin kan ändra kartkonfiguration"
  on map_config for all
  to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- === E-POSTNOTISER (användarinställningar) ===
create table notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  news_updates boolean not null default true,
  issue_updates boolean not null default true,
  meeting_notices boolean not null default true,
  maintenance_updates boolean not null default false,
  fee_reminders boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table notification_preferences enable row level security;

create policy "Användare kan se egna notiser"
  on notification_preferences for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Användare kan uppdatera egna notiser"
  on notification_preferences for all
  to authenticated
  using (auth.uid() = user_id);

-- === STORAGE BUCKETS ===
-- Skapa i Supabase Dashboard: documents, photos

-- === FUNKTIONER ===

-- Auto-uppdatera updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

create trigger posts_updated_at
  before update on posts
  for each row execute function update_updated_at();

create trigger issues_updated_at
  before update on issues
  for each row execute function update_updated_at();

-- Trigger: Skicka notis när nytt inlägg skapas
create or replace function notify_new_post()
returns trigger as $$
begin
  -- Pga förenkling: hanteras via API-route istället
  return new;
end;
$$ language plpgsql;