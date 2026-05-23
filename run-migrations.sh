#!/bin/bash

# Migration Runner Script
# Applies SQL migrations in the correct order

set -e

echo "🚀 Running ChildTrack Database Migrations"
echo "=========================================="

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable not set"
    echo ""
    echo "Please set the DATABASE_URL:"
    echo "  export DATABASE_URL='postgresql://username:password@localhost:5432/database_name'"
    echo "  Or create a .env file and run: source .env"
    exit 1
fi

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL client not found"
    echo "Please install PostgreSQL client first"
    exit 1
fi

# Check database connection
echo "🔍 Testing database connection..."
if ! psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Cannot connect to database"
    echo "Please check your DATABASE_URL and ensure the database exists"
    exit 1
fi
echo "✅ Database connection successful"

# Define migration files in order
MIGRATIONS=(
    "supabase-schema.sql"
    "children-soft-delete-migration.sql"
    "add-enrollment-dates.sql"
    "sync-child-finance-status.sql"
    "financial-summary-views.sql"
)

# Apply migrations
for migration in "${MIGRATIONS[@]}"; do
    if [ -f "$migration" ]; then
        echo ""
        echo "📄 Applying $migration..."
        if psql "$DATABASE_URL" -f "$migration" --quiet; then
            echo "✅ $migration applied successfully"
        else
            echo "❌ Failed to apply $migration"
            exit 1
        fi
    else
        echo "⚠️  Migration file not found: $migration"
    fi
done

echo ""
echo "🎉 All migrations applied successfully!"
echo ""
echo "Next steps:"
echo "1. Run the test suite: ./test-status-toggle-integration.sh"
echo "2. Start the development server: npm run dev"