#!/bin/bash

# CI/CD Test Script for Child Status Toggle and Financial Synchronization
# This script ensures that status changes don't break financial calculations

set -e  # Exit on any error

echo "🧪 Starting Child Status Toggle Tests..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Check if database is accessible
check_db_connection() {
    echo "🔍 Checking database connection..."
    if [ -z "$DATABASE_URL" ]; then
        echo -e "${RED}❌ DATABASE_URL environment variable not set${NC}"
        echo -e "${YELLOW}Please set the DATABASE_URL environment variable:${NC}"
        echo "  export DATABASE_URL='postgresql://username:password@localhost:5432/database_name'"
        echo "  Or create a .env file with: DATABASE_URL=postgresql://username:password@localhost:5432/database_name"
        exit 1
    fi

    if ! psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
        echo -e "${RED}❌ Cannot connect to database at $DATABASE_URL${NC}"
        echo -e "${YELLOW}Please ensure:${NC}"
        echo "  1. PostgreSQL is running"
        echo "  2. Database exists"
        echo "  3. Connection string is correct"
        exit 1
    fi
    print_status 0 "Database connection established"
}

# Test 1: Verify child status change triggers financial sync
test_status_toggle_sync() {
    echo "🔄 Testing child status toggle synchronization..."

    # Create a test child
    TEST_CHILD_ID=$(psql "$DATABASE_URL" -t -c "
        INSERT INTO children (full_name, status, enrollment_date)
        VALUES ('Test Child for CI', 'ACTIVE', CURRENT_DATE)
        RETURNING id;
    " | tr -d ' ')

    # Create a test financial transaction
    psql "$DATABASE_URL" -c "
        INSERT INTO financial_transactions (child_id, transaction_type, direction, amount, status, description)
        VALUES ('$TEST_CHILD_ID', 'TUITION', 'INCOME', 100.00, 'PENDING', 'Test payment');
    "

    # Deactivate the child
    psql "$DATABASE_URL" -c "
        UPDATE children SET status = 'INACTIVE', withdrawal_date = CURRENT_DATE WHERE id = '$TEST_CHILD_ID';
    "

    # Check if financial transaction was updated
    SYNCED=$(psql "$DATABASE_URL" -t -c "
        SELECT COUNT(*) FROM financial_transactions
        WHERE child_id = '$TEST_CHILD_ID' AND status = 'CANCELLED';
    " | tr -d ' ')

    if [ "$SYNCED" -gt 0 ]; then
        print_status 0 "Status toggle synchronized with finance"
    else
        print_status 1 "Status toggle did not sync with finance"
        return 1
    fi

    # Reactivate the child
    psql "$DATABASE_URL" -c "
        UPDATE children SET status = 'ACTIVE', withdrawal_date = NULL WHERE id = '$TEST_CHILD_ID';
    "

    # Check if financial transaction was reactivated
    REACTIVATED=$(psql "$DATABASE_URL" -t -c "
        SELECT COUNT(*) FROM financial_transactions
        WHERE child_id = '$TEST_CHILD_ID' AND status = 'PENDING';
    " | tr -d ' ')

    if [ "$REACTIVATED" -gt 0 ]; then
        print_status 0 "Child reactivation synchronized with finance"
    else
        print_status 1 "Child reactivation did not sync with finance"
        return 1
    fi

    # Cleanup
    psql "$DATABASE_URL" -c "
        DELETE FROM financial_transactions WHERE child_id = '$TEST_CHILD_ID';
        DELETE FROM children WHERE id = '$TEST_CHILD_ID';
    "

    return 0
}

# Test 2: Verify financial aggregates are accurate
test_financial_aggregates() {
    echo "📊 Testing financial aggregate calculations..."

    # Create test data
    TEST_CHILD_ID=$(psql "$DATABASE_URL" -t -c "
        INSERT INTO children (full_name, status, enrollment_date)
        VALUES ('Test Child Aggregates', 'ACTIVE', CURRENT_DATE)
        RETURNING id;
    " | tr -d ' ')

    # Create multiple transactions
    psql "$DATABASE_URL" -c "
        INSERT INTO financial_transactions (child_id, transaction_type, direction, amount, status, description) VALUES
        ('$TEST_CHILD_ID', 'TUITION', 'INCOME', 200.00, 'PAID', 'Paid tuition'),
        ('$TEST_CHILD_ID', 'TUITION', 'INCOME', 150.00, 'PENDING', 'Pending payment'),
        ('$TEST_CHILD_ID', 'TUITION', 'INCOME', 50.00, 'OVERDUE', 'Overdue payment');
    "

    # Check aggregates from view
    AGGREGATES=$(psql "$DATABASE_URL" -t -c "
        SELECT total_paid, total_owed, overdue_amount
        FROM child_financial_summary
        WHERE child_id = '$TEST_CHILD_ID';
    ")

    TOTAL_PAID=$(echo "$AGGREGATES" | awk '{print $1}')
    TOTAL_OWED=$(echo "$AGGREGATES" | awk '{print $2}')
    OVERDUE=$(echo "$AGGREGATES" | awk '{print $3}')

    if [ "$TOTAL_PAID" = "200.00" ] && [ "$TOTAL_OWED" = "200.00" ] && [ "$OVERDUE" = "50.00" ]; then
        print_status 0 "Financial aggregates calculated correctly"
    else
        echo -e "${RED}Expected: total_paid=200.00, total_owed=200.00, overdue=50.00${NC}"
        echo -e "${RED}Actual: total_paid=$TOTAL_PAID, total_owed=$TOTAL_OWED, overdue=$OVERDUE${NC}"
        print_status 1 "Financial aggregates incorrect"
        return 1
    fi

    # Cleanup
    psql "$DATABASE_URL" -c "
        DELETE FROM financial_transactions WHERE child_id = '$TEST_CHILD_ID';
        DELETE FROM children WHERE id = '$TEST_CHILD_ID';
    "

    return 0
}

# Test 3: Verify drawer UI components load without errors
test_frontend_components() {
    echo "🖥️  Testing frontend components..."

    # Check if React components compile
    if ! npm run build > /dev/null 2>&1; then
        print_status 1 "Frontend build failed"
        return 1
    fi

    print_status 0 "Frontend components compile successfully"
    return 0
}

# Test 4: Verify database constraints
test_database_constraints() {
    echo "🗄️  Testing database constraints..."

    # Test that withdrawal_date cannot be before enrollment_date
    CONSTRAINT_VIOLATION=$(psql "$DATABASE_URL" -c "
        INSERT INTO children (full_name, enrollment_date, withdrawal_date)
        VALUES ('Invalid Dates Test', CURRENT_DATE, CURRENT_DATE - INTERVAL '1 day');
    " 2>&1 | grep -c "check_withdrawal_after_enrollment" || true)

    if [ "$CONSTRAINT_VIOLATION" -gt 0 ]; then
        print_status 0 "Database constraints working correctly"
    else
        print_status 1 "Database constraints not enforced"
        return 1
    fi

    return 0
}

# Run all tests
main() {
    echo "🚀 Starting ChildTrack Status Toggle CI/CD Tests"
    echo "================================================"

    check_db_connection

    FAILED_TESTS=0

    test_status_toggle_sync || FAILED_TESTS=$((FAILED_TESTS + 1))
    test_financial_aggregates || FAILED_TESTS=$((FAILED_TESTS + 1))
    test_database_constraints || FAILED_TESTS=$((FAILED_TESTS + 1))
    test_frontend_components || FAILED_TESTS=$((FAILED_TESTS + 1))

    echo "================================================"

    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests passed! Ready for deployment.${NC}"
        exit 0
    else
        echo -e "${RED}💥 $FAILED_TESTS test(s) failed. Please fix before deploying.${NC}"
        exit 1
    fi
}

# Run main function
main