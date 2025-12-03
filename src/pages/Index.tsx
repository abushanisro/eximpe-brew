
import { useState, useEffect } from 'react';
import { apiService, type MarketData, type NewsItem } from '../services/api';

const Index = () => {
  const [marketData, setMarketData] = useState<MarketData>({
    nifty: { price: '--', change: '0.00' },
    sensex: { price: '--', change: '0.00' },
    usdInr: { price: '--', change: '0.00' },
    dxy: { price: '--', change: '0.00' },
    eurUsd: { price: '--', change: '0.00' },
    gbpUsd: { price: '--', change: '0.00' },
    usdJpy: { price: '--', change: '0.00' },
    gold: { price: '--', change: '0.00' },
    brent: { price: '--', change: '0.00' }
  });

  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [corporateNews, setCorporateNews] = useState<NewsItem[]>([]);

  const getCurrentDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleDateString('en-US', { month: 'long' });
    const year = today.getFullYear();
    
    const dayWithSuffix = day + 
      (day % 10 === 1 && day !== 11 ? 'st' : 
       day % 10 === 2 && day !== 12 ? 'nd' : 
       day % 10 === 3 && day !== 13 ? 'rd' : 'th');
    
    return `${dayWithSuffix} ${month} ${year}`;
  };

  const fetchCorporateNews = async () => {
    try {
      const news = await apiService.getCorporateNews();
      setCorporateNews(news);
      console.log('Corporate news updated:', news.length, 'items');
    } catch (error) {
      console.error('Error fetching corporate news:', error);
    }
  };

  const fetchMarketData = async () => {
    try {
      const data = await apiService.getMarketData();
      setMarketData(data);
      setLastUpdated(new Date());
      console.log('Market data updated:', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  useEffect(() => {
    // Fetch data on component mount
    fetchMarketData();
    fetchCorporateNews();
    
    // Set up interval to fetch market data every 30 seconds during market hours
    const marketInterval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const day = now.getDay();
      
      // Update only during market hours (9 AM to 4 PM, Monday to Friday)
      if (day >= 1 && day <= 5 && hours >= 9 && hours <= 16) {
        fetchMarketData();
      }
    }, 30000); // 30 seconds

    // Set up interval to fetch news every 5 minutes
    const newsInterval = setInterval(() => {
      fetchCorporateNews();
    }, 300000); // 5 minutes

    return () => {
      clearInterval(marketInterval);
      clearInterval(newsInterval);
    };
  }, []);

  const formatChange = (change) => {
    const changeNum = parseFloat(change);
    return changeNum >= 0 ? `(+${change}%)` : `(${change}%)`;
  };

  const getChangeColor = (change) => {
    const changeNum = parseFloat(change);
    return changeNum >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getSentimentIcon = (sentiment) => {
    switch(sentiment) {
      case 'positive': return { icon: '↑', color: 'text-teal-400' };
      case 'negative': return { icon: '↓', color: 'text-red-400' };
      default: return { icon: '→', color: 'text-gray-400' };
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="text-lg font-light">{getCurrentDate()}</div>
            <h1 className="text-5xl font-bold tracking-wide mt-2 mb-4">
              MORNING BREW
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <img src="/eximpe.jpg" alt="EximPe" className="w-16 h-16 rounded-lg" />
            <div>
              <div className="text-2xl font-bold">Exim<span className="text-teal-500">Pe</span></div>
              <div className="text-teal-400 text-sm">Export Import Excellence</div>
            </div>
          </div>
        </div>

        {/* Equity Section */}
        <div className="bg-slate-100 rounded-lg p-6 mb-6 border-2 border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-teal-500 rounded"></div>
            <span className="text-xl font-bold text-slate-900">Equity</span>
          </div>
          <div className="grid grid-cols-3 gap-6 text-slate-800">
            <div className="space-y-2">
              <div>
                <span className="text-sm">Nifty: </span>
                <span className="font-bold">{marketData.nifty.price}</span>
                <span className={`text-sm ${getChangeColor(marketData.nifty.change)}`}> {formatChange(marketData.nifty.change)}</span>
              </div>
              <div>
                <span className="text-sm">Sensex: </span>
                <span className="font-bold">{marketData.sensex.price}</span>
                <span className={`text-sm ${getChangeColor(marketData.sensex.change)}`}> {formatChange(marketData.sensex.change)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-sm">DIIs: </span>
                <span className="font-bold text-teal-600">Bought ₹7,060 Cr</span>
              </div>
              <div>
                <span className="text-sm">FIIs: </span>
                <span className="font-bold text-red-500">Sold ₹6,516 Cr</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg mb-1">
                <span className="text-sm">GIFT Nifty: </span>
                <span className="font-bold">{marketData.nifty.price}</span>
              </div>
              <div className="text-xs opacity-60">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Key Corporate Moves */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-teal-500 rounded"></div>
            <span className="text-xl font-bold text-white">Key Corporate Moves</span>
            <span className="text-xs text-gray-400 ml-auto">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
          {corporateNews.length > 0 ? (
            <ul className="space-y-3">
              {corporateNews.map((news, index) => {
                const sentimentData = getSentimentIcon(news.sentiment);
                return (
                  <li key={index} className="flex items-start gap-3">
                    <span className={`font-bold ${sentimentData.color}`}>
                      {sentimentData.icon}
                    </span>
                    <div className="flex-1">
                      {news.link && news.link !== '#' ? (
                        <a 
                          href={news.link} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="leading-relaxed text-gray-200 hover:text-white hover:underline transition-colors cursor-pointer block"
                        >
                          {news.title}
                        </a>
                      ) : (
                        <span className="leading-relaxed text-gray-200 block">
                          {news.title}
                        </span>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>{news.source}</span>
                        <span>•</span>
                        <span>{news.time}</span>
                        {news.link && (
                          <a 
                            href={news.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-teal-400 hover:text-teal-300 ml-auto"
                          >
                            Read more →
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
              <div className="text-gray-400 mb-2">📰</div>
              <div className="text-gray-300 mb-1">No Real-Time News Available</div>
              <div className="text-gray-500 text-sm">Requires working SerpAPI integration</div>
            </div>
          )}
        </div>

        {/* Bottom Grid */}
        <div className="grid gap-6" style={{gridTemplateColumns: '1.8fr 1fr'}}>
          {/* Debt Markets */}
          <div className="bg-slate-100 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 bg-teal-500 rounded"></div>
              <span className="text-xl font-bold text-slate-900">Debt Markets</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-700 leading-relaxed">
              <li>- 10Y G-sec yield stayed flat at 6.60%</li>
              <li>- Employment in manufacturing industry up 5.92% at 18.4 mn in FY24: Govt</li>
              <li>- India may become world's second-largest economy by 2038: EY report</li>
              <li>- Russia-led EAEU team to visit India to speed up free trade agreement</li>
              <li>- Trump's 60% India tariffs kick in</li>
            </ul>
          </div>

          {/* Currency */}
          <div className="bg-slate-100 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 bg-teal-500 rounded"></div>
              <span className="text-xl font-bold text-slate-900">Currency</span>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              <div>
                - USD/INR at <span className="font-bold">{marketData.usdInr.price}</span>
                <span className={`ml-2 ${getChangeColor(marketData.usdInr.change)}`}>{formatChange(marketData.usdInr.change)}</span>
              </div>
              <div>
                - DXY at <span className="font-bold">{marketData.dxy.price}</span>
                <span className={`ml-2 ${getChangeColor(marketData.dxy.change)}`}>{formatChange(marketData.dxy.change)}</span>
              </div>
              <div>
                - EUR/USD at <span className="font-bold">{marketData.eurUsd.price}</span>
                <span className={`ml-2 ${getChangeColor(marketData.eurUsd.change)}`}>{formatChange(marketData.eurUsd.change)}</span>
              </div>
              <div>
                - GBP/USD at <span className="font-bold">{marketData.gbpUsd.price}</span>
                <span className={`ml-2 ${getChangeColor(marketData.gbpUsd.change)}`}>{formatChange(marketData.gbpUsd.change)}</span>
              </div>
              <div>
                - USD/JPY at <span className="font-bold">{marketData.usdJpy.price}</span>
                <span className={`ml-2 ${getChangeColor(marketData.usdJpy.change)}`}>{formatChange(marketData.usdJpy.change)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">

          {/* Commodities */}
          <div className="bg-slate-100 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 bg-teal-500 rounded"></div>
              <span className="text-xl font-bold text-slate-900">Commodities</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>
                - Brent <span className="font-bold">${marketData.brent.price}/bbl</span>
                <span className={`ml-1 ${getChangeColor(marketData.brent.change)}`}>{formatChange(marketData.brent.change)}</span>, 
                Gold <span className="font-bold">${marketData.gold.price}/oz</span>
                <span className={`ml-1 ${getChangeColor(marketData.gold.change)}`}>{formatChange(marketData.gold.change)}</span>
              </li>
              <li>- Gold changed little with inflation data in focus, while concerns about the Federal Reserve's independence lingered after Trump tried to fire a Fed governor.</li>
              <li>- Oil edges up on US crude stocks drop, impact of US tariffs on India</li>
            </ul>
          </div>

          {/* Global Markets */}
          <div className="bg-slate-100 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 bg-teal-500 rounded"></div>
              <span className="text-xl font-bold text-slate-900">Global Markets</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>- US: Dow +0.32%, S&P 500 +0.24%, Nasdaq +0.21%</li>
              <li>- Europe: FTSE -0.11%, DAX -0.44%, CAC +0.44%</li>
              <li>- Asia: Nikkei -0.14%, Hang Seng -1.27%, Shanghai -1.76%</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs mt-8 opacity-70 leading-relaxed">
          Trade intelligence is subject to market conditions and regulatory changes. Verify all information with official sources before making business decisions.<br/>
          EximPe - Your trusted partner for export-import intelligence and cross-border trade solutions.<br/>
          © 2025 EximPe. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Index;
