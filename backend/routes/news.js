import express from 'express';
import newsService from '../services/newsService.js';

const router = express.Router();

// Get corporate news
router.get('/corporate', async (req, res) => {
  try {
    const news = await newsService.getCorporateNews();
    res.json({
      success: true,
      data: news,
      count: news.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news',
      message: error.message
    });
  }
});

// Get debt market news
router.get('/debt', async (req, res) => {
  try {
    const news = await newsService.getDebtMarketNews();
    res.json({
      success: true,
      data: news,
      count: news.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching debt news:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch debt news',
      message: error.message
    });
  }
});

// Get commodity news
router.get('/commodity', async (req, res) => {
  try {
    const news = await newsService.getCommodityNews();
    res.json({
      success: true,
      data: news,
      count: news.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching commodity news:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch commodity news',
      message: error.message
    });
  }
});

export default router;
