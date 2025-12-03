#!/bin/bash

echo "Starting API Test Suite..."

BASE_URL="http://localhost:3001"
PASS=0
FAIL=0

# Test 1: Health Check
echo "Test 1: Health Check"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/health)
if [ "$RESPONSE" -eq 200 ]; then
  echo "  STATUS: PASS (HTTP $RESPONSE)"
  ((PASS++))
else
  echo "  STATUS: FAIL - Expected 200, got $RESPONSE"
  ((FAIL++))
fi
echo ""

# Test 2: Market Data All
echo "Test 2: Market Data All"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/market/all)
if [ "$RESPONSE" -eq 200 ]; then
  echo "  STATUS: PASS (HTTP $RESPONSE)"
  ((PASS++))
else
  echo "  STATUS: FAIL - Expected 200, got $RESPONSE"
  ((FAIL++))
fi
echo ""

# Test 3: Market Data Stocks
echo "Test 3: Market Data Stocks"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/market/stocks)
if [ "$RESPONSE" -eq 200 ]; then
  echo "  STATUS: PASS (HTTP $RESPONSE)"
  ((PASS++))
else
  echo "  STATUS: FAIL - Expected 200, got $RESPONSE"
  ((FAIL++))
fi
echo ""

# Test 4: Market Data Currencies
echo "Test 4: Market Data Currencies"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/market/currencies)
if [ "$RESPONSE" -eq 200 ]; then
  echo "  STATUS: PASS (HTTP $RESPONSE)"
  ((PASS++))
else
  echo "  STATUS: FAIL - Expected 200, got $RESPONSE"
  ((FAIL++))
fi
echo ""

# Test 5: Market Data Commodities
echo "Test 5: Market Data Commodities"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/market/commodities)
if [ "$RESPONSE" -eq 200 ]; then
  echo "  STATUS: PASS (HTTP $RESPONSE)"
  ((PASS++))
else
  echo "  STATUS: FAIL - Expected 200, got $RESPONSE"
  ((FAIL++))
fi
echo ""

# Test 6: Corporate News
echo "Test 6: Corporate News"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/news/corporate)
if [ "$RESPONSE" -eq 200 ]; then
  echo "  STATUS: PASS (HTTP $RESPONSE)"
  ((PASS++))
else
  echo "  STATUS: FAIL - Expected 200, got $RESPONSE"
  ((FAIL++))
fi
echo ""

# Test 7: Response Body Structure
echo "Test 7: Response Body Structure"
BODY=$(curl -s $BASE_URL/api/market/all)
if echo "$BODY" | grep -q '"success":true'; then
  echo "  STATUS: PASS (Valid JSON structure)"
  ((PASS++))
else
  echo "  STATUS: FAIL - Invalid response structure"
  ((FAIL++))
fi
echo ""

# Test 8: Data Fields Existence
echo "Test 8: Data Fields Existence"
if echo "$BODY" | grep -q '"nifty"' && echo "$BODY" | grep -q '"sensex"' && echo "$BODY" | grep -q '"usdInr"'; then
  echo "  STATUS: PASS (All required fields present)"
  ((PASS++))
else
  echo "  STATUS: FAIL - Missing required fields"
  ((FAIL++))
fi
echo ""

echo "Test Summary"
echo "Total Tests:  $((PASS + FAIL))"
echo "Tests Passed: $PASS"
echo "Tests Failed: $FAIL"
echo "Pass Rate:    $(awk "BEGIN {printf \"%.1f\", ($PASS/($PASS+$FAIL))*100}")%"

if [ "$FAIL" -eq 0 ]; then
  echo "Result: ALL TESTS PASSED"
  exit 0
else
  echo "Result: SOME TESTS FAILED"
  exit 1
fi
