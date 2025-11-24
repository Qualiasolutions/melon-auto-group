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
- **Icons**: Lucide React (migrated from Material Symbols)
- **Animation**: Framer Motion
- **Internationalization**: Custom i18n implementation with locale routing
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

# Additional admin scripts
npm run scrape-autotrader         # Scrape AutoTrader listings
npm run playwright:install        # Install Playwright browser for scraping
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
├── page.tsx            # Homepage (server component) - redirects to locale
├── [locale]/           # Localized routes (en, el)
│   ├── page.tsx        # Localized homepage
│   ├── inventory/
│   │   ├── page.tsx        # Inventory listing (client component with Suspense)
│   │   └── [id]/page.tsx   # Vehicle detail page
│   ├── contact/page.tsx    # Contact page
│   ├── about/page.tsx      # About page
│   ├── faq/page.tsx        # FAQ page
│   └── custom-order/page.tsx # Custom order request page
├── inventory/          # Legacy routes (still present)
│   ├── page.tsx
│   └── [id]/page.tsx
├── loading.tsx         # Global loading state
├── not-found.tsx       # 404 page
└── admin/              # Admin dashboard (NOT locale-prefixed)
    ├── layout.tsx      # Admin layout wrapper
    ├── login/page.tsx  # Admin authentication
    ├── dashboard/page.tsx    # Admin overview
    ├── vehicles/
    │   ├── page.tsx          # Vehicle management list
    │   ├── new/page.tsx      # Add new vehicle form
    │   ├── [id]/edit/page.tsx # Edit vehicle form
    │   ├── import/page.tsx   # Bulk import interface
    │   └── bulk-images/page.tsx # Bulk image upload
    ├── scraping/       # Web scraping interfaces
    │   ├── bazaraki/page.tsx    # Bazaraki scraper
    │   ├── autotrader/page.tsx  # AutoTrader scraper
    │   └── facebook/page.tsx    # Facebook scraper
    └── settings/page.tsx     # Admin settings

components/
├── ui/                 # shadcn/ui primitives (button, card, dialog, etc.)
├── layout/             # Layout components (Header, Footer)
├── sections/           # Page sections (Hero, VehicleCard, VehicleGallery, SearchHeader)
└── filters/            # Filter components (FilterSidebar, ActiveFilters, ViewOptions, QuickFilters)

lib/
├── utils.ts            # Utility functions (cn for class merging)
├── supabase/
│   ├── client.ts       # Supabase client initialization
│   └── schema.sql      # Database schema
└── validations/        # Zod validation schemas
    ├── vehicle.ts      # Vehicle form validation
    └── custom-order.ts # Custom order form validation

types/
├── vehicle.ts          # Vehicle types and filter definitions
└── database.ts         # Supabase database types

config/
├── site.ts             # Site-wide configuration (contact, links, metadata)
└── i18n.ts             # i18n configuration (supported locales, default locale)

lib/i18n/
├── dictionaries/       # Translation JSON files
│   ├── en.json         # English translations
│   └── el.json         # Greek translations
└── locale-detector.ts  # Browser/cookie-based locale detection

middleware.ts           # Next.js middleware for locale routing and Supabase session

