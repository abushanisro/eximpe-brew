import express from 'express';
import newsService from '../services/newsService.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

// Get corporate news
router.get('/corporate', asyncHandler(async (req, res) => {
  const news = await newsService.getCorporateNews();
  res.json({
    success: true,
    data: news,
    count: news.length,
    timestamp: new Date().toISOString()
  });
}));

// Get debt market news
router.get('/debt', asyncHandler(async (req, res) => {
  const news = await newsService.getDebtMarketNews();
  res.json({
    success: true,
    data: news,
    count: news.length,
    timestamp: new Date().toISOString()
  });
}));

// Get commodity news
router.get('/commodity', asyncHandler(async (req, res) => {
  const news = await newsService.getCommodityNews();
  res.json({
    success: true,
    data: news,
    count: news.length,
    timestamp: new Date().toISOString()
  });
}));

export default router;
