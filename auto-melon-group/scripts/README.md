# Vehicle Import Scripts

This directory contains scripts to bulk import vehicles from Bazaraki listings into your Supabase database.

## Quick Start

### Step 1: Fill in Vehicle Data

Edit `bazaraki-vehicles.json` and update the vehicle information from the Bazaraki listings. For each vehicle, fill in:

**Required fields (MUST be filled):**
- `price` - Price in EUR (e.g., 15000)
- `mileage` - Mileage in kilometers (e.g., 125000)
- `horsepower` - Engine horsepower (e.g., 150)

**Optional but recommended:**
- `description` - Full vehicle description
- `images` - Array of image URLs from the listing
- `features` - Special features (e.g., ["Air Conditioning", "ABS", "Bluetooth"])
- `specifications` - Technical specs like `engineCapacity`, `gvw`, etc.

### Step 2: Run the Import Script

```bash
# Navigate to the project directory
cd auto-melon-group

# Install dependencies if not already installed
npm install

# Run the import script
npx tsx scripts/import-vehicles.ts
```

The script will:
1. Read `bazaraki-vehicles.json`
2. Validate each vehicle
3. Insert valid vehicles into Supabase
4. Show a summary of successes and errors

### Step 3: Verify Import

Visit http://localhost:3000/inventory to see your imported vehicles!

## Data Collection Tips

### From Bazaraki Listings

When viewing a Bazaraki vehicle listing, collect:

1. **Basic Info** (usually in the title/header)
   - Make, Model, Year

2. **Pricing** (main price section)
   - Price in EUR

3. **Vehicle Details** (details section)
   - Mileage (km)
   - Engine capacity (e.g., 2.5L)
   - Transmission (manual/automatic)
   - Horsepower

4. **Images** (right-click images and copy URL)
   - Add image URLs to the `images` array

5. **Description** (main text)
   - Copy the full description

6. **Location**
   - City/area in Cyprus

### Vehicle Categories

Choose the correct category based on vehicle type:

- **`flatbed`** - Pickup trucks, flat back trucks (D-Max, Hilux, Navara, L200, Rodeo)
- **`box-truck`** - Enclosed cargo trucks (DAF LF, Isuzu Grafter, Isuzu Forward)
- **`dump-truck`** - Tipper trucks (Transit Tipper)
- **`semi-truck`** - Large tractor units
- **`tanker`** - Liquid/gas transport
- **`refrigerated`** - Reefer trucks
- **`other`** - Specialized vehicles

### Engine Types

- **`diesel`** - Most commercial trucks (default)
- **`gas`** - Gasoline/petrol engines
- **`electric`** - Electric vehicles
- **`hybrid`** - Hybrid vehicles

### Transmission Types

- **`manual`** - Standard manual transmission
- **`automatic`** - Automatic transmission
- **`automated-manual`** - Semi-automatic (common in modern trucks)

## Example: Complete Vehicle Entry

```json
{
  "bazarakiUrl": "https://www.bazaraki.com/adv/6075356_daf-2016-7-5t/",
  "make": "DAF",
  "model": "LF 7.5T Box",
  "year": 2016,
  "mileage": 145000,
  "price": 25000,
  "currency": "EUR",
  "condition": "used",
  "category": "box-truck",
  "engineType": "diesel",
  "transmission": "manual",
  "horsepower": 180,
  "location": "Nicosia",
  "country": "Cyprus",
  "vin": "DAF-2016-7.5T-001",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "specifications": {
    "gvw": 7500,
    "engineCapacity": 4.5,
    "emissionStandard": "Euro 5",
    "length": 6000,
    "width": 2400
  },
  "features": [
    "Air Conditioning",
    "Power Steering",
    "ABS",
    "Tachograph"
  ],
  "description": "Well maintained DAF LF 7.5 tonne box truck. Full service history. Ready for work. Clean interior and exterior. Recently serviced.",
  "available": true,
  "featured": false
}
```

## Troubleshooting

### "Missing Supabase credentials"

Make sure you have a `.env.local` file in the `auto-melon-group/` directory with:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### "Missing price" or "Missing mileage" errors

The script skips vehicles with price=0 or mileage=0. Update these fields in the JSON file with real values from the Bazaraki listings.

### "Duplicate key value violates unique constraint"

The VIN field must be unique. If you see this error, make sure each vehicle has a unique VIN. You can use a format like:
`MAKE-YEAR-MODEL-001`, `MAKE-YEAR-MODEL-002`, etc.

### Images not loading

Make sure image URLs are:
- Publicly accessible (not behind login)
- Direct image URLs (ending in .jpg, .png, etc.)
- HTTPS URLs (not HTTP)

## Manual Database Operations

### View all vehicles in Supabase

1. Go to your Supabase dashboard
2. Click "Table Editor"
3. Select "vehicles" table

### Delete all vehicles (start fresh)

In Supabase SQL Editor:
```sql
DELETE FROM vehicles;
```

### Count vehicles

In Supabase SQL Editor:
```sql
SELECT COUNT(*) FROM vehicles;
```

## Need Help?

- Check the main `CLAUDE.md` for database schema details
- See `DATABASE_SETUP.md` for Supabase setup
- Check `types/vehicle.ts` for valid field values
