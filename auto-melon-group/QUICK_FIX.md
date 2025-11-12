# Quick Fix - Apply Database Policies

## Problem
Admin panel shows "400 Bad Request" when trying to add vehicles.

## Solution (2 Minutes)

### Step 1: Open Supabase Dashboard
Go to: https://supabase.com/dashboard/project/betmyuzngytzqdhplrqu

### Step 2: Navigate to SQL Editor
Click: **SQL Editor** in left sidebar

### Step 3: Copy & Run This SQL

```sql
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow anon insert for import" ON vehicles;
DROP POLICY IF EXISTS "Allow public read access to available vehicles" ON vehicles;

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

-- Allow public to read all vehicles (not just available ones)
CREATE POLICY "Allow public read access to all vehicles"
ON vehicles FOR SELECT
USING (true);

-- Policies for inquiries table (admin needs to read inquiries)
CREATE POLICY "Allow public read on inquiries"
ON inquiries FOR SELECT
USING (true);
```

### Step 4: Click "Run"

### Step 5: Test Admin Panel
Go to: `/admin/vehicles/new` and try adding a vehicle.

## Done!

The admin panel should now work perfectly. The vehicle form will:
- ✅ Validate all fields
- ✅ Show helpful error messages
- ✅ Display success toast on save
- ✅ Save data to Supabase
- ✅ Redirect to vehicle list

---

**Note:** For more details, see `ADMIN_SETUP.md` and `ADMIN_PANEL_UPDATE.md`
