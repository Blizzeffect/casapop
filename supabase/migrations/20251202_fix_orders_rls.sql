-- Allow public to create orders (insert)
CREATE POLICY "Public can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow public to view their own orders (by reference, if we had a way to check, but for now insert is key)
-- Usually for checkout flow, we just need INSERT permission.
-- The 400 error often comes from RLS blocking the INSERT.

-- Ensure customer_details column exists (redundant if migration ran, but safe)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_details JSONB DEFAULT '{}'::jsonb;
