import { useState, useEffect } from 'react';
import { apiService, type MarketData, type NewsItem } from '../../services/api';
import MarketOverview from '../MarketOverview';
import CategorizedNews from '../CategorizedNews';

const Index = () => {
    const [marketData, setMarketData] = useState<MarketData>({
        nifty: { price: '--', change: '0.00' },
        sensex: { price: '--', change: '0.00' },
        usdInr: { price: '--', change: '0.00' },
        eurInr: { price: '--', change: '0.00' },
        gbpInr: { price: '--', change: '0.00' },
        aedInr: { price: '--', change: '0.00' },
        audInr: { price: '--', change: '0.00' },
        cnyInr: { price: '--', change: '0.00' },
        jpyInr: { price: '--', change: '0.00' },
        dxy: { price: '--', change: '0.00' },
        eurUsd: { price: '--', change: '0.00' },
        gbpUsd: { price: '--', change: '0.00' },
        usdJpy: { price: '--', change: '0.00' },
        gold: { price: '--', change: '0.00' },
        brent: { price: '--', change: '0.00' }
    });

    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [newsLastUpdated, setNewsLastUpdated] = useState(new Date());
    const [debtNews, setDebtNews] = useState<NewsItem[]>([]);
    const [commodityNews, setCommodityNews] = useState<NewsItem[]>([]);

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

    const fetchDebtNews = async () => {
        try {
            const news = await apiService.getDebtNews();
            setDebtNews(news);
            setNewsLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching debt news:', error);
        }
    };

    const fetchCommodityNews = async () => {
        try {
            const news = await apiService.getCommodityNews();
            setCommodityNews(news);
            setNewsLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching commodity news:', error);
        }
    };

    const fetchMarketData = async () => {
        try {
            const data = await apiService.getMarketData();
            setMarketData(data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching market data:', error);
        }
    };

    useEffect(() => {
        // Fetch data on component mount
        fetchMarketData();
        fetchDebtNews();
        fetchCommodityNews();

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
            fetchDebtNews();
            fetchCommodityNews();
        }, 300000); // 5 minutes

        return () => {
            clearInterval(marketInterval);
            clearInterval(newsInterval);
        };
    }, []);

    const formatChange = (change: string) => {
        const changeNum = parseFloat(change);
        return changeNum >= 0 ? `(+${change}%)` : `(${change}%)`;
    };

    const getChangeColor = (change: string) => {
        const changeNum = parseFloat(change);
        return changeNum >= 0 ? 'text-green-500' : 'text-red-500';
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

                {/* Market Overview - Unified Equity & FX Section */}
                <MarketOverview marketData={marketData} lastUpdated={lastUpdated} />

                {/* Categorized News with Hacker News Style Dividers */}
                <CategorizedNews lastUpdated={newsLastUpdated} />

                {/* Debt Markets & Currency Rates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 mb-6">
                    {/* Debt Markets */}
                    <div className="bg-slate-100 rounded-lg p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-6 h-6 bg-teal-500 rounded"></div>
                            <span className="text-xl font-bold text-slate-900">Debt Markets</span>
                            <span className="text-xs text-slate-500 ml-auto" suppressHydrationWarning>
                                Updated: {newsLastUpdated.toLocaleTimeString()}
                            </span>
                        </div>
                        {marketData.debtMarkets?.indiaBond10Y && (
                            <div className="mb-4 text-sm text-slate-700">
                                <span className="font-bold">{marketData.debtMarkets.indiaBond10Y.name}</span> yield at <span className="font-bold">{marketData.debtMarkets.indiaBond10Y.yield}%</span>
                            </div>
                        )}
                        {debtNews.length > 0 ? (
                            <ul className="space-y-3 text-sm text-slate-700 leading-relaxed">
                                {debtNews.map((news, index) => (
                                    <li key={index}>- {news.title}</li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-sm text-slate-500 text-center py-4">
                                <div className="mb-2">📊</div>
                                <div>No real-time debt market news available</div>
                                <div className="text-xs mt-1">Configure NEWSAPI_KEY in backend/.env for live news</div>
                            </div>
                        )}
                    </div>

                    {/* Currency - Simple List */}
                    <div className="bg-slate-100 rounded-lg p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-6 h-6 bg-teal-500 rounded"></div>
                            <span className="text-xl font-bold text-slate-900">Currency</span>
                            <span className="text-xs text-slate-500 ml-auto" suppressHydrationWarning>
                                {lastUpdated.toLocaleTimeString()}
                            </span>
                        </div>
                        <ul className="space-y-3 text-sm text-slate-700 leading-relaxed">
                            <li>
                                - USD/INR at {marketData.usdInr.price} <span className={getChangeColor(marketData.usdInr.change)}>{formatChange(marketData.usdInr.change)}</span>
                            </li>
                            <li>
                                - DXY at {marketData.dxy.price} <span className={getChangeColor(marketData.dxy.change)}>{formatChange(marketData.dxy.change)}</span>
                            </li>
                            <li>
                                - EUR/USD at {marketData.eurUsd.price} <span className={getChangeColor(marketData.eurUsd.change)}>{formatChange(marketData.eurUsd.change)}</span>
                            </li>
                            <li>
                                - GBP/USD at {marketData.gbpUsd.price} <span className={getChangeColor(marketData.gbpUsd.change)}>{formatChange(marketData.gbpUsd.change)}</span>
                            </li>
                            <li>
                                - USD/JPY at {marketData.usdJpy.price} <span className={getChangeColor(marketData.usdJpy.change)}>{formatChange(marketData.usdJpy.change)}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">

                    {/* Commodities */}
                    <div className="bg-slate-100 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-6 bg-teal-500 rounded"></div>
                            <span className="text-xl font-bold text-slate-900">Commodities</span>
                            <span className="text-xs text-slate-500 ml-auto" suppressHydrationWarning>
                                Updated: {newsLastUpdated.toLocaleTimeString()}
                            </span>
                        </div>
                        <div className="space-y-2 text-sm text-slate-700">
                            <div>
                                - Brent <span className="font-bold">${marketData.brent.price}/bbl</span>
                                <span className={`ml-1 ${getChangeColor(marketData.brent.change)}`}>{formatChange(marketData.brent.change)}</span>,
                                Gold <span className="font-bold">${marketData.gold.price}/oz</span>
                                <span className={`ml-1 ${getChangeColor(marketData.gold.change)}`}>{formatChange(marketData.gold.change)}</span>
                            </div>
                            {commodityNews.length > 0 ? (
                                commodityNews.map((news, index) => (
                                    <div key={index}>- {news.title}</div>
                                ))
                            ) : (
                                <div className="text-slate-500 text-center py-3">
                                    <div className="text-xs">Configure NEWSAPI_KEY in backend/.env for commodity news</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Global Markets */}
                    <div className="bg-slate-100 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-6 bg-teal-500 rounded"></div>
                            <span className="text-xl font-bold text-slate-900">Global Markets</span>
                            <span className="text-xs text-slate-500 ml-auto" suppressHydrationWarning>
                                Updated: {lastUpdated.toLocaleTimeString()}
                            </span>
                        </div>
                        {marketData.globalMarkets ? (
                            <ul className="space-y-2 text-sm text-slate-700">
                                <li>
                                    - US:
                                    {marketData.globalMarkets.dow && (
                                        <>
                                            {' '}Dow <span className={getChangeColor(marketData.globalMarkets.dow.change)}>{formatChange(marketData.globalMarkets.dow.change)}</span>
                                        </>
                                    )}
                                    {marketData.globalMarkets.sp500 && (
                                        <>
                                            , S&P 500 <span className={getChangeColor(marketData.globalMarkets.sp500.change)}>{formatChange(marketData.globalMarkets.sp500.change)}</span>
                                        </>
                                    )}
                                    {marketData.globalMarkets.nasdaq && (
                                        <>
                                            , Nasdaq <span className={getChangeColor(marketData.globalMarkets.nasdaq.change)}>{formatChange(marketData.globalMarkets.nasdaq.change)}</span>
                                        </>
                                    )}
                                </li>
                                <li>
                                    - Europe:
                                    {marketData.globalMarkets.ftse && (
                                        <>
                                            {' '}FTSE <span className={getChangeColor(marketData.globalMarkets.ftse.change)}>{formatChange(marketData.globalMarkets.ftse.change)}</span>
                                        </>
                                    )}
                                    {marketData.globalMarkets.dax && (
                                        <>
                                            , DAX <span className={getChangeColor(marketData.globalMarkets.dax.change)}>{formatChange(marketData.globalMarkets.dax.change)}</span>
                                        </>
                                    )}
                                    {marketData.globalMarkets.cac && (
                                        <>
                                            , CAC <span className={getChangeColor(marketData.globalMarkets.cac.change)}>{formatChange(marketData.globalMarkets.cac.change)}</span>
                                        </>
                                    )}
                                </li>
                                <li>
                                    - Asia:
                                    {marketData.globalMarkets.nikkei && (
                                        <>
                                            {' '}Nikkei <span className={getChangeColor(marketData.globalMarkets.nikkei.change)}>{formatChange(marketData.globalMarkets.nikkei.change)}</span>
                                        </>
                                    )}
                                    {marketData.globalMarkets.hangseng && (
                                        <>
                                            , Hang Seng <span className={getChangeColor(marketData.globalMarkets.hangseng.change)}>{formatChange(marketData.globalMarkets.hangseng.change)}</span>
                                        </>
                                    )}
                                    {marketData.globalMarkets.shanghai && (
                                        <>
                                            , Shanghai <span className={getChangeColor(marketData.globalMarkets.shanghai.change)}>{formatChange(marketData.globalMarkets.shanghai.change)}</span>
                                        </>
                                    )}
                                </li>
                            </ul>
                        ) : (
                            <div className="text-sm text-slate-500 text-center py-4">Loading global market data...</div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs mt-8 opacity-70 leading-relaxed">
                    Trade intelligence is subject to market conditions and regulatory changes. Verify all information with official sources before making business decisions.<br />
                    EximPe - Your trusted partner for export-import intelligence and cross-border trade solutions.<br />
                    © 2025 EximPe. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Index;