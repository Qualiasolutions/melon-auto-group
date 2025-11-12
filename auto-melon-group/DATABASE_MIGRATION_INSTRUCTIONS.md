# Database Migration: Add Engine Size Column

## Changes Made

### 1. Database Schema
Added `engine_size` column to the `vehicles` table to store engine displacement in liters.

**SQL Migration:**
```sql
-- Run this in Supabase SQL Editor
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS engine_size DECIMAL(4,1);

COMMENT ON COLUMN vehicles.engine_size IS 'Engine displacement in liters';
```

### 2. Form Changes
- **Removed:** VIN field from the UI (still saved in database if provided via import)
- **Removed:** Reference URL field from the UI (still saved in database for imported vehicles)
- **Added:** Engine Size (L) field - replaces the Horsepower display
- **Added:** "4x4" category to vehicle categories

### 3. Vehicle Import/Scraper Updates
- Engine size extraction from listings (e.g., "2,0l" → 2.0L)
- Extracts from title: "Ford transit 2,0l 2021" → engineSize: 2.0
- Supports formats: "2,0l", "3.0L", "2.0 liter"

## How to Apply Migration

### Step 1: Run SQL Migration in Supabase
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the SQL from `lib/supabase/migration-add-engine-size.sql`
4. Execute the migration

### Step 2: Deploy to Production
The code changes are already in the build. Just deploy:
```bash
npx vercel --prod
```

## Field Visibility

### Visible in Form
- Make, Model, Year, Category, Condition
- Price, Mileage, **Engine Size (L)**
- Engine Type, Transmission, Location
- Images, Features, Description
- Available/Featured flags

### Hidden from Form (but saved)
- VIN (optional, saved if provided)
- Reference URL (optional, saved from imports)
- Horsepower (still in database, not displayed in new form)

## Testing

After deployment, test the Smart Import feature:
1. Go to `/admin/vehicles/import`
2. Use test URL: `www.bazaraki.com/el/adv/6087177_ford-transit-2-0l-2021/`
3. Should extract: "Ford transit 2,0l 2021" → engineSize: 2.0
4. Verify the form shows "Engine Size (L)" field with value 2.0
5. Save and confirm vehicle is created successfully
