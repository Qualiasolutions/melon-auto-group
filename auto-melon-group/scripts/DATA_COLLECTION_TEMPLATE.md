# Bazaraki Vehicle Data Collection Template

Use this template to quickly collect data from Bazaraki listings. Copy this template for each vehicle and fill in the details.

---

## Vehicle 1

**Bazaraki URL:** https://www.bazaraki.com/adv/6075356_daf-2016-7-5t/

### Basic Information
- **Make:** DAF
- **Model:** LF 7.5T
- **Year:** 2016
- **Price (EUR):** ___________
- **Mileage (km):** ___________

### Technical Specs
- **Engine Capacity (L):** ___________
- **Horsepower:** ___________
- **Transmission:** [ ] Manual  [ ] Automatic  [ ] Automated-Manual
- **Engine Type:** [ ] Diesel  [ ] Gas  [ ] Electric  [ ] Hybrid
- **Condition:** [ ] New  [ ] Used  [ ] Certified

### Category (choose one)
- [ ] Flatbed (pickups, flat back trucks)
- [ ] Box Truck (enclosed cargo)
- [ ] Dump Truck (tipper)
- [ ] Semi Truck (tractor units)
- [ ] Tanker
- [ ] Refrigerated
- [ ] Other

### Location
- **City/Area:** ___________
- **Country:** Cyprus

### Features (check all that apply)
- [ ] 4x4 / AWD
- [ ] Air Conditioning
- [ ] Power Steering
- [ ] ABS
- [ ] Crane
- [ ] Tipper/Dump
- [ ] Tachograph
- [ ] Bluetooth
- [ ] GPS
- Other: ___________

### Images
Copy image URLs from Bazaraki (right-click image → Copy Image Address):
1. ___________
2. ___________
3. ___________
4. ___________

### Description
Copy the full description from Bazaraki:
```
___________________________________________________________
___________________________________________________________
___________________________________________________________
```

### Additional Specifications
- **GVW (kg):** ___________
- **Emission Standard:** ___________
- **Axle Configuration:** ___________
- **Wheelbase (mm):** ___________
- **Length (mm):** ___________

---

## Quick Reference: Vehicle Categories

### Pickup Trucks & Flatbeds
- Isuzu D-Max → `flatbed`
- Toyota Hilux → `flatbed`
- Nissan Navara → `flatbed`
- Mitsubishi L200 → `flatbed`
- Ford Ranger → `flatbed`
- Isuzu Rodeo → `flatbed`
- MAN with crane/flatback → `flatbed`

### Box Trucks / Enclosed Cargo
- DAF LF 7.5T → `box-truck`
- Isuzu Grafter 3.5T → `box-truck`
- Isuzu Forward → `box-truck`
- Mercedes Atego → `box-truck`

### Dump/Tipper Trucks
- Ford Transit Tipper → `dump-truck`
- Any vehicle with "tipper" in name → `dump-truck`

### Semi Trucks / Tractors
- Mercedes Actros → `semi-truck`
- Scania R Series → `semi-truck`
- Volvo FH → `semi-truck`
- DAF XF → `semi-truck`

---

## How to Fill the JSON File

Once you've collected the data using this template, update `bazaraki-vehicles.json`:

```json
{
  "bazarakiUrl": "PASTE_URL_HERE",
  "make": "PASTE_MAKE",
  "model": "PASTE_MODEL",
  "year": 2016,
  "mileage": PASTE_MILEAGE_NUMBER,
  "price": PASTE_PRICE_NUMBER,
  "currency": "EUR",
  "condition": "used",
  "category": "box-truck",
  "engineType": "diesel",
  "transmission": "manual",
  "horsepower": PASTE_HP_NUMBER,
  "location": "PASTE_CITY",
  "country": "Cyprus",
  "vin": "MAKE-YEAR-MODEL-001",
  "images": [
    "IMAGE_URL_1",
    "IMAGE_URL_2"
  ],
  "specifications": {
    "gvw": PASTE_GVW,
    "engineCapacity": PASTE_ENGINE_SIZE,
    "emissionStandard": "Euro 5"
  },
  "features": [
    "FEATURE_1",
    "FEATURE_2"
  ],
  "description": "PASTE_FULL_DESCRIPTION",
  "available": true,
  "featured": false
}
```

---

## Tips for Fast Data Entry

1. **Open all 15 Bazaraki links in browser tabs**
2. **For each tab:**
   - Copy the title → extract Make, Model, Year
   - Find the price → note it down
   - Find mileage in details → note it down
   - Copy image URLs (right-click → Copy Image Address)
   - Copy the description text
   - Note any special features

3. **Update the JSON file** with all the collected data

4. **Run the import:** `npm run import-vehicles`

---

## Common Fields

### Makes You'll See:
- DAF
- Isuzu
- Toyota
- Nissan
- Mitsubishi
- Ford
- Iveco
- MAN
- Mercedes-Benz

### Typical Engine Capacities:
- Small pickups: 2.2L - 2.5L
- Medium trucks: 3.0L - 4.5L
- Large trucks: 6.0L - 13.0L

### Typical Horsepower:
- Small pickups: 130-160 HP
- Medium trucks: 150-200 HP
- Large trucks: 300-500 HP

### Cyprus Locations:
- Nicosia (Lefkosia)
- Limassol (Lemesos)
- Larnaca
- Paphos (Pafos)
- Famagusta
- Kyrenia
