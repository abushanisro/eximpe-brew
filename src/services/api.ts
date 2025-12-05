const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

export interface MarketData {
  nifty: { price: string; change: string };
  sensex: { price: string; change: string };
  usdInr: { price: string; change: string };
  dxy: { price: string; change: string };
  eurUsd: { price: string; change: string };
  gbpUsd: { price: string; change: string };
  usdJpy: { price: string; change: string };
  gold: { price: string; change: string };
  brent: { price: string; change: string };
  globalMarkets?: GlobalMarkets;
  debtMarkets?: DebtMarkets;
}

export interface NewsItem {
  title: string;
  source: string;
  time: string;
  link?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

class ApiService {
  private async fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

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
}

export const apiService = new ApiService();
