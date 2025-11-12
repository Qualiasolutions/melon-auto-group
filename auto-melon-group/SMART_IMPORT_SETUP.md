# Smart Import Feature Setup Guide

## Overview

The Smart Import feature allows you to automatically import vehicle listings from **Bazaraki** and **Facebook Marketplace** by simply pasting the listing URL. The system uses AI-powered data extraction via Firecrawl API to automatically extract all vehicle details.

## Features

- ✨ **AI-Powered Extraction**: Automatically extracts make, model, year, price, mileage, and more
- 🔗 **Multi-Platform Support**: Works with Bazaraki and Facebook Marketplace
- 🖼️ **Image Import**: Automatically extracts vehicle images from listings
- 📝 **Smart Description**: Captures listing descriptions and features
- ⚡ **Fast & Accurate**: Saves time compared to manual data entry

## Required API Key

To use the Smart Import feature, you need a **Firecrawl API key**.

### Get Your Firecrawl API Key

1. Visit: https://www.firecrawl.dev/
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API key

**Free Tier**: Firecrawl offers a generous free tier with enough credits for testing and moderate use.

## Environment Setup

### Local Development (.env.local)

Add the following to your `.env.local` file:

```bash
# Existing Supabase config
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Firecrawl API Key (Required for Smart Import)
FIRECRAWL_API_KEY=fc-your-api-key-here
```

### Vercel Production Deployment

Add the environment variable in your Vercel dashboard:

1. Go to your project on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `FIRECRAWL_API_KEY`
   - **Value**: Your Firecrawl API key
   - **Environments**: Production, Preview, Development
4. Click **Save**
5. Redeploy your application

## How to Use Smart Import

### From Admin Dashboard

1. Log in to the admin panel at `/admin/dashboard`
2. Click the **"Smart Import"** button (featured with AI-Powered badge)
3. Paste a vehicle listing URL from Bazaraki or Facebook Marketplace
4. Click **"Import Vehicle"**
5. Review the automatically extracted data
6. Make any necessary adjustments
7. Save to inventory

### From Import Page Directly

Visit `/admin/vehicles/import` directly to access the import interface.

### Supported URL Formats

**Bazaraki:**
- `https://www.bazaraki.com/adv/...`
- Example: `https://www.bazaraki.com/adv/6075356_daf-2016-7-5t/`

**Facebook Marketplace:**
- `https://www.facebook.com/marketplace/item/...`
- Example: `https://www.facebook.com/marketplace/item/123456789012345/`

## What Data Gets Extracted

The Smart Import feature automatically extracts:

### Basic Information
- ✅ Make (e.g., Mercedes-Benz, Scania, Volvo)
- ✅ Model
- ✅ Year
- ✅ VIN (if available)
- ✅ Category

### Technical Specifications
- ✅ Price
- ✅ Mileage
- ✅ Horsepower
- ✅ Engine Type (Diesel, Electric, Hybrid)
- ✅ Transmission (Manual, Automatic)

### Additional Details
- ✅ Description
- ✅ Location
- ✅ Condition (New, Used, Certified)
- ✅ Features (extracted from bullet points)
- ✅ Images (up to 10 images)

## Deployment Steps

### Build and Deploy

```bash
# Navigate to project directory
cd auto-melon-group

# Build the project
npm run build

# Deploy to Vercel production
npx vercel --prod
```

### Verify Deployment

After deployment:

1. Check that environment variables are set in Vercel dashboard
2. Test the import feature with a sample URL
3. Verify that data is extracted correctly
4. Check that images are loading properly

## Troubleshooting

### "Firecrawl API key not configured" Error

**Solution**: Ensure `FIRECRAWL_API_KEY` is set in your environment variables:
- Local: Check `.env.local` file
- Production: Check Vercel dashboard → Settings → Environment Variables

### "Unsupported platform" Error

**Solution**: Ensure you're using a valid URL from:
- Bazaraki.com (must contain `bazaraki.com`)
- Facebook Marketplace (must contain `facebook.com/marketplace`)

### No Data Extracted

**Possible causes**:
1. The listing page structure changed
2. The listing was removed or is unavailable
3. The URL is incorrect

**Solution**: Try a different listing URL or use manual entry.

### Images Not Loading

**Possible causes**:
1. External image URLs are blocked
2. Images are behind authentication
3. Images were removed from the source

**Solution**: Manually add image URLs in the form after import.

## Cost Considerations

**Firecrawl Pricing**:
- Free tier: ~500 credits/month
- Each scrape operation costs approximately 1-5 credits
- Paid plans available for higher usage

**Recommendation**: Start with the free tier to test the feature, then upgrade based on your import volume.

## API Architecture

The Smart Import feature consists of:

1. **Frontend** (`app/admin/vehicles/import/page.tsx`): User interface for URL input
2. **API Route** (`app/api/scrape-vehicle/route.ts`): Server-side scraping logic
3. **Data Extractors**: Platform-specific extraction functions
   - `extractBazarakiData()` - Extracts data from Bazaraki listings
   - `extractFacebookMarketplaceData()` - Extracts data from Facebook Marketplace

## Security Notes

- ✅ API key is stored server-side (not exposed to client)
- ✅ All scraping happens via Next.js API route
- ✅ Rate limiting is handled by Firecrawl
- ✅ No sensitive data is stored

## Support

For issues or questions:
1. Check this documentation
2. Verify environment variables are set correctly
3. Test with different listing URLs
4. Check Firecrawl API status: https://status.firecrawl.dev/

## Future Enhancements

Potential improvements:
- [ ] Support for more platforms (AutoTrader, etc.)
- [ ] Batch import from multiple URLs
- [ ] Import history and logging
- [ ] Auto-categorization based on listing content
- [ ] Image optimization during import
- [ ] Duplicate detection

---

**Last Updated**: 2025-11-12
**Version**: 1.0.0
