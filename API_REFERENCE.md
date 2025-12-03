# API Reference Documentation

Version: 1.0.0
Base URL: `http://localhost:3001/api`

## Table of Contents

1. [Authentication](#authentication)
2. [Rate Limiting](#rate-limiting)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [Endpoints](#endpoints)
6. [Data Models](#data-models)

## Authentication

The API currently does not require authentication. All endpoints are publicly accessible.

## Rate Limiting

No explicit rate limiting is enforced at the application level. However, upstream data providers have the following limits:

- Yahoo Finance: No documented limit for current usage
- Frankfurter API: No limit
- NewsAPI: 100 requests/day
- GNews: 100 requests/day
- Finnhub: 60 requests/minute

The application implements a 30-second cache for market data and 5-minute cache for news data to minimize upstream API calls.

## Response Format

All API responses follow a consistent JSON structure:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "timestamp": "2025-12-03T12:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Error Handling

### HTTP Status Codes

- `200 OK`: Request successful
- `404 Not Found`: Endpoint does not exist
- `500 Internal Server Error`: Server or upstream API error

### Common Error Scenarios

**Network Timeout**
```json
{
  "success": false,
  "error": "Failed to fetch market data",
  "message": "timeout of 15000ms exceeded"
}
```

**Upstream API Failure**
```json
{
  "success": false,
  "error": "Failed to fetch market data",
  "message": "Request failed with status code 429"
}
```

## Endpoints

### Health Check

#### GET /health

Check if the API server is running.

**Request**
```http
GET /health HTTP/1.1
Host: localhost:3001
```

**Response**
```json
{
  "status": "ok",
  "timestamp": "2025-12-03T12:00:00.000Z"
}
```

**Status Code:** 200

---

### Market Data

#### GET /api/market/all

Retrieve all market data including stocks, currencies, and commodities.

**Request**
```http
GET /api/market/all HTTP/1.1
Host: localhost:3001
```

**Response**
```json
{
  "success": true,
  "data": {
    "nifty": {
      "price": "25,986",
      "change": "-0.18",
      "timestamp": "2025-12-03T12:00:00.000Z"
    },
    "sensex": {
      "price": "85,107",
      "change": "-0.04",
      "timestamp": "2025-12-03T12:00:00.000Z"
    },
    "usdInr": {
      "price": "89.95",
      "change": "0.46"
    },
    "eurUsd": {
      "price": "1.1614",
      "change": "-0.28"
    },
    "gbpUsd": {
      "price": "1.3204",
      "change": "-0.48"
    },
    "usdJpy": {
      "price": "156.07",
      "change": "0.82"
    },
    "dxy": {
      "price": "52.38",
      "change": "0.39"
    },
    "gold": {
      "price": "4,235",
      "change": "1.15"
    },
    "brent": {
      "price": "63.16",
      "change": "1.14"
    },
    "lastUpdated": "2025-12-03T12:00:00.000Z"
  },
  "timestamp": "2025-12-03T12:00:00.000Z"
}
```

**Status Code:** 200

**Cache:** 30 seconds

**Upstream Sources:**
- Yahoo Finance: Nifty (^NSEI), Sensex (^BSESN), Gold (GC=F), Brent (BZ=F)
- Frankfurter: All currencies, DXY calculation

---

#### GET /api/market/stocks

Retrieve Indian stock market indices only.

**Request**
```http
GET /api/market/stocks HTTP/1.1
Host: localhost:3001
```

**Response**
```json
{
  "success": true,
  "data": {
    "nifty": {
      "price": "25,986",
      "change": "-0.18",
      "timestamp": "2025-12-03T12:00:00.000Z"
    },
    "sensex": {
      "price": "85,107",
      "change": "-0.04",
      "timestamp": "2025-12-03T12:00:00.000Z"
    }
  },
  "timestamp": "2025-12-03T12:00:00.000Z"
}
```

**Status Code:** 200

**Cache:** 30 seconds

---

#### GET /api/market/currencies

Retrieve currency exchange rates and DXY index.

**Request**
```http
GET /api/market/currencies HTTP/1.1
Host: localhost:3001
```

**Response**
```json
{
  "success": true,
  "data": {
    "usdInr": {
      "price": "89.95",
      "change": "0.46"
    },
    "eurUsd": {
      "price": "1.1614",
      "change": "-0.28"
    },
    "gbpUsd": {
      "price": "1.3204",
      "change": "-0.48"
    },
    "usdJpy": {
      "price": "156.07",
      "change": "0.82"
    },
    "dxy": {
      "price": "52.38",
      "change": "0.39"
    }
  },
  "timestamp": "2025-12-03T12:00:00.000Z"
}
```

**Status Code:** 200

**Cache:** 30 seconds

**DXY Calculation Formula:**
```
DXY = 50.14348112 × (EUR/USD)^-0.576 × (GBP/USD)^-0.119 ×
      (USD/JPY)^0.136 × (USD/CAD)^0.091 × (USD/CHF)^0.042 ×
      (USD/SEK)^0.036
```

---

#### GET /api/market/commodities

Retrieve commodity prices (Gold and Brent Crude Oil).

**Request**
```http
GET /api/market/commodities HTTP/1.1
Host: localhost:3001
```

**Response**
```json
{
  "success": true,
  "data": {
    "gold": {
      "price": "4,235",
      "change": "1.15"
    },
    "brent": {
      "price": "63.16",
      "change": "1.14"
    }
  },
  "timestamp": "2025-12-03T12:00:00.000Z"
}
```

**Status Code:** 200

**Cache:** 30 seconds

---

### News

#### GET /api/news/corporate

Retrieve corporate and market news articles.

**Request**
```http
GET /api/news/corporate HTTP/1.1
Host: localhost:3001
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "title": "Tata Communications acquires 51% stake in Commotion Inc",
      "source": "BusinessLine",
      "time": "1d ago",
      "link": "https://www.thehindubusinessline.com/info-tech/...",
      "sentiment": "positive"
    },
    {
      "title": "Stock market ended lower today",
      "source": "The Times of India",
      "time": "2d ago",
      "link": "https://economictimes.indiatimes.com/...",
      "sentiment": "negative"
    }
  ],
  "count": 2,
  "timestamp": "2025-12-03T12:00:00.000Z"
}
```

**Status Code:** 200

**Cache:** 5 minutes

**Upstream Sources:**
- GNews API (primary)
- Finnhub API (secondary)
- NewsAPI (tertiary)

**Sentiment Analysis:**
- `positive`: Article contains terms like "gain", "profit", "growth", "up"
- `negative`: Article contains terms like "loss", "decline", "fall", "down"
- `neutral`: No strong positive or negative indicators

**Deduplication:** Articles with similar titles (first 50 characters) are filtered to prevent duplicates.

---

## Data Models

### StockData
```typescript
interface StockData {
  price: string;        // Formatted with thousand separators (e.g., "25,986")
  change: string;       // Percentage change with 2 decimal places (e.g., "-0.18")
  timestamp: string;    // ISO 8601 timestamp
}
```

### CurrencyData
```typescript
interface CurrencyData {
  price: string;        // Exchange rate (2 decimals for pairs, 4 for major currencies)
  change: string;       // Percentage change with 2 decimal places
}
```

### CommodityData
```typescript
interface CommodityData {
  price: string;        // Gold: formatted with separators, Brent: 2 decimals
  change: string;       // Percentage change with 2 decimal places
}
```

### NewsArticle
```typescript
interface NewsArticle {
  title: string;        // Article headline
  source: string;       // Publication name
  time: string;         // Relative time (e.g., "1d ago", "3h ago")
  link: string;         // Full URL to article
  sentiment: 'positive' | 'negative' | 'neutral';
}
```

### MarketDataResponse
```typescript
interface MarketDataResponse {
  success: boolean;
  data: {
    nifty: StockData;
    sensex: StockData;
    usdInr: CurrencyData;
    eurUsd: CurrencyData;
    gbpUsd: CurrencyData;
    usdJpy: CurrencyData;
    dxy: CurrencyData;
    gold: CommodityData;
    brent: CommodityData;
    lastUpdated: string;
  };
  timestamp: string;
}
```

### NewsResponse
```typescript
interface NewsResponse {
  success: boolean;
  data: NewsArticle[];
  count: number;
  timestamp: string;
}
```

---

## Usage Examples

### cURL Examples

**Fetch all market data:**
```bash
curl http://localhost:3001/api/market/all
```

**Fetch only stocks:**
```bash
curl http://localhost:3001/api/market/stocks
```

**Fetch news:**
```bash
curl http://localhost:3001/api/news/corporate
```

**Pretty print JSON:**
```bash
curl -s http://localhost:3001/api/market/all | jq .
```

### JavaScript Fetch Examples

**Basic fetch:**
```javascript
fetch('http://localhost:3001/api/market/all')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

**With async/await:**
```javascript
async function getMarketData() {
  try {
    const response = await fetch('http://localhost:3001/api/market/all');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

**With error handling:**
```javascript
async function getMarketData() {
  try {
    const response = await fetch('http://localhost:3001/api/market/all');

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error('Failed to fetch market data:', error.message);
    return null;
  }
}
```

### Axios Examples

```javascript
import axios from 'axios';

async function getMarketData() {
  try {
    const response = await axios.get('http://localhost:3001/api/market/all');
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Server error:', error.response.data);
    } else if (error.request) {
      console.error('Network error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
  }
}
```

---

## Versioning

Current version: 1.0.0

The API does not currently use URL versioning. Breaking changes will be communicated in advance and will include a migration path.

## Support

For API issues or questions, refer to the main README.md file or examine server logs for detailed error information.
