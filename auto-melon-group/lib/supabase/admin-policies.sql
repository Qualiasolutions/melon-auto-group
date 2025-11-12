-- Admin Panel RLS Policies for Auto Melon Group
-- These policies allow the anon key to perform admin operations
-- For production, you should implement proper authentication

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow anon insert for import" ON vehicles;

-- Create comprehensive admin policies for vehicles table
CREATE POLICY "Allow public insert on vehicles"
ON vehicles FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update on vehicles"
ON vehicles FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete on vehicles"
ON vehicles FOR DELETE
USING (true);

-- Allow public to read all vehicles (not just available ones) for admin panel
DROP POLICY IF EXISTS "Allow public read access to available vehicles" ON vehicles;

CREATE POLICY "Allow public read access to all vehicles"
ON vehicles FOR SELECT
USING (true);

-- Policies for inquiries table (admin needs to read inquiries)
CREATE POLICY "Allow public read on inquiries"
ON inquiries FOR SELECT
USING (true);

-- Note: For production, replace these with proper authentication-based policies
-- Example:
-- CREATE POLICY "Allow authenticated admin insert on vehicles"
-- ON vehicles FOR INSERT
-- TO authenticated
-- WITH CHECK (auth.jwt() ->> 'role' = 'admin');
