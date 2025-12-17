const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface GlobalMarketIndex {
  name: string;
  price: string;
  change: string;
}

export interface GlobalMarkets {
  dow?: GlobalMarketIndex;
  sp500?: GlobalMarketIndex;
  nasdaq?: GlobalMarketIndex;
  ftse?: GlobalMarketIndex;
  dax?: GlobalMarketIndex;
  cac?: GlobalMarketIndex;
  nikkei?: GlobalMarketIndex;
  hangseng?: GlobalMarketIndex;
  shanghai?: GlobalMarketIndex;
}

export interface DebtMarkets {
  indiaBond10Y?: {
    yield: string;
    name: string;
  };
}

export interface FIIDIIData {
  fii: {
    buy?: string;
    sell?: string;
    net?: string;
    netStatus?: 'bought' | 'sold';
    netAmount?: string;
    status?: string;
  };
  dii: {
    buy?: string;
    sell?: string;
    net?: string;
    netStatus?: 'bought' | 'sold';
    netAmount?: string;
    status?: string;
  };
  error?: string;
  lastUpdated?: string;
}

export interface MarketData {
  nifty: { price: string; change: string };
  sensex: { price: string; change: string };
  usdInr: { price: string; change: string };
  eurInr: { price: string; change: string };
  gbpInr: { price: string; change: string };
  aedInr: { price: string; change: string };
  audInr: { price: string; change: string };
  cnyInr: { price: string; change: string };
  jpyInr: { price: string; change: string };
  dxy: { price: string; change: string };
  eurUsd: { price: string; change: string };
  gbpUsd: { price: string; change: string };
  usdJpy: { price: string; change: string };
  gold: { price: string; change: string };
  brent: { price: string; change: string };
  globalMarkets?: GlobalMarkets;
  debtMarkets?: DebtMarkets;
  fiiDii?: FIIDIIData;
}

export interface NewsItem {
  title: string;
  source: string;
  time: string;
  link?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  category?: 'USA' | 'CHINA' | 'INDIA' | 'GLOBAL';
}

export interface CurrencyInsight {
  headline: string;
  source: string;
  time: string;
  impact: string;
  aiInsight?: string;
  news?: Array<{
    title: string;
    source: string;
    time: string;
    url: string;
  }>;
}

export interface CurrencyInsights {
  usdInr?: CurrencyInsight;
  eurInr?: CurrencyInsight;
  gbpInr?: CurrencyInsight;
  aedInr?: CurrencyInsight;
  cnyInr?: CurrencyInsight;
  audInr?: CurrencyInsight;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

class ApiService {
  private async fetchWithTimeout(url: string, timeout = 20000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async getMarketData(): Promise<MarketData> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/market/all`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<MarketData> = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }

  async getCorporateNews(): Promise<NewsItem[]> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/news/corporate`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<NewsItem[]> = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (error) {
      console.error('Error fetching corporate news:', error);
      throw error;
    }
  }

  async getDebtNews(): Promise<NewsItem[]> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/news/debt`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<NewsItem[]> = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (error) {
      console.error('Error fetching debt news:', error);
      throw error;
    }
  }

  async getCommodityNews(): Promise<NewsItem[]> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/news/commodity`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<NewsItem[]> = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (error) {
      console.error('Error fetching commodity news:', error);
      throw error;
    }
  }

  async getCurrencyInsights(): Promise<CurrencyInsights> {
    try {
      const response = await this.fetchWithTimeout(`${API_BASE_URL}/market/currency-insights`, 30000);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<CurrencyInsights> = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (error) {
      console.error('Error fetching currency insights:', error);
      throw error;
    }
  }

  async getSupabaseNewsByCategoryAndPeriod(period: 'today' | 'yesterday' | '1w' | '1m'): Promise<{
    indian: NewsItem[];
    usa: NewsItem[];
    china: NewsItem[];
    global: NewsItem[];
  }> {
    try {
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/supabase-news/all-categories?period=${period}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Map backend categories to frontend categories
        return {
          indian: result.data.india || [],
          usa: result.data.usa || [],
          china: result.data.china || [],
          global: result.data.global || []
        };
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (error) {
      console.error('Error fetching Supabase news:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
