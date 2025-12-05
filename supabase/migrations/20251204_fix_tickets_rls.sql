-- Enable RLS on tickets table
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Public can create tickets" ON tickets;
DROP POLICY IF EXISTS "Admins can view tickets" ON tickets;
DROP POLICY IF EXISTS "Admins can update tickets" ON tickets;

-- Create policies for tickets table

-- Allow public to insert tickets (anyone can submit a ticket)
CREATE POLICY "Public can create tickets" 
ON tickets FOR INSERT 
WITH CHECK (true);

-- Allow authenticated users (admins) to view all tickets
CREATE POLICY "Admins can view tickets" 
ON tickets FOR SELECT 
USING (auth.role() = 'authenticated');

-- Allow authenticated users (admins) to update tickets (e.g. resolve them)
CREATE POLICY "Admins can update tickets" 
ON tickets FOR UPDATE 
USING (auth.role() = 'authenticated');
