import express from 'express';
import supabaseNewsService from '../services/supabaseNewsService.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

router.get('/all-categories', asyncHandler(async (req, res) => {
  const { period = 'today' } = req.query;
  const newsByCategory = await supabaseNewsService.getNewsByCategoryAndPeriod(period);

  res.json({
    success: true,
    data: {
      indian: newsByCategory.INDIA || [],
      usa: newsByCategory.USA || [],
      china: newsByCategory.CHINA || [],
      global: newsByCategory.GLOBAL || []
    }
  });
}));

router.post('/cleanup', asyncHandler(async (req, res) => {
  const result = await supabaseNewsService.cleanupOldNews();
  res.json({ success: result.success });
}));

router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await supabaseNewsService.getStats();
  res.json({ success: !!stats, data: stats });
}));

export default router;
