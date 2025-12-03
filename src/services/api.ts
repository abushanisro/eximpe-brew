const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
}

export interface NewsItem {
  title: string;
  source: string;
  time: string;
  link: string;
  sentiment: 'positive' | 'negative' | 'neutral';
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
      // Return default values on error
      return {
        nifty: { price: '--', change: '0.00' },
        sensex: { price: '--', change: '0.00' },
        usdInr: { price: '--', change: '0.00' },
        dxy: { price: '--', change: '0.00' },
        eurUsd: { price: '--', change: '0.00' },
        gbpUsd: { price: '--', change: '0.00' },
        usdJpy: { price: '--', change: '0.00' },
        gold: { price: '--', change: '0.00' },
        brent: { price: '--', change: '0.00' }
      };
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
      return [];
    }
  }
}

export const apiService = new ApiService();
