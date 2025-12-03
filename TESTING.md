# Testing Documentation

## Overview

This document outlines the testing strategy, test cases, and procedures for the EximPe Financial Dashboard application.

## Testing Strategy

### Test Levels
1. Unit Tests - Individual function and component testing
2. Integration Tests - API endpoint and service integration testing
3. End-to-End Tests - Complete user workflow testing
4. Performance Tests - Load and response time testing

### Test Coverage Goals
- Backend Services: 80% minimum
- API Endpoints: 100%
- Frontend Components: 70% minimum
- Critical Paths: 100%

## Manual Testing Procedures

### Backend API Testing

#### Test Suite 1: Health Check
**Objective:** Verify server is running and responding

**Test Case 1.1: Health Endpoint**
```bash
curl http://localhost:3001/health
```

**Expected Result:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-03T..."
}
```

**Status Code:** 200

---

#### Test Suite 2: Market Data API

**Test Case 2.1: Fetch All Market Data**
```bash
curl http://localhost:3001/api/market/all
```

**Expected Result:**
- Status Code: 200
- Response contains: nifty, sensex, usdInr, eurUsd, gbpUsd, usdJpy, dxy, gold, brent
- All price fields are non-empty strings
- All change fields are numeric strings
- timestamp field is ISO 8601 format

**Validation Criteria:**
```javascript
{
  success: true,
  data: {
    nifty: { price: /^\d{1,3}(,\d{3})*$/, change: /^-?\d+\.\d{2}$/ },
    sensex: { price: /^\d{1,3}(,\d{3})*$/, change: /^-?\d+\.\d{2}$/ },
    // ... all other fields
  },
  timestamp: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
}
```

**Test Case 2.2: Fetch Stocks Only**
```bash
curl http://localhost:3001/api/market/stocks
```

**Expected Result:**
- Status Code: 200
- Response contains only: nifty, sensex
- No currency or commodity data present

**Test Case 2.3: Fetch Currencies Only**
```bash
curl http://localhost:3001/api/market/currencies
```

**Expected Result:**
- Status Code: 200
- Response contains: usdInr, eurUsd, gbpUsd, usdJpy, dxy
- No stock or commodity data present

**Test Case 2.4: Fetch Commodities Only**
```bash
curl http://localhost:3001/api/market/commodities
```

**Expected Result:**
- Status Code: 200
- Response contains: gold, brent
- No stock or currency data present

**Test Case 2.5: Cache Validation**
```bash
# First request
time curl http://localhost:3001/api/market/all

# Second request (within 30 seconds)
time curl http://localhost:3001/api/market/all
```

**Expected Result:**
- First request: 2-5 seconds
- Second request: < 0.1 seconds
- Both responses identical

---

#### Test Suite 3: News API

**Test Case 3.1: Fetch Corporate News**
```bash
curl http://localhost:3001/api/news/corporate
```

**Expected Result:**
- Status Code: 200
- Response contains array of 0-10 news items
- Each item has: title, source, time, link, sentiment
- sentiment is one of: positive, negative, neutral

**Validation Criteria:**
```javascript
{
  success: true,
  data: [
    {
      title: string (length > 0),
      source: string (length > 0),
      time: string (matches /\d+[dhm] ago/),
      link: string (valid URL),
      sentiment: string ('positive' | 'negative' | 'neutral')
    }
  ],
  count: number (0-10),
  timestamp: ISO 8601 string
}
```

**Test Case 3.2: News Cache Validation**
```bash
# First request
time curl http://localhost:3001/api/news/corporate

