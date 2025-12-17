import BaseService from './baseService.js';

class MarketDataService extends BaseService {
  constructor() {
    super(30000); // 30 seconds cache timeout for real-time updates
  }

  // Helper: Build URL with query parameters
  buildUrl(baseUrl, params = {}) {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
    return url.toString();
  }

  // Helper: Fetch with timeout
  async fetchWithTimeout(url, timeout = 10000, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } finally {
      clearTimeout(timeoutId);
    }
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
        const url = this.buildUrl(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
          { interval: '1d', range: '2d' }
        );

        const data = await this.fetchWithTimeout(url, 15000);

        const quote = data.chart.result[0];
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

  // Currency Exchange Rates - Using Yahoo Finance for real-time data with previous close
  async getCurrencyRates() {
    const cacheKey = 'currency_rates';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // Define currency pairs to fetch from Yahoo Finance
      const currencyPairs = [
        { symbol: 'USDINR=X', key: 'usdInr', decimals: 2 },
        { symbol: 'EURINR=X', key: 'eurInr', decimals: 2 },
        { symbol: 'GBPINR=X', key: 'gbpInr', decimals: 2 },
        { symbol: 'AUDINR=X', key: 'audInr', decimals: 2 },
        { symbol: 'CNYINR=X', key: 'cnyInr', decimals: 2 },
        { symbol: 'JPYINR=X', key: 'jpyInr', decimals: 4 },
        { symbol: 'EURUSD=X', key: 'eurUsd', decimals: 4 },
        { symbol: 'GBPUSD=X', key: 'gbpUsd', decimals: 4 },
        { symbol: 'USDJPY=X', key: 'usdJpy', decimals: 2 }
      ];

      const results = {};

      // Fetch all currency pairs in parallel
      await Promise.all(
        currencyPairs.map(async ({ symbol, key, decimals }) => {
          try {
            const url = this.buildUrl(
              `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
              { interval: '1d', range: '2d' }
            );

            const data = await this.fetchWithTimeout(url, 10000);

            const quote = data.chart.result[0];
            const meta = quote.meta;
            const currentPrice = meta.regularMarketPrice;
            const previousClose = meta.previousClose || meta.chartPreviousClose;
            const change = currentPrice - previousClose;
            const changePercent = (change / previousClose) * 100;

            console.log(`${symbol}: Current=${currentPrice}, Previous=${previousClose}, Change=${changePercent.toFixed(2)}%`);

            results[key] = {
              price: currentPrice.toFixed(decimals),
              change: changePercent.toFixed(2)
            };
          } catch (error) {
            console.error(`Error fetching ${symbol}:`, error.message);
          }
        })
      );

      // Calculate AED/INR (AED is pegged to USD at 3.6725)
      if (results.usdInr) {
        const AED_TO_USD = 3.6725;
        const aedInrPrice = parseFloat(results.usdInr.price) / AED_TO_USD;

        results.aedInr = {
          price: aedInrPrice.toFixed(2),
          change: results.usdInr.change // AED follows USD due to peg
        };
      }

      // Fetch DXY (Dollar Index) from Yahoo Finance for accurate real-time data
      const dxyUrl = this.buildUrl(
        'https://query1.finance.yahoo.com/v8/finance/chart/DX-Y.NYB',
        { interval: '1d', range: '2d' }
      );

      const dxyData = await this.fetchWithTimeout(dxyUrl, 10000);

      const dxyQuote = dxyData.chart.result[0];
      const dxyMeta = dxyQuote.meta;
      const dxyCurrentPrice = dxyMeta.regularMarketPrice;
      const dxyPreviousClose = dxyMeta.previousClose || dxyMeta.chartPreviousClose;
      const dxyChange = dxyCurrentPrice - dxyPreviousClose;
      const dxyChangePercent = (dxyChange / dxyPreviousClose) * 100;

      results.dxy = {
        price: dxyCurrentPrice.toFixed(2),
        change: dxyChangePercent.toFixed(2)
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
        const url = this.buildUrl(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
          { interval: '1d', range: '2d' }
        );

        const data = await this.fetchWithTimeout(url, 15000);

        const quote = data.chart.result[0];
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
          const url = this.buildUrl(
            `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
            { interval: '1d', range: '2d' }
          );

          const data = await this.fetchWithTimeout(url, 15000);

          const quote = data.chart.result[0];
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

  // FII/DII Data - Real-time from NSE India API
  async getFIIDIIData() {
    const cacheKey = 'fii_dii_data';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // NSE India provides real-time FII/DII data
      const data = await this.fetchWithTimeout('https://www.nseindia.com/api/fiidiiTradeReact', 15000, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.nseindia.com/',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      // NSE provides data in format: {category: "FII", buyValue: "123.45", sellValue: "234.56", ...}

      let fiiData = { buy: 0, sell: 0, net: 0 };
      let diiData = { buy: 0, sell: 0, net: 0 };

      if (Array.isArray(data)) {
        // Find FII and DII data in the array
        data.forEach(item => {
          if (item.category && item.category.toLowerCase().includes('fii')) {
            fiiData.buy = parseFloat(item.buyValue || 0);
            fiiData.sell = parseFloat(item.sellValue || 0);
            fiiData.net = parseFloat(item.netValue || (fiiData.buy - fiiData.sell));
          }
          if (item.category && item.category.toLowerCase().includes('dii')) {
            diiData.buy = parseFloat(item.buyValue || 0);
            diiData.sell = parseFloat(item.sellValue || 0);
            diiData.net = parseFloat(item.netValue || (diiData.buy - diiData.sell));
          }
        });
      }

      const results = {
        fii: {
          buy: Math.abs(fiiData.buy).toFixed(2),
          sell: Math.abs(fiiData.sell).toFixed(2),
          net: fiiData.net.toFixed(2),
          netStatus: fiiData.net >= 0 ? 'bought' : 'sold',
          netAmount: Math.abs(fiiData.net).toFixed(2)
        },
        dii: {
          buy: Math.abs(diiData.buy).toFixed(2),
          sell: Math.abs(diiData.sell).toFixed(2),
          net: diiData.net.toFixed(2),
          netStatus: diiData.net >= 0 ? 'bought' : 'sold',
          netAmount: Math.abs(diiData.net).toFixed(2)
        },
        lastUpdated: new Date().toISOString()
      };

      this.setCached(cacheKey, results);
      return results;
    } catch (error) {
      console.error('Error fetching FII/DII data from NSE:', error.message);
      console.error('NSE API may be blocking requests or rate limiting');
      throw error; // Throw error instead of returning dummy data
    }
  }

  // Get all market data
  async getAllMarketData() {
    // Use Promise.allSettled to get partial data even if some APIs fail
    const [stocks, currencies, commodities, globalMarkets, debtMarkets, fiiDii] = await Promise.allSettled([
      this.getIndianStocks(),
      this.getCurrencyRates(),
      this.getCommodities(),
      this.getGlobalMarkets(),
      this.getDebtMarkets(),
      this.getFIIDIIData()
    ]);

    // Only include successfully fetched data
    const result = {
      lastUpdated: new Date().toISOString()
    };

    if (stocks.status === 'fulfilled') Object.assign(result, stocks.value);
    if (currencies.status === 'fulfilled') Object.assign(result, currencies.value);
    if (commodities.status === 'fulfilled') Object.assign(result, commodities.value);
    if (globalMarkets.status === 'fulfilled') result.globalMarkets = globalMarkets.value;
    if (debtMarkets.status === 'fulfilled') result.debtMarkets = debtMarkets.value;
    if (fiiDii.status === 'fulfilled') result.fiiDii = fiiDii.value;

    // Log any failures
    [stocks, currencies, commodities, globalMarkets, debtMarkets, fiiDii].forEach((promise, index) => {
      if (promise.status === 'rejected') {
        const names = ['stocks', 'currencies', 'commodities', 'globalMarkets', 'debtMarkets', 'fiiDii'];
        console.error(`Failed to fetch ${names[index]}:`, promise.reason?.message);
      }
    });

    return result;
  }
}

export default new MarketDataService();
