# Email Integration Setup Guide

This guide explains how to set up email notifications for the contact form and custom order form using Resend.

## Overview

The website has two forms that send email notifications to `info@melonautogroup.com`:
1. **Contact Form** (`/contact`) - For general inquiries
2. **Custom Order Form** (`/custom-order`) - For custom truck order requests

Both forms use the [Resend](https://resend.com) email service to send beautifully formatted HTML emails.

## Setup Instructions

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up for a free account
2. The free tier includes:
   - 100 emails/day
   - 3,000 emails/month
   - Perfect for starting out

### 2. Get Your API Key

1. Log in to your Resend dashboard
2. Navigate to **API Keys** section
3. Click **Create API Key**
4. Give it a name (e.g., "Auto Melon Group Production")
5. Copy the API key (it will look like: `re_xxxxxxxxxxxxx`)

### 3. Add API Key to Environment Variables

#### For Local Development:

Add to `.env.local`:
```bash
RESEND_API_KEY="re_your_actual_api_key_here"
```

Then restart your development server:
```bash
npm run dev
```

#### For Vercel Production:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Your Resend API key
   - **Environment**: Production (and Preview if needed)
4. Click **Save**
5. Redeploy your application

### 4. Verify Email Domain (Optional but Recommended)

For production use, you should verify your domain to send emails from `@melonautogroup.com`:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain: `melonautogroup.com`
4. Add the DNS records provided by Resend to your domain's DNS settings
5. Wait for verification (usually takes a few minutes)

Once verified, update the API routes to use your domain:

**File: `app/api/contact/route.ts`**
```typescript
from: 'Auto Melon Group <contact@melonautogroup.com>',
```

**File: `app/api/custom-order/route.ts`**
```typescript
from: 'Auto Melon Group <orders@melonautogroup.com>',
```

### 5. Testing the Forms

#### Test Contact Form:
1. Go to `http://localhost:3000/contact`
2. Fill out the form with test data
3. Submit the form
4. Check `info@melonautogroup.com` for the email

#### Test Custom Order Form:
1. Go to `http://localhost:3000/custom-order`
2. Fill out the form with test data
3. Submit the form
4. Check `info@melonautogroup.com` for the email

## Email Templates

### Contact Form Email

The contact form sends a clean, branded email with:
- Sender's name, email, and phone
- Message content
- Reply-to header set to sender's email (for easy responses)

### Custom Order Email

The custom order form sends a comprehensive email with:
- Customer information (name, email, phone, company)
- Truck specifications (type, make, engine, transmission, etc.)
- Special features requested
- Budget and delivery timeline
- Requirements and intended use
- Trade-in and financing preferences

Both emails are styled with:
- Professional HTML formatting
- Auto Melon Group branding colors
- Responsive design
- Easy-to-read sections

## Troubleshooting

### Email Not Sending

1. **Check API Key**: Ensure `RESEND_API_KEY` is set correctly in `.env.local`
2. **Check Console**: Look for errors in browser console and terminal
3. **Verify Resend Account**: Log in to Resend dashboard and check:
   - API key is active
   - You haven't exceeded rate limits
   - Check the **Logs** section for delivery status

### "Failed to send email" Error

- Make sure your API key is valid
- Check that you're using the correct environment variable name: `RESEND_API_KEY`
- Restart your development server after adding the API key
- Check Resend dashboard for error details

### Emails Going to Spam

- Verify your domain in Resend
- Add SPF, DKIM, and DMARC records to your DNS
- Use a verified "from" address
- Avoid spam trigger words in email content

### Rate Limiting

Free tier limits:
- 100 emails/day
- 3,000 emails/month

If you exceed these, upgrade to a paid plan at [resend.com/pricing](https://resend.com/pricing)

## Additional Configuration

### Change Recipient Email

To send emails to a different address, update both API routes:

**File: `app/api/contact/route.ts` (line ~21)**
```typescript
to: ['your-new-email@example.com'],
```

**File: `app/api/custom-order/route.ts` (line ~24)**
```typescript
to: ['your-new-email@example.com'],
```

### Add Multiple Recipients

```typescript
to: ['info@melonautogroup.com', 'sales@melonautogroup.com'],
```

### Add CC or BCC

```typescript
to: ['info@melonautogroup.com'],
cc: ['manager@melonautogroup.com'],
bcc: ['archive@melonautogroup.com'],
```

## Email Delivery Flow

1. User fills out form on website
2. Form submits data to API route (`/api/contact` or `/api/custom-order`)
3. API route validates the data
4. API route calls Resend API to send email
5. Resend delivers email to `info@melonautogroup.com`
6. User receives success confirmation
7. You can reply directly to the sender from your email client

## Support

- **Resend Documentation**: [resend.com/docs](https://resend.com/docs)
- **Resend Support**: [resend.com/support](https://resend.com/support)
- **Check Email Logs**: View all sent emails in Resend dashboard under **Emails**

## Production Checklist

Before deploying to production:

- [ ] Resend API key is set in Vercel environment variables
- [ ] Domain is verified in Resend (optional but recommended)
- [ ] "From" address updated to use verified domain
- [ ] Test both forms in production environment
- [ ] Monitor email delivery in Resend dashboard
- [ ] Set up email forwarding/monitoring for `info@melonautogroup.com`
- [ ] Consider upgrading Resend plan if expecting high volume

## Code References

- **Contact Form**: `auto-melon-group/app/contact/page.tsx:26`
- **Custom Order Form**: `auto-melon-group/app/custom-order/page.tsx:110`
- **Contact API Route**: `auto-melon-group/app/api/contact/route.ts`
- **Custom Order API Route**: `auto-melon-group/app/api/custom-order/route.ts`
