-- Add image_url to radio_tracks
alter table public.radio_tracks
add column if not exists image_url text;

-- Update RLS if necessary (existing policies cover 'all' for admin, so checks should pass if it's just a column add)
