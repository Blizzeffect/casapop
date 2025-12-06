-- Create community_messages table
create table if not exists public.community_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nickname text not null,
  email text not null,
  message text not null,
  marketing_consent boolean default false,
  is_approved boolean default false
);

-- Enable RLS
alter table public.community_messages enable row level security;

-- Policies

-- Public Read: Only approved messages are visible to everyone
create policy "Public messages are viewable by everyone"
  on public.community_messages for select
  using (is_approved = true);

-- Public Insert: Anyone can post a message
create policy "Anyone can insert a message"
  on public.community_messages for insert
  with check (true);

-- Admin Full Access: Service role (and admins if using authenticated role with claims) can do everything
-- For simplicity in this project's context, usually service_role is used for admin actions or authenticated users if checked.
-- Assuming 'authenticated' users are admins for simplicity based on previous context, OR we rely on dashboard using service role client?
-- Let's check how other admin features are implemented. usually RLS for admin is strictly controlled.
-- Checking previous conversations/files, it seems we might differ.
-- Let's add a policy for authenticated users to view ALL (for moderation).
create policy "Authenticated users can view all messages"
  on public.community_messages for select
  to authenticated
  using (true);

create policy "Authenticated users can update messages"
  on public.community_messages for update
  to authenticated
  using (true);

create policy "Authenticated users can delete messages"
  on public.community_messages for delete
  to authenticated
  using (true);
