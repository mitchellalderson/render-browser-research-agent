import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  browserbase: {
    apiKey: process.env.BROWSERBASE_API_KEY || '',
    projectId: process.env.BROWSERBASE_PROJECT_ID || '',
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  },
  scraping: {
    defaultMaxPages: 5,
    timeout: 30000, // 30 seconds per page
  },
} as const;

// Validate required environment variables
export function validateConfig(): void {
  const requiredVars = [
    'BROWSERBASE_API_KEY',
    'BROWSERBASE_PROJECT_ID',
    'ANTHROPIC_API_KEY',
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.warn(
      `Warning: Missing environment variables: ${missing.join(', ')}`
    );
    console.warn('Please set these variables in your .env file');
  }
}

