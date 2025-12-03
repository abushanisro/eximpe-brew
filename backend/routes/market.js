import express from 'express';
import marketDataService from '../services/marketDataService.js';

const router = express.Router();

// Get all market data
router.get('/all', async (req, res) => {
  try {
    const data = await marketDataService.getAllMarketData();
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market data',
      message: error.message
    });
  }
});

// Get Indian stocks only
router.get('/stocks', async (req, res) => {
  try {
    const data = await marketDataService.getIndianStocks();
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stock data',
      message: error.message
    });
  }
});

// Get currencies only
router.get('/currencies', async (req, res) => {
  try {
    const data = await marketDataService.getCurrencyRates();
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching currencies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch currency data',
      message: error.message
    });
  }
});

// Get commodities only
router.get('/commodities', async (req, res) => {
  try {
    const data = await marketDataService.getCommodities();
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching commodities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch commodities data',
      message: error.message
    });
  }
});

export default router;
