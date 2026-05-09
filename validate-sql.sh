#!/bin/bash

# SQL Validation Script
# Checks SQL files for syntax errors and missing dependencies

echo "🔍 Validating SQL files..."
echo "==========================="

SQL_FILES=(
    "supabase-schema.sql"
    "children-soft-delete-migration.sql"
    "add-enrollment-dates.sql"
    "sync-child-finance-status.sql"
    "financial-summary-views.sql"
)

ERRORS_FOUND=0

# Check if files exist
for file in "${SQL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing file: $file"
        ERRORS_FOUND=$((ERRORS_FOUND + 1))
    else
        echo "✅ Found: $file"
    fi
done

# Basic syntax check (if psql is available)
if command -v psql &> /dev/null && [ -n "$DATABASE_URL" ]; then
    echo ""
    echo "🔬 Running syntax validation against database..."

    for file in "${SQL_FILES[@]}"; do
        if [ -f "$file" ]; then
            echo "  Checking $file..."
            if psql "$DATABASE_URL" -f "$file" --quiet 2>&1 | grep -q "ERROR"; then
                echo "❌ Syntax error in $file"
                ERRORS_FOUND=$((ERRORS_FOUND + 1))
            else
                echo "✅ $file syntax OK"
            fi
        fi
    done
else
    echo ""
    if ! command -v psql &> /dev/null; then
        echo "⚠️  Skipping syntax validation (PostgreSQL client not found)"
        echo "   Install PostgreSQL client to enable database validation"
    elif [ -z "$DATABASE_URL" ]; then
        echo "⚠️  Skipping database validation (DATABASE_URL not set)"
        echo "   Set DATABASE_URL to enable full syntax validation against database"
        echo "   Example: export DATABASE_URL='postgresql://user:pass@localhost:5432/db'"
    fi
    echo ""
    echo "📄 Performing basic file existence check only..."
fi

echo ""
echo "==========================="
if [ $ERRORS_FOUND -eq 0 ]; then
    echo "🎉 All SQL files validated successfully!"
else
    echo "💥 Found $ERRORS_FOUND error(s). Please fix before proceeding."
    exit 1
fi