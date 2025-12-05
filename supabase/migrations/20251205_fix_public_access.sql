-- Ensure RLS is enabled for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
DROP POLICY IF EXISTS "Public read access to products" ON products;
CREATE POLICY "Public read access to products" ON products FOR SELECT USING (true);

-- Allow authenticated admin access to products (insert/update/delete)
DROP POLICY IF EXISTS "Admin access to products" ON products;
CREATE POLICY "Admin access to products" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Ensure RLS is enabled for posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to posts
DROP POLICY IF EXISTS "Public read access to posts" ON posts;
CREATE POLICY "Public read access to posts" ON posts FOR SELECT USING (true);

-- Allow authenticated admin access to posts
DROP POLICY IF EXISTS "Admin access to posts" ON posts;
CREATE POLICY "Admin access to posts" ON posts FOR ALL USING (auth.role() = 'authenticated');
