# EximPe Financial Dashboard

A real-time financial market data aggregation platform for Indian equity markets, global currencies, commodities, and corporate news.

## Architecture Overview

The application follows a three-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                          │
│              React 18 + TypeScript + Vite                   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
┌──────────────────────▼──────────────────────────────────────┐
│                   Backend API Layer                         │
│              Node.js + Express + ES Modules                 │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────────────────┐   │
│  │  Market Service  │  │     News Service             │   │
│  │  - Caching Layer │  │     - Multi-provider         │   │
│  │  - Rate Limiting │  │     - Sentiment Analysis     │   │
│  └──────────────────┘  └──────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────────┐
│                 External Data Providers                     │
│                                                              │
│  Yahoo Finance    Frankfurter API    NewsAPI    GNews      │
│  (Stocks/Comm.)   (Currencies)       (News)     (News)      │
└─────────────────────────────────────────────────────────────┘
```

## Technical Stack

### Frontend
- React 18.3.1
- TypeScript 5.8.3
- Vite 5.4.19
- Tailwind CSS 3.4.17

### Backend
- Node.js (ES Modules)
- Express 4.18.2
- Axios 1.6.2
- dotenv 16.3.1

### External APIs
- Yahoo Finance API (Market Data)
- Frankfurter API (Currency Exchange Rates)
- NewsAPI.org (News Aggregation)
- GNews API (News Aggregation)
- Finnhub API (Financial News)

## Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Backend Setup

```bash
cd backend
npm install
```

Create environment configuration:

```bash
cp .env.example .env
```

Edit `.env` with your API credentials:

```
PORT=3001
NODE_ENV=development
NEWSAPI_KEY=your_newsapi_key
GNEWS_API_KEY=your_gnews_key
FINNHUB_API_KEY=your_finnhub_key
```

Start the backend server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### Frontend Setup

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### GET /api/market/all
Retrieves all market data including stocks, currencies, and commodities.

**Response:**
```json
{
  "success": true,
  "data": {
    "nifty": {
      "price": "25,986",
      "change": "-0.18",
      "timestamp": "2025-12-03T11:56:47.875Z"
    },
    "sensex": {
      "price": "85,107",
      "change": "-0.04",
      "timestamp": "2025-12-03T11:56:48.614Z"
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
    "lastUpdated": "2025-12-03T11:56:48.615Z"
  },
  "timestamp": "2025-12-03T11:56:48.615Z"
}
```

#### GET /api/market/stocks
Retrieves Indian stock market indices only.

**Response:**
```json
{
  "success": true,
  "data": {
    "nifty": {
      "price": "25,986",
      "change": "-0.18",
      "timestamp": "2025-12-03T11:56:47.875Z"
    },
    "sensex": {
      "price": "85,107",
      "change": "-0.04",
      "timestamp": "2025-12-03T11:56:48.614Z"
    }
  },
  "timestamp": "2025-12-03T11:56:48.615Z"
}
```

#### GET /api/market/currencies
Retrieves currency exchange rates.

**Response:**
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
  "timestamp": "2025-12-03T11:56:48.615Z"
}
```

#### GET /api/market/commodities
Retrieves commodity prices.

**Response:**
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
  "timestamp": "2025-12-03T11:56:48.615Z"
}
```

#### GET /api/news/corporate
Retrieves corporate news articles.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "title": "Article headline",
      "source": "Source name",
      "time": "1d ago",
      "link": "https://...",
      "sentiment": "positive"
    }
  ],
  "count": 10,
  "timestamp": "2025-12-03T11:56:15.125Z"
}
```

