#!/bin/bash

# Auto-configure Supabase database password
# Uses Supabase CLI to get the database password automatically

echo "🔑 Auto-configuring Supabase Database Connection"
echo "==============================================="

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found in PATH"
    echo ""
    echo "Manual setup required:"
    echo "1. Get your password from Supabase Dashboard"
    echo "2. Update .env file with the actual password"
    echo "3. Run: ./quick-setup.sh"
    exit 1
fi

echo "🔍 Checking Supabase project status..."
if ! supabase status > /dev/null 2>&1; then
    echo "❌ Supabase project not linked or not logged in"
    echo ""
    echo "Please run:"
    echo "  supabase login"
    echo "  supabase link --project-ref lzkhjmtfvksxobxdjytb"
    exit 1
fi

echo "✅ Supabase project linked"

# Try to get database password from Supabase settings
echo "🔑 Retrieving database password..."

# Method 1: Try to get from Supabase CLI secrets
DB_PASSWORD=$(supabase secrets list 2>/dev/null | grep -oP '(?<=postgres_password = ")[^"]*' || echo "")

# Method 2: Try to get from local config
if [ -z "$DB_PASSWORD" ]; then
    CONFIG_FILE="$HOME/.supabase/config.toml"
    if [ -f "$CONFIG_FILE" ]; then
        DB_PASSWORD=$(grep -A 10 "\[database\]" "$CONFIG_FILE" 2>/dev/null | grep "password" | head -1 | cut -d'"' -f2 || echo "")
    fi
fi

# Method 3: Try to get from environment or ask user
if [ -z "$DB_PASSWORD" ]; then
    echo ""
    echo "❌ Could not retrieve password automatically"
    echo ""
    echo "Please get your database password manually:"
    echo "1. Go to: https://lzkhjmtfvksxobxdjytb.supabase.co"
    echo "2. Settings → Database → Connection string"
    echo "3. Copy the password from the URI"
    echo ""
    echo "Then update your .env file and run: ./quick-setup.sh"
    exit 1
fi

echo "✅ Database password retrieved"

# Update .env file
echo "📝 Updating .env file..."

# Backup original
cp .env .env.backup 2>/dev/null || true

# Replace password placeholder
sed -i.bak "s/\[YOUR-PASSWORD\]/$DB_PASSWORD/g" .env
sed -i.bak "s/\[PASSWORD\]/$DB_PASSWORD/g" .env

echo "✅ .env file updated with database password"
echo ""
echo "🎉 Configuration complete!"
echo ""
echo "Next: Run ./quick-setup.sh to test connection and run migrations"