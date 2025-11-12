# Admin Panel Setup Instructions

## Database Policies Setup

The admin panel requires specific Row Level Security (RLS) policies to function properly. Follow these steps to configure your Supabase database:

### Step 1: Apply Admin Policies

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `lib/supabase/admin-policies.sql`
5. Click **Run** to execute the policies

The policies will:
- Allow INSERT operations on vehicles table
- Allow UPDATE operations on vehicles table
- Allow DELETE operations on vehicles table
- Allow SELECT on all vehicles (not just available ones)
- Allow SELECT on inquiries table for admin viewing

### Step 2: Verify Policies

After running the SQL, verify the policies were created:

```sql
SELECT * FROM pg_policies WHERE tablename IN ('vehicles', 'inquiries');
```

You should see policies like:
- `Allow public insert on vehicles`
- `Allow public update on vehicles`
- `Allow public delete on vehicles`
- `Allow public read access to all vehicles`
- `Allow public read on inquiries`

### Step 3: Test Admin Panel

1. Start your development server: `npm run dev`
2. Navigate to `/admin/dashboard`
3. Try adding a new vehicle at `/admin/vehicles/new`
4. The form should submit successfully without 400 errors

## Security Notes

**⚠️ IMPORTANT**: The current policies use `WITH CHECK (true)` which allows any client with the anon key to perform admin operations. This is acceptable for:
- Development environments
- Internal tools behind authentication
- Sites with external authentication (Auth0, Clerk, etc.)

**For production**, consider:

### Option 1: External Authentication
Use an authentication provider (Clerk, Auth0, NextAuth) and protect admin routes:

```typescript
// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/inventory", "/contact"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### Option 2: Supabase Authentication
Implement Supabase Auth and update policies:

```sql
-- Replace WITH CHECK (true) with role-based checks
CREATE POLICY "Allow authenticated admin insert on vehicles"
ON vehicles FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt() ->> 'role' = 'admin'
);
```

### Option 3: Network-Level Protection
- Deploy admin panel on separate subdomain
- Use Vercel password protection
- Restrict access via IP allowlist

## Environment Variables

Ensure your `.env.local` has:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For Vercel deployment, set these in the Vercel dashboard under **Settings → Environment Variables**.

## Troubleshooting

### 400 Bad Request Error
- **Cause**: Missing INSERT/UPDATE/DELETE policies
- **Fix**: Run `lib/supabase/admin-policies.sql` in Supabase SQL Editor

### Policy Already Exists Error
```sql
-- Drop all existing policies first
DROP POLICY IF EXISTS "Allow public insert on vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow public update on vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow public delete on vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow public read access to all vehicles" ON vehicles;

-- Then re-run the policy creation statements
```

### Cannot Read Vehicles
- Check that "Allow public read access to all vehicles" policy exists
- Verify RLS is enabled: `ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;`

### Images Not Loading
- Verify image URLs are valid and accessible
- Check CORS settings in Supabase Storage (if using Supabase Storage)
- Ensure Next.js `next.config.js` has proper image domains configured

## Next Steps

After setting up the database policies:

1. **Test the admin panel** - Add, edit, and delete vehicles
2. **Customize the UI** - Update colors, branding in `/app/admin/layout.tsx`
3. **Add authentication** - Implement one of the security options above
4. **Deploy to production** - Use Vercel CLI: `vercel --prod`

## Support

For issues or questions:
- Check Supabase logs in Dashboard → Logs
- Review browser console for client-side errors
- Verify environment variables are set correctly
