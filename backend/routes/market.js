import express from 'express';
import marketDataService from '../services/marketDataService.js';
import currencyInsightsService from '../services/currencyInsightsService.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

// Get all market data
router.get('/all', asyncHandler(async (req, res) => {
  const data = await marketDataService.getAllMarketData();
  res.json({
    success: true,
    data,
    timestamp: new Date().toISOString()
  });
}));

// Get Indian stocks only
router.get('/stocks', asyncHandler(async (req, res) => {
  const data = await marketDataService.getIndianStocks();
  res.json({
    success: true,
    data,
    timestamp: new Date().toISOString()
  });
}));

// Get currencies only
router.get('/currencies', asyncHandler(async (req, res) => {
  const data = await marketDataService.getCurrencyRates();
  res.json({
    success: true,
    data,
    timestamp: new Date().toISOString()
  });
}));

// Get commodities only
router.get('/commodities', asyncHandler(async (req, res) => {
  const data = await marketDataService.getCommodities();
  res.json({
    success: true,
    data,
    timestamp: new Date().toISOString()
  });
}));

// Get currency insights with AI analysis
router.get('/currency-insights', asyncHandler(async (req, res) => {
  // Get current market data for context
  const marketData = await marketDataService.getAllMarketData();

  // Get AI-powered insights
  const insights = await currencyInsightsService.getAllCurrencyInsights(marketData);

  res.json({
    success: true,
    data: insights,
    timestamp: new Date().toISOString()
  });
}));

// Get insights for specific currency pair
router.get('/currency-insights/:pair', asyncHandler(async (req, res) => {
  const { pair } = req.params;

  // Get current market data for context
  const marketData = await marketDataService.getAllMarketData();

  const insight = await currencyInsightsService.getCurrencyInsights(pair, marketData);

  res.json({
    success: true,
    data: insight,
    timestamp: new Date().toISOString()
  });
}));

// Clear all caches - useful for debugging
router.post('/clear-cache', asyncHandler(async (req, res) => {
  marketDataService.cache.clear();
  currencyInsightsService.cache.clear();

  res.json({
    success: true,
    message: 'All caches cleared',
    timestamp: new Date().toISOString()
  });
}));

export default router;
