# Quick Setup Instructions

I need you to provide your Supabase credentials to proceed. Here's what you need to do:

## 1. Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select or create a project
3. Go to Project Settings → API
4. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 2. Update Environment Variables

Replace the placeholder values in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

## 3. Get Firecrawl API Key (Optional)

If you want to scrape real truck images:

1. Go to [firecrawl.dev](https://firecrawl.dev)
2. Sign up and get an API key
3. Add to `.env.local`:
   ```bash
   FIRECRAWL_API_KEY=fc-your-api-key-here
   ```

## 4. Let Me Know

Once you have the Supabase credentials, just tell me and I'll:
1. Update the environment file
2. Set up the database
3. Run the image scraping and import scripts
4. Deploy to Vercel

**Your Supabase URL should look like:** `https://abcdefgh.supabase.co`
**Your anon key should start with:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

Please share your Supabase URL and anon key when you have them!