scripts/                # Data management and utility scripts
├── check-setup.ts           # Environment verification
├── scrape-bazaraki.ts       # Web scraping
├── transform-scraped-data.ts # Data normalization
├── import-vehicles.ts       # Bulk vehicle import
├── list-vehicles.ts         # List database vehicles
├── remove-vehicles.ts       # Remove vehicles
└── [image scripts]          # Image processing utilities
```

### Key Architectural Patterns

**1. Server/Client Component Split**
- Homepage (`app/page.tsx`): Server Component - fetches featured vehicles at build/request time
- Inventory Page (`app/inventory/page.tsx`): Client Component wrapped in Suspense - handles interactive filtering, search, and real-time state
- Use `"use client"` directive when components need useState, useEffect, or event handlers
- Wrap client components with searchParams in `<Suspense>` to prevent static generation errors
- Pattern: Export default wrapper component with Suspense, implement main logic in separate component

**2. Database Interaction**
- All database queries use Supabase client (`lib/supabase/client.ts`)
- Type-safe queries with `Database` type from `types/database.ts`
- RLS (Row Level Security) enabled - public read access to available vehicles
- **IMPORTANT: Database uses snake_case columns** (`created_at`, `engine_type`), TypeScript interfaces use camelCase (`createdAt`, `engineType`)
- Supabase automatically handles the conversion for top-level columns
- Server-side fetching pattern:
  ```typescript
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('available', true)
  ```
- Filtering with `in()` for arrays: `.in('make', ['Mercedes-Benz', 'Scania'])`
- Range filtering: `.gte('price', min).lte('price', max)`
- Text search with `or()`: `.or('make.ilike.%term%,model.ilike.%term%')`

**3. Type System & Validation**
- Central types in `types/vehicle.ts`:
  - `Vehicle`: Complete vehicle entity
  - `VehicleFilters`: Filter state and URL params
  - `VehicleSpecifications`: JSONB specifications field
- Database types auto-generated in `types/database.ts`
- Form validation with Zod schemas in `lib/validations/`:
  - `lib/validations/vehicle.ts`: Vehicle creation/editing forms
  - `lib/validations/custom-order.ts`: Custom order request forms
- Strict TypeScript with path aliases (`@/*` maps to root)
- Use Zod with React Hook Form via `@hookform/resolvers/zod`

**4. Filtering Architecture**
- Filter state managed in `app/inventory/page.tsx`
- Filters applied directly in Supabase queries (server-side filtering)
- URL sync for shareable filtered views (via Next.js searchParams)
- Filter components are pure - receive filters/onChange props
- Complex filter logic: ranges (price, year, mileage), arrays (make, category), booleans (featured, certified)

**5. Internationalization (i18n)**
- Custom i18n implementation with locale routing (`/en/`, `/el/`)
- Middleware (`middleware.ts`) redirects root paths to locale-prefixed URLs
- Locale detection: Browser Accept-Language header → cookies → default to English
- Translation files: `lib/i18n/dictionaries/en.json`, `lib/i18n/dictionaries/el.json`
- Configuration: `config/i18n.ts` defines supported locales (`en`, `el`)
- Locale cookie: `NEXT_LOCALE` stored for 1 year
- Admin routes bypass locale routing (no `/[locale]/admin/`)
- Pattern for accessing translations in Server Components:
  ```typescript
  import { getDictionary } from '@/lib/i18n/get-dictionary'
  const dict = await getDictionary(locale)
  // Use: dict.nav.home, dict.inventory.filters.make, etc.
  ```

**6. Component Organization**
- `components/ui/`: Atomic shadcn/ui components (button, card, input, etc.)
- `components/sections/`: Composite UI sections (Hero, VehicleCard)
- `components/layout/`: Layout wrappers (Header with navigation, Footer)
- `components/filters/`: Filter-specific components (sidebar, active filter chips)

**7. Styling Strategy**
- Tailwind utility-first classes
- CSS variables for theming (defined in `app/globals.css`)
- Brand colors: Orange-600 primary (`#ea580c`), neutral grays
- Responsive breakpoints: mobile-first, `md:`, `lg:`, `xl:`
- Use `cn()` utility from `lib/utils.ts` for conditional class merging
- **Icons**: Lucide React library (project migrated from Material Symbols in Nov 2024)

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
1. Create file in `app/[locale]/` directory for localized pages (e.g., `app/[locale]/services/page.tsx`)
2. For admin pages, create in `app/admin/` (no locale prefix)
3. Use Server Component by default, add `"use client"` if needed
4. If using `useSearchParams`, wrap in Suspense (see `app/[locale]/inventory/page.tsx` pattern)
5. Accept `params` prop with `locale` for i18n:
   ```typescript
   export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
     const { locale } = await params
     const dict = await getDictionary(locale)
     // ...
   }
   ```
6. Update Header navigation in `components/layout/Header.tsx`
7. Add translations to `lib/i18n/dictionaries/en.json` and `el.json`
8. Add to sitemap if implementing SEO

### Adding a New Filter
1. Update `VehicleFilters` type in `types/vehicle.ts`
2. Add filter UI in `components/filters/FilterSidebar.tsx`
3. Implement query logic in `app/inventory/page.tsx` useEffect
4. **IMPORTANT**: Use snake_case for database column names in queries (e.g., `engine_type` not `engineType`)
5. Create type guard if needed (e.g., `isMultiSelectKey` for array filters)
6. Handle filter removal in `handleFilterRemove` function
7. Add to `ActiveFilters` display if needed

### Modifying Database Schema
1. Update `lib/supabase/schema.sql` with ALTER/CREATE statements
2. Run SQL in Supabase dashboard SQL Editor
3. Update `types/vehicle.ts` and `types/database.ts` to match
4. Redeploy to Vercel if production database changed

### Adding a New Form with Validation
1. Create Zod schema in `lib/validations/` (e.g., `inquiry.ts`)
2. Define form component with `useForm` hook from `react-hook-form`
3. Use `zodResolver` to connect schema: `resolver: zodResolver(inquirySchema)`
4. Use shadcn Form components for consistent styling
5. Handle submission with proper error handling and loading states
6. Example pattern:
   ```typescript
   const form = useForm<z.infer<typeof schema>>({
     resolver: zodResolver(schema),
     defaultValues: { /* ... */ }
   })
   ```

### Adding a New shadcn/ui Component
```bash
# Example: adding a carousel for image galleries
npx shadcn@latest add carousel

