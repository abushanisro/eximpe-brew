import axios from 'axios';

class SupabaseService {
  constructor() {
    this.url = process.env.SUPABASE_URL;
    this.anonKey = process.env.SUPABASE_ANON_KEY;
    this.client = axios.create({
      baseURL: `${this.url}/rest/v1`,
      headers: {
        'apikey': this.anonKey,
        'Authorization': `Bearer ${this.anonKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Store market data snapshot
  async storeMarketSnapshot(data) {
    try {
      const response = await this.client.post('/market_snapshots', {
        data: data,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error storing market snapshot:', error.message);
      throw error;
    }
  }

  // Store news articles
  async storeNewsArticle(article) {
    try {
      const response = await this.client.post('/news_articles', {
        title: article.title,
        source: article.source,
        link: article.link,
        sentiment: article.sentiment,
        category: article.category,
        created_at: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error storing news article:', error.message);
      throw error;
    }
  }

  // Get market history
  async getMarketHistory(days = 7) {
    try {
      const response = await this.client.get(
        `/market_snapshots?order=timestamp.desc&limit=${days}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching market history:', error.message);
      throw error;
    }
  }

  // Get recent news
  async getRecentNews(limit = 50) {
    try {
      const response = await this.client.get(
        `/news_articles?order=created_at.desc&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching recent news:', error.message);
      throw error;
    }
  }
}

export default new SupabaseService();
