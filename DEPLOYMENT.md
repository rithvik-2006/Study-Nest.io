# Deployment Guide

## Prerequisites

- Vercel account
- Supabase project
- GitHub repository

## Step 1: Set Up Supabase

1. Create a Supabase project at https://supabase.com
2. Get your project URL and API keys
3. Run database migrations in Supabase SQL editor:
   - Copy SQL from `scripts/001_create_profiles.sql` through `scripts/008_create_trigger_profile.sql`
   - Paste each into Supabase SQL editor and execute
4. Enable Email Confirmation in Auth settings

## Step 2: Deploy to Vercel

1. Push your repo to GitHub
2. Connect repo in Vercel at https://vercel.com/new
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAILS` (optional, comma-separated)

4. Click Deploy

## Step 3: Post-Deployment

1. Test sign-up flow (check your email for confirmation)
2. Create a test deck and cards
3. Run a study session
4. Check admin panel at `/admin`

## Monitoring

- Monitor logs in Vercel dashboard
- Set up error tracking in Supabase dashboard
- Configure custom domain in Vercel settings

## Scaling

- For production, upgrade Supabase to Pro plan
- Enable backups and PITR (Point-in-Time Recovery)
- Set up CDN for media assets
- Consider Vercel Pro for better performance

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only) | Yes |
| `ADMIN_EMAILS` | Comma-separated admin emails | No |
| `TUTOR_ENDPOINT` | Custom tutor API endpoint | No |
| `SENTRY_DSN` | Sentry error tracking | No |
