# 🚀 Quick Reference - Vehicle Import

## The 3-Step Process

### 1. Collect Data
Open each Bazaraki URL and note down:
- **Price** (EUR)
- **Mileage** (km)
- **Horsepower**
- **Description**
- **Images** (right-click → Copy Image Address)

### 2. Update JSON
Edit `scripts/bazaraki-vehicles.json` with the collected data

### 3. Import
```bash
npm run import-vehicles
```

---

## Commands

```bash
npm run check-setup       # Verify environment & data
npm run import-vehicles   # Import to database
npm run dev               # Start dev server
```

---

## Required Fields

Must be filled (not 0):
- ✅ `price`
- ✅ `mileage`
- ✅ `horsepower`

Recommended:
- 📸 `images` (at least 1)
- 📝 `description`

---

## Vehicle Categories

| Type | Category | Examples |
|------|----------|----------|
| Pickups / 4x4 | `flatbed` | D-Max, Hilux, Navara, L200 |
| Box Trucks | `box-truck` | DAF LF, Isuzu Grafter, Forward |
| Tippers | `dump-truck` | Transit Tipper |
| With Crane | `flatbed` | MAN, Iveco with crane |

---

## Your 15 Vehicles

1. DAF 2016 7.5T → `box-truck`
2. Isuzu Grafter 3.5T 2016 → `box-truck`
3. Isuzu D-Max 2.5L 2015 → `flatbed`
4. Toyota Hilux 2.2L 2015 → `flatbed`
5. Nissan Navara 2.2L 2013 → `flatbed`
6. Isuzu Rodeo 2.2L 2011 → `flatbed`
7. Mitsubishi L200 2.3L 2020 → `flatbed`
8. Isuzu D-Max 2.2L 2018 → `flatbed`
9. DAF 7.5 Tonne 2018 → `box-truck`
10. Isuzu 7.5 Tonne 2016 → `box-truck`
11. MAN 2011 with Crane → `flatbed`
12. DAF Box 2016 → `box-truck`
13. Ford Transit Tipper 2016 → `dump-truck`
14. Iveco with Crane 6.5T → `flatbed`
15. Isuzu Forward N75 190 Auto → `box-truck`

---

## Quick Troubleshooting

**Import skips vehicles?**
→ Check price/mileage are not 0

**Duplicate VIN error?**
→ Each vehicle needs unique VIN (MAKE-YEAR-MODEL-001, 002, etc.)

**Can't connect to database?**
→ Check `.env.local` has Supabase credentials

**Images don't load?**
→ Use direct URLs ending in .jpg/.png

---

## After Import

✅ Visit http://localhost:3000/inventory
✅ Test filters (make, category, price)
✅ Check vehicle detail pages
✅ Test search functionality

---

## File Locations

- Data file: `scripts/bazaraki-vehicles.json`
- Import script: `scripts/import-vehicles.ts`
- Full guide: `scripts/IMPORT_GUIDE.md`
- Database schema: `lib/supabase/schema.sql`
