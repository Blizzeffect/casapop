-- Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('funkos', 'funkos', true)
on conflict (id) do nothing;

-- Enable RLS on objects
alter table storage.objects enable row level security;

-- Drop existing policies to avoid conflicts
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Upload" on storage.objects;
drop policy if exists "Authenticated Update" on storage.objects;
drop policy if exists "Authenticated Delete" on storage.objects;

-- Policy: Allow public read access to all files in 'funkos' bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'funkos' );

-- Policy: Allow authenticated users to upload files to 'funkos' bucket
create policy "Authenticated Upload"
on storage.objects for insert
with check (
  bucket_id = 'funkos'
  and auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to update their own files (or all files if admin)
-- For simplicity in this admin context, we allow authenticated users to update any file in the bucket
create policy "Authenticated Update"
on storage.objects for update
using (
  bucket_id = 'funkos'
  and auth.role() = 'authenticated'
);

-- Policy: Allow authenticated users to delete files
create policy "Authenticated Delete"
on storage.objects for delete
using (
  bucket_id = 'funkos'
  and auth.role() = 'authenticated'
);
