-- Create news_cache table for storing categorized news
CREATE TABLE IF NOT EXISTS news_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  link TEXT,
  sentiment VARCHAR(20) DEFAULT 'neutral',
  category VARCHAR(20) NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_news UNIQUE(title, source, published_at)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_news_category ON news_cache(category);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news_cache(published_at DESC);

-- Cleanup function (removes news older than 1 month)
CREATE OR REPLACE FUNCTION cleanup_old_news()
RETURNS void AS $$
BEGIN
  DELETE FROM news_cache WHERE created_at < NOW() - INTERVAL '1 month';
END;
$$ LANGUAGE plpgsql;