# Second request (within 5 minutes)
time curl http://localhost:3001/api/news/corporate
```

**Expected Result:**
- First request: 3-7 seconds
- Second request: < 0.1 seconds
- Both responses identical

---

#### Test Suite 4: Error Handling

**Test Case 4.1: Invalid Endpoint**
```bash
curl http://localhost:3001/api/invalid
```

**Expected Result:**
- Status Code: 404

**Test Case 4.2: Server Error Simulation**
Disconnect internet connection, then:
```bash
curl http://localhost:3001/api/market/all
```

**Expected Result:**
- Status Code: 500
- Response contains error message

---

### Frontend Testing

#### Test Suite 5: Component Rendering

**Test Case 5.1: Initial Page Load**
1. Navigate to http://localhost:5173
2. Verify page loads within 3 seconds
3. Verify all sections render:
   - Header with date
   - Equity section
   - Key Corporate Moves section
   - Debt Markets section
   - Currency section
   - Commodities section
   - Global Markets section
   - Footer

**Test Case 5.2: Data Population**
1. Wait for API calls to complete (check network tab)
2. Verify market data displays actual values (not placeholders)
3. Verify news items populate in Key Corporate Moves section
4. Verify timestamp shows "Last updated: HH:MM:SS"

**Test Case 5.3: Change Indicators**
1. Verify positive changes show green color
2. Verify negative changes show red color
3. Verify change percentages display with + or - prefix

---

#### Test Suite 6: User Interactions

**Test Case 6.1: News Link Clicks**
1. Click on a news article title or "Read more" link
2. Verify link opens in new tab
3. Verify correct article loads

**Test Case 6.2: Auto-Refresh**
1. Note initial market data values
2. Wait 30 seconds
3. Verify data refreshes automatically
4. Verify timestamp updates

---

### Performance Testing

#### Test Suite 7: Load Testing

**Test Case 7.1: Concurrent Requests**
```bash
# Install Apache Bench if not available
# Test with 100 concurrent requests
ab -n 100 -c 10 http://localhost:3001/api/market/all
```

**Expected Result:**
- 100% success rate
- Mean response time: < 5 seconds for uncached
- Mean response time: < 0.2 seconds for cached

**Test Case 7.2: Sustained Load**
```bash
# Run for 60 seconds with 5 concurrent users
ab -t 60 -c 5 http://localhost:3001/api/market/all
```

**Expected Result:**
- No memory leaks (monitor with `top` or `htop`)
- Memory usage stable < 100 MB
- CPU usage < 50%

---

#### Test Suite 8: Response Time Testing

**Test Case 8.1: API Response Times**
```bash
# Create test script: test_response_times.sh
for i in {1..10}; do
  curl -w "Time: %{time_total}s\n" -o /dev/null -s http://localhost:3001/api/market/all
done
```

**Expected Result:**
- First request: 2-5 seconds
- Subsequent cached requests: < 0.1 seconds
- Average: < 1 second

---

### Data Accuracy Testing

#### Test Suite 9: Market Data Validation

**Test Case 9.1: Cross-Reference Stock Prices**
1. Fetch data from API
2. Compare Nifty/Sensex values with NSE/BSE official websites
3. Verify values within 0.5% variance (accounting for refresh lag)

**Test Case 9.2: Currency Rate Validation**
1. Fetch currency data from API
2. Compare with ECB official rates at https://www.ecb.europa.eu
3. Verify values match exactly (Frankfurter uses ECB data)

**Test Case 9.3: DXY Calculation Verification**
```javascript
// Manual calculation verification
const eurUsd = 1.1614;
const gbpUsd = 1.3204;
const usdJpy = 156.07;
const usdCad = 1.35;  // From API
const usdChf = 0.92;  // From API
const usdSek = 10.5;  // From API

const dxy = 50.14348112 *
  Math.pow((1/eurUsd), 0.576) *
  Math.pow((1/gbpUsd), 0.119) *
  Math.pow((usdJpy/100), 0.136) *
  Math.pow(usdCad, 0.091) *
  Math.pow(usdChf, 0.042) *
  Math.pow(usdSek, 0.036);

console.log(`Calculated DXY: ${dxy.toFixed(2)}`);
// Should match API response within 0.01
```

---

### Security Testing

#### Test Suite 10: Security Validation

**Test Case 10.1: API Key Exposure**
1. Open browser DevTools Network tab
2. Load application
3. Inspect all API requests
4. Verify no API keys in request headers or URLs

**Test Case 10.2: CORS Configuration**
```bash
# Test from unauthorized origin
curl -H "Origin: http://malicious-site.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS http://localhost:3001/api/market/all
```

**Expected Result:**
- Development: CORS allows all origins
- Production: Should restrict to specific origins

**Test Case 10.3: Environment Variable Protection**
```bash
# Verify .env is not accessible
curl http://localhost:3001/.env
```

**Expected Result:**
- Status Code: 404

---

## Automated Test Scripts

### Script 1: Complete API Test
Save as `tests/api_test.sh`:

```bash
#!/bin/bash

