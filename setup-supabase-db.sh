#!/bin/bash

# Get Supabase Database Password using CLI
# This script extracts the database password from Supabase secrets

echo "🔑 Getting Supabase Database Password via CLI"
echo "============================================="

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found in PATH"
    echo "Trying alternative locations..."

    # Try common installation paths
    SUPABASE_CMD=""
    for path in "./supabase" "~/bin/supabase" "/usr/local/bin/supabase" "/opt/homebrew/bin/supabase"; do
        if [ -x "$path" ]; then
            SUPABASE_CMD="$path"
            break
        fi
    done

    if [ -z "$SUPABASE_CMD" ]; then
        echo "❌ Supabase CLI not found"
        echo "Please install it from: https://supabase.com/docs/guides/cli"
        echo "Or ensure it's in your PATH"
        echo ""
        echo "Manual setup instructions:"
        echo "1. Go to https://lzkhjmtfvksxobxdjytb.supabase.co"
        echo "2. Settings → Database → Connection string"
        echo "3. Copy the password and update your .env file"
        exit 1
    else
        echo "✅ Found Supabase CLI at $SUPABASE_CMD"
        # Create an alias for this session
        alias supabase="$SUPABASE_CMD"
    fi
fi

# Check if logged in and project linked
if ! supabase status > /dev/null 2>&1; then
    echo "❌ Not logged in or project not linked"
    echo "Run: supabase login"
    echo "Then: supabase link --project-ref lzkhjmtfvksxobxdjytb"
    exit 1
fi

echo "🔍 Fetching database password..."

# Try to get password from Supabase secrets
DB_PASSWORD=$(supabase secrets list 2>/dev/null | grep -oP '(?<=postgres_password = ")[^"]*' || echo "")

if [ -z "$DB_PASSWORD" ]; then
    echo "⚠️  Could not get password from secrets. Trying alternative method..."

    # Alternative: try to get from project settings
    PROJECT_INFO=$(supabase status --output json 2>/dev/null || echo "{}")
    PROJECT_REF=$(echo "$PROJECT_INFO" | grep -oP '(?<="ref": ")[^"]*' || echo "")

    if [ -n "$PROJECT_REF" ]; then
        echo "📋 Manual Setup Required:"
        echo ""
        echo "Since automatic password retrieval failed, please:"
        echo "1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/settings/database"
        echo "2. Find the 'Connection string' section"
        echo "3. Copy the password from the URI"
        echo "4. Update your .env file with the complete DATABASE_URL"
        echo ""
        echo "Example:"
        echo "DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.$PROJECT_REF.supabase.co:5432/postgres"
        exit 1
    else
        echo "❌ Could not determine project details"
        echo "Please check your Supabase CLI setup"
        exit 1
    fi
fi

# Update .env file with the password
if [ -f ".env" ]; then
    # Replace the placeholder in .env
    sed -i.bak "s|\[PASSWORD\]|$DB_PASSWORD|g" .env
    sed -i.bak "s|\[YOUR-PASSWORD\]|$DB_PASSWORD|g" .env
    echo "✅ Updated .env file with database password"
else
    # Create .env file
    cat > .env << EOF
# Supabase Configuration
VITE_SUPABASE_URL=https://lzkhjmtfvksxobxdjytb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6a2hqbXRmdmtzeG9ieGRqeXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNDcyODYsImV4cCI6MjA4OTYyMzI4Nn0.YmwbP8PB24Lc1vYaBPhfjkTRBFxwuwlmzxGM4skb09w

# Database Configuration
DATABASE_URL=postgresql://postgres:$DB_PASSWORD@db.lzkhjmtfvksxobxdjytb.supabase.co:5432/postgres
EOF
    echo "✅ Created .env file with database password"
fi

echo ""
echo "🎉 Database password configured successfully!"
echo ""
echo "Next step: Run ./quick-setup.sh to complete the setup"