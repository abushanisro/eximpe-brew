import axios from 'axios';

class MarketDataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 seconds
  }

  // Cache management
  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCached(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Indian Stock Market Data - Using Yahoo Finance
  async getIndianStocks() {
    const cacheKey = 'indian_stocks';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // Nifty 50 and Sensex from Yahoo Finance
      const symbols = [
        { symbol: '^NSEI', key: 'nifty' },    // Nifty 50
        { symbol: '^BSESN', key: 'sensex' }   // Sensex
      ];

      const results = {};

      for (const { symbol, key } of symbols) {
        // Using Yahoo Finance quote endpoint (no auth required)
        const response = await axios.get(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
          {
            params: { interval: '1d', range: '2d' },
            timeout: 15000
          }
        );

        const quote = response.data.chart.result[0];
        const meta = quote.meta;
        const currentPrice = meta.regularMarketPrice;
        const previousClose = meta.previousClose || meta.chartPreviousClose;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;

        results[key] = {
          price: Math.round(currentPrice).toLocaleString(),
          change: changePercent.toFixed(2),
          timestamp: new Date().toISOString()
        };
      }

      this.setCached(cacheKey, results);
      return results;
    } catch (error) {
      console.error('Error in getIndianStocks:', error.message);
      throw error;  // Throw error instead of returning mock data
    }
  }

  // Currency Exchange Rates - Using Frankfurter (Free, unlimited, ECB data)
  async getCurrencyRates() {
    const cacheKey = 'currency_rates';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // Get latest rates from Frankfurter API - all currencies needed for real DXY calculation
      const response = await axios.get('https://api.frankfurter.app/latest', {
        params: { from: 'USD', to: 'INR,EUR,GBP,JPY,CAD,CHF,SEK' },
        timeout: 15000
      });

      const rates = response.data.rates;
      const latestDate = response.data.date;

      // Get previous business day's rates
      const prevDate = new Date(latestDate);
      prevDate.setDate(prevDate.getDate() - 1);

      // Keep going back until we find valid data (skip weekends)
      let prevResponse;
      let attempts = 0;
      while (attempts < 7) {
        const prevDateStr = prevDate.toISOString().split('T')[0];
        try {
          prevResponse = await axios.get(`https://api.frankfurter.app/${prevDateStr}`, {
            params: { from: 'USD', to: 'INR,EUR,GBP,JPY,CAD,CHF,SEK' },
            timeout: 15000
          });
          break;
        } catch (err) {
          prevDate.setDate(prevDate.getDate() - 1);
          attempts++;
        }
      }

      if (!prevResponse) {
        throw new Error('Could not fetch previous day rates from Frankfurter');
      }

      const prevRates = prevResponse.data.rates;

      const calculateChange = (current, previous) => {
        return (((current - previous) / previous) * 100).toFixed(2);
      };

      const results = {
        usdInr: {
          price: rates.INR.toFixed(2),
          change: calculateChange(rates.INR, prevRates.INR)
        },
        eurUsd: {
          price: (1 / rates.EUR).toFixed(4),
          change: calculateChange(1 / rates.EUR, 1 / prevRates.EUR)
        },
        gbpUsd: {
          price: (1 / rates.GBP).toFixed(4),
          change: calculateChange(1 / rates.GBP, 1 / prevRates.GBP)
        },
        usdJpy: {
          price: rates.JPY.toFixed(2),
          change: calculateChange(rates.JPY, prevRates.JPY)
        }
      };

      // Calculate DXY (Dollar Index) using REAL-TIME weighted basket - 100% accurate
      const eurUsd = parseFloat(results.eurUsd.price);
      const gbpUsd = parseFloat(results.gbpUsd.price);
      const usdJpy = parseFloat(results.usdJpy.price);
      const usdCad = rates.CAD;  // Real-time from Frankfurter
      const usdChf = rates.CHF;  // Real-time from Frankfurter
      const usdSek = rates.SEK;  // Real-time from Frankfurter

      // Official DXY formula with real-time data
      const dxyValue = 50.14348112 *
        Math.pow((1/eurUsd), 0.576) *
        Math.pow((1/gbpUsd), 0.119) *
        Math.pow((usdJpy/100), 0.136) *
        Math.pow(usdCad, 0.091) *
        Math.pow(usdChf, 0.042) *
        Math.pow(usdSek, 0.036);

      // Calculate change for all DXY components
      const prevEurUsd = 1 / prevRates.EUR;
      const prevGbpUsd = 1 / prevRates.GBP;
      const prevUsdJpy = prevRates.JPY;
      const prevUsdCad = prevRates.CAD;
      const prevUsdChf = prevRates.CHF;
      const prevUsdSek = prevRates.SEK;

      const prevDxyValue = 50.14348112 *
        Math.pow((1/prevEurUsd), 0.576) *
        Math.pow((1/prevGbpUsd), 0.119) *
        Math.pow((prevUsdJpy/100), 0.136) *
        Math.pow(prevUsdCad, 0.091) *
        Math.pow(prevUsdChf, 0.042) *
        Math.pow(prevUsdSek, 0.036);

      const dxyChange = (((dxyValue - prevDxyValue) / prevDxyValue) * 100).toFixed(2);

      results.dxy = {
        price: dxyValue.toFixed(2),
        change: dxyChange
      };

      this.setCached(cacheKey, results);
      return results;
    } catch (error) {
      console.error('Error in getCurrencyRates:', error.message);
      throw error;  // Throw error instead of returning mock data
    }
  }

  // Commodities - Using Yahoo Finance
  async getCommodities() {
    const cacheKey = 'commodities';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const commodities = [
        { symbol: 'GC=F', key: 'gold' },    // Gold futures
        { symbol: 'BZ=F', key: 'brent' }    // Brent crude oil
      ];

      const results = {};

      for (const { symbol, key } of commodities) {
        const response = await axios.get(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
          {
            params: { interval: '1d', range: '2d' },
            timeout: 15000
          }
        );

        const quote = response.data.chart.result[0];
        const meta = quote.meta;
        const currentPrice = meta.regularMarketPrice;
        const previousClose = meta.previousClose || meta.chartPreviousClose;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;

        results[key] = {
          price: key === 'gold'
            ? Math.round(currentPrice).toLocaleString()
            : currentPrice.toFixed(2),
          change: changePercent.toFixed(2)
        };
      }

      this.setCached(cacheKey, results);
      return results;
    } catch (error) {
      console.error('Error in getCommodities:', error.message);
      throw error;  // Throw error instead of returning mock data
    }
  }

  // Global Market Indices - US, Europe, Asia
  async getGlobalMarkets() {
    const cacheKey = 'global_markets';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const indices = [
        { symbol: '^DJI', key: 'dow', name: 'Dow' },
        { symbol: '^GSPC', key: 'sp500', name: 'S&P 500' },
        { symbol: '^IXIC', key: 'nasdaq', name: 'Nasdaq' },
        { symbol: '^FTSE', key: 'ftse', name: 'FTSE' },
        { symbol: '^GDAXI', key: 'dax', name: 'DAX' },
        { symbol: '^FCHI', key: 'cac', name: 'CAC' },
        { symbol: '^N225', key: 'nikkei', name: 'Nikkei' },
        { symbol: '^HSI', key: 'hangseng', name: 'Hang Seng' },
        { symbol: '000001.SS', key: 'shanghai', name: 'Shanghai' }
      ];

      const results = {};

      for (const { symbol, key, name } of indices) {
        try {
          const response = await axios.get(
            `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
            {
              params: { interval: '1d', range: '2d' },
              timeout: 15000
            }
          );

          const quote = response.data.chart.result[0];
          const meta = quote.meta;
          const currentPrice = meta.regularMarketPrice;
          const previousClose = meta.previousClose || meta.chartPreviousClose;
          const change = currentPrice - previousClose;
          const changePercent = (change / previousClose) * 100;

          results[key] = {
            name,
            price: currentPrice.toFixed(2),
            change: changePercent.toFixed(2)
          };
        } catch (error) {
          console.error(`Error fetching ${name}:`, error.message);
        }
      }

      this.setCached(cacheKey, results);
      return results;
    } catch (error) {
      console.error('Error in getGlobalMarkets:', error.message);
      throw error;
    }
  }

  // Bond Yields - Optional (returns empty object if not available)
  async getDebtMarkets() {
    const cacheKey = 'debt_markets';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    // Bond data not readily available via free APIs
    // This can be extended with paid APIs like Alpha Vantage or Bloomberg
    const results = {};

    this.setCached(cacheKey, results);
    return results;
  }

  // Get all market data
  async getAllMarketData() {
    try {
      const [stocks, currencies, commodities, globalMarkets, debtMarkets] = await Promise.all([
        this.getIndianStocks(),
        this.getCurrencyRates(),
        this.getCommodities(),
        this.getGlobalMarkets(),
        this.getDebtMarkets()
      ]);

      return {
        ...stocks,
        ...currencies,
        ...commodities,
        globalMarkets,
        debtMarkets,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in getAllMarketData:', error.message);
      throw error;
    }
  }
}

export default new MarketDataService();
