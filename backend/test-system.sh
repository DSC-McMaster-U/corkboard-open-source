#!/bin/bash
# Corkboard Backend Test Script
# This script tests all API endpoints and verifies the system is working correctly

set -e

echo "🎵 Corkboard Backend System Test"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to run a test
test_endpoint() {
  local name=$1
  local url=$2
  local expected=$3
  
  echo -n "Testing $name... "
  
  response=$(curl -s "$url")
  
  if echo "$response" | grep -q "$expected"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAILED${NC}"
    echo "  Expected substring: $expected"
    echo "  Got: $response"
    ((FAILED++))
  fi
}

# Check if server is running
echo "1. Checking if services are running..."
if ! curl -s http://localhost:3000/health > /dev/null 2>&1; then
  echo -e "${RED}ERROR: Backend API is not running on port 3000${NC}"
  echo "Please start the backend with: npm start"
  exit 1
fi

if ! docker compose -f /workspaces/corkboard-open-source/backend/docker-compose.yml ps | grep -q "Up"; then
  echo -e "${RED}ERROR: Database is not running${NC}"
  echo "Please start the database with: docker compose up -d"
  exit 1
fi

echo -e "${GREEN}✓ Services are running${NC}"
echo ""

# Run tests
echo "2. Running API endpoint tests..."
echo ""

test_endpoint "Health Check" "http://localhost:3000/health" '"status":"healthy"'
test_endpoint "API Root" "http://localhost:3000/" '"message":"Corkboard API"'
test_endpoint "Get All Events" "http://localhost:3000/events" '"count":15'
test_endpoint "Get Event by ID" "http://localhost:3000/events/1" '"title":"Indie Night at The Casbah"'
test_endpoint "Filter by Genre (indie)" "http://localhost:3000/events/genre/indie" '"genre":"indie"'
test_endpoint "Filter by Genre (punk)" "http://localhost:3000/events/genre/punk" '"Punk Rock Marathon"'
test_endpoint "Filter by Genre (jazz)" "http://localhost:3000/events/genre/jazz" '"Jazz & Blues Night"'

echo ""
echo "3. Testing database directly..."
echo ""

# Test database
echo -n "Checking event count in database... "
if event_count=$(docker exec backend-db-1 psql -U postgres -d corkboard -t -c "SELECT COUNT(*) FROM events;" 2>/dev/null | tr -d ' '); then
  if [ "$event_count" = "15" ]; then
    echo -e "${GREEN}✓ PASSED${NC} (15 events)"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAILED${NC} (expected 15, got $event_count)"
    ((FAILED++))
  fi
else
  echo -e "${RED}✗ FAILED${NC} (database connection error)"
  ((FAILED++))
fi

echo -n "Checking users table... "
if user_count=$(docker exec backend-db-1 psql -U postgres -d corkboard -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' '); then
  if [ "$user_count" = "2" ]; then
    echo -e "${GREEN}✓ PASSED${NC} (2 users)"
    ((PASSED++))
  else
    echo -e "${RED}✗ FAILED${NC} (expected 2, got $user_count)"
    ((FAILED++))
  fi
else
  echo -e "${RED}✗ FAILED${NC} (database connection error)"
  ((FAILED++))
fi

# Summary
echo ""
echo "=================================="
echo "Test Results"
echo "=================================="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All tests passed! The system is working correctly.${NC}"
  exit 0
else
  echo -e "${RED}⚠️  Some tests failed. Please check the errors above.${NC}"
  exit 1
fi
