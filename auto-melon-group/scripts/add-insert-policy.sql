-- Add policy to allow inserting vehicles with anon key
-- This policy should be added temporarily for import, then removed in production

-- Drop the policy if it exists
DROP POLICY IF EXISTS "Allow anon insert for import" ON vehicles;

-- Create policy to allow inserts
CREATE POLICY "Allow anon insert for import"
ON vehicles FOR INSERT
WITH CHECK (true);

-- To remove this policy after import, run:
-- DROP POLICY "Allow anon insert for import" ON vehicles;
