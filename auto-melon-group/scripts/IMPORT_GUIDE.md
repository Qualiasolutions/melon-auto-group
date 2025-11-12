# 🚚 Bazaraki Vehicle Import Guide

Complete guide for importing vehicles from Bazaraki listings into your Auto Melon Group database.

## 📋 Overview

You have 15 Bazaraki vehicle listings ready to import. Since Bazaraki blocks automated scraping, you'll need to manually collect the data and use our import script to add them to your database.

**Time estimate:** 30-45 minutes for all 15 vehicles

## 🚀 Quick Start (3 Steps)

### Step 1: Fill in Vehicle Data

Open `scripts/bazaraki-vehicles.json` and for each vehicle, update these **required fields**:

- **price** - Price in EUR (e.g., `25000`)
- **mileage** - Kilometers (e.g., `145000`)
- **horsepower** - Engine power (e.g., `180`)
- **description** - Vehicle description
- **images** - Array of image URLs

### Step 2: Run the Import

```bash
npm run import-vehicles
```

### Step 3: View Your Vehicles

```bash
npm run dev
```

Then visit: http://localhost:3000/inventory

## 📝 Detailed Instructions

### 1. Prepare Your Workspace

Open these two items side-by-side:
1. **Bazaraki listings** (in browser tabs)
2. **scripts/bazaraki-vehicles.json** (in your code editor)

### 2. For Each Vehicle, Collect Data

Visit each Bazaraki URL and gather:

#### Basic Information (from page header/title)
- Make (e.g., "DAF", "Isuzu", "Toyota")
- Model (e.g., "LF 7.5T", "D-Max", "Hilux")
- Year (e.g., 2016, 2015, 2018)

#### Pricing Section
- **Price in EUR** → Update `"price": 25000`

#### Vehicle Details/Specifications
- **Mileage (km)** → Update `"mileage": 145000`
- **Engine capacity** (e.g., 2.5L) → Update `specifications.engineCapacity`
- **Horsepower** → Update `"horsepower": 180`
- **Transmission** (Manual/Automatic)

#### Images
1. Right-click on each vehicle image
2. Click "Copy Image Address"
3. Add to `"images": ["URL1", "URL2", ...]`

#### Description
- Copy the full text description
- Paste into `"description": "Full description here"`

#### Location
- City/area mentioned → Update `"location": "Nicosia"`

### 3. Update JSON File

Example of a completed vehicle entry:

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
    "emissionStandard": "Euro 5"
  },
  "features": [
    "Air Conditioning",
    "Power Steering",
    "ABS"
  ],
  "description": "Well maintained DAF LF 7.5 tonne box truck. Full service history.",
  "available": true,
  "featured": false
}
```

## 🎯 Vehicle Categorization Guide

### Flatbed / Pickup Trucks
**Category:** `"flatbed"`

Vehicles:
- Isuzu D-Max
- Toyota Hilux
- Nissan Navara
- Mitsubishi L200
- Isuzu Rodeo
- MAN with crane/flatback
- Iveco with crane

**Common features:** `["4x4", "Crane"]` (if applicable)

### Box Trucks
**Category:** `"box-truck"`

Vehicles:
- DAF LF 7.5T
- DAF Box
- Isuzu Grafter 3.5T
- Isuzu Forward N75 190 Auto

**Typical GVW:** 3500-7500 kg

### Dump/Tipper Trucks
**Category:** `"dump-truck"`

Vehicles:
- Ford Transit Tipper

**Common features:** `["Tipper"]`

## 🔧 Commands Reference

```bash
# Check if everything is set up correctly
npm run check-setup

# Import vehicles to database
npm run import-vehicles

# Start development server
npm run dev

