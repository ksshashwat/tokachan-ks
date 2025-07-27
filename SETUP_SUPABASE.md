# Tokachan Supabase Migration Setup

This document provides step-by-step instructions to set up Tokachan with Supabase instead of Convex.

## Prerequisites

- Node.js 18+ (you have v22.16.0 ✅)
- pnpm (you have v10.13.1 ✅)
- Supabase CLI (will install below)

## Step 1: Install Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Verify installation
supabase --version
```

## Step 2: Initialize Supabase Project

```bash
# Initialize Supabase in the project
supabase init

# Start Supabase locally
supabase start
```

This will:
- Start a local PostgreSQL database
- Start the Supabase API
- Start Supabase Studio (web interface)
- Generate local API keys

## Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your_anon_key_from_supabase_start_output

# Site Configuration (for auth redirects)
SUPABASE_SITE_URL=http://localhost:3000
```

The `VITE_SUPABASE_ANON_KEY` will be displayed when you run `supabase start`.

## Step 4: Run Database Migrations

```bash
# Apply the database schema
supabase db push
```

This will create:
- `users` table with RLS policies
- `notes` table with RLS policies  
- Custom `note_color` enum type
- Indexes for performance
- Triggers for `updated_at` timestamps

## Step 5: Install Dependencies

```bash
# Install project dependencies
pnpm install
```

## Step 6: Start the Development Server

```bash
# Start the Vite development server
pnpm dev
```

The application will be available at `http://localhost:3000`

## Step 7: Set Up Authentication

1. Open Supabase Studio at `http://localhost:54323`
2. Go to Authentication > Settings
3. Configure your email provider (or use the built-in email testing)
4. Set up any OAuth providers you want to use

## Database Schema

The migration creates the following structure:

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Notes Table
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Untitled',
  content TEXT NOT NULL DEFAULT '',
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  color note_color NOT NULL DEFAULT 'Ocean',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)
- Users can only access their own notes
- Users can only update their own profile
- All operations require authentication

## Key Changes Made

### 1. Removed Convex Dependencies
- Removed `@convex-dev/auth` and `convex` packages
- Removed Convex configuration files
- Updated TypeScript paths

### 2. Added Supabase Integration
- Added `@supabase/supabase-js` package
- Created `src/lib/supabase.ts` for client configuration
- Created `src/lib/supabaseService.ts` for service layer

### 3. Updated Components
- Replaced Convex queries with Supabase service calls
- Updated authentication to use Supabase Auth
- Removed TipTap Pro AI extension (requires paid subscription)

### 4. Database Migration
- Created SQL migration for Supabase schema
- Set up RLS policies for security
- Added proper indexes and triggers

## Troubleshooting

### Common Issues

1. **Supabase not starting**: Make sure Docker is running
2. **Migration errors**: Run `supabase db reset` to start fresh
3. **Auth issues**: Check that environment variables are set correctly
4. **Type errors**: Make sure all Convex imports are removed

### Useful Commands

```bash
# Reset database
supabase db reset

# View logs
supabase logs

# Stop Supabase
supabase stop

# Generate types (if needed)
supabase gen types typescript --local > src/lib/database.types.ts
```

## Production Deployment

For production, you'll need to:

1. Create a Supabase project at https://supabase.com
2. Get your production URL and anon key
3. Update environment variables
4. Run migrations on production: `supabase db push --db-url your_production_url`

## Development Workflow

1. Start Supabase: `supabase start`
2. Start dev server: `pnpm dev`
3. Make changes to code
4. If you change the database schema, create a new migration:
   ```bash
   supabase migration new your_migration_name
   ```
5. Apply migrations: `supabase db push`

The application is now fully migrated from Convex to Supabase! 🎉 