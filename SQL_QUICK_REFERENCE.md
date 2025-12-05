# SQL Quick Reference

## Copy-Paste Ready SQL Commands

### 1. Create Tables (Run First)

```sql
-- Market snapshots table
CREATE TABLE IF NOT EXISTS market_snapshots (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- News articles table
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
```

### 2. Create Indexes (Run Second)

```sql
CREATE INDEX IF NOT EXISTS idx_market_snapshots_timestamp 
ON market_snapshots(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_news_articles_created_at 
ON news_articles(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_news_articles_category 
ON news_articles(category);
```

### 3. Enable RLS (Run Third)

```sql
ALTER TABLE market_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
```

### 4. Create Policies (Run Fourth)

```sql
-- Market snapshots policies
CREATE POLICY "Allow public read market_snapshots" 
ON market_snapshots FOR SELECT USING (true);

CREATE POLICY "Allow service role write market_snapshots" 
ON market_snapshots FOR INSERT WITH CHECK (true);

-- News articles policies
CREATE POLICY "Allow public read news_articles" 
ON news_articles FOR SELECT USING (true);

CREATE POLICY "Allow service role write news_articles" 
ON news_articles FOR INSERT WITH CHECK (true);
```

### 5. Insert Sample Data (Optional)

```sql
-- Sample market snapshot
INSERT INTO market_snapshots (data) VALUES (
  jsonb_build_object(
    'nifty', jsonb_build_object('price', '25986', 'change', '-0.18'),
    'sensex', jsonb_build_object('price', '85107', 'change', '-0.04'),
    'usdInr', jsonb_build_object('price', '89.95', 'change', '0.46'),
    'gold', jsonb_build_object('price', '4235', 'change', '1.15'),
    'brent', jsonb_build_object('price', '63.16', 'change', '1.14')
  )
);

-- Sample news articles
INSERT INTO news_articles (title, source, link, sentiment, category) VALUES
('Market rallies on positive earnings', 'Reuters', 'https://example.com/1', 'positive', 'corporate'),
('RBI raises interest rates', 'CNBC', 'https://example.com/2', 'negative', 'debt'),
('Gold prices stable amid inflation', 'Bloomberg', 'https://example.com/3', 'neutral', 'commodity');
```

---

## Common Queries

### Get Latest Market Data

```sql
SELECT * FROM market_snapshots
ORDER BY timestamp DESC
LIMIT 1;
```

### Get Recent News (Last 7 Days)

```sql
SELECT * FROM news_articles
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### Get News by Category

```sql
SELECT * FROM news_articles
WHERE category = 'corporate'
ORDER BY created_at DESC
LIMIT 50;
```

### Get News by Sentiment

```sql
SELECT * FROM news_articles
WHERE sentiment = 'positive'
ORDER BY created_at DESC
LIMIT 50;
```

### Get Market Data for Date Range

```sql
SELECT * FROM market_snapshots
WHERE timestamp BETWEEN '2024-01-01' AND '2024-01-31'
ORDER BY timestamp DESC;
```

### Count News by Category

```sql
SELECT category, COUNT(*) as count
FROM news_articles
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY category;
```

### Count News by Sentiment

```sql
SELECT sentiment, COUNT(*) as count
FROM news_articles
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY sentiment;
```

---

## Maintenance Queries

### Delete Old Market Snapshots (Older than 90 days)

```sql
DELETE FROM market_snapshots
WHERE created_at < NOW() - INTERVAL '90 days';
```

### Delete Old News Articles (Older than 30 days)

```sql
DELETE FROM news_articles
WHERE created_at < NOW() - INTERVAL '30 days';
```

### Check Table Sizes

```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check Row Counts

```sql
SELECT 
  'market_snapshots' as table_name,
  COUNT(*) as row_count
FROM market_snapshots
UNION ALL
SELECT 
  'news_articles' as table_name,
  COUNT(*) as row_count
FROM news_articles;
```

---

## Verification Queries

### Check Tables Exist

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Check Indexes

```sql
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY indexname;
```

### Check RLS Policies

```sql
SELECT * FROM pg_policies
WHERE schemaname = 'public';
```

### Check Constraints

```sql
SELECT constraint_name, table_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public';
```

---

## Troubleshooting Queries

### Find Duplicate News Links

```sql
SELECT link, COUNT(*) as count
FROM news_articles
WHERE link IS NOT NULL
GROUP BY link
HAVING COUNT(*) > 1;
```

### Find Orphaned Records

```sql
-- News articles with no category
SELECT * FROM news_articles
WHERE category IS NULL;

-- News articles with no sentiment
SELECT * FROM news_articles
WHERE sentiment IS NULL;
```

### Check Last Update Time

```sql
SELECT 
  'market_snapshots' as table_name,
  MAX(created_at) as last_update
FROM market_snapshots
UNION ALL
SELECT 
  'news_articles' as table_name,
  MAX(created_at) as last_update
FROM news_articles;
```

---

## Performance Tips

### Add Composite Index for Common Queries

```sql
CREATE INDEX IF NOT EXISTS idx_news_category_created 
ON news_articles(category, created_at DESC);
```

### Analyze Query Performance

```sql
EXPLAIN ANALYZE
SELECT * FROM news_articles
WHERE category = 'corporate'
ORDER BY created_at DESC
LIMIT 50;
```

### Vacuum and Analyze (Maintenance)

```sql
VACUUM ANALYZE market_snapshots;
VACUUM ANALYZE news_articles;
```

---

## How to Use in Supabase

1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Click "New Query"
4. Copy-paste SQL from above
5. Click "Run"
6. View results

**Pro Tip**: Save frequently used queries as "Saved Queries" in Supabase for quick access.
