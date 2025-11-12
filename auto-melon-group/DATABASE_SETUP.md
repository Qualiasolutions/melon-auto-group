# Database Setup Instructions

## Quick Setup via Supabase Dashboard

Since direct CLI connection is having SSL issues, please follow these steps to set up the database:

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard:
   - URL: https://supabase.com/dashboard/project/betmyuzngytzqdhplrqu

2. Navigate to the SQL Editor:
   - Click on "SQL Editor" in the left sidebar
   - Or go directly to: https://supabase.com/dashboard/project/betmyuzngytzqdhplrqu/sql/new

### Step 2: Execute the Schema SQL

1. Copy the entire contents of `lib/supabase/schema.sql`
2. Paste it into the SQL Editor
3. Click "Run" or press Cmd/Ctrl + Enter

The SQL will:
- Create the `vehicles` and `inquiries` tables
- Set up indexes for performance
- Enable Row Level Security (RLS)
- Create policies for public read access
- Insert 3 sample trucks (Mercedes, Scania, Volvo)

### Step 3: Verify the Setup

After running the SQL, verify that:
- Tables are created: Go to "Table Editor" and you should see `vehicles` and `inquiries`
- Sample data exists: Click on `vehicles` table and you should see 3 trucks

### Step 4: Redeploy to Vercel

Once the database has data, trigger a new deployment:

```bash
npm run build
vercel --prod
```

Or push to GitHub if you have automatic deployments set up.

## Alternative: Using psql (if you have PostgreSQL client installed)

```bash
psql "postgres://postgres.betmyuzngytzqdhplrqu:[PASSWORD]@aws-1-eu-west-2.pooler.supabase.com:5432/postgres?sslmode=require" < lib/supabase/schema.sql
```

Replace `[PASSWORD]` with the actual password from `.env.local`

## Troubleshooting

### Tables Already Exist Error

If you get an error that tables already exist, the schema is already set up! Just add sample data by running only the INSERT statements from the schema file.

### RLS Policy Issues

If you can't read/write data, check that RLS policies are properly set up:
- Public read access to available vehicles
- Public insert access to inquiries

You can disable RLS temporarily for testing (not recommended for production):
```sql
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
```

## Environment Variables

Make sure these are set in Vercel (already configured via integration):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

All environment variables are already pulled into `.env.local` via `vercel env pull`.
