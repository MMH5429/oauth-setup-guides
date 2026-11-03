create table if not exists public.generated_guides (
  id text primary key,
  guide jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.generated_guides enable row level security;

-- The app accesses this table only from its server using the service role key.
-- Do not expose SUPABASE_SERVICE_ROLE_KEY to browser code.
