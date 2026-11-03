create table if not exists public.generated_guides (
  id text primary key,
  guide jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.generated_guides enable row level security;

-- Only the server-side service role (used by SUPABASE_SECRET_KEY) may access generated guides.
revoke all on table public.generated_guides from anon, authenticated;
grant all on table public.generated_guides to service_role;

-- The app accesses this table only from its server using a Supabase secret key.
-- Never expose SUPABASE_SECRET_KEY to browser code.
