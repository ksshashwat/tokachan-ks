# Tokachan Setup with Supabase Cloud

Since Docker isn't installed, let's use Supabase Cloud instead of local development.

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `tokachan-ks`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to you
6. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

## Step 3: Update Environment Variables

Update your `.env` file with the cloud credentials:

```bash
# Supabase Configuration (Cloud)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_from_dashboard

# Site Configuration
SUPABASE_SITE_URL=http://localhost:3000
```

## Step 4: Run Database Migrations

Since we can't use the local Supabase CLI, we'll run the SQL directly in the Supabase dashboard:

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run" to execute the migration

## Step 5: Install Dependencies and Start

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

## Step 6: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, enter: `http://localhost:3000`
3. Under **Redirect URLs**, add: `http://localhost:3000`
4. Save the settings

## Step 7: Test the Application

1. Open http://localhost:3000
2. Try creating an account
3. Test creating and editing notes

## Benefits of Using Supabase Cloud

✅ **No Docker required**  
✅ **Production-ready from day one**  
✅ **Automatic backups**  
✅ **Real-time subscriptions**  
✅ **Built-in monitoring**  
✅ **Free tier available**

## Next Steps

Once everything is working, you can:

1. **Deploy to production** using Vercel, Netlify, or similar
2. **Add real-time features** using Supabase subscriptions
3. **Set up custom domains** for authentication
4. **Configure email templates** for better UX

The application will work exactly the same as with local Supabase, but with the added benefits of cloud hosting! 