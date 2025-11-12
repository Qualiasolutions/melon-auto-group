-- Add engine_size column to vehicles table
-- This column stores engine displacement in liters (e.g., 2.0, 3.5, 6.0)

ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS engine_size DECIMAL(4,1);

COMMENT ON COLUMN vehicles.engine_size IS 'Engine displacement in liters';
