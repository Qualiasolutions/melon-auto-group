# Production Deployment Guide

This guide covers deploying the Auto Melon Group truck dealership website to production with real vehicle images and optimized performance.

## 🚀 Quick Deployment Checklist

- [ ] Database schema is set up in Supabase
- [ ] Supabase Storage bucket is created
- [ ] Environment variables are configured
- [ ] Image scraping and processing is complete
- [ ] Build optimization is tested
- [ ] SSL certificate is configured
- [ ] Analytics and monitoring are set up

## 📋 Prerequisites

### 1. Supabase Setup

1. **Create Database Tables**
   ```sql
   -- Run the main schema
   -- File: lib/supabase/schema.sql
   ```

2. **Set Up Storage**
   ```sql
   -- Run storage setup
   -- File: lib/supabase/storage-setup.sql
   ```

3. **Configure Environment Variables**
   ```bash
   # Copy example file
   cp .env.example .env.local

   # Fill in your values
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   FIRECRAWL_API_KEY=your-firecrawl-key
   ```

### 2. Image Processing Pipeline

Run these commands in order to populate your inventory:

```bash
# 1. Scrape truck images from marketplaces
npm run scrape-images

# 2. Process and optimize images
npm run process-images

# 3. Import vehicles to database
npm run import-processed-images
```

## 🏗️ Production Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Add all environment variables from `.env.local`
   - Set `NEXT_PUBLIC_SITE_URL` to your production URL

### Option 2: Self-Hosted (Docker)

1. **Build Docker Image**
   ```bash
   docker build -t auto-melon-group .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_SUPABASE_URL=your-url \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
     auto-melon-group
   ```

3. **Configure Nginx** (if needed)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## 🔧 Production Optimizations

### Image Optimization

The site includes comprehensive image optimization:

- **WebP format** with AVIF fallback
- **Responsive images** with multiple breakpoints
- **Lazy loading** for non-critical images
- **Blur placeholders** for better UX
- **CDN delivery** via Supabase Storage

### Performance Settings

- **Next.js 16** with App Router
- **Incremental Static Regeneration** for homepage
- **Server Components** for optimal performance
- **Code splitting** and tree shaking
- **Compressed assets** with Brotli/Gzip

### SEO & Analytics

1. **Meta Tags**
   - Dynamic vehicle page titles
   - Open Graph and Twitter cards
   - Structured data for vehicles

2. **Sitemap**
   ```bash
   # Generate sitemap automatically
   # Accessible at /sitemap.xml
   ```

3. **Analytics Setup**
   ```bash
   # Google Analytics (optional)
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

## 🔍 Monitoring & Maintenance

### Health Checks

1. **Database Monitoring**
   - Monitor Supabase storage usage
   - Check query performance
   - Set up alerts for errors

2. **Image Pipeline**
   - Monitor image processing logs
   - Check storage quotas
   - Validate image quality

3. **Performance Monitoring**
   ```bash
   # Lighthouse CI (optional)
   npm install -g @lhci/cli
   lhci autorun
   ```

### Regular Tasks

1. **Weekly**
   - Check for broken images
   - Monitor site speed
   - Review error logs

2. **Monthly**
   - Update image inventory
   - Review SEO performance
   - Update featured vehicles

3. **Quarterly**
   - Refresh image gallery
   - Update pricing information
   - Performance audit

## 🚨 Troubleshooting

### Common Issues

1. **Images Not Loading**
   ```bash
   # Check Supabase storage permissions
   # Verify CDN URLs
   # Check image processing logs
   ```

2. **Build Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next

   # Reinstall dependencies
   npm install

   # Rebuild
   npm run build
   ```

3. **Database Issues**
   ```bash
   # Check Supabase connection
   npm run check-setup

   # Verify RLS policies
   # Check database logs
   ```

### Performance Issues

1. **Slow Image Loading**
   - Check CDN configuration
   - Verify image compression
   - Monitor network requests

2. **Build Size**
   - Analyze bundle size
   - Optimize image imports
   - Check for unused dependencies

## 📊 Post-Deployment Checklist

- [ ] Site loads correctly on all devices
- [ ] Images display properly with optimization
- [ ] Vehicle pages have correct meta tags
- [ ] Contact forms are working
- [ ] Navigation functions properly
- [ ] Search and filtering work
- [ ] Performance scores are acceptable (>90)
- [ ] SSL certificate is valid
- [ ] Analytics are tracking correctly
- [ ] Error monitoring is configured

## 🔄 CI/CD Setup (Optional)

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs
2. Review Supabase status
3. Monitor error tracking
4. Test image processing pipeline

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ Homepage loads with real vehicle images
- ✅ Vehicle detail pages display correctly
- ✅ Search and filtering work properly
- ✅ Images are optimized and fast-loading
- ✅ Mobile experience is responsive
- ✅ SEO tags are properly set
- ✅ No console errors on production site

Congratulations! Your truck dealership website is now live with real inventory and optimized performance! 🚚✨