echo "Starting API Test Suite..."
echo "=========================="

BASE_URL="http://localhost:3001"
PASS=0
FAIL=0

# Test 1: Health Check
echo "Test 1: Health Check"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/health)
if [ "$RESPONSE" -eq 200 ]; then
  echo "PASS"
  ((PASS++))
else
  echo "FAIL - Expected 200, got $RESPONSE"
  ((FAIL++))
fi

# Test 2: Market Data All
echo "Test 2: Market Data All"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/market/all)
if [ "$RESPONSE" -eq 200 ]; then
  echo "PASS"
  ((PASS++))
else
  echo "FAIL - Expected 200, got $RESPONSE"
  ((FAIL++))
fi

# Test 3: Market Data Stocks
echo "Test 3: Market Data Stocks"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/market/stocks)
if [ "$RESPONSE" -eq 200 ]; then
  echo "PASS"
  ((PASS++))
else
  echo "FAIL - Expected 200, got $RESPONSE"
  ((FAIL++))
fi

# Test 4: Market Data Currencies
echo "Test 4: Market Data Currencies"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/market/currencies)
if [ "$RESPONSE" -eq 200 ]; then
  echo "PASS"
  ((PASS++))
else
  echo "FAIL - Expected 200, got $RESPONSE"
  ((FAIL++))
fi

# Test 5: Market Data Commodities
echo "Test 5: Market Data Commodities"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/market/commodities)
if [ "$RESPONSE" -eq 200 ]; then
  echo "PASS"
  ((PASS++))
else
  echo "FAIL - Expected 200, got $RESPONSE"
  ((FAIL++))
fi

# Test 6: Corporate News
echo "Test 6: Corporate News"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/news/corporate)
if [ "$RESPONSE" -eq 200 ]; then
  echo "PASS"
  ((PASS++))
else
  echo "FAIL - Expected 200, got $RESPONSE"
  ((FAIL++))
fi

# Test 7: Cache Performance
echo "Test 7: Cache Performance"
START=$(date +%s%N)
curl -s $BASE_URL/api/market/all > /dev/null
END=$(date +%s%N)
FIRST_TIME=$((($END - $START) / 1000000))

START=$(date +%s%N)
curl -s $BASE_URL/api/market/all > /dev/null
END=$(date +%s%N)
SECOND_TIME=$((($END - $START) / 1000000))

if [ "$SECOND_TIME" -lt 200 ]; then
  echo "PASS - Second request: ${SECOND_TIME}ms"
  ((PASS++))
else
  echo "FAIL - Second request too slow: ${SECOND_TIME}ms"
  ((FAIL++))
fi

echo "=========================="
echo "Tests Passed: $PASS"
echo "Tests Failed: $FAIL"
echo "=========================="

if [ "$FAIL" -eq 0 ]; then
  exit 0
else
  exit 1
