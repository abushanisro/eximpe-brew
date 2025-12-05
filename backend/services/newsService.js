import axios from 'axios';

class NewsService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 300000; // 5 minutes
  }

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

  // Analyze sentiment from title
  analyzeSentiment(title) {
    const positiveWords = ['up', 'gain', 'rise', 'surge', 'boost', 'profit', 'growth', 'high', 'record', 'positive'];
    const negativeWords = ['down', 'fall', 'drop', 'decline', 'loss', 'crash', 'low', 'negative', 'cut', 'slash'];

    const lowerTitle = title.toLowerCase();
    const hasPositive = positiveWords.some(word => lowerTitle.includes(word));
    const hasNegative = negativeWords.some(word => lowerTitle.includes(word));

    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  }

  // Get news from NewsAPI.org (100 requests/day free)
  async getNewsFromNewsAPI() {
    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) {
      throw new Error('NEWSAPI_KEY not configured');
    }

    try {
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: 'India stock market OR Indian business OR Nifty OR Sensex',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 10,
          apiKey: apiKey
        },
        timeout: 15000
      });

      return response.data.articles.map(article => ({
        title: article.title,
        source: article.source.name,
        time: this.getRelativeTime(new Date(article.publishedAt)),
        link: article.url,
        sentiment: this.analyzeSentiment(article.title)
      }));
    } catch (error) {
      console.error('NewsAPI error:', error.message);
      throw error;
    }
  }

  // Get news from GNews API (100 requests/day free)
  async getNewsFromGNews() {
    const apiKey = process.env.GNEWS_API_KEY;
    if (!apiKey) {
      throw new Error('GNEWS_API_KEY not configured');
    }

    try {
      const response = await axios.get('https://gnews.io/api/v4/search', {
        params: {
          q: 'India stock market business',
          lang: 'en',
          country: 'in',
          max: 10,
          apikey: apiKey
        },
        timeout: 15000
      });

      return response.data.articles.map(article => ({
        title: article.title,
        source: article.source.name,
        time: this.getRelativeTime(new Date(article.publishedAt)),
        link: article.url,
        sentiment: this.analyzeSentiment(article.title)
      }));
    } catch (error) {
      console.error('GNews error:', error.message);
      throw error;
    }
  }

  // Get news from Finnhub (60 calls/minute free)
  async getNewsFromFinnhub() {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      throw new Error('FINNHUB_API_KEY not configured');
    }

    try {
      const response = await axios.get('https://finnhub.io/api/v1/news', {
        params: {
          category: 'general',
          token: apiKey
        },
        timeout: 15000
      });

      return response.data.slice(0, 10).map(article => ({
        title: article.headline,
        source: article.source,
        time: this.getRelativeTime(new Date(article.datetime * 1000)),
        link: article.url,
        sentiment: this.analyzeSentiment(article.headline)
      }));
    } catch (error) {
      console.error('Finnhub error:', error.message);
      throw error;
    }
  }

  // Fallback: RSS feed parsing for NSE India
  async getNewsFromRSS() {
    try {
      // Using NSE India's announcements (no auth required)
      const response = await axios.get('https://www.nseindia.com/api/latest-circular', {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json'
        },
        timeout: 15000
      });

      if (response.data && Array.isArray(response.data)) {
        return response.data.slice(0, 10).map(item => ({
          title: item.subject || item.title || 'NSE Announcement',
          source: 'NSE India',
          time: this.getRelativeTime(new Date(item.publishedDate)),
          link: item.url || '#',
          sentiment: 'neutral'
        }));
      }
      throw new Error('No RSS data available');
    } catch (error) {
      console.error('RSS feed error:', error.message);
      throw error;
    }
  }

  // Helper: Get relative time
  getRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  // Get debt/economic news
  async getDebtMarketNews() {
    const cacheKey = 'debt_market_news';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const results = [];

      // Try NewsAPI if key is available
      const newsApiKey = process.env.NEWSAPI_KEY;
      if (newsApiKey) {
        try {
          const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
              q: 'India economy OR India GDP OR India manufacturing OR India trade OR India bonds',
              language: 'en',
              sortBy: 'publishedAt',
              pageSize: 5,
              apiKey: newsApiKey
            },
            timeout: 15000
          });

          results.push(...response.data.articles.map(article => ({
            title: article.title,
            source: article.source.name,
            time: this.getRelativeTime(new Date(article.publishedAt))
          })));
        } catch (error) {
          console.error('NewsAPI debt news error:', error.message);
        }
      }

      this.setCached(cacheKey, results.slice(0, 5));
      return results.slice(0, 5);
    } catch (error) {
      console.error('Error in getDebtMarketNews:', error.message);
      throw error;
    }
  }

  // Get commodity news
  async getCommodityNews() {
    const cacheKey = 'commodity_news';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const results = [];

      // Try NewsAPI if key is available
      const newsApiKey = process.env.NEWSAPI_KEY;
      if (newsApiKey) {
        try {
          const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
              q: 'gold price OR oil price OR brent crude OR commodity markets',
              language: 'en',
              sortBy: 'publishedAt',
              pageSize: 3,
              apiKey: newsApiKey
            },
            timeout: 15000
          });

          results.push(...response.data.articles.map(article => ({
            title: article.title,
            source: article.source.name,
            time: this.getRelativeTime(new Date(article.publishedAt))
          })));
        } catch (error) {
          console.error('NewsAPI commodity news error:', error.message);
        }
      }

      this.setCached(cacheKey, results.slice(0, 3));
      return results.slice(0, 3);
    } catch (error) {
      console.error('Error in getCommodityNews:', error.message);
      throw error;
    }
  }

  // Get corporate news from available sources
  async getCorporateNews() {
    const cacheKey = 'corporate_news';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // Try multiple sources in parallel
      const results = await Promise.allSettled([
        this.getNewsFromNewsAPI(),
        this.getNewsFromGNews(),
        this.getNewsFromFinnhub(),
        this.getNewsFromRSS()
      ]);

      // Combine all successful results
      const allNews = results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => result.value);

      // Remove duplicates based on title similarity
      const uniqueNews = [];
      const seenTitles = new Set();

      for (const news of allNews) {
        const titleKey = news.title.toLowerCase().substring(0, 50);
        if (!seenTitles.has(titleKey)) {
          seenTitles.add(titleKey);
          uniqueNews.push(news);
        }
      }

      // Return top 10 most recent
      const finalNews = uniqueNews.slice(0, 10);

      this.setCached(cacheKey, finalNews);
      return finalNews;
    } catch (error) {
      console.error('Error in getCorporateNews:', error.message);
      throw error;
    }
  }
}

export default new NewsService();
