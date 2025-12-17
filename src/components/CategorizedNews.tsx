'use client';

import { useState, useEffect } from 'react';
import { apiService, type NewsItem } from '../services/api';

type TimeFilter = 'today' | 'yesterday' | '1w' | '1m';
type NewsCategory = 'indian' | 'global' | 'china' | 'usa';

interface CategorizedNewsProps {
  lastUpdated: Date;
}

const CategorizedNews = ({ lastUpdated }: CategorizedNewsProps) => {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('indian');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
  const [news, setNews] = useState<{ [key in NewsCategory]: NewsItem[] }>({
    indian: [],
    global: [],
    china: [],
    usa: []
  });

  useEffect(() => {
    fetchCategorizedNews();
  }, [timeFilter]);

  const fetchCategorizedNews = async () => {
    try {
      // Use Supabase for historical data (yesterday, 1w, 1m)
      if (timeFilter !== 'today') {
        console.log(`\n🔍 Fetching ${timeFilter} news from Supabase...`);
        const supabaseNews = await apiService.getSupabaseNewsByCategoryAndPeriod(timeFilter);

        console.log('📊 Supabase News Distribution:');
        console.log(`  India: ${supabaseNews.indian.length} news`);
        console.log(`  USA: ${supabaseNews.usa.length} news`);
        console.log(`  China: ${supabaseNews.china.length} news`);
        console.log(`  Global: ${supabaseNews.global.length} news`);

        setNews(supabaseNews);
        return;
      }

      // Use regular API for today's news
      const response = await apiService.getCorporateNews();

      console.log(`\n🔍 Frontend received ${response.length} total news items`);

      // Categorize news based on content with better distribution
      const categorized: { [key in NewsCategory]: NewsItem[] } = {
        indian: [],
        global: [],
        china: [],
        usa: []
      };

      const uncategorized: NewsItem[] = [];

      // Log pre-categorized items from backend
      const preCategorized = {
        USA: response.filter((item: any) => item.category === 'USA').length,
        CHINA: response.filter((item: any) => item.category === 'CHINA').length,
        INDIA: response.filter((item: any) => item.category === 'INDIA').length,
        GLOBAL: response.filter((item: any) => item.category === 'GLOBAL').length,
      };
      console.log('📦 Pre-categorized from backend:', preCategorized);

      response.forEach((item: any) => {
        const title = item.title.toLowerCase();
        const source = item.source.toLowerCase();
        const combined = title + ' ' + source;

        // Check if backend pre-marked the category (HIGHEST PRIORITY)
        if (item.category === 'USA') {
          categorized.usa.push(item);
        } else if (item.category === 'CHINA') {
          categorized.china.push(item);
        } else if (item.category === 'INDIA') {
          categorized.indian.push(item);
        } else if (item.category === 'GLOBAL') {
          categorized.global.push(item);
        }
        // China-related keywords (fallback)
        else if (
          combined.includes('china') ||
          combined.includes('chinese') ||
          combined.includes('beijing') ||
          combined.includes('yuan') ||
          combined.includes('cny') ||
          combined.includes('pboc') ||
          combined.includes('xi jinping') ||
          combined.includes('shanghai') ||
          combined.includes('hong kong')
        ) {
          categorized.china.push(item);
        }
        // USA-related keywords
        else if (
          combined.includes('us ') ||
          combined.includes('usa ') ||
          combined.includes('u.s.') ||
          combined.includes('america') ||
          combined.includes('washington') ||
          combined.includes('federal reserve') ||
          combined.includes('fed ') ||
          combined.includes('dollar') ||
          combined.includes('trump') ||
          combined.includes('biden') ||
          combined.includes('wall street') ||
          combined.includes('nasdaq') ||
          combined.includes('dow jones') ||
          combined.includes('s&p 500') ||
          source.includes('bloomberg') ||
          source.includes('marketwatch') ||
          source.includes('wsj')
        ) {
          categorized.usa.push(item);
        }
        // Indian-specific
        else if (
          combined.includes('india') ||
          combined.includes('indian') ||
          combined.includes('rupee') ||
          combined.includes('modi') ||
          combined.includes('rbi') ||
          combined.includes('mumbai') ||
          combined.includes('delhi') ||
          combined.includes('nse') ||
          combined.includes('sensex') ||
          combined.includes('nifty') ||
          source.includes('hindu') ||
          source.includes('economic times')
        ) {
          categorized.indian.push(item);
        }
        // Save for later redistribution
        else {
          uncategorized.push(item);
        }
      });

      // Ensure each category has exactly 5 news items
      const targetCount = 5;

      // First pass: Distribute uncategorized to fill gaps
      let allAvailable = [...uncategorized];

      // Priority order: china, usa, global, indian
      const fillOrder: NewsCategory[] = ['china', 'usa', 'global', 'indian'];

      fillOrder.forEach((cat) => {
        const currentCount = categorized[cat].length;

        if (currentCount < targetCount && allAvailable.length > 0) {
          const needed = targetCount - currentCount;
          const toAdd = allAvailable.splice(0, needed);
          categorized[cat].push(...toAdd);
        }
      });

      // Second pass: If still not enough, redistribute from categories with more than 5
      fillOrder.forEach((cat) => {
        const currentCount = categorized[cat].length;

        if (currentCount < targetCount) {
          const needed = targetCount - currentCount;

          // Take from other categories that have > 5
          for (const otherCat of fillOrder) {
            if (otherCat !== cat && categorized[otherCat].length > targetCount) {
              const available = categorized[otherCat].length - targetCount;
              const toTake = Math.min(available, needed);
              const taken = categorized[otherCat].splice(targetCount, toTake);
              categorized[cat].push(...taken);

              if (categorized[cat].length >= targetCount) break;
            }
          }
        }
      });

      // Take exactly 5 from each category
      Object.keys(categorized).forEach((cat) => {
        categorized[cat as NewsCategory] = categorized[cat as NewsCategory].slice(0, 5);
      });

      // Log final distribution
      console.log('📊 News Distribution:');
      console.log(`  India: ${categorized.indian.length} news`);
      console.log(`  USA: ${categorized.usa.length} news`);
      console.log(`  China: ${categorized.china.length} news`);
      console.log(`  Global: ${categorized.global.length} news`);

      setNews(categorized);
    } catch (error) {
      console.error('Error fetching categorized news:', error);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return { icon: '↑', color: 'text-teal-400' };
      case 'negative': return { icon: '↓', color: 'text-red-400' };
      default: return { icon: '→', color: 'text-gray-400' };
    }
  };

  const categoryLabels = {
    indian: 'Indian News',
    global: 'Global News',
    china: 'China News',
    usa: 'USA News'
  };

  const timeFilterLabels = {
    today: 'Today',
    yesterday: 'Yesterday',
    '1w': '1 Week',
    '1m': '1 Month'
  };

  const currentNews = news[activeCategory];

  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-teal-500 rounded"></div>
          <span className="text-xl font-bold text-white">Key Trade News</span>
        </div>
        <span className="text-xs text-gray-400" suppressHydrationWarning>
          Updated: {lastUpdated.toLocaleTimeString()}
        </span>
      </div>

      {/* Time Filters */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-gray-400 mr-2">Time:</span>
        {(['today', 'yesterday', '1w', '1m'] as TimeFilter[]).map((filter) => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              timeFilter === filter
                ? 'bg-teal-500 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {timeFilterLabels[filter]}
          </button>
        ))}
      </div>

      {/* Category Tabs - Hacker News Style */}
      <div className="flex gap-1 mb-4 border-b border-gray-700">
        {(Object.keys(categoryLabels) as NewsCategory[]).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${
              activeCategory === category
                ? 'text-teal-400 border-b-2 border-teal-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <span>{categoryLabels[category]}</span>
            {news[category].length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-gray-700 rounded-full text-[10px]">
                {news[category].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* News List */}
      {currentNews.length > 0 ? (
        <ul className="space-y-3">
          {currentNews.map((newsItem, index) => {
            const sentimentData = getSentimentIcon(newsItem.sentiment || 'neutral');
            return (
              <li key={index} className="flex items-start gap-3 pb-3 border-b border-gray-700 last:border-0">
                <span className={`font-bold ${sentimentData.color} mt-1`}>
                  {sentimentData.icon}
                </span>
                <div className="flex-1">
                  {newsItem.link ? (
                    <a
                      href={newsItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-200 hover:text-teal-400 transition-colors block leading-relaxed"
                    >
                      {newsItem.title}
                    </a>
                  ) : (
                    <span className="text-gray-200 block leading-relaxed">
                      {newsItem.title}
                    </span>
                  )}
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span>{newsItem.source}</span>
                    <span>•</span>
                    <span>{newsItem.time}</span>
                    {newsItem.link && (
                      <a
                        href={newsItem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-500 hover:text-teal-400 ml-auto"
                      >
                        Read →
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-300 mb-1">No {categoryLabels[activeCategory]} Available</div>
          <div className="text-gray-500 text-sm">Check back soon for updates</div>
        </div>
      )}
    </div>
  );
};

export default CategorizedNews;
