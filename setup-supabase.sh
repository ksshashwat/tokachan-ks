#!/bin/bash

# Tokachan Supabase Migration Setup Script
set -e

echo "🚀 Setting up Tokachan with Supabase..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the tokachan-ks directory"
    exit 1
fi

# Step 1: Install Supabase CLI if not already installed
if ! command -v supabase &> /dev/null; then
    echo "📦 Installing Supabase CLI..."
    npm install -g supabase
else
    echo "✅ Supabase CLI already installed"
fi

# Step 2: Initialize Supabase project
echo "🔧 Initializing Supabase project..."
if [ ! -f "supabase/config.toml" ]; then
    supabase init
else
    echo "✅ Supabase already initialized"
fi

# Step 3: Start Supabase
echo "🚀 Starting Supabase..."
supabase start

# Step 4: Create .env file
echo "🔧 Setting up environment variables..."
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Supabase Configuration
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Site Configuration
SUPABASE_SITE_URL=http://localhost:3000
EOF
    echo "⚠️  Please update the .env file with your actual Supabase anon key"
    echo "   You can find it in the output above from 'supabase start'"
else
    echo "✅ .env file already exists"
fi

# Step 5: Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Step 6: Run database migrations
echo "🗄️  Running database migrations..."
supabase db push

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 To start the development server:"
echo "   pnpm dev"
echo ""
echo "🎯 To access Supabase Studio:"
echo "   http://localhost:54323"
echo ""
echo "🎯 To stop Supabase:"
echo "   supabase stop"
echo ""
echo "🎯 To reset database:"
echo "   supabase db reset" 