'use client';

import { useMemo } from 'react';

interface MarketIndicatorProps {
  title: string;
  subtitle: string;
  value: string;
  change: string;
  changeValue?: string;
}

const MarketIndicator = ({
  title,
  subtitle,
  value,
  change,
  changeValue,
}: MarketIndicatorProps) => {
  const changeNum = parseFloat(change);
  const isNegative = changeNum < 0;

  // Seeded random number generator for consistent SSR/Client rendering
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Generate realistic market-style sparkline with deterministic seed
  const sparklinePath = useMemo(() => {
    // Use title + change as seed for deterministic randomness
    const seed = (title.charCodeAt(0) + changeNum * 1000);

    // Create realistic market movements with multiple points
    const points = 25;
    const data: number[] = [];

    // Start value based on trend
    let currentValue = isNegative ? 10 : 30;

    // Generate points with realistic market movement
    for (let i = 0; i < points; i++) {
      // Add deterministic "randomness" to simulate market volatility
      const volatility = (seededRandom(seed + i) - 0.5) * 4;

      // Overall trend (negative goes down, positive goes up)
      const trend = isNegative ? 0.8 : -0.8;

      currentValue += trend + volatility;

      // Keep within bounds
      currentValue = Math.max(5, Math.min(35, currentValue));
      data.push(currentValue);
    }

    // Create path from data points
    const pathParts = data.map((y, i) => {
      const x = (i / (points - 1)) * 100;
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    });

    return pathParts.join(' ');
  }, [title, changeNum, isNegative]);

  return (
    <div className="bg-[#1E293B] rounded-lg p-3">
      {/* Header with inline change */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-white leading-tight">{title}</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">{subtitle}</p>
        </div>
        <div className={`flex items-center gap-0.5 ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
          <span className="text-xs">{isNegative ? '↓' : '↑'}</span>
          <span className="text-xs font-semibold">{Math.abs(changeNum).toFixed(2)}%</span>
        </div>
      </div>

      {/* Sparkline Chart */}
      <div className="mt-2 mb-1">
        <svg
          viewBox="0 0 100 40"
          className="w-full h-8"
          preserveAspectRatio="none"
        >
          <path
            d={sparklinePath}
            fill="none"
            stroke={isNegative ? '#ef4444' : '#22c55e'}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Current Value */}
      <div className="text-xl font-bold text-white leading-tight">
        {value}
      </div>
      {changeValue && (
        <div className={`text-[10px] ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
          {changeValue}
        </div>
      )}
    </div>
  );
};

export default MarketIndicator;