# Component will be added to components/ui/carousel.tsx
# Import and use: import { Carousel } from "@/components/ui/carousel"
```

### Working with Translations
1. **Adding new translations**:
   - Edit `lib/i18n/dictionaries/en.json` for English text
   - Edit `lib/i18n/dictionaries/el.json` for Greek text
   - Keep structure identical in both files
   - Use nested objects for organization: `"inventory.filters.make"`

2. **Using translations in Server Components**:
   ```typescript
   import { getDictionary } from '@/lib/i18n/get-dictionary'
   import type { Locale } from '@/types/i18n'

   export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
     const { locale } = await params
     const dict = await getDictionary(locale)
     return <h1>{dict.page.title}</h1>
   }
   ```

3. **Using translations in Client Components**:
   - Pass translations as props from parent Server Component
   - Or use React Context for deeply nested components
   - Dictionary loading must happen in Server Component

4. **Locale switching**:
   - User selects locale from language switcher in Header
   - Middleware sets `NEXT_LOCALE` cookie
   - Next navigation updates URL with new locale prefix

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

1. **Server vs Client Components**: Default to Server Components unless you need interactivity (useState, event handlers). Inventory page is client-side for real-time filtering; homepage is server-side for better performance. Wrap client components using `useSearchParams` in `<Suspense>` to avoid static generation errors.

2. **Database Column Naming**: Database uses snake_case (`created_at`, `engine_type`), TypeScript uses camelCase (`createdAt`, `engineType`). Supabase client automatically converts top-level columns. When querying, use snake_case: `.in('engine_type', filters.engineType)`.

3. **Image Handling**: Vehicle images are stored as URL arrays. Use Next.js `<Image>` component with proper sizing for optimization.

4. **RLS Policies**: Row Level Security is enabled. Public can read available vehicles and insert inquiries. Admin operations require service role key.

5. **Environment Variables**: Prefix with `NEXT_PUBLIC_` for client-side access. Restart dev server after `.env.local` changes.

6. **Filter State Management**: Filters in inventory page sync with URL params for shareable links. Use `useSearchParams` and `router.push` for URL updates. Implement type guards for filter keys (see `isMultiSelectKey`, `isPriceKey` pattern in `app/inventory/page.tsx`).

7. **Responsive Design**: Mobile-first approach. Test on small screens first. Use Tailwind breakpoints (`md:`, `lg:`) for larger screens. Filter sidebar is sticky on desktop, Sheet component for mobile.

8. **Type Safety**: All Supabase queries should be typed with `Database` type. Cast results to `Vehicle[]` when needed.

9. **Form Validation**: Use Zod schemas from `lib/validations/` with React Hook Form. Define schema, use `zodResolver`, and handle form submission with proper error handling.

10. **Admin Dashboard**: Admin routes in `app/admin/` include authentication via `/admin/login`. Structure includes vehicle management, bulk import, bulk image upload, web scraping interfaces (Bazaraki, AutoTrader, Facebook), and settings.

11. **Internationalization**: All public pages support English (`/en/`) and Greek (`/el/`) locales. Admin pages are NOT localized. When adding new pages, create them in `app/[locale]/` and add translations to both `en.json` and `el.json`.

12. **Icon System**: Project uses Lucide React icons exclusively. Do not import from Material Symbols or other icon libraries. All icons should be imported from `lucide-react`.

13. **Bulk Image Upload**: Admin panel at `/admin/vehicles/bulk-images` supports uploading multiple images at once and associating them with vehicles. Recent feature added November 2024.

14. **Web Scraping**: Admin interfaces at `/admin/scraping/` allow scraping vehicle listings from Bazaraki, AutoTrader, and Facebook. Requires Playwright for browser automation (`npm run playwright:install`).

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

**Quick deployment via CLI:**
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy to production
vercel --prod
```

See `VERCEL_SETUP.md` and `DEPLOYMENT_SUCCESS.md` for detailed deployment docs.

## Related Documentation

- `README.md` - Standard Next.js starter documentation
- `SETUP_GUIDE.md` - Comprehensive setup and development guide with phase breakdown
- `PROJECT_STATUS.md` - Current implementation status and progress tracking
- `DATABASE_SETUP.md` - Database schema setup instructions
- `QUICK_START.md` - Quick reference for getting started
- `VERCEL_SETUP.md` - Vercel deployment configuration
- `DEPLOYMENT_SUCCESS.md` - Post-deployment success notes
