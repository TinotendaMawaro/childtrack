#!/bin/bash

# Quick Setup Script for ChildTrack Database
# This script helps configure and test the database connection

echo "🚀 ChildTrack Database Quick Setup"
echo "==================================="

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create one first."
    echo "Run: ./setup-test-environment.sh"
    exit 1
fi

# Load environment variables (Windows-compatible)
if [ -f ".env" ]; then
    echo "📝 Loading .env file..."
    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        [[ $key =~ ^[[:space:]]*# ]] && continue
        [[ -z "$key" ]] && continue
        # Remove quotes and carriage returns
        value=$(echo "$value" | tr -d '\r' | sed 's/^"\(.*\)"$/\1/' | sed "s/^'\(.*\)'$/\1/")
        export "$key=$value"
        echo "  ✅ Loaded $key"
    done < .env
fi

# Check if Supabase CLI is available and try to get password
if command -v supabase &> /dev/null; then
    echo "🔍 Checking Supabase CLI status..."
    if supabase status > /dev/null 2>&1; then
        echo "✅ Supabase project is linked"
        # Try to get database password from Supabase secrets
        DB_PASSWORD=$(supabase secrets list 2>/dev/null | grep -oP '(?<=postgres_password = ")[^"]*' || echo "")
        if [ -n "$DB_PASSWORD" ]; then
            echo "✅ Found database password from Supabase"
            export DATABASE_URL="postgresql://postgres:$DB_PASSWORD@db.lzkhjmtfvksxobxdjytb.supabase.co:5432/postgres"
        fi
    fi
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ] || [[ $DATABASE_URL == *"PASSWORD"* ]] || [[ $DATABASE_URL == *"[YOUR"* ]]; then
    echo ""
    echo "📋 DATABASE_URL Configuration Required:"
    echo ""
    echo "Since you're using Supabase CLI, you can get the password automatically:"
    echo "1. Make sure you're logged in: supabase login"
    echo "2. Link your project: supabase link --project-ref lzkhjmtfvksxobxdjytb"
    echo ""
    echo "Or manually configure:"
    echo "1. Go to your Supabase Dashboard:"
    echo "   https://lzkhjmtfvksxobxdjytb.supabase.co"
    echo ""
    echo "2. Navigate to: Settings → Database → Connection string"
    echo ""
    echo "3. Copy the 'URI' connection string"
    echo ""
    echo "4. Update your .env file:"
    echo "   DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.lzkhjmtfvksxobxdjytb.supabase.co:5432/postgres"
    echo ""
    echo "5. Replace [YOUR_PASSWORD] with your actual database password"
    echo ""
    echo "⚠️  Your current DATABASE_URL still contains placeholder"
    exit 1
fi

echo "✅ DATABASE_URL found"

# Test connection (skip if psql not available)
echo ""
echo "🔍 Testing database connection..."
if command -v psql >/dev/null 2>&1; then
    if psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
        echo "✅ Database connection successful!"
    else
        echo "❌ Database connection failed"
        echo "Please check your DATABASE_URL and password"
        echo "Note: If using Supabase, ensure your IP is allowed"
        exit 1
    fi
else
    echo "⚠️  psql not found - skipping connection test"
    echo "   Assuming DATABASE_URL is correct"
fi

# Check if tables exist
echo ""
echo "📊 Checking existing tables..."
TABLE_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null || echo "0")

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo "ℹ️  Database already has $TABLE_COUNT tables"
    echo "⚠️  This will run migrations on existing data. Continue? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
fi

# Run migrations
echo ""
echo "📄 Running migrations..."
./run-migrations.sh

# Run tests
echo ""
echo "🧪 Running integration tests..."
./test-status-toggle-integration.sh

echo ""
echo "🎉 Setup complete! Your ChildTrack system is ready."
echo ""
echo "Next steps:"
echo "• Start development server: npm run dev"
echo "• Open browser to: http://localhost:5173"