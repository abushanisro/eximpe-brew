// Security configuration for production

export const securityConfig = {
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Too many requests, please try again later'
  },

  // CORS
  cors: {
    development: ['http://localhost:5173', 'http://localhost:3001'],
    production: (process.env.CORS_ORIGIN || 'https://yourdomain.com').split(',')
  },

  // Security headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  },

  // API validation
  validation: {
    maxJsonSize: '10kb',
    maxUrlEncodedSize: '10kb'
  },

  // Timeout settings
  timeout: {
    apiCall: 15000, // 15 seconds
    database: 10000  // 10 seconds
  }
};

export default securityConfig;
