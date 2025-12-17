import express from 'express';
import cors from 'cors';
import env from './config/environment.js';
import marketRoutes from './routes/market.js';
import newsRoutes from './routes/news.js';
import supabaseNewsRoutes from './routes/supabaseNews.js';

const app = express();

// CORS Configuration
const corsOptions = {
  origin: env.isProduction ? env.corsOrigin : env.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.set('trust proxy', 1);

// Request logging
app.use((req, res, next) => {
  if (env.isDevelopment) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next()
});

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  if (env.isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Routes
app.use('/api/market', marketRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/supabase-news', supabaseNewsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = err.statusCode || 500;
  const message = env.isProduction ? 'Internal server error' : err.message;
  res.status(statusCode).json({ success: false, error: message });
});

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
  console.log(`Environment: ${env.nodeEnv}`);
  if (env.isDevelopment) {
    console.log('CORS origins:', env.corsOrigin);
  }
});
