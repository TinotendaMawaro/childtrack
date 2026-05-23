#!/bin/bash

# Manual Migration Runner (when psql is not available)
# Provides SQL commands to run in Supabase dashboard

echo "📄 Manual Database Migration Instructions"
echo "========================================="
echo ""
echo "Since psql is not available, run these migrations manually:"
echo ""
echo "1. Go to: https://lzkhjmtfvksxobxdjytb.supabase.co"
echo "2. Open 'SQL Editor' from the left sidebar"
echo "3. Run each migration in order:"
echo ""

# Read and display each SQL file
SQL_FILES=(
    "supabase-schema.sql"
    "children-soft-delete-migration.sql"
    "add-enrollment-dates.sql"
    "sync-child-finance-status.sql"
    "financial-summary-views.sql"
)

for file in "${SQL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo ""
        echo "📄 $file"
        echo "----------------------------------------"
        cat "$file"
        echo ""
        echo "----------------------------------------"
        echo ""
    fi
done

echo "After running all migrations:"
echo "1. Test the connection: ./test-connection.sh"
echo "2. Run integration tests: ./test-status-toggle-integration.sh"
echo "3. Start development: npm run dev"