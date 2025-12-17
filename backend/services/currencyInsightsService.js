import BaseService from './baseService.js';
import groqService from './groqService.js';

class CurrencyInsightsService extends BaseService {
  constructor() {
    super(300000); // 5 minutes cache
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

  async getCurrencyInsights(currencyPair, marketData = null) {
    const cacheKey = `insights_${currencyPair}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const currencyData = this.prepareCurrencyData(currencyPair, marketData);

      // Get real-time news for this currency
      const news = await this.fetchCurrencyNews(currencyPair);

      if (!news || news.length === 0) {
        console.log(`No news found for ${currencyPair}`);
        return null;
      }

      // Get AI insight
      const aiInsight = await groqService.getCurrencyInsight(currencyData, news);

      if (!aiInsight) {
        return null;
      }

      const result = {
        aiInsight: aiInsight,
        news: news.slice(0, 3)
      };

      this.setCached(cacheKey, result);
      return result;
    } catch (error) {
      console.error(`Error fetching insights for ${currencyPair}:`, error.message);
      return null;
    }
  }

  prepareCurrencyData(currencyPair, marketData) {
    const pairMap = {
      'usdInr': { pair: 'USD/INR', ...marketData?.usdInr },
      'eurInr': { pair: 'EUR/INR', ...marketData?.eurInr },
      'gbpInr': { pair: 'GBP/INR', ...marketData?.gbpInr },
      'aedInr': { pair: 'AED/INR', ...marketData?.aedInr },
      'cnyInr': { pair: 'CNY/INR', ...marketData?.cnyInr },
      'audInr': { pair: 'AUD/INR', ...marketData?.audInr }
    };

    return pairMap[currencyPair] || { pair: currencyPair, price: '--', change: '0' };
  }

  async fetchCurrencyNews(currencyPair) {
    const queries = {
      usdInr: '(dollar OR "USD/INR" OR "federal reserve" OR "Fed rate" OR RBI OR rupee) india',
      eurInr: '(euro OR "EUR/INR" OR ECB OR eurozone) (india OR rupee)',
      gbpInr: '(pound OR "GBP/INR" OR "bank of england") (india OR rupee)',
      aedInr: '(dirham OR "AED/INR" OR UAE OR "oil prices") (india OR rupee)',
      cnyInr: '(yuan OR "CNY/INR" OR china OR PBOC) (india OR rupee)',
      audInr: '("australian dollar" OR "AUD/INR" OR RBA) (india OR rupee)'
    };

    const query = queries[currencyPair] || currencyPair;

    try {
      const url = this.buildUrl('https://api.gdeltproject.org/api/v2/doc/doc', {
        query: query,
        mode: 'artlist',
        maxrecords: 10,
        format: 'json',
        sort: 'datedesc',
        timespan: '24h'
      });

      const data = await this.fetchWithTimeout(url, 10000);

      if (!data?.articles?.length) {
        return null;
      }

      // Remove duplicates
      const uniqueArticles = [];
      const seenTitles = new Set();

      for (const article of data.articles) {
        const title = article.title?.toLowerCase().trim();
        if (title && !seenTitles.has(title)) {
          seenTitles.add(title);
          uniqueArticles.push({
            title: article.title,
            source: article.domain || 'News',
            url: article.url
          });
          if (uniqueArticles.length >= 5) break;
        }
      }

      return uniqueArticles;
    } catch (error) {
      console.error('GDELT API error:', error.message);
      return null;
    }
  }

  async getAllCurrencyInsights(marketData = null) {
    const pairs = ['usdInr', 'eurInr', 'gbpInr', 'aedInr', 'cnyInr', 'audInr'];
    const insights = {};

    const results = await Promise.allSettled(
      pairs.map(pair => this.getCurrencyInsights(pair, marketData))
    );

    results.forEach((result, index) => {
      const pair = pairs[index];
      if (result.status === 'fulfilled' && result.value) {
        insights[pair] = result.value;
      }
    });

    return insights;
  }
}

export default new CurrencyInsightsService();
