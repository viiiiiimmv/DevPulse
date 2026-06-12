# DevPulse Setup Guide

This guide will help you set up DevPulse locally for development.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running locally
- GitHub OAuth Application credentials

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up PostgreSQL Database

1. Create a new PostgreSQL database named `devpulse`:
```bash
createdb devpulse
```

Or using PostgreSQL CLI:
```sql
CREATE DATABASE devpulse;
```

## Step 3: Configure Environment Variables

Edit `.env.local` with your credentials:

```env
# Database URL
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/devpulse"

# GitHub OAuth Credentials (from https://github.com/settings/developers)
GITHUB_ID="your_github_app_id"
GITHUB_SECRET="your_github_app_secret"

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_generated_secret"
```

### Getting GitHub OAuth Credentials

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in the form:
   - **Application name**: DevPulse
   - **Homepage URL**: http://localhost:3000
   - **Authorization callback URL**: http://localhost:3000/api/auth/callback/github
4. Copy your Client ID and Client Secret to `.env.local`

### Generating NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Step 4: Set Up Database Schema

Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

This will:
- Create all database tables
- Generate Prisma Client

## Step 5: Start Development Server

```bash
npm run dev
```

The application will be available at: http://localhost:3000

## Features

✓ GitHub OAuth Authentication
✓ User profile sync with GitHub
✓ Activity logging
✓ Dashboard with user information
✓ Sync button to fetch latest GitHub data

## Available Routes

- `/` - Home page
- `/login` - GitHub login
- `/dashboard` - User dashboard (requires authentication)
- `/api/auth/*` - NextAuth endpoints
- `/api/github/profile` - Sync GitHub profile (POST)

## Troubleshooting

### Database connection errors
- Make sure PostgreSQL is running
- Check your `DATABASE_URL` in `.env.local`
- Verify the database exists: `psql -l`

### GitHub OAuth errors
- Verify your `GITHUB_ID` and `GITHUB_SECRET` are correct
- Check the callback URL matches exactly: http://localhost:3000/api/auth/callback/github
- Make sure the GitHub app is still active

### Sync button not working
- Make sure you're logged in
- Check browser console for errors
- Verify NEXTAUTH_SECRET is set
- Check server logs for activity logging errors

## Build for Production

```bash
npm run build
npm start
```

## Issues Fixed

✓ Added missing `octokit` dependency
✓ Fixed session type to include `accessToken`
✓ Fixed Prisma `InputJsonValue` import
✓ Fixed typo in `user.service.ts` (usrname → username)
✓ Fixed user ID references in API routes
✓ Added sync button with proper error handling
✓ Split dashboard into server and client components for proper React 19 compatibility
✓ Improved error handling and activity logging

## Next Steps

1. Configure your GitHub OAuth app
2. Set up PostgreSQL
3. Run migrations
4. Start the dev server
5. Test the login flow
6. Use the sync button on the dashboard
