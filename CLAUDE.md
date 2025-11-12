# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a workspace directory for truck dealership websites. The active project is located in the `auto-melon-group/` subdirectory.

```
tasos/                          # Workspace root
├── auto-melon-group/           # Active Next.js 16 project (main codebase)
│   ├── CLAUDE.md               # Comprehensive project documentation
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # Project-specific components
│   ├── lib/                    # Project utilities and Supabase client
│   ├── types/                  # TypeScript type definitions
│   ├── config/                 # Site configuration
│   ├── scripts/                # Data import and setup scripts
│   └── package.json            # Project dependencies
├── components/                 # Root-level component prototypes/variations
│   ├── layout/                 # Header, Footer variations
│   └── sections/               # Hero, VehicleCard variations
├── lib/                        # Root-level library code
│   └── supabase/               # Supabase schema and client prototypes
├── .playwright-mcp/            # Playwright browser automation cache (can be ignored)
└── .env.local                  # Shared environment configuration
```

## Working in This Workspace

**Primary Project:** All active development happens in `auto-melon-group/`. This is a Next.js 16 application for a commercial truck dealership specializing in heavy commercial vehicles.

**Root-level Files:** The `components/` and `lib/` directories at the workspace root contain prototype components and library code. These may be:
- Earlier versions of components now in `auto-melon-group/`
- Shared code intended for future projects
- Experimental variations being tested

**⚠️ Important:** When making changes:
1. **Always work in `auto-melon-group/`** for the active truck dealership site
2. Check `auto-melon-group/CLAUDE.md` for comprehensive project-specific guidance
3. Root-level components are NOT imported by the main project - changes there won't affect the live site

## Quick Start

```bash
# Navigate to the main project
cd auto-melon-group

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Configuration

The `.env.local` file at the workspace root contains shared configuration:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

This file should be copied to `auto-melon-group/.env.local` for the project to use it.

## Technology Stack

The main project (`auto-melon-group/`) uses:
- **Next.js 16** with App Router
- **TypeScript** (strict mode)
- **Tailwind CSS 4** + **shadcn/ui**
- **Supabase** (PostgreSQL database)
- **React Hook Form + Zod** for forms
- **Framer Motion** for animations
- **tsx** for running TypeScript scripts

## Development Commands

All commands should be run from the `auto-melon-group/` directory:

```bash
cd auto-melon-group

# Core Development
npm run dev                    # Start dev server (localhost:3000)
npm run build                  # Production build
npm start                      # Run production build locally
npm run lint                   # Run ESLint

# Data Management Scripts
npm run check-setup            # Verify environment and database configuration
npm run transform-data         # Transform scraped vehicle data to proper format
npm run import-vehicles        # Import vehicles from JSON to Supabase database
npm run scrape-images          # Scrape truck images from external sources
npm run process-images         # Process and optimize scraped images
npm run import-processed-images # Import processed images to database

# shadcn/ui Components
npx shadcn@latest add [component-name]
```

## High-Level Architecture

The project follows a modern Next.js 16 architecture with clear separation between server and client components:

### Application Structure

**App Router Architecture:**
- `app/layout.tsx` - Root layout with Header/Footer components
- `app/page.tsx` - Homepage (Server Component) - displays featured trucks
- `app/inventory/page.tsx` - Vehicle inventory (Client Component) - handles filtering, search, and real-time state
- `app/inventory/[id]/page.tsx` - Individual vehicle detail pages
- `app/contact/page.tsx` - Contact page with inquiry forms
- `app/about/page.tsx` - About page

**Component Organization:**
- `components/ui/` - shadcn/ui primitives (button, card, dialog, etc.)
- `components/sections/` - Composite UI sections (Hero, VehicleCard)
- `components/layout/` - Layout wrappers (Header with navigation, Footer)
- `components/filters/` - Filter-specific components (sidebar, active filter chips)
- `components/forms/` - Contact and inquiry form components

### Database Architecture

**Supabase Integration:**
- PostgreSQL database with Row Level Security (RLS)
- Primary table: `vehicles` with comprehensive truck specifications
- JSONB `specifications` field for flexible truck-specific attributes
- RLS policies for public read access to available vehicles
- Inquiry system for customer contacts

**Key Vehicle Data Structure:**
- Core fields: make, model, year, mileage, price, condition, category
- Commercial vehicle specific: engineType, transmission, horsepower, gvw
- Flexible specifications: axleConfiguration, engineCapacity, emissionStandard
- Media: images array for multiple vehicle photos
- Status: available, featured flags for inventory management

### State Management Patterns

**Server/Client Component Split:**
- Homepage uses Server Components for optimal performance and SEO
- Inventory page uses Client Components for interactive filtering
- Filter state synchronized with URL parameters for shareable links
- Form handling with React Hook Form and Zod validation

**Data Flow:**
1. Server Components fetch data at request/build time
2. Client Components handle user interactions and state
3. Supabase queries are type-safe with `Database` interface
4. Filter changes trigger new Supabase queries with server-side filtering

### Import/Export System

**Data Scripts (scripts/ directory):**
- `scrape-bazaraki.ts` - Web scraping for vehicle data
- `transform-scraped-data.ts` - Clean and normalize scraped data
- `import-vehicles.ts` - Bulk import to Supabase with validation
- `check-setup.ts` - Environment and database connectivity verification

## Documentation

For detailed project documentation, see:
- **`auto-melon-group/CLAUDE.md`** - Comprehensive project guide (architecture, commands, patterns)
- **`auto-melon-group/README.md`** - Standard Next.js starter docs
- **`auto-melon-group/scripts/`** - Data import and processing documentation

## Workspace vs Project Files

**Root-level components differ from project components:**

The files in `/components/` and `/lib/` at the workspace root are NOT used by `auto-melon-group/`. The project has its own versions:

| Workspace Root | Project (auto-melon-group/) | Status |
|----------------|----------------------------|--------|
| `components/layout/Header.tsx` | `auto-melon-group/components/layout/Header.tsx` | Different implementations |
| `components/sections/VehicleCard.tsx` | `auto-melon-group/components/sections/VehicleCard.tsx` | Different implementations |
| `lib/supabase/client.ts` | `auto-melon-group/lib/supabase/client.ts` | May differ |

When editing code, **always work in the `auto-melon-group/` directory** to affect the actual application.

## Git Workflow

Git is initialized in the `auto-melon-group/` subdirectory. The workspace root is not tracked.

```bash
cd auto-melon-group

# Standard git workflow
git status
git add .
git commit -m "Your commit message"
git push
```

**Note:** The workspace root (`tasos/`) is NOT under version control. Only the `auto-melon-group/` project is tracked by git.
