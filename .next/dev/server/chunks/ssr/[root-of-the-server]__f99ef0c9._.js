module.exports = [
"[project]/OneDrive/Desktop/eximpe/src/services/api.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiService",
    ()=>apiService
]);
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:3001/api") || 'http://localhost:3001/api';
class ApiService {
    async fetchWithTimeout(url, timeout = 20000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>{
            controller.abort();
        }, timeout);
        try {
            const response = await fetch(url, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
    async getMarketData() {
        try {
            const response = await this.fetchWithTimeout(`${API_BASE_URL}/market/all`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
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
    async getCorporateNews() {
        try {
            const response = await this.fetchWithTimeout(`${API_BASE_URL}/news/corporate`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
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
    async getDebtNews() {
        try {
            const response = await this.fetchWithTimeout(`${API_BASE_URL}/news/debt`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
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
    async getCommodityNews() {
        try {
            const response = await this.fetchWithTimeout(`${API_BASE_URL}/news/commodity`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
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
    async getCurrencyInsights() {
        try {
            const response = await this.fetchWithTimeout(`${API_BASE_URL}/market/currency-insights`, 30000);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result.success) {
                return result.data;
            } else {
                throw new Error('API returned unsuccessful response');
            }
        } catch (error) {
            console.error('Error fetching currency insights:', error);
            throw error;
        }
    }
    async getSupabaseNewsByCategoryAndPeriod(period) {
        try {
            const response = await this.fetchWithTimeout(`${API_BASE_URL}/supabase-news/all-categories?period=${period}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result.success) {
                // Map backend categories to frontend categories
                return {
                    indian: result.data.india || [],
                    usa: result.data.usa || [],
                    china: result.data.china || [],
                    global: result.data.global || []
                };
            } else {
                throw new Error('API returned unsuccessful response');
            }
        } catch (error) {
            console.error('Error fetching Supabase news:', error);
            throw error;
        }
    }
}
const apiService = new ApiService();
}),
"[externals]/embla-carousel-react [external] (embla-carousel-react, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("embla-carousel-react");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/embla-carousel-autoplay [external] (embla-carousel-autoplay, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("embla-carousel-autoplay");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/OneDrive/Desktop/eximpe/src/components/MarketIndicator.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
'use client';
;
;
const MarketIndicator = ({ title, subtitle, value, change, changeValue })=>{
    const changeNum = parseFloat(change);
    const isNegative = changeNum < 0;
    // Seeded random number generator for consistent SSR/Client rendering
    const seededRandom = (seed)=>{
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };
    // Generate realistic market-style sparkline with deterministic seed
    const sparklinePath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        // Use title + change as seed for deterministic randomness
        const seed = title.charCodeAt(0) + changeNum * 1000;
        // Create realistic market movements with multiple points
        const points = 25;
        const data = [];
        // Start value based on trend
        let currentValue = isNegative ? 10 : 30;
        // Generate points with realistic market movement
        for(let i = 0; i < points; i++){
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
        const pathParts = data.map((y, i)=>{
            const x = i / (points - 1) * 100;
            return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
        });
        return pathParts.join(' ');
    }, [
        title,
        changeNum,
        isNegative
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "bg-[#1E293B] rounded-lg p-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-bold text-white leading-tight",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketIndicator.tsx",
                                lineNumber: 70,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-[10px] text-gray-500 uppercase tracking-wide mt-0.5",
                                children: subtitle
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketIndicator.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketIndicator.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: `flex items-center gap-0.5 ${isNegative ? 'text-red-500' : 'text-green-500'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "text-xs",
                                children: isNegative ? '↓' : '↑'
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketIndicator.tsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "text-xs font-semibold",
                                children: [
                                    Math.abs(changeNum).toFixed(2),
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketIndicator.tsx",
                                lineNumber: 75,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketIndicator.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketIndicator.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mt-2 mb-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                    viewBox: "0 0 100 40",
                    className: "w-full h-8",
                    preserveAspectRatio: "none",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                        d: sparklinePath,
                        fill: "none",
                        stroke: isNegative ? '#ef4444' : '#22c55e',
                        strokeWidth: "2",
                        vectorEffect: "non-scaling-stroke"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketIndicator.tsx",
                        lineNumber: 86,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketIndicator.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketIndicator.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "text-xl font-bold text-white leading-tight",
                children: value
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketIndicator.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            changeValue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: `text-[10px] ${isNegative ? 'text-red-500' : 'text-green-500'}`,
                children: changeValue
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketIndicator.tsx",
                lineNumber: 101,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketIndicator.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = MarketIndicator;
}),
"[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$embla$2d$carousel$2d$react__$5b$external$5d$__$28$embla$2d$carousel$2d$react$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/embla-carousel-react [external] (embla-carousel-react, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$embla$2d$carousel$2d$autoplay__$5b$external$5d$__$28$embla$2d$carousel$2d$autoplay$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/embla-carousel-autoplay [external] (embla-carousel-autoplay, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/eximpe/node_modules/lucide-react/dist/esm/icons/chevron-left.js [ssr] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/eximpe/node_modules/lucide-react/dist/esm/icons/chevron-right.js [ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$components$2f$MarketIndicator$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/eximpe/src/components/MarketIndicator.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/eximpe/src/services/api.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$embla$2d$carousel$2d$react__$5b$external$5d$__$28$embla$2d$carousel$2d$react$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$embla$2d$carousel$2d$autoplay__$5b$external$5d$__$28$embla$2d$carousel$2d$autoplay$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$embla$2d$carousel$2d$react__$5b$external$5d$__$28$embla$2d$carousel$2d$react$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$embla$2d$carousel$2d$autoplay__$5b$external$5d$__$28$embla$2d$carousel$2d$autoplay$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
'use client';
;
;
;
;
;
;
;
const FX_CONFIG = [
    {
        code: 'USD',
        name: 'US Dollar',
        flag: '🇺🇸',
        impact: 'Major trade currency'
    },
    {
        code: 'EUR',
        name: 'Euro',
        flag: '🇪🇺',
        impact: 'EU machinery & tech'
    },
    {
        code: 'GBP',
        name: 'British Pound',
        flag: '🇬🇧',
        impact: 'Services & education'
    },
    {
        code: 'AED',
        name: 'UAE Dirham',
        flag: '🇦🇪',
        impact: 'Gold & oil imports'
    },
    {
        code: 'CNY',
        name: 'Chinese Yuan',
        flag: '🇨🇳',
        impact: 'Electronics & machinery'
    },
    {
        code: 'AUD',
        name: 'Australian Dollar',
        flag: '🇦🇺',
        impact: 'Coal & minerals'
    }
];
const MarketOverview = ({ marketData, lastUpdated })=>{
    const [currencyInsights, setCurrencyInsights] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    const [insightsLoading, setInsightsLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [emblaRef, emblaApi] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$embla$2d$carousel$2d$react__$5b$external$5d$__$28$embla$2d$carousel$2d$react$2c$__esm_import$29$__["default"])({
        loop: true,
        align: 'center'
    }, [
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$embla$2d$carousel$2d$autoplay__$5b$external$5d$__$28$embla$2d$carousel$2d$autoplay$2c$__esm_import$29$__["default"])({
            delay: 4000,
            stopOnInteraction: false
        })
    ]);
    const [selectedIndex, setSelectedIndex] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    // Fetch AI-powered currency insights
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const fetchInsights = async ()=>{
            try {
                setInsightsLoading(true);
                const insights = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].getCurrencyInsights();
                setCurrencyInsights(insights);
            } catch (error) {
                console.error('Failed to fetch currency insights:', error);
            } finally{
                setInsightsLoading(false);
            }
        };
        fetchInsights();
        // Refresh insights every 30 minutes
        const interval = setInterval(fetchInsights, 30 * 60 * 1000);
        return ()=>clearInterval(interval);
    }, []);
    const ratesMap = {
        USD: marketData.usdInr,
        EUR: marketData.eurInr,
        GBP: marketData.gbpInr,
        AED: marketData.aedInr,
        CNY: marketData.cnyInr,
        AUD: marketData.audInr
    };
    const fxData = FX_CONFIG.map((config)=>{
        const insightKey = `${config.code.toLowerCase()}Inr`;
        const insight = currencyInsights[insightKey];
        return {
            ...config,
            price: ratesMap[config.code].price,
            change: ratesMap[config.code].change,
            // Only include AI insight if it exists
            aiInsight: insight?.aiInsight
        };
    });
    const scrollPrev = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(()=>emblaApi?.scrollPrev(), [
        emblaApi
    ]);
    const scrollNext = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(()=>emblaApi?.scrollNext(), [
        emblaApi
    ]);
    const onSelect = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(()=>{
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [
        emblaApi
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        return ()=>{
            emblaApi.off('select', onSelect);
        };
    }, [
        emblaApi,
        onSelect
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "mb-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-3 pb-2 border-b border-slate-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                className: "text-base font-bold text-slate-900",
                                children: "Market Overview"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1 px-1.5 py-0.5 bg-red-50 rounded-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "relative flex h-1.5 w-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                                lineNumber: 126,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                                lineNumber: 127,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                        lineNumber: 125,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] font-semibold text-red-600 uppercase tracking-wide",
                                        children: "Live"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                        lineNumber: 129,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                lineNumber: 124,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "text-[10px] text-slate-500",
                        suppressHydrationWarning: true,
                        children: lastUpdated.toLocaleTimeString()
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$components$2f$MarketIndicator$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        title: "NIFTY 50",
                        subtitle: "*NSEI · INDEX",
                        value: marketData.nifty.price,
                        change: marketData.nifty.change,
                        changeValue: `${parseFloat(marketData.nifty.change) >= 0 ? '+' : ''}${(parseFloat(marketData.nifty.change) * parseFloat(marketData.nifty.price.replace(/,/g, '')) / 100).toFixed(1)}`
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$components$2f$MarketIndicator$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        title: "S&P BSE Sensex",
                        subtitle: "*BSESN · INDEX",
                        value: marketData.sensex.price,
                        change: marketData.sensex.change,
                        changeValue: `${parseFloat(marketData.sensex.change) >= 0 ? '+' : ''}${(parseFloat(marketData.sensex.change) * parseFloat(marketData.sensex.price.replace(/,/g, '')) / 100).toFixed(1)}`
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$components$2f$MarketIndicator$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        title: "Dollar Index",
                        subtitle: "DXY · INDEX",
                        value: marketData.dxy.price,
                        change: marketData.dxy.change,
                        changeValue: `${parseFloat(marketData.dxy.change) >= 0 ? '+' : ''}${(parseFloat(marketData.dxy.change) * parseFloat(marketData.dxy.price) / 100).toFixed(2)}`
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "bg-[#1E293B] rounded-lg p-3 relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] font-bold text-gray-400 uppercase tracking-wide",
                                        children: "Live FX Rates"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                        lineNumber: 164,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: scrollPrev,
                                                className: "p-0.5 hover:bg-gray-700 rounded",
                                                "aria-label": "Previous",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                                    className: "w-3 h-3 text-gray-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                                lineNumber: 166,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: scrollNext,
                                                className: "p-0.5 hover:bg-gray-700 rounded",
                                                "aria-label": "Next",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                    className: "w-3 h-3 text-gray-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                                lineNumber: 169,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                        lineNumber: 165,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "overflow-hidden",
                                ref: emblaRef,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex",
                                    children: fxData.map((fx)=>{
                                        const changeNum = parseFloat(fx.change);
                                        const isNegative = changeNum < 0;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex-[0_0_100%] min-w-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col h-full",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                className: "text-sm font-bold text-white leading-tight",
                                                                children: [
                                                                    fx.code,
                                                                    "/INR"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                                                lineNumber: 186,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "text-2xl font-bold text-white leading-tight",
                                                                children: [
                                                                    "₹",
                                                                    fx.price
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                                                lineNumber: 187,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: `flex items-center gap-0.5 ${isNegative ? 'text-red-500' : 'text-green-500'}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm font-bold",
                                                                        children: isNegative ? '↓' : '↑'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                                                        lineNumber: 189,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm font-bold",
                                                                        children: [
                                                                            Math.abs(changeNum).toFixed(2),
                                                                            "%"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                                                        lineNumber: 190,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                                                lineNumber: 188,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                                        lineNumber: 185,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "pt-2 border-t border-gray-700",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "text-[10px] text-gray-300 leading-relaxed",
                                                            children: insightsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "italic text-gray-400",
                                                                children: "Analyzing market conditions..."
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                                                lineNumber: 198,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0)) : fx.aiInsight ? fx.aiInsight : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-gray-400",
                                                                children: changeNum >= 0 ? `${fx.code} stronger - imports cost more today.` : `${fx.code} weaker - good time for imports.`
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                                                lineNumber: 202,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                                            lineNumber: 196,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                                        lineNumber: 195,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                                lineNumber: 183,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, fx.code, false, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                            lineNumber: 182,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0));
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                    lineNumber: 176,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                lineNumber: 175,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex justify-center gap-0.5 mt-2",
                                children: fxData.map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        className: `h-0.5 rounded-full transition-all ${index === selectedIndex ? 'w-3 bg-gray-400' : 'w-0.5 bg-gray-600'}`,
                                        onClick: ()=>emblaApi?.scrollTo(index),
                                        "aria-label": `Go to currency ${index + 1}`
                                    }, index, false, {
                                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                        lineNumber: 221,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                                lineNumber: 219,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx",
        lineNumber: 119,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = MarketOverview;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/eximpe/src/services/api.ts [ssr] (ecmascript)");
'use client';
;
;
;
const CategorizedNews = ({ lastUpdated })=>{
    const [activeCategory, setActiveCategory] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('indian');
    const [timeFilter, setTimeFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('today');
    const [news, setNews] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        indian: [],
        global: [],
        china: [],
        usa: []
    });
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        fetchCategorizedNews();
    }, [
        timeFilter
    ]);
    const fetchCategorizedNews = async ()=>{
        try {
            // Use Supabase for historical data (yesterday, 1w, 1m)
            if (timeFilter !== 'today') {
                console.log(`\n🔍 Fetching ${timeFilter} news from Supabase...`);
                const supabaseNews = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].getSupabaseNewsByCategoryAndPeriod(timeFilter);
                console.log('📊 Supabase News Distribution:');
                console.log(`  India: ${supabaseNews.indian.length} news`);
                console.log(`  USA: ${supabaseNews.usa.length} news`);
                console.log(`  China: ${supabaseNews.china.length} news`);
                console.log(`  Global: ${supabaseNews.global.length} news`);
                setNews(supabaseNews);
                return;
            }
            // Use regular API for today's news
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].getCorporateNews();
            console.log(`\n🔍 Frontend received ${response.length} total news items`);
            // Categorize news based on content with better distribution
            const categorized = {
                indian: [],
                global: [],
                china: [],
                usa: []
            };
            const uncategorized = [];
            // Log pre-categorized items from backend
            const preCategorized = {
                USA: response.filter((item)=>item.category === 'USA').length,
                CHINA: response.filter((item)=>item.category === 'CHINA').length,
                INDIA: response.filter((item)=>item.category === 'INDIA').length,
                GLOBAL: response.filter((item)=>item.category === 'GLOBAL').length
            };
            console.log('📦 Pre-categorized from backend:', preCategorized);
            response.forEach((item)=>{
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
                } else if (combined.includes('china') || combined.includes('chinese') || combined.includes('beijing') || combined.includes('yuan') || combined.includes('cny') || combined.includes('pboc') || combined.includes('xi jinping') || combined.includes('shanghai') || combined.includes('hong kong')) {
                    categorized.china.push(item);
                } else if (combined.includes('us ') || combined.includes('usa ') || combined.includes('u.s.') || combined.includes('america') || combined.includes('washington') || combined.includes('federal reserve') || combined.includes('fed ') || combined.includes('dollar') || combined.includes('trump') || combined.includes('biden') || combined.includes('wall street') || combined.includes('nasdaq') || combined.includes('dow jones') || combined.includes('s&p 500') || source.includes('bloomberg') || source.includes('marketwatch') || source.includes('wsj')) {
                    categorized.usa.push(item);
                } else if (combined.includes('india') || combined.includes('indian') || combined.includes('rupee') || combined.includes('modi') || combined.includes('rbi') || combined.includes('mumbai') || combined.includes('delhi') || combined.includes('nse') || combined.includes('sensex') || combined.includes('nifty') || source.includes('hindu') || source.includes('economic times')) {
                    categorized.indian.push(item);
                } else {
                    uncategorized.push(item);
                }
            });
            // Ensure each category has exactly 5 news items
            const targetCount = 5;
            // First pass: Distribute uncategorized to fill gaps
            let allAvailable = [
                ...uncategorized
            ];
            // Priority order: china, usa, global, indian
            const fillOrder = [
                'china',
                'usa',
                'global',
                'indian'
            ];
            fillOrder.forEach((cat)=>{
                const currentCount = categorized[cat].length;
                if (currentCount < targetCount && allAvailable.length > 0) {
                    const needed = targetCount - currentCount;
                    const toAdd = allAvailable.splice(0, needed);
                    categorized[cat].push(...toAdd);
                }
            });
            // Second pass: If still not enough, redistribute from categories with more than 5
            fillOrder.forEach((cat)=>{
                const currentCount = categorized[cat].length;
                if (currentCount < targetCount) {
                    const needed = targetCount - currentCount;
                    // Take from other categories that have > 5
                    for (const otherCat of fillOrder){
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
            Object.keys(categorized).forEach((cat)=>{
                categorized[cat] = categorized[cat].slice(0, 5);
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
    const getSentimentIcon = (sentiment)=>{
        switch(sentiment){
            case 'positive':
                return {
                    icon: '↑',
                    color: 'text-teal-400'
                };
            case 'negative':
                return {
                    icon: '↓',
                    color: 'text-red-400'
                };
            default:
                return {
                    icon: '→',
                    color: 'text-gray-400'
                };
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "bg-slate-800 rounded-lg p-6 mb-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "w-6 h-6 bg-teal-500 rounded"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "text-xl font-bold text-white",
                                children: "Key Trade News"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                                lineNumber: 230,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                        lineNumber: 228,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "text-xs text-gray-400",
                        suppressHydrationWarning: true,
                        children: [
                            "Updated: ",
                            lastUpdated.toLocaleTimeString()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                        lineNumber: 232,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                lineNumber: 227,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "text-xs text-gray-400 mr-2",
                        children: "Time:"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                        lineNumber: 239,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    [
                        'today',
                        'yesterday',
                        '1w',
                        '1m'
                    ].map((filter)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: ()=>setTimeFilter(filter),
                            className: `px-3 py-1 rounded text-xs font-semibold transition-colors ${timeFilter === filter ? 'bg-teal-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`,
                            children: timeFilterLabels[filter]
                        }, filter, false, {
                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                            lineNumber: 241,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)))
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                lineNumber: 238,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex gap-1 mb-4 border-b border-gray-700",
                children: Object.keys(categoryLabels).map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveCategory(category),
                        className: `flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${activeCategory === category ? 'text-teal-400 border-b-2 border-teal-400' : 'text-gray-400 hover:text-gray-300'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                children: categoryLabels[category]
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                                lineNumber: 267,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            news[category].length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "ml-1 px-1.5 py-0.5 bg-gray-700 rounded-full text-[10px]",
                                children: news[category].length
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                                lineNumber: 269,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, category, true, {
                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                        lineNumber: 258,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                lineNumber: 256,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            currentNews.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                className: "space-y-3",
                children: currentNews.map((newsItem, index)=>{
                    const sentimentData = getSentimentIcon(newsItem.sentiment || 'neutral');
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                        className: "flex items-start gap-3 pb-3 border-b border-gray-700 last:border-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: `font-bold ${sentimentData.color} mt-1`,
                                children: sentimentData.icon
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                                lineNumber: 284,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    newsItem.link ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                        href: newsItem.link,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "text-gray-200 hover:text-teal-400 transition-colors block leading-relaxed",
                                        children: newsItem.title
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                                        lineNumber: 289,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-gray-200 block leading-relaxed",
                                        children: newsItem.title
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                                        lineNumber: 298,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 mt-1.5 text-xs text-gray-500",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                children: newsItem.source
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                                                lineNumber: 303,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                children: "•"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                                                lineNumber: 304,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                children: newsItem.time
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                                                lineNumber: 305,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            newsItem.link && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                                href: newsItem.link,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "text-teal-500 hover:text-teal-400 ml-auto",
                                                children: "Read →"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                                                lineNumber: 307,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                                        lineNumber: 302,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                                lineNumber: 287,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, index, true, {
                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                        lineNumber: 283,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0));
                })
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                lineNumber: 279,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "text-center py-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-gray-300 mb-1",
                        children: [
                            "No ",
                            categoryLabels[activeCategory],
                            " Available"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                        lineNumber: 324,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-gray-500 text-sm",
                        children: "Check back soon for updates"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                        lineNumber: 325,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
                lineNumber: 323,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx",
        lineNumber: 225,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = CategorizedNews;
}),
"[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/eximpe/src/services/api.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$components$2f$MarketOverview$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/eximpe/src/components/MarketOverview.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$components$2f$CategorizedNews$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/eximpe/src/components/CategorizedNews.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$components$2f$MarketOverview$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$components$2f$MarketOverview$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const Index = ()=>{
    const [marketData, setMarketData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        nifty: {
            price: '--',
            change: '0.00'
        },
        sensex: {
            price: '--',
            change: '0.00'
        },
        usdInr: {
            price: '--',
            change: '0.00'
        },
        eurInr: {
            price: '--',
            change: '0.00'
        },
        gbpInr: {
            price: '--',
            change: '0.00'
        },
        aedInr: {
            price: '--',
            change: '0.00'
        },
        audInr: {
            price: '--',
            change: '0.00'
        },
        cnyInr: {
            price: '--',
            change: '0.00'
        },
        jpyInr: {
            price: '--',
            change: '0.00'
        },
        dxy: {
            price: '--',
            change: '0.00'
        },
        eurUsd: {
            price: '--',
            change: '0.00'
        },
        gbpUsd: {
            price: '--',
            change: '0.00'
        },
        usdJpy: {
            price: '--',
            change: '0.00'
        },
        gold: {
            price: '--',
            change: '0.00'
        },
        brent: {
            price: '--',
            change: '0.00'
        }
    });
    const [lastUpdated, setLastUpdated] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Date());
    const [newsLastUpdated, setNewsLastUpdated] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Date());
    const [debtNews, setDebtNews] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [commodityNews, setCommodityNews] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const getCurrentDate = ()=>{
        const today = new Date();
        const day = today.getDate();
        const month = today.toLocaleDateString('en-US', {
            month: 'long'
        });
        const year = today.getFullYear();
        const dayWithSuffix = day + (day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th');
        return `${dayWithSuffix} ${month} ${year}`;
    };
    const fetchDebtNews = async ()=>{
        try {
            const news = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].getDebtNews();
            setDebtNews(news);
            setNewsLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching debt news:', error);
        }
    };
    const fetchCommodityNews = async ()=>{
        try {
            const news = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].getCommodityNews();
            setCommodityNews(news);
            setNewsLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching commodity news:', error);
        }
    };
    const fetchMarketData = async ()=>{
        try {
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$services$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["apiService"].getMarketData();
            setMarketData(data);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching market data:', error);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // Fetch data on component mount
        fetchMarketData();
        fetchDebtNews();
        fetchCommodityNews();
        // Set up interval to fetch market data every 30 seconds during market hours
        const marketInterval = setInterval(()=>{
            const now = new Date();
            const hours = now.getHours();
            const day = now.getDay();
            // Update only during market hours (9 AM to 4 PM, Monday to Friday)
            if (day >= 1 && day <= 5 && hours >= 9 && hours <= 16) {
                fetchMarketData();
            }
        }, 30000); // 30 seconds
        // Set up interval to fetch news every 5 minutes
        const newsInterval = setInterval(()=>{
            fetchDebtNews();
            fetchCommodityNews();
        }, 300000); // 5 minutes
        return ()=>{
            clearInterval(marketInterval);
            clearInterval(newsInterval);
        };
    }, []);
    const formatChange = (change)=>{
        const changeNum = parseFloat(change);
        return changeNum >= 0 ? `(+${change}%)` : `(${change}%)`;
    };
    const getChangeColor = (change)=>{
        const changeNum = parseFloat(change);
        return changeNum >= 0 ? 'text-green-500' : 'text-red-500';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-white text-slate-900 p-4 md:p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "max-w-4xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "text-lg font-light",
                                    children: getCurrentDate()
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                    lineNumber: 120,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    className: "text-5xl font-bold tracking-wide mt-2 mb-4",
                                    children: "MORNING BREW"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                    lineNumber: 121,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                            lineNumber: 119,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                    src: "/eximpe.jpg",
                                    alt: "EximPe",
                                    className: "w-16 h-16 rounded-lg"
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                    lineNumber: 126,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "text-2xl font-bold",
                                            children: [
                                                "Exim",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-teal-500",
                                                    children: "Pe"
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 69
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 128,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "text-teal-400 text-sm",
                                            children: "Export Import Excellence"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 129,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                    lineNumber: 127,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                            lineNumber: 125,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                    lineNumber: 118,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$components$2f$MarketOverview$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    marketData: marketData,
                    lastUpdated: lastUpdated
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                    lineNumber: 135,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$components$2f$CategorizedNews$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    lastUpdated: newsLastUpdated
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                    lineNumber: 138,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "bg-slate-100 rounded-lg p-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-6 h-6 bg-teal-500 rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 145,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-xl font-bold text-slate-900",
                                            children: "Debt Markets"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 146,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-slate-500 ml-auto",
                                            suppressHydrationWarning: true,
                                            children: [
                                                "Updated: ",
                                                newsLastUpdated.toLocaleTimeString()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 147,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                    lineNumber: 144,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                marketData.debtMarkets?.indiaBond10Y && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mb-4 text-sm text-slate-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "font-bold",
                                            children: marketData.debtMarkets.indiaBond10Y.name
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 153,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " yield at ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "font-bold",
                                            children: [
                                                marketData.debtMarkets.indiaBond10Y.yield,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 153,
                                            columnNumber: 120
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                    lineNumber: 152,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                debtNews.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                    className: "space-y-3 text-sm text-slate-700 leading-relaxed",
                                    children: debtNews.map((news, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: [
                                                "- ",
                                                news.title
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 159,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                    lineNumber: 157,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-slate-500 text-center py-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mb-2",
                                            children: "📊"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 164,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: "No real-time debt market news available"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 165,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "text-xs mt-1",
                                            children: "Configure NEWSAPI_KEY in backend/.env for live news"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 166,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                    lineNumber: 163,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                            lineNumber: 143,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "bg-slate-100 rounded-lg p-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-6 h-6 bg-teal-500 rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 174,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-xl font-bold text-slate-900",
                                            children: "Currency"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 175,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-slate-500 ml-auto",
                                            suppressHydrationWarning: true,
                                            children: lastUpdated.toLocaleTimeString()
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 176,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                    lineNumber: 173,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                    className: "space-y-3 text-sm text-slate-700 leading-relaxed",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: [
                                                "- USD/INR at ",
                                                marketData.usdInr.price,
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: getChangeColor(marketData.usdInr.change),
                                                    children: formatChange(marketData.usdInr.change)
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                    lineNumber: 182,
                                                    columnNumber: 72
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 181,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: [
                                                "- DXY at ",
                                                marketData.dxy.price,
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: getChangeColor(marketData.dxy.change),
                                                    children: formatChange(marketData.dxy.change)
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                    lineNumber: 185,
                                                    columnNumber: 65
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 184,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: [
                                                "- EUR/USD at ",
                                                marketData.eurUsd.price,
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: getChangeColor(marketData.eurUsd.change),
                                                    children: formatChange(marketData.eurUsd.change)
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                    lineNumber: 188,
                                                    columnNumber: 72
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 187,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: [
                                                "- GBP/USD at ",
                                                marketData.gbpUsd.price,
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: getChangeColor(marketData.gbpUsd.change),
                                                    children: formatChange(marketData.gbpUsd.change)
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                    lineNumber: 191,
                                                    columnNumber: 72
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 190,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: [
                                                "- USD/JPY at ",
                                                marketData.usdJpy.price,
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: getChangeColor(marketData.usdJpy.change),
                                                    children: formatChange(marketData.usdJpy.change)
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                    lineNumber: 194,
                                                    columnNumber: 72
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 193,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                    lineNumber: 180,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                            lineNumber: 172,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                    lineNumber: 141,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "bg-slate-100 rounded-lg p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-6 h-6 bg-teal-500 rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 205,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-xl font-bold text-slate-900",
                                            children: "Commodities"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 206,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-slate-500 ml-auto",
                                            suppressHydrationWarning: true,
                                            children: [
                                                "Updated: ",
                                                newsLastUpdated.toLocaleTimeString()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 207,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                    lineNumber: 204,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "space-y-2 text-sm text-slate-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                "- Brent ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "font-bold",
                                                    children: [
                                                        "$",
                                                        marketData.brent.price,
                                                        "/bbl"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                    lineNumber: 213,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: `ml-1 ${getChangeColor(marketData.brent.change)}`,
                                                    children: formatChange(marketData.brent.change)
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                ", Gold ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "font-bold",
                                                    children: [
                                                        "$",
                                                        marketData.gold.price,
                                                        "/oz"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                    lineNumber: 215,
                                                    columnNumber: 38
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: `ml-1 ${getChangeColor(marketData.gold.change)}`,
                                                    children: formatChange(marketData.gold.change)
                                                }, void 0, false, {
                                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                    lineNumber: 216,
                                                    columnNumber: 33
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 212,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        commodityNews.length > 0 ? commodityNews.map((news, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                children: [
                                                    "- ",
                                                    news.title
                                                ]
                                            }, index, true, {
                                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                lineNumber: 220,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "text-slate-500 text-center py-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "text-xs",
                                                children: "Configure NEWSAPI_KEY in backend/.env for commodity news"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                lineNumber: 224,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 223,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                    lineNumber: 211,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                            lineNumber: 203,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "bg-slate-100 rounded-lg p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-6 h-6 bg-teal-500 rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 233,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-xl font-bold text-slate-900",
                                            children: "Global Markets"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 234,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-slate-500 ml-auto",
                                            suppressHydrationWarning: true,
                                            children: [
                                                "Updated: ",
                                                lastUpdated.toLocaleTimeString()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 235,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                    lineNumber: 232,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                marketData.globalMarkets ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2 text-sm text-slate-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: [
                                                "- US:",
                                                marketData.globalMarkets.dow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                    children: [
                                                        ' ',
                                                        "Dow ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: getChangeColor(marketData.globalMarkets.dow.change),
                                                            children: formatChange(marketData.globalMarkets.dow.change)
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                            lineNumber: 245,
                                                            columnNumber: 54
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true),
                                                marketData.globalMarkets.sp500 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                    children: [
                                                        ", S&P 500 ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: getChangeColor(marketData.globalMarkets.sp500.change),
                                                            children: formatChange(marketData.globalMarkets.sp500.change)
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                            lineNumber: 250,
                                                            columnNumber: 55
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true),
                                                marketData.globalMarkets.nasdaq && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                    children: [
                                                        ", Nasdaq ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: getChangeColor(marketData.globalMarkets.nasdaq.change),
                                                            children: formatChange(marketData.globalMarkets.nasdaq.change)
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                            lineNumber: 255,
                                                            columnNumber: 54
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 241,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: [
                                                "- Europe:",
                                                marketData.globalMarkets.ftse && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                    children: [
                                                        ' ',
                                                        "FTSE ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: getChangeColor(marketData.globalMarkets.ftse.change),
                                                            children: formatChange(marketData.globalMarkets.ftse.change)
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                            lineNumber: 263,
                                                            columnNumber: 55
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true),
                                                marketData.globalMarkets.dax && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                    children: [
                                                        ", DAX ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: getChangeColor(marketData.globalMarkets.dax.change),
                                                            children: formatChange(marketData.globalMarkets.dax.change)
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                            lineNumber: 268,
                                                            columnNumber: 51
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true),
                                                marketData.globalMarkets.cac && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                    children: [
                                                        ", CAC ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: getChangeColor(marketData.globalMarkets.cac.change),
                                                            children: formatChange(marketData.globalMarkets.cac.change)
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                            lineNumber: 273,
                                                            columnNumber: 51
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 259,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            children: [
                                                "- Asia:",
                                                marketData.globalMarkets.nikkei && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                    children: [
                                                        ' ',
                                                        "Nikkei ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: getChangeColor(marketData.globalMarkets.nikkei.change),
                                                            children: formatChange(marketData.globalMarkets.nikkei.change)
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                            lineNumber: 281,
                                                            columnNumber: 57
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true),
                                                marketData.globalMarkets.hangseng && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                    children: [
                                                        ", Hang Seng ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: getChangeColor(marketData.globalMarkets.hangseng.change),
                                                            children: formatChange(marketData.globalMarkets.hangseng.change)
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                            lineNumber: 286,
                                                            columnNumber: 57
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true),
                                                marketData.globalMarkets.shanghai && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                    children: [
                                                        ", Shanghai ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: getChangeColor(marketData.globalMarkets.shanghai.change),
                                                            children: formatChange(marketData.globalMarkets.shanghai.change)
                                                        }, void 0, false, {
                                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                                            lineNumber: 291,
                                                            columnNumber: 56
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                            lineNumber: 277,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                    lineNumber: 240,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-slate-500 text-center py-4",
                                    children: "Loading global market data..."
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                                    lineNumber: 297,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                            lineNumber: 231,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                    lineNumber: 200,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "text-center text-xs mt-8 opacity-70 leading-relaxed",
                    children: [
                        "Trade intelligence is subject to market conditions and regulatory changes. Verify all information with official sources before making business decisions.",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                            lineNumber: 304,
                            columnNumber: 174
                        }, ("TURBOPACK compile-time value", void 0)),
                        "EximPe - Your trusted partner for export-import intelligence and cross-border trade solutions.",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                            lineNumber: 305,
                            columnNumber: 115
                        }, ("TURBOPACK compile-time value", void 0)),
                        "© 2025 EximPe. All rights reserved."
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
                    lineNumber: 303,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
            lineNumber: 116,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx",
        lineNumber: 115,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Index;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/OneDrive/Desktop/eximpe/src/pages/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$components$2f$pages$2f$Index$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/eximpe/src/components/pages/Index.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/eximpe/node_modules/next/head.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$components$2f$pages$2f$Index$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$components$2f$pages$2f$Index$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                    children: "Trade Morning Brew - Cross-Border Trade Intelligence"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/eximpe/src/pages/index.tsx",
                    lineNumber: 8,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/eximpe/src/pages/index.tsx",
                lineNumber: 7,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$eximpe$2f$src$2f$components$2f$pages$2f$Index$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/eximpe/src/pages/index.tsx",
                lineNumber: 10,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f99ef0c9._.js.map