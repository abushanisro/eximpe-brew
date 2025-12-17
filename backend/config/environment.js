import { config } from 'dotenv';

// Load environment variables
config();

// Environment configuration with validation
const environment = {
  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001'],

  // Optional API Keys (not required for basic functionality)
  apiKeys: {
    newsApi: process.env.NEWSAPI_KEY || null,
    gNews: process.env.GNEWS_API_KEY || null,
    finnhub: process.env.FINNHUB_API_KEY || null,
  },

  // Feature flags
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
};

// Validation
const validateEnvironment = () => {
  const errors = [];

  if (environment.port < 1 || environment.port > 65535) {
    errors.push('PORT must be between 1 and 65535');
  }

  if (!['development', 'production', 'test'].includes(environment.nodeEnv)) {
    errors.push('NODE_ENV must be development, production, or test');
  }

  if (errors.length > 0) {
    console.error('Environment validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }
};

// Run validation
validateEnvironment();

export default environment;
