'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MarketIndicator from './MarketIndicator';
import { apiService, type CurrencyInsights } from '../services/api';

interface MarketData {
  nifty: { price: string; change: string };
  sensex: { price: string; change: string };
  dxy: { price: string; change: string };
  usdInr: { price: string; change: string };
  eurInr: { price: string; change: string };
  gbpInr: { price: string; change: string };
  aedInr: { price: string; change: string };
  cnyInr: { price: string; change: string };
  audInr: { price: string; change: string };
}

interface MarketOverviewProps {
  marketData: MarketData;
  lastUpdated: Date;
}

interface FXRate {
  code: string;
  name: string;
  flag: string;
  price: string;
  change: string;
  impact: string;
  aiInsight?: string;
}

const FX_CONFIG: Omit<FXRate, 'price' | 'change' | 'aiInsight'>[] = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', impact: 'Major trade currency' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', impact: 'EU machinery & tech' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', impact: 'Services & education' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', impact: 'Gold & oil imports' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', impact: 'Electronics & machinery' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', impact: 'Coal & minerals' },
];

const MarketOverview = ({ marketData, lastUpdated }: MarketOverviewProps) => {
  const [currencyInsights, setCurrencyInsights] = useState<CurrencyInsights>({});
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fetch AI-powered currency insights
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setInsightsLoading(true);
        const insights = await apiService.getCurrencyInsights();
        setCurrencyInsights(insights);
      } catch (error) {
        console.error('Failed to fetch currency insights:', error);
      } finally {
        setInsightsLoading(false);
      }
    };

    fetchInsights();

    // Refresh insights every 30 minutes
    const interval = setInterval(fetchInsights, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const ratesMap = {
    USD: marketData.usdInr,
    EUR: marketData.eurInr,
    GBP: marketData.gbpInr,
    AED: marketData.aedInr,
    CNY: marketData.cnyInr,
    AUD: marketData.audInr,
  };

  const fxData: FXRate[] = FX_CONFIG.map(config => {
    const insightKey = `${config.code.toLowerCase()}Inr` as keyof CurrencyInsights;
    const insight = currencyInsights[insightKey];

    return {
      ...config,
      price: ratesMap[config.code as keyof typeof ratesMap].price,
      change: ratesMap[config.code as keyof typeof ratesMap].change,
      // Only include AI insight if it exists
      aiInsight: insight?.aiInsight
    };
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-900">Market Overview</h2>
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-50 rounded-full">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
            </span>
            <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wide">Live</span>
          </div>
        </div>
        <span className="text-[10px] text-slate-500" suppressHydrationWarning>
          {lastUpdated.toLocaleTimeString()}
        </span>
      </div>

      {/* Market Indicators - Dark Theme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MarketIndicator
          title="NIFTY 50"
          subtitle="*NSEI · INDEX"
          value={marketData.nifty.price}
          change={marketData.nifty.change}
          changeValue={`${parseFloat(marketData.nifty.change) >= 0 ? '+' : ''}${(parseFloat(marketData.nifty.change) * parseFloat(marketData.nifty.price.replace(/,/g, '')) / 100).toFixed(1)}`}
        />
        <MarketIndicator
          title="S&P BSE Sensex"
          subtitle="*BSESN · INDEX"
          value={marketData.sensex.price}
          change={marketData.sensex.change}
          changeValue={`${parseFloat(marketData.sensex.change) >= 0 ? '+' : ''}${(parseFloat(marketData.sensex.change) * parseFloat(marketData.sensex.price.replace(/,/g, '')) / 100).toFixed(1)}`}
        />
        <MarketIndicator
          title="Dollar Index"
          subtitle="DXY · INDEX"
          value={marketData.dxy.price}
          change={marketData.dxy.change}
          changeValue={`${parseFloat(marketData.dxy.change) >= 0 ? '+' : ''}${(parseFloat(marketData.dxy.change) * parseFloat(marketData.dxy.price) / 100).toFixed(2)}`}
        />

        {/* FX Rates Carousel - Dark Theme */}
        <div className="bg-[#1E293B] rounded-lg p-3 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Live FX Rates</div>
            <div className="flex items-center gap-1">
              <button onClick={scrollPrev} className="p-0.5 hover:bg-gray-700 rounded" aria-label="Previous">
                <ChevronLeft className="w-3 h-3 text-gray-400" />
              </button>
              <button onClick={scrollNext} className="p-0.5 hover:bg-gray-700 rounded" aria-label="Next">
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {fxData.map((fx) => {
                const changeNum = parseFloat(fx.change);
                const isNegative = changeNum < 0;

                return (
                  <div key={fx.code} className="flex-[0_0_100%] min-w-0">
                    <div className="flex flex-col h-full">
                      {/* Currency Name, Price, and Percentage in One Row */}
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-white leading-tight">{fx.code}/INR</h3>
                        <div className="text-2xl font-bold text-white leading-tight">₹{fx.price}</div>
                        <div className={`flex items-center gap-0.5 ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
                          <span className="text-sm font-bold">{isNegative ? '↓' : '↑'}</span>
                          <span className="text-sm font-bold">{Math.abs(changeNum).toFixed(2)}%</span>
                        </div>
                      </div>

                      {/* AI Insight for Importers - Right below currency info */}
                      <div className="pt-2 border-t border-gray-700">
                        <div className="text-[10px] text-gray-300 leading-relaxed">
                          {insightsLoading ? (
                            <span className="italic text-gray-400">Analyzing market conditions...</span>
                          ) : fx.aiInsight ? (
                            fx.aiInsight
                          ) : (
                            <span className="text-gray-400">
                              {changeNum >= 0
                                ? `${fx.code} stronger - imports cost more today.`
                                : `${fx.code} weaker - good time for imports.`
                              }
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-0.5 mt-2">
            {fxData.map((_, index) => (
              <button
                key={index}
                className={`h-0.5 rounded-full transition-all ${
                  index === selectedIndex ? 'w-3 bg-gray-400' : 'w-0.5 bg-gray-600'
                }`}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to currency ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default MarketOverview;
