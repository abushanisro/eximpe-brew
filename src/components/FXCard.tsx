'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface FXRate {
  code: string;
  name: string;
  flag: string;
  price: string;
  change: string;
  impact: string;
}

interface FXCardProps {
  rates: {
    usdInr: { price: string; change: string };
    eurInr: { price: string; change: string };
    gbpInr: { price: string; change: string };
    aedInr: { price: string; change: string };
    cnyInr: { price: string; change: string };
    audInr: { price: string; change: string };
  };
}

const FX_CONFIG: Omit<FXRate, 'price' | 'change'>[] = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', impact: 'Major trade currency' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', impact: 'EU machinery & tech' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', impact: 'Services & education' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', impact: 'Gold & oil imports' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', impact: 'Electronics & machinery' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', impact: 'Coal & minerals' },
];

const FXCard = ({ rates }: FXCardProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const ratesMap = {
    USD: rates.usdInr,
    EUR: rates.eurInr,
    GBP: rates.gbpInr,
    AED: rates.aedInr,
    CNY: rates.cnyInr,
    AUD: rates.audInr,
  };

  const fxData: FXRate[] = FX_CONFIG.map(config => ({
    ...config,
    price: ratesMap[config.code as keyof typeof ratesMap].price,
    change: ratesMap[config.code as keyof typeof ratesMap].change,
  }));

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return undefined;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const getChangeColor = (change: string) =>
    parseFloat(change) >= 0 ? 'text-green-600' : 'text-red-600';

  const TrendIcon = (change: string) =>
    parseFloat(change) >= 0 ? TrendingUp : TrendingDown;

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-slate-900">Foreign Exchange</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={scrollPrev}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={scrollNext}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden flex-1" ref={emblaRef}>
        <div className="flex h-full">
          {fxData.map((fx) => {
            const Icon = TrendIcon(fx.change);
            return (
              <div key={fx.code} className="flex-[0_0_100%] min-w-0 h-full">
                <div className="h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{fx.flag}</span>
                      <div>
                        <div className="text-xl font-bold text-slate-900 leading-tight">{fx.code}</div>
                        <div className="text-xs text-slate-600">{fx.name}</div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 ${getChangeColor(fx.change)} font-semibold`}>
                      <Icon className="w-3 h-3" />
                      <span className="text-xs">{parseFloat(fx.change) > 0 ? '+' : ''}{fx.change}%</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Exchange Rate</div>
                    <div className="text-3xl font-bold text-slate-900 leading-tight">₹{fx.price}</div>
                  </div>

                  <div className="pt-3">
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Trade Impact</div>
                    <div className="text-xs text-slate-700 leading-snug">{fx.impact}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-1.5 mt-3">
        {fxData.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === selectedIndex ? 'w-6 bg-teal-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to currency ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FXCard;