**Sentiment values:**
- `positive`: Article contains positive market indicators
- `negative`: Article contains negative market indicators
- `neutral`: Article is informational

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-03T11:55:23.422Z"
}
```

## Data Sources

### Market Data
- **Provider:** Yahoo Finance API
- **Symbols:** ^NSEI (Nifty 50), ^BSESN (Sensex), GC=F (Gold), BZ=F (Brent)
- **Update Frequency:** Real-time with 30-second cache
- **Rate Limit:** None for current usage pattern
- **Authentication:** Not required

### Currency Data
- **Provider:** Frankfurter API (European Central Bank)
- **Currencies:** USD, INR, EUR, GBP, JPY, CAD, CHF, SEK
- **Update Frequency:** Daily (ECB working days)
- **Rate Limit:** Unlimited
- **Authentication:** Not required

### Dollar Index (DXY) Calculation
The DXY is calculated using the official ICE US Dollar Index formula:

```
DXY = 50.14348112 × (EUR/USD)^-0.576 × (GBP/USD)^-0.119 ×
      (USD/JPY)^0.136 × (USD/CAD)^0.091 × (USD/CHF)^0.042 ×
      (USD/SEK)^0.036
```

All currency rates are fetched in real-time from Frankfurter API.

### News Data
- **Primary Provider:** GNews API
- **Secondary Provider:** Finnhub API
- **Tertiary Provider:** NewsAPI.org
- **Update Frequency:** 5 minutes
- **Rate Limits:**
  - NewsAPI: 100 requests/day
  - GNews: 100 requests/day
  - Finnhub: 60 requests/minute

## Caching Strategy

### Market Data Cache
- **TTL (Time To Live):** 30 seconds
- **Implementation:** In-memory Map object
- **Invalidation:** Automatic on TTL expiration
- **Cache Key Format:** `{data_type}_cache` (e.g., `indian_stocks`)

### News Data Cache
- **TTL (Time To Live):** 5 minutes
- **Implementation:** In-memory Map object
- **Invalidation:** Automatic on TTL expiration
- **Deduplication:** Title-based (first 50 characters)

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

HTTP Status Codes:
- `200`: Success
- `500`: Internal server error (API failure, network timeout)

## Performance Characteristics

### Response Times
- Cached request: < 100ms
- Uncached market data: 2-5 seconds
- Uncached news data: 3-7 seconds

### Memory Usage
- Backend process: ~50-70 MB
- Frontend bundle: ~800 KB (gzipped)

### Network Requirements
- Bandwidth: ~2-5 MB/hour during market hours
- Concurrent connections: 3-6 per data refresh

### Code Standards
- ES Modules (import/export)
- TypeScript strict mode enabled
- ESLint configuration enforced
- No console.log in production builds

### Testing

See `TESTING.md` for comprehensive test suite documentation.

## Production Deployment

### Environment Variables

Backend `.env`:
```
PORT=3001
NODE_ENV=production
NEWSAPI_KEY=production_key
GNEWS_API_KEY=production_key
FINNHUB_API_KEY=production_key
```

Frontend `.env`:
```
VITE_API_URL=https://api.yourdomain.com/api
```

### Build Process

Frontend:
```bash
npm run build
```

Output directory: `dist/`

### Recommended Infrastructure
- Backend: Node.js 18+ runtime (Heroku, Render, Railway)
- Frontend: Static hosting (Vercel, Netlify, Cloudflare Pages)
- Reverse Proxy: Nginx or Cloudflare
- Monitoring: Application Performance Monitoring (APM) tool

### Security Considerations
- API keys stored in backend environment only
- CORS configured for specific origins in production
- Rate limiting recommended for production deployment
- HTTPS required for all communications

## Troubleshooting

### Backend fails to start
Check Node.js version and ensure all dependencies are installed:
```bash
node --version  # Should be >= 18.0.0
cd backend
npm install
```

### Market data returns errors
Verify network connectivity to external APIs:
```bash
curl https://query1.finance.yahoo.com/v8/finance/chart/^NSEI
curl https://api.frankfurter.app/latest
```

### News data is empty
Verify API keys are configured correctly in `backend/.env`:
```bash
cat backend/.env
```

### CORS errors in frontend
Ensure backend is running and VITE_API_URL is correctly configured:
```bash
echo $VITE_API_URL
```

## License

Proprietary - All rights reserved

## Support

For technical issues, consult the troubleshooting section or review backend logs:
```bash
cd backend
node server.js
```

Log output will indicate specific API failures or configuration issues.
# eximpe-brew
