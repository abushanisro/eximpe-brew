-- EximPe Supabase Setup - Free Tier
-- Copy and paste this entire script into Supabase SQL Editor

-- ============================================
-- 1. MARKET DATA TABLES
-- ============================================

-- Market snapshots (stores historical market data)
CREATE TABLE IF NOT EXISTS market_snapshots (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_market_snapshots_timestamp 
ON market_snapshots(timestamp DESC);

-- ============================================
-- 2. NEWS TABLES
-- ============================================

-- News articles storage
CREATE TABLE IF NOT EXISTS news_articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  source TEXT,
  link TEXT UNIQUE,
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  category TEXT CHECK (category IN ('corporate', 'debt', 'commodity')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for news queries
CREATE INDEX IF NOT EXISTS idx_news_articles_created_at 
ON news_articles(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_news_articles_category 
ON news_articles(category);

CREATE INDEX IF NOT EXISTS idx_news_articles_sentiment 
ON news_articles(sentiment);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on market_snapshots
ALTER TABLE market_snapshots ENABLE ROW LEVEL SECURITY;

-- Enable RLS on news_articles
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES (Public Read Access)
-- ============================================

-- Market snapshots - Allow public read
CREATE POLICY "Allow public read market_snapshots" 
ON market_snapshots FOR SELECT 
USING (true);

-- Market snapshots - Allow service role write
CREATE POLICY "Allow service role write market_snapshots" 
ON market_snapshots FOR INSERT 
WITH CHECK (true);

-- News articles - Allow public read
CREATE POLICY "Allow public read news_articles" 
ON news_articles FOR SELECT 
USING (true);

-- News articles - Allow service role write
CREATE POLICY "Allow service role write news_articles" 
ON news_articles FOR INSERT 
WITH CHECK (true);

-- ============================================
-- 5. STORAGE BUCKETS (Optional - for images)
-- ============================================

-- Create storage bucket for market data exports
INSERT INTO storage.buckets (id, name, public)
VALUES ('market-data', 'market-data', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. VIEWS FOR COMMON QUERIES
-- ============================================

-- Latest market snapshot
CREATE OR REPLACE VIEW latest_market_snapshot AS
SELECT * FROM market_snapshots
ORDER BY timestamp DESC
LIMIT 1;

-- Recent news (last 7 days)
CREATE OR REPLACE VIEW recent_news AS
SELECT * FROM news_articles
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- News by category (last 7 days)
CREATE OR REPLACE VIEW news_by_category AS
SELECT 
  category,
  COUNT(*) as count,
  sentiment,
  MAX(created_at) as latest
FROM news_articles
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY category, sentiment;

-- ============================================
-- 7. FUNCTIONS FOR COMMON OPERATIONS
-- ============================================

-- Function to get market data for date range
CREATE OR REPLACE FUNCTION get_market_data_range(
  start_date TIMESTAMP,
  end_date TIMESTAMP
)
RETURNS TABLE (
  id BIGINT,
  data JSONB,
  timestamp TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    market_snapshots.id,
    market_snapshots.data,
    market_snapshots.timestamp
  FROM market_snapshots
  WHERE market_snapshots.timestamp BETWEEN start_date AND end_date
  ORDER BY market_snapshots.timestamp DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get news by sentiment
CREATE OR REPLACE FUNCTION get_news_by_sentiment(
  p_sentiment TEXT,
  p_limit INT DEFAULT 50
)
RETURNS TABLE (
  id BIGINT,
  title TEXT,
  source TEXT,
  link TEXT,
  sentiment TEXT,
  category TEXT,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    news_articles.id,
    news_articles.title,
    news_articles.source,
    news_articles.link,
    news_articles.sentiment,
    news_articles.category,
    news_articles.created_at
  FROM news_articles
  WHERE news_articles.sentiment = p_sentiment
  ORDER BY news_articles.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. CLEANUP POLICIES (Optional)
-- ============================================

-- Auto-delete old market snapshots (older than 90 days)
-- Run this as a scheduled job in Supabase
-- SELECT delete_old_market_snapshots();

CREATE OR REPLACE FUNCTION delete_old_market_snapshots()
RETURNS void AS $$
BEGIN
  DELETE FROM market_snapshots
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Auto-delete old news articles (older than 30 days)
CREATE OR REPLACE FUNCTION delete_old_news_articles()
RETURNS void AS $$
BEGIN
  DELETE FROM news_articles
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample market snapshot
INSERT INTO market_snapshots (data) VALUES (
  jsonb_build_object(
    'nifty', jsonb_build_object('price', '25986', 'change', '-0.18'),
    'sensex', jsonb_build_object('price', '85107', 'change', '-0.04'),
    'usdInr', jsonb_build_object('price', '89.95', 'change', '0.46'),
    'gold', jsonb_build_object('price', '4235', 'change', '1.15'),
    'brent', jsonb_build_object('price', '63.16', 'change', '1.14')
  )
) ON CONFLICT DO NOTHING;

-- Insert sample news articles
INSERT INTO news_articles (title, source, link, sentiment, category) VALUES
('Market rallies on positive earnings', 'Reuters', 'https://example.com/1', 'positive', 'corporate'),
('RBI raises interest rates', 'CNBC', 'https://example.com/2', 'negative', 'debt'),
('Gold prices stable amid inflation', 'Bloomberg', 'https://example.com/3', 'neutral', 'commodity')
ON CONFLICT (link) DO NOTHING;

-- ============================================
-- 10. VERIFICATION QUERIES
-- ============================================

-- Check tables created
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public';

-- Check RLS policies
-- SELECT * FROM pg_policies;

-- Check indexes
-- SELECT indexname FROM pg_indexes 
-- WHERE schemaname = 'public';

-- ============================================
-- NOTES FOR FREE TIER
-- ============================================
-- Storage: 500 MB (sufficient for ~50k market snapshots + news)
-- Bandwidth: 2 GB/month (sufficient for ~100k API calls)
-- Database: PostgreSQL 15
-- Connections: 10 concurrent
-- Auto-cleanup: Run delete functions monthly to stay within limits
