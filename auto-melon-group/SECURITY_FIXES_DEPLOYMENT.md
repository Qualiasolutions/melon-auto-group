# Security Fixes & Deployment Guide

## 🎯 Changes Made

### Critical Security Fixes ✅

1. **Removed Insecure Authentication System**
   - Deleted `lib/admin/auth.ts` (hardcoded credentials, forged JWT signatures)
   - Implemented proper Supabase Auth integration
   - Created secure middleware: `lib/auth/admin-middleware.ts`

2. **Protected All Admin API Endpoints**
   - `/api/admin/vehicles` - GET, POST
   - `/api/admin/vehicles/[id]` - GET, PATCH, DELETE
   - `/api/admin/vehicles/bulk-upload` - POST
   - `/api/admin/vehicles/bulk-urls` - POST
   - All routes now require authenticated admin user

3. **Fixed Bulk Image Upload System**
   - Replaced filesystem writes with Supabase Storage
   - Now production-ready for Vercel deployment
   - Images stored in `vehicle-images` bucket

4. **Added Input Validation**
   - Zod schemas for vehicle creation
   - Validated all required fields
   - Type-safe camelCase ↔ snake_case conversion

5. **Moved Configuration to Environment Variables**
   - `ADMIN_EMAILS` - Comma-separated list of admin emails
   - `NEXT_PUBLIC_CONTACT_EMAIL` - Recipient for contact forms
   - `RESEND_FROM_EMAIL` - Sender email for notifications

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup

**Required in Vercel Dashboard:**

```bash
# Supabase (CRITICAL)
NEXT_PUBLIC_SUPABASE_URL=https://betmyuzngytzqdhplrqu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin Authentication (CRITICAL)
ADMIN_EMAILS=admin@automelon.com,tasos@automelon.com

# Email Configuration (REQUIRED)
RESEND_API_KEY=re_your_key_here
NEXT_PUBLIC_CONTACT_EMAIL=info@melonautogroup.com
RESEND_FROM_EMAIL="Auto Melon Group <noreply@melonautogroup.com>"

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://auto-melon-group.vercel.app

# Optional
FIRECRAWL_API_KEY=fc-xxx (if using smart import)
APIFY_API_TOKEN=apify_api_xxx (if using scrapers)
```

### 2. Supabase Configuration

**Storage Bucket Setup:**
1. Go to Supabase Dashboard → Storage
2. Create bucket named: `vehicle-images`
3. Set policies:
   ```sql
   -- Allow public read access
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'vehicle-images' );

   -- Allow authenticated admin uploads
   CREATE POLICY "Admin upload access"
   ON storage.objects FOR INSERT
   WITH CHECK ( bucket_id = 'vehicle-images' AND auth.role() = 'authenticated' );
   ```

**Admin User Setup:**
1. Go to Supabase Dashboard → Authentication → Users
2. Create admin users with emails matching `ADMIN_EMAILS`
3. Verify email addresses
4. Test login at `/admin/login`

### 3. Resend Email Setup

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add and verify your domain (melonautogroup.com)
3. Update `RESEND_FROM_EMAIL` to use verified domain
4. Test contact form submission

---

## 🚀 Deployment Steps

### Option 1: Automatic Deployment (Recommended)

```bash
# Push to GitHub (if connected to Vercel)
git push origin main
```

Vercel will auto-deploy when push is detected.

### Option 2: Manual Deployment

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Deploy to production
vercel --prod
```

---

## ✅ Post-Deployment Testing

### 1. Test Admin Authentication

```bash
# Visit admin login
https://your-domain.com/admin/login

# Try logging in with admin email (from ADMIN_EMAILS)
# Should redirect to /admin/dashboard if successful
```

### 2. Test Admin API Protection

```bash
# Without auth - should return 401
curl https://your-domain.com/api/admin/vehicles

