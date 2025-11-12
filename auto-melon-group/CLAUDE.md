# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Auto Melon Group is a professional truck dealership website built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui, and Supabase. The site showcases commercial vehicles (trucks) with advanced filtering, search functionality, and inquiry management.

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Radix UI primitives via shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Deployment**: Vercel (configured)

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production build locally
npm start

# Run linting
npm run lint

# Data Management Scripts (run with tsx)
npm run check-setup            # Verify environment and database configuration
npm run transform-data         # Transform scraped vehicle data to proper format
npm run import-vehicles        # Import vehicles from JSON to Supabase database
tsx scripts/scrape-truck-images.ts      # Scrape truck images from external sources
tsx scripts/process-images.ts           # Process and optimize scraped images
tsx scripts/import-processed-images.ts  # Import processed images to database

# Additional utility scripts
tsx scripts/list-vehicles.ts            # List all vehicles in database
tsx scripts/remove-vehicles.ts          # Remove vehicles from database
tsx scripts/download-images.ts          # Download images from URLs
tsx scripts/update-vehicle-images.ts    # Update vehicle image URLs
tsx scripts/update-to-local-images.ts   # Switch to local image storage

# Add new shadcn/ui component
npx shadcn@latest add [component-name]
```

## Database Setup

The project uses Supabase for data management. Database schema is located at `lib/supabase/schema.sql`.

**To set up the database:**
1. Access Supabase SQL Editor at your project dashboard
2. Copy contents of `lib/supabase/schema.sql`
3. Execute in SQL Editor
4. Schema includes sample data (3 trucks) for testing

**Environment variables** (`.env.local`):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

See `DATABASE_SETUP.md` for detailed instructions.

**Data Management Scripts:**
The `scripts/` directory contains utility scripts for vehicle data management:
- `check-setup.ts` - Verify environment and database connectivity
- `scrape-bazaraki.ts` - Scrape vehicle listings from Bazaraki.com
- `transform-scraped-data.ts` - Clean and normalize scraped data
- `import-vehicles.ts` - Bulk import vehicles to Supabase with validation
- `list-vehicles.ts` - List all vehicles in database
- `remove-vehicles.ts` - Remove vehicles from database
- `scrape-truck-images.ts` - Scrape vehicle images from external sources
- `process-images.ts` - Optimize and resize images for web
- `import-processed-images.ts` - Import optimized images to database
- `download-images.ts` - Download images from URLs
- `update-vehicle-images.ts` - Update vehicle image URLs in database
- `update-to-local-images.ts` - Switch from external URLs to local image storage

Run scripts with: `npm run <script-name>` (for scripts in package.json) or `tsx scripts/<script-name>.ts`

**Scripts Directory Documentation:**
The `scripts/` directory also contains:
- `README.md` - Detailed script documentation and workflows
- `IMPORT_GUIDE.md` - Step-by-step import guide
- `IMPORT_INSTRUCTIONS.md` - Import process instructions
- `QUICK_REFERENCE.md` - Quick reference for common tasks
- `DATA_COLLECTION_TEMPLATE.md` - Template for vehicle data collection
- SQL setup files (`add-insert-policy.sql`, `create-schema.js`, etc.)
- Data files (`bazaraki-vehicles.json`, `image-mapping.json`)

## Architecture Overview

### Directory Structure

```
app/                    # Next.js App Router pages
├── layout.tsx          # Root layout with Header/Footer
├── page.tsx            # Homepage (server component)
├── inventory/
│   ├── page.tsx        # Inventory listing (client component)
│   └── [id]/page.tsx   # Vehicle detail page
├── contact/page.tsx    # Contact page
└── about/page.tsx      # About page

components/
├── ui/                 # shadcn/ui primitives (button, card, dialog, etc.)
├── layout/             # Layout components (Header, Footer)
├── sections/           # Page sections (Hero, VehicleCard)
└── filters/            # Filter components (FilterSidebar, ActiveFilters)

lib/
├── utils.ts            # Utility functions (cn for class merging)
└── supabase/
    ├── client.ts       # Supabase client initialization
    └── schema.sql      # Database schema

types/
├── vehicle.ts          # Vehicle types and filter definitions
└── database.ts         # Supabase database types

