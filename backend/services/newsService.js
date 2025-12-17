import axios from 'axios';
import Parser from 'rss-parser';
import BaseService from './baseService.js';
import supabaseNewsService from './supabaseNewsService.js';

class NewsService extends BaseService {
  constructor() {
    super(180000); // 3 minutes cache timeout - Shorter for fresher trade news
    this.rssParser = new Parser({
      customFields: {
        item: ['pubDate', 'description', 'content:encoded', 'contentSnippet']
      }
    });
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

  // GDELT Project - Real-time global news (FREE, NO LIMITS)
  // OPTIMIZED FOR GLOBAL TRADE NEWS - INCLUDES USA, CHINA, GLOBAL
  async getNewsFromGDELT() {
    try {
      // Enhanced query with global trade focus
      const query = 'trade OR export OR import OR tariff OR "Federal Reserve" OR "dollar index" OR "yuan rate" OR china economy OR US economy OR global trade OR WTO OR trade war OR supply chain';
      const response = await axios.get('https://api.gdeltproject.org/api/v2/doc/doc', {
        params: {
          query: query,
          mode: 'artlist',
          maxrecords: 30,
          format: 'json',
          sort: 'datedesc'
        },
        timeout: 10000
      });

      if (response.data && response.data.articles) {
        return response.data.articles.map(article => ({
          title: article.title || 'No title',
          source: article.domain || 'Unknown',
          time: this.getRelativeTime(new Date(article.seendate)),
          link: article.url,
          sentiment: this.analyzeSentiment(article.title || ''),
          description: article.socialimage || ''
        }));
      }
      return [];
    } catch (error) {
      console.error('GDELT error:', error.message);
      return [];
    }
  }

  // RSS Feeds - OPTIMIZED FOR IMPORT/EXPORT TRADE NEWS
  async getNewsFromRSSFeeds() {
    const rssFeeds = [
      'https://economictimes.indiatimes.com/news/economy/foreign-trade/rssfeeds/1656954455.cms', // ET Foreign Trade
      'https://economictimes.indiatimes.com/industry/transportation/rssfeeds/13039717.cms', // ET Transportation/Logistics
      'https://www.thehindubusinessline.com/economy/logistics/?service=rss', // Business Line Logistics
      // Removed: 'https://www.business-standard.com/rss/economy-policy-102.rss', // Returns 403
      'https://economictimes.indiatimes.com/news/economy/rssfeeds/1373380680.cms' // ET Economy
    ];

    const allArticles = [];

    for (const feedUrl of rssFeeds) {
      try {
        const feed = await this.rssParser.parseURL(feedUrl);

        if (feed && feed.items) {
          const articles = feed.items.slice(0, 5).map(item => ({
            title: item.title || 'No title',
            source: feed.title || 'RSS Feed',
            time: this.getRelativeTime(new Date(item.pubDate || item.isoDate)),
            link: item.link,
            sentiment: this.analyzeSentiment(item.title || ''),
            description: item.contentSnippet || item.description || ''
          }));

          allArticles.push(...articles);
        }
      } catch (error) {
        console.error(`RSS feed error for ${feedUrl}:`, error.message);
        // Continue with next feed
      }
    }

    return allArticles;
  }

  // MoneyControl RSS - Specific for Indian markets (FREE, FAST, RELIABLE)
  async getNewsFromMoneyControl() {
    try {
      const feed = await this.rssParser.parseURL('https://www.moneycontrol.com/rss/latestnews.xml');

      if (feed && feed.items) {
        return feed.items.slice(0, 10).map(item => ({
          title: item.title,
          source: 'MoneyControl',
          time: this.getRelativeTime(new Date(item.pubDate || item.isoDate)),
          link: item.link,
          sentiment: this.analyzeSentiment(item.title),
          description: item.contentSnippet || item.description || ''
        }));
      }
      return [];
    } catch (error) {
      console.error('MoneyControl RSS error:', error.message);
      return [];
    }
  }

  // FIEO, Commerce Ministry, DGFT news - OFFICIAL TRADE SOURCES
  async getTradeOfficialNews() {
    try {
      const tradeFeeds = [
        // Removed: 'https://pib.gov.in/rss/RssMainNews.aspx', // Returns 404
        'https://economictimes.indiatimes.com/news/economy/foreign-trade/rssfeeds/1656954455.cms' // ET Foreign Trade
      ];

      const allArticles = [];

      for (const feedUrl of tradeFeeds) {
        try {
          const feed = await this.rssParser.parseURL(feedUrl);
          if (feed && feed.items) {
            // Filter for trade/commerce related news
            const tradeNews = feed.items
              .filter(item => {
                const title = (item.title || '').toLowerCase();
                const description = (item.contentSnippet || item.description || '').toLowerCase();
                const text = title + ' ' + description;
                return (
                  text.includes('export') || text.includes('import') ||
                  text.includes('trade') || text.includes('customs') ||
                  text.includes('dgft') || text.includes('commerce') ||
                  text.includes('logistics') || text.includes('shipping')
                );
              })
              .slice(0, 5)
              .map(item => ({
                title: item.title,
                source: feed.title || 'Official',
                time: this.getRelativeTime(new Date(item.pubDate || item.isoDate)),
                link: item.link,
                sentiment: this.analyzeSentiment(item.title),
                description: item.contentSnippet || item.description || ''
              }));

            allArticles.push(...tradeNews);
          }
        } catch (error) {
          console.error(`Trade official feed error for ${feedUrl}:`, error.message);
        }
      }

      return allArticles;
    } catch (error) {
      console.error('Trade official news error:', error.message);
      return [];
    }
  }

  // Economic Times RSS - Reliable Indian business news (FREE, FAST)
  async getNewsFromEconomicTimes() {
    try {
      const feed = await this.rssParser.parseURL('https://economictimes.indiatimes.com/news/economy/foreign-trade/rssfeeds/1656954455.cms');

      if (feed && feed.items) {
        return feed.items.slice(0, 10).map(item => ({
          title: item.title,
          source: 'Economic Times',
          time: this.getRelativeTime(new Date(item.pubDate || item.isoDate)),
          link: item.link,
          sentiment: this.analyzeSentiment(item.title),
          description: item.contentSnippet || item.description || ''
        }));
      }
      return [];
    } catch (error) {
      console.error('Economic Times RSS error:', error.message);
      return [];
    }
  }

  // Get news from NewsAPI.org (100 requests/day free)
  // OPTIMIZED FOR IMPORT/EXPORT TRADE
  async getNewsFromNewsAPI() {
    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) {
      throw new Error('NEWSAPI_KEY not configured');
    }

    try {
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: 'India export OR India import OR India trade OR customs OR DGFT OR shipping OR logistics OR "foreign trade" OR "trade policy"',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 15,
          apiKey: apiKey
        },
        timeout: 15000
      });

      return response.data.articles.map(article => ({
        title: article.title,
        source: article.source.name,
        time: this.getRelativeTime(new Date(article.publishedAt)),
        link: article.url,
        sentiment: this.analyzeSentiment(article.title),
        description: article.description || article.content || ''
      }));
    } catch (error) {
      console.error('NewsAPI error:', error.message);
      throw error;
    }
  }

  // Get news from GNews API (100 requests/day free)
  // OPTIMIZED FOR IMPORT/EXPORT TRADE
  async getNewsFromGNews() {
    const apiKey = process.env.GNEWS_API_KEY;
    if (!apiKey) {
      throw new Error('GNEWS_API_KEY not configured');
    }

    try {
      const response = await axios.get('https://gnews.io/api/v4/search', {
        params: {
          q: 'India export import trade logistics customs shipping',
          lang: 'en',
          country: 'in',
          max: 15,
          apikey: apiKey
        },
        timeout: 15000
      });

      return response.data.articles.map(article => ({
        title: article.title,
        source: article.source.name,
        time: this.getRelativeTime(new Date(article.publishedAt)),
        link: article.url,
        sentiment: this.analyzeSentiment(article.title),
        description: article.description || ''
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
        sentiment: this.analyzeSentiment(article.headline),
        description: article.summary || ''
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
          sentiment: 'neutral',
          description: item.description || ''
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

  // Helper: Check if article is recent (within last 48 hours)
  isRecent(date, maxHours = 48) {
    const now = new Date();
    const articleDate = new Date(date);
    const diffHours = (now - articleDate) / (1000 * 60 * 60);
    return diffHours <= maxHours;
  }

  // Helper: Calculate trade relevance score for import/exporters
  calculateTradeRelevance(title, description = '') {
    const text = (title + ' ' + description).toLowerCase();

    // High priority keywords for import/export decisions
    const highPriorityKeywords = [
      'customs duty', 'import duty', 'export duty', 'tariff', 'trade policy',
      'dgft', 'foreign trade policy', 'ftp', 'customs notification',
      'export incentive', 'import restriction', 'free trade agreement', 'fta',
      'gst export', 'export refund', 'shipping cost', 'freight rate',
      'port congestion', 'container shortage', 'logistics cost',
      'export ban', 'import ban', 'trade restriction', 'rcm', 'meis', 'seis',
      'currency fluctuation', 'usd inr', 'rupee depreciation', 'forex',
      'export promotion', 'make in india', 'pli scheme', 'production linked'
    ];

    // Medium priority keywords
    const mediumPriorityKeywords = [
      'export', 'import', 'trade', 'logistics', 'shipping', 'customs',
      'international trade', 'cross border', 'supply chain', 'global trade',
      'commerce ministry', 'trade minister', 'exporters association'
    ];

    let score = 0;

    // Check high priority (3 points each)
    highPriorityKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 3;
    });

    // Check medium priority (1 point each)
    mediumPriorityKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 1;
    });

    return score;
  }

  // Get debt/economic news - OPTIMIZED FOR TRADE & POLICY
  async getDebtMarketNews() {
    const cacheKey = 'debt_market_news';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const results = [];

      // 1. Try GDELT for trade policy and economic news (FREE, NO LIMITS)
      try {
        const response = await axios.get('https://api.gdeltproject.org/api/v2/doc/doc', {
          params: {
            query: 'india trade policy OR india GDP OR RBI currency OR india economic policy OR trade deficit india OR india FTA',
            mode: 'artlist',
            maxrecords: 15,
            format: 'json',
            sort: 'datedesc'
          },
          timeout: 10000
        });

        if (response.data && response.data.articles) {
          results.push(...response.data.articles.map(article => ({
            title: article.title || 'No title',
            source: article.domain || 'Unknown',
            time: this.getRelativeTime(new Date(article.seendate))
          })));
        }
      } catch (error) {
        console.error('GDELT debt news error:', error.message);
      }

      // 2. Try RSS feeds for trade & economy (FREE)
      try {
        const economicFeeds = [
          'https://economictimes.indiatimes.com/news/economy/foreign-trade/rssfeeds/1656954455.cms', // ET Foreign Trade
          'https://economictimes.indiatimes.com/news/economy/rssfeeds/1373380680.cms' // ET Economy (changed from policy to general economy)
        ];

        for (const feedUrl of economicFeeds) {
          try {
            const feed = await this.rssParser.parseURL(feedUrl);
            if (feed && feed.items) {
              results.push(...feed.items.slice(0, 5).map(item => ({
                title: item.title,
                source: feed.title || 'RSS Feed',
                time: this.getRelativeTime(new Date(item.pubDate || item.isoDate))
              })));
            }
          } catch (e) {
            console.error(`RSS economic feed error: ${e.message}`);
          }
        }
      } catch (error) {
        console.error('RSS economic feeds error:', error.message);
      }

      // 3. Fallback: Try NewsAPI if key is available
      const newsApiKey = process.env.NEWSAPI_KEY;
      if (newsApiKey && results.length < 8) {
        try {
          const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
              q: 'India trade policy OR India GDP OR India manufacturing OR "trade deficit" OR "foreign trade policy" OR DGFT',
              language: 'en',
              sortBy: 'publishedAt',
              pageSize: 10,
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

  // Get commodity news - OPTIMIZED FOR TRADE-RELEVANT COMMODITIES
  async getCommodityNews() {
    const cacheKey = 'commodity_news';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const results = [];

      // 1. Try GDELT for commodity & shipping news (FREE, NO LIMITS)
      try {
        const response = await axios.get('https://api.gdeltproject.org/api/v2/doc/doc', {
          params: {
            query: 'gold price OR oil price OR brent crude OR shipping cost OR freight rates OR steel prices india OR aluminum export',
            mode: 'artlist',
            maxrecords: 8,
            format: 'json',
            sort: 'datedesc'
          },
          timeout: 10000
        });

        if (response.data && response.data.articles) {
          results.push(...response.data.articles.map(article => ({
            title: article.title || 'No title',
            source: article.domain || 'Unknown',
            time: this.getRelativeTime(new Date(article.seendate))
          })));
        }
      } catch (error) {
        console.error('GDELT commodity news error:', error.message);
      }

      // 2. Try RSS feeds for commodities & trade (FREE)
      try {
        const commodityFeeds = [
          'https://economictimes.indiatimes.com/commodities/rssfeeds/1808152121.cms', // ET Commodities
          'https://economictimes.indiatimes.com/industry/transportation/shipping-/-transport/rssfeeds/13039678.cms' // ET Shipping
        ];

        for (const feedUrl of commodityFeeds) {
          try {
            const feed = await this.rssParser.parseURL(feedUrl);
            if (feed && feed.items) {
              results.push(...feed.items.slice(0, 3).map(item => ({
                title: item.title,
                source: feed.title || 'RSS Feed',
                time: this.getRelativeTime(new Date(item.pubDate || item.isoDate))
              })));
            }
          } catch (e) {
            console.error(`RSS commodity feed error: ${e.message}`);
          }
        }
      } catch (error) {
        console.error('RSS commodity feeds error:', error.message);
      }

      // 3. Fallback: Try NewsAPI if key is available and results are insufficient
      const newsApiKey = process.env.NEWSAPI_KEY;
      if (newsApiKey && results.length < 2) {
        try {
          const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
              q: 'gold price OR oil price OR brent crude OR "freight rates" OR "shipping cost" OR "commodity export india"',
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

  // Get USA-specific trade and economy news
  async getUSANewsFromGDELT() {
    try {
      // Broader query to ensure we get more USA news
      const query = 'United States OR America OR "US economy" OR "Federal Reserve" OR "Wall Street" OR "US dollar" OR "US trade" OR "American economy" OR Washington OR "US inflation" OR "US jobs"';
      const response = await axios.get('https://api.gdeltproject.org/api/v2/doc/doc', {
        params: {
          query: query,
          mode: 'artlist',
          maxrecords: 30,
          format: 'json',
          sort: 'datedesc',
          timespan: '72h'
        },
        timeout: 10000
      });

      if (response.data && response.data.articles) {
        const filtered = response.data.articles
          .filter(article => {
            const title = (article.title || '').toLowerCase();
            const combined = title + ' ' + (article.domain || '').toLowerCase();
            // Broader matching - must contain ANY USA-related terms
            return (
              title.includes('america') || title.includes('washington') ||
              title.includes('federal') || title.includes('dollar') ||
              combined.includes('us ') || combined.includes('usa') ||
              combined.includes('united states')
            );
          })
          .map(article => ({
            title: article.title || 'No title',
            source: article.domain || 'Unknown',
            time: this.getRelativeTime(new Date(article.seendate)),
            link: article.url,
            sentiment: this.analyzeSentiment(article.title || ''),
            description: article.socialimage || '',
            category: 'USA'
          }));

        console.log(`✅ USA News fetched: ${filtered.length} articles`);
        return filtered.slice(0, 15);
      }
      return [];
    } catch (error) {
      console.error('GDELT USA news error:', error.message);
      return [];
    }
  }

  // Get China-specific trade and economy news
  async getChinaNewsFromGDELT() {
    try {
      // Broader query to ensure we get more China news
      const query = 'China OR Chinese OR Beijing OR Shanghai OR "Hong Kong" OR yuan OR renminbi OR "China economy" OR "China trade" OR "Chinese economy" OR PBOC OR "trade war" OR "China manufacturing"';
      const response = await axios.get('https://api.gdeltproject.org/api/v2/doc/doc', {
        params: {
          query: query,
          mode: 'artlist',
          maxrecords: 30,
          format: 'json',
          sort: 'datedesc',
          timespan: '72h'
        },
        timeout: 10000
      });

      if (response.data && response.data.articles) {
        const filtered = response.data.articles
          .filter(article => {
            const title = (article.title || '').toLowerCase();
            const combined = title + ' ' + (article.domain || '').toLowerCase();
            // Must contain China-related terms
            return (
              title.includes('china') || title.includes('chinese') || title.includes('beijing') ||
              title.includes('shanghai') || title.includes('yuan') || combined.includes('hong kong')
            );
          })
          .map(article => ({
            title: article.title || 'No title',
            source: article.domain || 'Unknown',
            time: this.getRelativeTime(new Date(article.seendate)),
            link: article.url,
            sentiment: this.analyzeSentiment(article.title || ''),
            description: article.socialimage || '',
            category: 'CHINA'
          }));

        console.log(`✅ China News fetched: ${filtered.length} articles`);
        return filtered.slice(0, 15);
      }
      return [];
    } catch (error) {
      console.error('GDELT China news error:', error.message);
      return [];
    }
  }

  // Get India-specific import/export news
  async getIndiaNewsFromGDELT() {
    try {
      // Focus on Indian import/export and trade
      const query = 'India OR Indian OR "India export" OR "India import" OR "India trade" OR "Indian economy" OR rupee OR RBI OR Modi OR "India manufacturing" OR DGFT OR "foreign trade" OR "India customs"';
      const response = await axios.get('https://api.gdeltproject.org/api/v2/doc/doc', {
        params: {
          query: query,
          mode: 'artlist',
          maxrecords: 30,
          format: 'json',
          sort: 'datedesc',
          timespan: '72h'
        },
        timeout: 10000
      });

      if (response.data && response.data.articles) {
        const filtered = response.data.articles
          .filter(article => {
            const title = (article.title || '').toLowerCase();
            const combined = title + ' ' + (article.domain || '').toLowerCase();
            // Must contain India-related terms
            return (
              title.includes('india') || title.includes('indian') || title.includes('modi') ||
              title.includes('rbi') || title.includes('rupee') || combined.includes('india')
            );
          })
          .map(article => ({
            title: article.title || 'No title',
            source: article.domain || 'Unknown',
            time: this.getRelativeTime(new Date(article.seendate)),
            link: article.url,
            sentiment: this.analyzeSentiment(article.title || ''),
            description: article.socialimage || '',
            category: 'INDIA'
          }));

        console.log(`✅ India News fetched: ${filtered.length} articles`);
        return filtered.slice(0, 15);
      }
      return [];
    } catch (error) {
      console.error('GDELT India news error:', error.message);
      return [];
    }
  }

  // Get Global trade news (Europe, Middle East, Africa, Latin America, etc.)
  async getGlobalNewsFromGDELT() {
    try {
      // Focus on regions other than USA, China, India
      const query = '"European Union" OR Europe OR EU OR Brexit OR Germany OR France OR UK OR Britain OR "Middle East" OR Africa OR "Latin America" OR Brazil OR Mexico OR Russia OR Japan OR Korea OR Australia OR Canada OR OPEC OR "oil price" OR "global economy" OR "international trade" OR forex OR currency OR WTO';
      const response = await axios.get('https://api.gdeltproject.org/api/v2/doc/doc', {
        params: {
          query: query,
          mode: 'artlist',
          maxrecords: 30,
          format: 'json',
          sort: 'datedesc',
          timespan: '72h'
        },
        timeout: 10000
      });

      if (response.data && response.data.articles) {
        const filtered = response.data.articles
          .filter(article => {
            const title = (article.title || '').toLowerCase();
            // Must NOT be primarily about USA, China, or India
            const isUSA = title.includes('us ') || title.includes('usa') || title.includes('america') || title.includes('washington');
            const isChina = title.includes('china') || title.includes('chinese') || title.includes('beijing');
            const isIndia = title.includes('india') || title.includes('indian') || title.includes('modi');

            // Include if it's about other regions OR general global topics
            return !isUSA && !isChina && !isIndia;
          })
          .map(article => ({
            title: article.title || 'No title',
            source: article.domain || 'Unknown',
            time: this.getRelativeTime(new Date(article.seendate)),
            link: article.url,
            sentiment: this.analyzeSentiment(article.title || ''),
            description: article.socialimage || '',
            category: 'GLOBAL'
          }));

        console.log(`✅ Global News fetched: ${filtered.length} articles`);
        return filtered.slice(0, 15);
      }
      return [];
    } catch (error) {
      console.error('GDELT Global news error:', error.message);
      return [];
    }
  }

  // Get corporate news from available sources
  // OPTIMIZED FOR CATEGORY-SPECIFIC NEWS - USA, CHINA, INDIA, GLOBAL
  // GUARANTEES 5+ NEWS PER CATEGORY
  async getCorporateNews() {
    const cacheKey = 'corporate_news';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      console.log('\n📰 Fetching categorized news...');

      // Fetch category-specific news in parallel
      const results = await Promise.allSettled([
        this.getUSANewsFromGDELT(),        // USA-specific (pre-marked)
        this.getChinaNewsFromGDELT(),      // China-specific (pre-marked)
        this.getIndiaNewsFromGDELT(),      // India-specific (pre-marked)
        this.getGlobalNewsFromGDELT(),     // Global-specific (pre-marked)
        this.getNewsFromEconomicTimes(),   // Additional Indian sources
        this.getNewsFromRSSFeeds(),        // Additional global sources
      ]);

      // Log what was fetched
      console.log('\n📊 Backend Fetch Results:');
      results.forEach((result, index) => {
        const names = ['USA GDELT', 'China GDELT', 'India GDELT', 'Global GDELT', 'Economic Times', 'RSS Feeds'];
        if (result.status === 'fulfilled') {
          console.log(`  ✅ ${names[index]}: ${result.value.length} articles`);
        } else {
          console.log(`  ❌ ${names[index]}: Failed`);
        }
      });

      // Combine all successful results
      const allNews = results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => result.value)
        .filter(news => news && news.title); // Filter out invalid entries

      // Add recency check and relevance scoring
      const scoredNews = allNews
        .map(news => {
          // Parse the time string to check recency
          let articleDate = new Date();
          if (news.time) {
            const timeMatch = news.time.match(/(\d+)([mhd])/);
            if (timeMatch) {
              const value = parseInt(timeMatch[1]);
              const unit = timeMatch[2];
              if (unit === 'm') articleDate = new Date(Date.now() - value * 60000);
              else if (unit === 'h') articleDate = new Date(Date.now() - value * 3600000);
              else if (unit === 'd') articleDate = new Date(Date.now() - value * 86400000);
            }
          }

          // Calculate trade relevance score
          const relevanceScore = this.calculateTradeRelevance(news.title, news.description || '');

          return {
            ...news,
            articleDate,
            relevanceScore,
            isRecent: this.isRecent(articleDate, 72) // 72 hours = 3 days max
          };
        })
        .filter(news => news.isRecent) // Only recent articles, keep all sources
        .sort((a, b) => {
          // Sort by recency primarily to ensure fresh news
          // Then by relevance for trade-specific content
          const recencyDiff = b.articleDate - a.articleDate;
          if (Math.abs(recencyDiff) > 86400000) { // More than 1 day difference
            return recencyDiff;
          }
          // Within same day, sort by relevance
          return b.relevanceScore - a.relevanceScore;
        });

      // Remove duplicates based on title similarity
      const uniqueNews = [];
      const seenTitles = new Set();

      for (const news of scoredNews) {
        const titleKey = news.title.toLowerCase().substring(0, 50);
        if (!seenTitles.has(titleKey)) {
          seenTitles.add(titleKey);

          // Auto-categorize if category not set
          let category = news.category;
          if (!category) {
            const text = (news.title + ' ' + news.source).toLowerCase();
            if (text.includes('china') || text.includes('chinese') || text.includes('beijing')) {
              category = 'CHINA';
            } else if (text.includes('america') || text.includes('us ') || text.includes('usa') || text.includes('federal reserve') || text.includes('wall street')) {
              category = 'USA';
            } else if (text.includes('india') || text.includes('indian') || text.includes('mumbai') || text.includes('delhi')) {
              category = 'INDIA';
            } else {
              category = 'GLOBAL';
            }
          }

          uniqueNews.push({
            title: news.title,
            source: news.source,
            time: news.time,
            link: news.link,
            sentiment: news.sentiment,
            category: category
          });
        }
      }

      // Return more news to ensure frontend has enough to categorize
      const finalNews = uniqueNews.slice(0, 40);

      // Log category breakdown
      const categoryCount = {
        USA: finalNews.filter(n => n.category === 'USA').length,
        CHINA: finalNews.filter(n => n.category === 'CHINA').length,
        INDIA: finalNews.filter(n => n.category === 'INDIA').length,
        GLOBAL: finalNews.filter(n => n.category === 'GLOBAL').length,
        UNCATEGORIZED: finalNews.filter(n => !n.category).length
      };
      console.log('\n📦 Final News by Category:');
      console.log(`  🇺🇸 USA: ${categoryCount.USA}`);
      console.log(`  🇨🇳 China: ${categoryCount.CHINA}`);
      console.log(`  🇮🇳 India: ${categoryCount.INDIA}`);
      console.log(`  🌍 Global: ${categoryCount.GLOBAL}`);
      console.log(`  ❓ Uncategorized: ${categoryCount.UNCATEGORIZED}`);
      console.log(`  📊 Total sent to frontend: ${finalNews.length}\n`);

      // Store news in Supabase for historical access (non-blocking)
      if (supabaseNewsService.enabled) {
        supabaseNewsService.storeNews(finalNews).catch(err => {
          console.error('Failed to store news in Supabase:', err.message);
        });
      }

      this.setCached(cacheKey, finalNews);
      return finalNews;
    } catch (error) {
      console.error('Error in getCorporateNews:', error.message);
      throw error;
    }
  }
}

export default new NewsService();
