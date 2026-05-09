#!/bin/bash

# Setup script for ChildTrack testing environment
# This script helps set up the local testing environment

set -e

echo "🛠️  Setting up ChildTrack testing environment..."
echo "==============================================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file template..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/childtrack_test

# Supabase Configuration (if using Supabase)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
EOF
    echo "✅ Created .env file. Please update with your database credentials."
else
    echo "ℹ️  .env file already exists."
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL client not found. Please install PostgreSQL:"
    echo "  - Ubuntu/Debian: sudo apt-get install postgresql-client"
    echo "  - macOS: brew install postgresql"
    echo "  - Windows: Download from https://www.postgresql.org/download/windows/"
    exit 1
fi

echo "✅ PostgreSQL client found."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js:"
    echo "  - Download from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
    echo "✅ Dependencies installed."
else
    echo "ℹ️  Dependencies already installed."
fi

echo ""
echo "🎯 Next steps:"
echo "1. Update the DATABASE_URL in .env with your PostgreSQL connection string"
echo "2. Create a test database: createdb childtrack_test"
echo "3. Run the database migrations:"
echo "   Option A (manual): Run each SQL file individually"
echo "   Option B (automated): ./run-migrations.sh"
echo "4. Run the tests: ./test-status-toggle-integration.sh"
echo ""
echo "💡 Tip: You can also run 'source .env' to load environment variables"
echo "==============================================="