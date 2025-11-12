# Vehicle Import Instructions

## Issue: RLS Policy Blocking Inserts

The import failed because Row Level Security (RLS) policies are blocking INSERT operations with the anonymous key.

## Solution: Add Temporary INSERT Policy

### Step 1: Add the Policy in Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `scripts/add-insert-policy.sql`
4. Paste and execute it in the SQL Editor
5. You should see: "Success. No rows returned"

### Step 2: Run the Import Again

```bash
npm run import-vehicles
```

### Step 3: Remove the Policy (Production Security)

After successful import, remove the temporary policy:

1. Go back to Supabase SQL Editor
2. Run this command:

```sql
DROP POLICY "Allow anon insert for import" ON vehicles;
```

## Alternative: Use Service Role Key

For a more secure approach (recommended for production):

1. Get your service role key from Supabase Dashboard → Settings → API
2. Add it to `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
3. Update `scripts/import-vehicles.ts` to use the service role key
4. Run the import

## Verification

After successful import, verify:

1. Start dev server: `npm run dev`
2. Visit: http://localhost:3000/inventory
3. Check that all 15 vehicles appear correctly