config/
└── site.ts             # Site-wide configuration (contact, links, metadata)
```

### Key Architectural Patterns

**1. Server/Client Component Split**
- Homepage (`app/page.tsx`): Server Component - fetches featured vehicles at build/request time
- Inventory Page (`app/inventory/page.tsx`): Client Component - handles interactive filtering, search, and real-time state
- Use `"use client"` directive when components need useState, useEffect, or event handlers

**2. Database Interaction**
- All database queries use Supabase client (`lib/supabase/client.ts`)
- Type-safe queries with `Database` type from `types/database.ts`
- RLS (Row Level Security) enabled - public read access to available vehicles
- Server-side fetching pattern:
  ```typescript
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('available', true)
  ```

**3. Type System**
- Central types in `types/vehicle.ts`:
  - `Vehicle`: Complete vehicle entity
  - `VehicleFilters`: Filter state and URL params
  - `VehicleSpecifications`: JSONB specifications field
- Database types auto-generated in `types/database.ts`
- Strict TypeScript with path aliases (`@/*` maps to root)

**4. Filtering Architecture**
- Filter state managed in `app/inventory/page.tsx`
- Filters applied directly in Supabase queries (server-side filtering)
- URL sync for shareable filtered views (via Next.js searchParams)
- Filter components are pure - receive filters/onChange props
- Complex filter logic: ranges (price, year, mileage), arrays (make, category), booleans (featured, certified)

**5. Component Organization**
- `components/ui/`: Atomic shadcn/ui components (button, card, input, etc.)
- `components/sections/`: Composite UI sections (Hero, VehicleCard)
- `components/layout/`: Layout wrappers (Header with navigation, Footer)
- `components/filters/`: Filter-specific components (sidebar, active filter chips)

**6. Styling Strategy**
- Tailwind utility-first classes
- CSS variables for theming (defined in `app/globals.css`)
- Brand colors: Orange-600 primary (`#ea580c`), neutral grays
- Responsive breakpoints: mobile-first, `md:`, `lg:`, `xl:`
- Use `cn()` utility from `lib/utils.ts` for conditional class merging

## Working with Vehicle Data

**Vehicle Entity Structure:**
```typescript
{
  id: string              // UUID
  make: string            // Mercedes-Benz, Scania, Volvo, DAF, etc.
  model: string
  year: number            // 1900-current+2
  mileage: number         // in kilometers
  price: number           // base price
  currency: "EUR" | "USD"
  condition: "new" | "used" | "certified"
  category: "semi-truck" | "dump-truck" | "box-truck" | etc.
  engineType: "diesel" | "electric" | "hybrid" | "gas"
  transmission: "manual" | "automatic" | "automated-manual"
  horsepower: number
  location: string
  country: string
  vin: string             // unique
  images: string[]        // array of URLs
  specifications: {       // JSONB field
    axleConfiguration?: string
    gvw?: number
    engineCapacity?: number
    emissionStandard?: string
    // ... flexible schema
  }
  features: string[]
  description: string
  available: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
}
```

**Querying Patterns:**
- Available vehicles only: `.eq('available', true)`
- Featured vehicles: `.eq('featured', true).limit(6)`
- Filtering: `.in('make', ['Mercedes-Benz', 'Scania'])`
- Range filters: `.gte('price', min).lte('price', max)`
- Search: `.or('make.ilike.%term%,model.ilike.%term%,description.ilike.%term%')`
- Sorting: `.order('price', { ascending: true })`

## shadcn/ui Components

This project uses shadcn/ui's "New York" style with Lucide icons. Components are in `components/ui/`.

**Installed components:**
- button, card, input, dialog, dropdown-menu
- navigation-menu, select, slider, badge, separator
- tabs, accordion, label, form, checkbox, sheet

**To add new components:**
```bash
npx shadcn@latest add [component-name]
```

Components are copied into the project (not npm packages) for full customization.

## Common Development Tasks

### Adding a New Page
1. Create file in `app/` directory (e.g., `app/services/page.tsx`)
2. Use Server Component by default, add `"use client"` if needed
3. Update Header navigation in `components/layout/Header.tsx`
4. Add to sitemap if implementing SEO

### Adding a New Filter
1. Update `VehicleFilters` type in `types/vehicle.ts`
2. Add filter UI in `components/filters/FilterSidebar.tsx`
3. Implement query logic in `app/inventory/page.tsx` useEffect
4. Handle filter removal in `handleFilterRemove` function
5. Add to `ActiveFilters` display if needed

### Modifying Database Schema
1. Update `lib/supabase/schema.sql` with ALTER/CREATE statements
2. Run SQL in Supabase dashboard SQL Editor
3. Update `types/vehicle.ts` and `types/database.ts` to match
4. Redeploy to Vercel if production database changed

### Adding a New shadcn/ui Component
```bash
# Example: adding a carousel for image galleries
npx shadcn@latest add carousel

# Component will be added to components/ui/carousel.tsx
# Import and use: import { Carousel } from "@/components/ui/carousel"
```

## Configuration Files

**Site-wide settings** (`config/site.ts`):
- Site name, description, URLs
- Contact information (email, phone, WhatsApp)
- Social media links
- Supported languages/currencies

**Update contact info:**
Edit `config/site.ts` - values used in Header, Footer, and metadata.

**TypeScript paths** (`tsconfig.json`):
- `@/*` maps to project root
- Enables clean imports: `@/components/ui/button` instead of `../../../components/ui/button`

## Important Development Notes

1. **Server vs Client Components**: Default to Server Components unless you need interactivity (useState, event handlers). Inventory page is client-side for real-time filtering; homepage is server-side for better performance.

2. **Database Column Naming**: Supabase uses snake_case (`created_at`), but TypeScript interfaces use camelCase (`createdAt`). Make sure conversions are handled consistently.

3. **Image Handling**: Vehicle images are stored as URL arrays. Use Next.js `<Image>` component with proper sizing for optimization.

4. **RLS Policies**: Row Level Security is enabled. Public can read available vehicles and insert inquiries. Admin operations require service role key.

5. **Environment Variables**: Prefix with `NEXT_PUBLIC_` for client-side access. Restart dev server after `.env.local` changes.

6. **Filter State Management**: Filters in inventory page sync with URL params for shareable links. Use `useSearchParams` and `router.push` for URL updates.

7. **Responsive Design**: Mobile-first approach. Test on small screens first. Use Tailwind breakpoints (`md:`, `lg:`) for larger screens.

8. **Type Safety**: All Supabase queries should be typed with `Database` type. Cast results to `Vehicle[]` when needed.

## Debugging and Troubleshooting

**Verify Environment Setup:**
```bash
npm run check-setup  # Validates .env.local and Supabase connectivity
```

**Common Issues:**

1. **Supabase Connection Errors**
   - Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
   - Check that Supabase project is active and not paused
   - Run `npm run check-setup` to diagnose

2. **No Vehicles Displaying**
   - Check if vehicles are imported: `tsx scripts/list-vehicles.ts`
   - Verify `available = true` flag on vehicles in database
   - Check Supabase RLS policies allow public read access

3. **Filter Not Working**
   - Check browser console for errors
   - Verify Supabase query syntax in `app/inventory/page.tsx`
   - Ensure filter state is properly synced with URL params

4. **Build Failures**
   - Run `npm run lint` to check for TypeScript/ESLint errors
   - Verify all imports are correct and files exist
   - Check for missing environment variables in build environment

5. **Script Execution Issues**
   - Ensure `tsx` is installed: `npm install tsx --save-dev`
   - Verify script file paths are correct
   - Check that `.env.local` is present for database scripts

## Git Workflow

This project has git initialized. Standard git workflow:

```bash
git status                      # Check current status
git add .                       # Stage all changes
git commit -m "Your message"    # Commit changes
git push                        # Push to remote (if configured)
```

**Note:** Only this project directory (`auto-melon-group/`) is under version control, not the parent workspace directory.

## Deployment

**Vercel Deployment (configured):**
- Project is connected to Vercel
- Environment variables configured via Vercel dashboard
- Automatic deployments on git push (if GitHub connected)
- Build command: `npm run build`
- Output directory: `.next`

**Manual deployment:**
```bash
npm run build              # Test build locally
vercel --prod              # Deploy to production
```

**Environment variables in Vercel:**
Set in Vercel dashboard under Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

See `VERCEL_SETUP.md` and `DEPLOYMENT_SUCCESS.md` for detailed deployment docs.

## Related Documentation

- `README.md` - Standard Next.js starter documentation
- `SETUP_GUIDE.md` - Comprehensive setup and development guide with phase breakdown
- `PROJECT_STATUS.md` - Current implementation status and progress tracking
- `DATABASE_SETUP.md` - Database schema setup instructions
- `QUICK_START.md` - Quick reference for getting started
- `VERCEL_SETUP.md` - Vercel deployment configuration
- `DEPLOYMENT_SUCCESS.md` - Post-deployment success notes
