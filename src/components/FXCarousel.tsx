'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { TrendingUp, TrendingDown, Info, ChevronLeft, ChevronRight } from 'lucide-react';

interface FXRate {
  code: string;
  name: string;
  flag: string;
  price: string;
  change: string;
  impact: string;
}

interface FXCarouselProps {
  rates: {
    usdInr: { price: string; change: string };
    eurInr: { price: string; change: string };
    gbpInr: { price: string; change: string };
    aedInr: { price: string; change: string };
    cnyInr: { price: string; change: string };
    audInr: { price: string; change: string };
  };
}

const FX_DATA_CONFIG: Omit<FXRate, 'price' | 'change'>[] = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', impact: 'Major trade currency' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', impact: 'EU machinery & tech' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', impact: 'Services & education' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', impact: 'Gold & oil imports' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', impact: 'Electronics & machinery' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', impact: 'Coal & minerals' },
];

const FXCarousel = ({ rates }: FXCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Map rates data to display config
  const ratesMap = {
    USD: rates.usdInr,
    EUR: rates.eurInr,
    GBP: rates.gbpInr,
    AED: rates.aedInr,
    CNY: rates.cnyInr,
    AUD: rates.audInr,
  };

  const fxData: FXRate[] = FX_DATA_CONFIG.map(config => ({
    ...config,
    price: ratesMap[config.code as keyof typeof ratesMap].price,
    change: ratesMap[config.code as keyof typeof ratesMap].change,
  }));

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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

  const getChangeColor = (change: string) => {
    return parseFloat(change) >= 0 ? 'text-emerald-600' : 'text-red-600';
  };

  const getChangeIcon = (change: string) => {
    const Icon = parseFloat(change) >= 0 ? TrendingUp : TrendingDown;
    return <Icon className="w-4 h-4" />;
  };

  const getImpactText = (code: string, change: string) => {
    const changeNum = parseFloat(change);
    const isUp = changeNum > 0;

    const impacts: Record<string, { up: string; down: string }> = {
      USD: {
        up: 'Imports costlier • Exports competitive',
        down: 'Imports cheaper • Exports less competitive'
      },
      EUR: {
        up: 'EU tech costlier • Better IT margins',
        down: 'Cheaper EU imports • Lower export receipts'
      },
      GBP: {
        up: 'UK education costlier • Better remittances',
        down: 'Cheaper UK services • Lower export value'
      },
      AED: {
        up: 'Gold/Oil costlier • Better worker remittances',
        down: 'Cheaper gold imports • Lower remittance value'
      },
      CNY: {
        up: 'Chinese imports costlier • Export advantage',
        down: 'Cheaper electronics • China competition'
      },
      AUD: {
        up: 'Costlier minerals • Education margins up',
        down: 'Cheaper commodities • Student costs down'
      }
    };

    return impacts[code]?.[isUp ? 'up' : 'down'] || 'Market movement';
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full"></div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Foreign Exchange</h3>
            <p className="text-xs text-slate-500">Live currency rates against INR</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={scrollPrev}
            className="p-2 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-600 transition-all duration-200 shadow-sm"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollNext}
            className="p-2 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-600 transition-all duration-200 shadow-sm"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3">
          {fxData.map((fx) => (
            <div
              key={fx.code}
              className="flex-[0_0_calc(50%-0.375rem)] min-w-0 sm:flex-[0_0_calc(33.333%-0.5rem)] md:flex-[0_0_calc(25%-0.75rem)]"
              onMouseEnter={() => setHoveredCard(fx.code)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative group h-full">
                <div className="bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl p-5 border-2 border-slate-200 hover:border-teal-400 hover:shadow-2xl transition-all duration-300 cursor-pointer h-full group-hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl drop-shadow-sm">{fx.flag}</div>
                      <div>
                        <div className="font-bold text-slate-900 text-base">{fx.code}</div>
                        <div className="text-xs text-slate-500">{fx.name}</div>
                      </div>
                    </div>
                    <Info className="w-5 h-5 text-slate-400 group-hover:text-teal-500 transition-colors" />
                  </div>

                  <div className="mb-3">
                    <div className="text-3xl font-bold text-slate-900 tracking-tight">
                      ₹{fx.price}
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 ${getChangeColor(fx.change)} font-semibold text-sm mb-4`}>
                    {getChangeIcon(fx.change)}
                    <span>{parseFloat(fx.change) > 0 ? '+' : ''}{fx.change}%</span>
                  </div>

                  <div className="pt-3 border-t-2 border-slate-100">
                    <div className="text-xs text-slate-700 font-medium leading-snug">{fx.impact}</div>
                  </div>
                </div>

                {hoveredCard === fx.code && (
                  <div className="absolute left-0 right-0 -bottom-2 translate-y-full z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-4 shadow-2xl text-sm mt-2 border border-slate-700">
                      <div className="font-semibold mb-2 text-teal-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse"></div>
                        Live Analysis
                      </div>
                      <div className="text-slate-200 leading-relaxed">
                        {getImpactText(fx.code, fx.change)}
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-400">
                        Real-time market data • Updated continuously
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {fxData.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? 'w-6 bg-teal-500'
                : 'w-1.5 bg-slate-300 hover:bg-slate-400'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FXCarousel;