# Build for production
npm run build
```

## ✅ Verification Checklist

Before running `npm run import-vehicles`, verify:

- [ ] All vehicles have `price > 0`
- [ ] All vehicles have `mileage > 0`
- [ ] All vehicles have `horsepower > 0`
- [ ] At least 1 image URL per vehicle (recommended)
- [ ] Description is filled in (recommended)
- [ ] Category is correct for vehicle type
- [ ] VIN is unique for each vehicle

Run the check:
```bash
npm run check-setup
```

## 🎨 Categorized Vehicle List

### Pickups & 4x4 (7 vehicles)
1. ✅ Isuzu D-Max 2.5L (2015) - `flatbed`
2. ✅ Toyota Hilux 2.2L (2015) - `flatbed`
3. ✅ Nissan Navara 2.2L (2013) - `flatbed`
4. ✅ Isuzu Rodeo 2.2L (2011) - `flatbed`
5. ✅ Mitsubishi L200 2.3L (2020) - `flatbed`
6. ✅ Isuzu D-Max 2.2L (2018) - `flatbed`
7. ✅ MAN with Crane (2011) - `flatbed`

### Box Trucks (5 vehicles)
8. ✅ DAF 7.5T (2016) - `box-truck`
9. ✅ Isuzu Grafter 3.5T (2016) - `box-truck`
10. ✅ DAF 7.5 Tonne (2018) - `box-truck`
11. ✅ Isuzu 7.5 Tonne (2016) - `box-truck`
12. ✅ DAF Box (2016) - `box-truck`
13. ✅ Isuzu Forward N75 190 Auto (2018) - `box-truck`

### Tippers (1 vehicle)
14. ✅ Ford Transit Tipper (2016) - `dump-truck`

### Specialized (1 vehicle)
15. ✅ Iveco with Crane 6.5T (2015) - `flatbed`

## 🐛 Troubleshooting

### "Missing price" or "Missing mileage" errors
**Solution:** Update all `"price": 0` and `"mileage": 0` fields in the JSON file with real values from Bazaraki.

### "Duplicate key value violates unique constraint (vin)"
**Solution:** Each vehicle needs a unique VIN. Use format: `MAKE-YEAR-MODEL-XXX` where XXX is unique (001, 002, etc.)

### "Database connection error"
**Solution:**
1. Check `.env.local` has correct Supabase credentials
2. Verify Supabase project is active
3. Run database schema from `lib/supabase/schema.sql`

### Images not displaying
**Possible causes:**
- Image URLs are not publicly accessible
- URLs are not direct image links
- Images are behind authentication

**Solution:** Use direct image URLs ending in `.jpg`, `.png`, etc.

## 📊 After Import

Once vehicles are imported successfully:

### 1. View Inventory
Visit http://localhost:3000/inventory to see all vehicles

### 2. Test Filtering
- Filter by make (DAF, Isuzu, Toyota, etc.)
- Filter by category (flatbed, box-truck, dump-truck)
- Filter by price range
- Search by keyword

### 3. Check Individual Vehicle Pages
Click on any vehicle card to view detailed information

### 4. Update Featured Vehicles
To mark vehicles as featured (shown on homepage):

In Supabase dashboard:
```sql
UPDATE vehicles
SET featured = true
WHERE id = 'vehicle-uuid-here';
```

Or update the JSON before importing:
```json
"featured": true
```

## 💡 Tips for Fast Data Entry

1. **Batch similar vehicles** - Do all pickups first, then box trucks, etc.

2. **Copy-paste smartly** - Many vehicles have similar specifications
   - Engine capacity often same for same model
   - Transmission types repeat
   - Features can be reused

3. **Use placeholders for images** - You can add images later via Supabase dashboard

4. **Start with critical fields** - Price, mileage, horsepower are required. Add details later.

5. **Test with 2-3 vehicles first** - Import a few, verify they look good, then do the rest

## 📸 Getting Image URLs from Bazaraki

### Method 1: Right-click
1. Right-click on vehicle image
2. Select "Copy Image Address"
3. Paste into JSON `images` array

### Method 2: Inspect Element
1. Right-click image → "Inspect"
2. Find `<img src="URL">` in HTML
3. Copy the URL

### Method 3: Use Placeholder Images
If Bazaraki images don't work, use these truck placeholders:

```json
"images": [
  "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
  "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800"
]
```

## 🎉 Success!

When you see:
```
✅ Successfully imported: 15 vehicles
🎉 Vehicle import completed!
Visit http://localhost:3000/inventory to see your vehicles
```

You're done! Your Auto Melon Group website now has a full inventory of vehicles with:
- Advanced filtering by make, category, price, year, mileage
- Search functionality
- Beautiful vehicle cards with images
- Detailed vehicle pages
- Inquiry forms for each vehicle

## 📚 Additional Resources

- **Main Project Docs:** `CLAUDE.md`
- **Database Schema:** `lib/supabase/schema.sql`
- **Vehicle Types:** `types/vehicle.ts`
- **Data Template:** `scripts/DATA_COLLECTION_TEMPLATE.md`
- **Script README:** `scripts/README.md`