fi
```

### Script 2: Data Validation Test
Save as `tests/data_validation.js`:

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function validateMarketData() {
  console.log('Validating Market Data...');

  try {
    const response = await axios.get(`${BASE_URL}/market/all`);
    const { data } = response.data;

    const tests = [
      { name: 'Nifty price format', pass: /^\d{1,3}(,\d{3})*$/.test(data.nifty.price) },
      { name: 'Nifty change format', pass: /^-?\d+\.\d{2}$/.test(data.nifty.change) },
      { name: 'Sensex price format', pass: /^\d{1,3}(,\d{3})*$/.test(data.sensex.price) },
      { name: 'USD/INR price format', pass: /^\d+\.\d{2}$/.test(data.usdInr.price) },
      { name: 'DXY calculation exists', pass: data.dxy.price !== '--' },
      { name: 'Gold price format', pass: /^\d{1,3}(,\d{3})*$/.test(data.gold.price) },
      { name: 'Timestamp format', pass: /^\d{4}-\d{2}-\d{2}T/.test(data.lastUpdated) }
    ];

    let passed = 0;
    let failed = 0;

    tests.forEach(test => {
      if (test.pass) {
        console.log(`PASS: ${test.name}`);
        passed++;
      } else {
        console.log(`FAIL: ${test.name}`);
        failed++;
      }
    });

    console.log(`\nTotal: ${passed} passed, ${failed} failed`);
    return failed === 0;

  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

async function validateNewsData() {
  console.log('\nValidating News Data...');

  try {
    const response = await axios.get(`${BASE_URL}/news/corporate`);
    const { data } = response.data;

    const tests = [
      { name: 'News array exists', pass: Array.isArray(data) },
      { name: 'News count reasonable', pass: data.length >= 0 && data.length <= 20 },
      { name: 'First item has title', pass: data.length > 0 ? data[0].title.length > 0 : true },
      { name: 'First item has source', pass: data.length > 0 ? data[0].source.length > 0 : true },
      { name: 'First item has link', pass: data.length > 0 ? data[0].link.startsWith('http') : true },
      { name: 'First item has sentiment', pass: data.length > 0 ? ['positive', 'negative', 'neutral'].includes(data[0].sentiment) : true }
    ];

    let passed = 0;
    let failed = 0;

    tests.forEach(test => {
      if (test.pass) {
        console.log(`PASS: ${test.name}`);
        passed++;
      } else {
        console.log(`FAIL: ${test.name}`);
        failed++;
      }
    });

    console.log(`\nTotal: ${passed} passed, ${failed} failed`);
    return failed === 0;

  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

(async () => {
  const marketResult = await validateMarketData();
  const newsResult = await validateNewsData();

  process.exit(marketResult && newsResult ? 0 : 1);
})();
```

## Test Execution

### Prerequisites
```bash
# Ensure server is running
cd backend
node server.js

# In another terminal, run tests
```

### Running Tests

**API Test Suite:**
```bash
chmod +x tests/api_test.sh
./tests/api_test.sh
```

**Data Validation:**
```bash
cd tests
npm install axios
node data_validation.js
```

**Performance Test:**
```bash
ab -n 100 -c 10 http://localhost:3001/api/market/all
```

## Test Results Documentation

### Test Run Template

```
Date: YYYY-MM-DD
Tester: [Name]
Environment: Development/Staging/Production
Node Version: X.X.X

Test Suite: [Suite Name]
Results:
- Total Tests: XX
- Passed: XX
- Failed: XX
- Skipped: XX

Failed Test Details:
1. [Test Case ID] - [Reason]
2. [Test Case ID] - [Reason]

Notes:
[Any additional observations]
```

## Continuous Integration

### GitHub Actions Workflow
Create `.github/workflows/test.yml`:

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'

    - name: Install dependencies
      run: |
        cd backend
        npm install

    - name: Start server
      run: |
        cd backend
        node server.js &
        sleep 5

    - name: Run API tests
      run: ./tests/api_test.sh

    - name: Run data validation
      run: |
        cd tests
        npm install axios
        node data_validation.js
```

## Regression Testing

After any code change, run the following minimum test suite:

1. Health check endpoint
2. All market data endpoint
3. News endpoint
4. Cache performance test
5. Data format validation

Expected execution time: 2-3 minutes

## Bug Reporting

When reporting bugs, include:

1. Test case that failed
2. Expected result
3. Actual result
4. Steps to reproduce
5. Environment details (OS, Node version, etc.)
6. Server logs
7. Network logs (if frontend issue)

## Acceptance Criteria

For a release to be approved, the following must pass:

1. All API endpoints return status 200
2. Cache performs within 100ms for cached requests
3. No memory leaks during 60-second sustained load
4. Data format validation 100% pass rate
5. Frontend renders all sections without errors
6. No console errors in browser
7. API keys not exposed in network traffic
