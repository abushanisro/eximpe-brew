import supabase from '../config/supabase.js';

class SupabaseNewsService {
  constructor() {
    this.tableName = 'news_cache';
    this.enabled = !!supabase;

    if (!this.enabled) {
      console.warn('⚠️  Supabase news caching disabled - credentials not configured');
    }
  }

  async storeNews(newsItems) {
    if (!this.enabled) return { success: false };

    try {
      const newsToInsert = newsItems.map(item => ({
        title: item.title,
        source: item.source,
        link: item.link || null,
        sentiment: item.sentiment || 'neutral',
        category: item.category || 'GLOBAL',
        published_at: new Date()
      }));

      const { error } = await supabase
        .from(this.tableName)
        .upsert(newsToInsert, { onConflict: 'title,source,published_at', ignoreDuplicates: true });

      if (error) {
        console.error('❌ Supabase error:', error.message);
        return { success: false, error: error.message };
      }

      console.log(`✅ Stored ${newsToInsert.length} news in Supabase`);
      return { success: true };
    } catch (error) {
      console.error('❌ Supabase error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async getNewsByPeriod(period = 'today', category = null, limit = 5) {
    if (!this.enabled) return [];

    try {
      const now = new Date();
      let startTime;

      switch (period) {
        case 'yesterday':
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          startTime = new Date(yesterday.setHours(0, 0, 0, 0));
          break;
        case '1w':
          startTime = new Date(now.setDate(now.getDate() - 7));
          break;
        case '1m':
          startTime = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startTime = new Date(now.setHours(0, 0, 0, 0));
      }

      let query = supabase
        .from(this.tableName)
        .select('*')
        .gte('published_at', startTime.toISOString())
        .order('published_at', { ascending: false })
        .limit(limit);

      if (category) query = query.eq('category', category);

      const { data, error } = await query;

      if (error) {
        console.error('❌ Supabase error:', error.message);
        return [];
      }

      return data.map(item => ({
        ...item,
        time: this.getRelativeTime(new Date(item.published_at))
      }));
    } catch (error) {
      console.error('❌ Supabase error:', error.message);
      return [];
    }
  }

  async getNewsByCategoryAndPeriod(period = 'today') {
    const categories = ['USA', 'CHINA', 'INDIA', 'GLOBAL'];
    const results = {};

    for (const category of categories) {
      results[category] = await this.getNewsByPeriod(period, category, 5);
    }

    return results;
  }

  async cleanupOldNews() {
    if (!this.enabled) return { success: false };

    try {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .lt('created_at', oneMonthAgo.toISOString());

      if (error) {
        console.error('❌ Supabase error:', error.message);
        return { success: false, error: error.message };
      }

      console.log('🗑️  Cleaned up old news');
      return { success: true };
    } catch (error) {
      console.error('❌ Supabase error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async getStats() {
    if (!this.enabled) return null;

    try {
      const { count, error } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      if (error) return null;

      const { data: categoryData } = await supabase
        .from(this.tableName)
        .select('category');

      const categoryCounts = {};
      categoryData?.forEach(item => {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      });

      return { total: count, byCategory: categoryCounts };
    } catch (error) {
      return null;
    }
  }

  getRelativeTime(date) {
    const diffMs = new Date() - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }
}

export default new SupabaseNewsService();
