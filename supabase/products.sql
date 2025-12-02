-- Enable RLS (safe to run even if already enabled)
alter table public.products enable row level security;

-- Drop existing policies to avoid conflicts when re-running
drop policy if exists "Allow public read access" on public.products;
drop policy if exists "Allow authenticated insert" on public.products;
drop policy if exists "Allow authenticated update" on public.products;
drop policy if exists "Allow authenticated delete" on public.products;

-- Create policies
create policy "Allow public read access" on public.products
  for select using (true);

create policy "Allow authenticated insert" on public.products
  for insert with check (auth.role() = 'authenticated');

create policy "Allow authenticated update" on public.products
  for update using (auth.role() = 'authenticated');

create policy "Allow authenticated delete" on public.products
  for delete using (auth.role() = 'authenticated');
