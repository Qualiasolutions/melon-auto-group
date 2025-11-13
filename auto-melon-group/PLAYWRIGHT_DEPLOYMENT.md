# Playwright AutoTrader Scraper Deployment Guide

## Overview
This project now uses Playwright instead of Firecrawl for AutoTrader UK scraping, providing better control and no enterprise fees.

## Key Improvements
- ✅ **Free & Open Source** - No subscription costs
- ✅ **Rate Limiting** - 3 requests per minute for AutoTrader
- ✅ **Commercial Vehicle Focus** - Targets vans, trucks, pickups
- ✅ **Better Error Handling** - Graceful fallbacks and clear messages
- ✅ **No Enterprise Required** - Works with standard browser automation

## Production Deployment

### 1. Install Playwright Browsers

**On Vercel (Recommended):**
```bash
# Add playwright install script to package.json
npm install @playwright/nextjs-ct
```

Add to `package.json`:
```json
{
  "scripts": {
    "playwright:install": "npx playwright install chromium"
  }
}
```

**Vercel Configuration:**
Add to `vercel.json`:
```json
{
  "functions": {
    "app/api/scrape-vehicle/route.ts": {
      "maxDuration": 30
    }
  },
  "installCommand": "npm install && npm run playwright:install"
}
```

**On Self-Hosted/VPS:**
```bash
# Run the installation script
chmod +x scripts/install-chromium.sh
./scripts/install-chromium.sh
```

### 2. Environment Variables

Update `.env.local` or production environment:
```bash
# No additional variables needed for Playwright
# Existing FIRECRAWL_API_KEY still used for other platforms
```

### 3. Rate Limiting Configuration

Current settings (in `lib/scraper/rate-limiter.ts`):
- **AutoTrader**: 3 requests per minute
- **General platforms**: 10 requests per minute

Adjust if needed:
```typescript
export const autotraderRateLimiter = new RateLimiter(5, 60000) // 5 requests per minute
```

### 4. Testing Production Deployment

```bash
# Test AutoTrader scraping
curl -X POST https://your-domain.com/api/scrape-vehicle \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.autotrader.co.uk/commercial-vehicles"}'

# Test rate limiting
for i in {1..4}; do
  curl -X POST https://your-domain.com/api/scrape-vehicle \
    -H "Content-Type: application/json" \
    -d '{"url": "https://www.autotrader.co.uk/van"}'
  sleep 1
done
```

## Architecture

### Files Added/Modified

1. **`lib/scraper/autotrader-scraper.ts`** - Main Playwright scraper
2. **`lib/scraper/rate-limiter.ts`** - Rate limiting implementation
3. **`app/api/scrape-vehicle/route.ts`** - Updated API route
4. **`scripts/install-chromium.sh`** - Browser installation script

### How It Works

1. **Platform Detection** - Identifies AutoTrader URLs
2. **Rate Limiting** - Checks request limits per IP
3. **Playwright Scraping** - Uses headless Chrome to browse AutoTrader
4. **Commercial Vehicle Focus** - Targets vans, trucks, pickups
5. **Data Extraction** - Structured JSON output for inventory system

### Error Handling

- **Browser Initialization**: Graceful fallback if browsers not installed
- **Rate Limiting**: 429 status with retry-after timing
- **Network Errors**: 503 status with clear error messages
- **Invalid URLs**: 400 status with supported platform list

## Monitoring & Maintenance

### Log Monitoring
Watch for these logs in production:
```
🚛 Using Playwright for AutoTrader scraping...
✅ AutoTrader Playwright scraping successful
⚠️ Rate limit exceeded for autotrader
❌ Playwright AutoTrader scraping failed
```

### Performance Monitoring
- **Response Times**: Should be <30 seconds for successful scraping
- **Success Rate**: Monitor 503 vs 200 responses
- **Rate Limit Hits**: High rate limit usage may indicate abuse

### Regular Updates
- **CSS Selectors**: AutoTrader may change website structure
- **Rate Limits**: Adjust based on traffic patterns
- **Browser Versions**: Update Playwright regularly

## Troubleshooting

### Common Issues

1. **Browser Not Installed**
   - Error: `Executable doesn't exist`
   - Fix: Run `npm run playwright:install`

2. **Rate Limit Exceeded**
   - Error: 429 status
   - Fix: Wait for reset or increase limits

3. **Memory Issues on Vercel**
   - Error: Function timeout
   - Fix: Increase `maxDuration` in vercel.json

4. **CSS Selector Changes**
   - Error: No vehicles found
   - Fix: Update selectors in scraper

### Debug Mode

Enable debug logging by setting:
```bash
NEXT_PUBLIC_DEBUG_SCRAPING=true
```

## Security Considerations

- **Rate Limiting**: Prevents abuse and IP blocks
- **User Agent**: Uses realistic browser signatures
- **Request Delays**: Built-in delays between page operations
- **Error Messages**: Doesn't expose internal system details

## Comparison: Firecrawl vs Playwright

| Feature | Firecrawl | Playwright |
|---------|-----------|------------|
| Cost | Enterprise fees | Free |
| Control | Limited | Full control |
| Customization | Generic | Tailored for AutoTrader |
| Rate Limits | Depends on plan | Customizable |
| Error Handling | Generic | Specific to needs |
| Maintenance | Provider updates | In our control |

## Future Enhancements

1. **Browser Pool** - Reuse browser instances for better performance
2. **Caching** - Cache results for popular searches
3. **Scheduling** - Regular automated scraping
4. **More Platforms** - Extend to other commercial vehicle sites
5. **Image Processing** - Download and optimize vehicle images

## Support

For issues with the AutoTrader scraper:
1. Check Vercel function logs
2. Verify browser installation
3. Test with simple URLs first
4. Monitor rate limit headers in responses