# Expected response:
# {"error":"Unauthorized. Admin access required."}
```

### 3. Test Vehicle Management

1. Login to admin panel
2. Go to `/admin/vehicles/new`
3. Create a test vehicle
4. Upload images using bulk upload
5. Verify images appear in Supabase Storage bucket
6. Edit vehicle details
7. Delete test vehicle

### 4. Test Public Pages

1. Visit homepage - featured vehicles should load
2. Visit `/en/inventory` - all vehicles should display
3. Test search functionality
4. Test filter combinations
5. Visit vehicle detail page
6. Submit contact form
7. Submit custom order request

### 5. Test Internationalization

1. Switch between English (`/en/`) and Greek (`/el/`)
2. Verify all translations display correctly
3. Check locale routing works

---

## 🔒 Security Verification

### Admin Access Control
- ✅ Only users in `ADMIN_EMAILS` can access admin panel
- ✅ All admin API routes require authentication
- ✅ Unauthenticated requests return 401
- ✅ No hardcoded credentials in code

### Data Validation
- ✅ Vehicle creation validates all fields
- ✅ Image uploads validate file types
- ✅ Contact forms validate required fields
- ✅ Type-safe database operations

### File Upload Security
- ✅ Images stored in Supabase Storage (not filesystem)
- ✅ Public URLs generated securely
- ✅ File type validation prevents non-images
- ✅ Unique filenames prevent collisions

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" on Admin Panel

**Solution:**
1. Check user email is in `ADMIN_EMAILS` env var
2. Verify user is registered in Supabase Auth
3. Check Supabase session cookie is set
4. Clear browser cookies and re-login

### Issue: Bulk Upload Fails

**Solution:**
1. Verify `vehicle-images` bucket exists in Supabase Storage
2. Check `SUPABASE_SERVICE_ROLE_KEY` is set correctly
3. Verify storage policies allow authenticated uploads
4. Check browser console for detailed error messages

### Issue: Contact Form Not Sending Emails

**Solution:**
1. Verify `RESEND_API_KEY` is valid
2. Check `RESEND_FROM_EMAIL` uses verified domain
3. Verify `NEXT_PUBLIC_CONTACT_EMAIL` is correct
4. Check Resend dashboard for delivery status

### Issue: Images Not Displaying

**Solution:**
1. Check Supabase Storage bucket is public
2. Verify public URL policy exists
3. Check image URLs in database are valid
4. Inspect network tab for 403/404 errors

---

## 📊 Performance Improvements (Planned)

The following improvements are documented but not yet implemented:

### Database Search Optimization
- [ ] Add PostgreSQL full-text search indexes
- [ ] Implement server-side search (`.or()` with `ilike()`)
- [ ] Remove client-side filtering

### Search UX Improvements
- [ ] Add 400ms debouncing on search input
- [ ] Sync all filters to URL parameters
- [ ] Enable shareable search results

### Pagination
- [ ] Implement 24 vehicles per page
- [ ] Add "Load More" or infinite scroll
- [ ] Use `.range()` for database pagination

---

## 📝 Breaking Changes

### For Existing Deployments

1. **Admin Authentication Changed**
   - Old system with hardcoded credentials removed
   - Must register admin users in Supabase Auth
   - Must set `ADMIN_EMAILS` environment variable

2. **Image Upload System Changed**
   - Old filesystem uploads no longer work
   - Must create `vehicle-images` bucket in Supabase Storage
   - Existing local images must be migrated to cloud storage

3. **Environment Variables Required**
   - `SUPABASE_SERVICE_ROLE_KEY` now required
   - `ADMIN_EMAILS` now required
   - `RESEND_FROM_EMAIL` recommended for proper email delivery

---

## 🎉 Success Criteria

Deployment is successful when:

✅ Build completes without errors
✅ Admin login works with Supabase Auth
✅ Unauthorized API requests return 401
✅ Bulk image upload stores files in Supabase Storage
✅ Contact forms send emails
✅ All public pages load correctly
✅ Search and filtering work
✅ Both locales (en/el) function properly

---

## 📞 Support

If issues persist after deployment:

1. Check Vercel deployment logs
2. Check Supabase logs (Database → Logs)
3. Check browser console for client-side errors
4. Review environment variables in Vercel dashboard

---

**Deployment Date:** 2025-01-24
**Version:** 2.0.0 (Security Update)
**Status:** ✅ Ready for Production
