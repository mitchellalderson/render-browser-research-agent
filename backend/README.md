# Backend - Web Scraper & Summarizer AI Agent

Node.js + Express.js + TypeScript backend for web scraping and AI summarization.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
- `BROWSERBASE_API_KEY` - Get from [Browserbase](https://browserbase.com)
- `BROWSERBASE_PROJECT_ID` - Your Browserbase project ID
- `ANTHROPIC_API_KEY` - Get from [Anthropic Console](https://console.anthropic.com)

3. Run in development mode:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run type-check` - Check TypeScript types without building

## API Endpoints

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-22T..."
}
```

### WebSocket Connection
Connect to `ws://localhost:3001` for real-time scraping updates

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Express app entry point
│   ├── routes/               # API routes
│   ├── services/             # Business logic services
│   │   ├── browserbase.service.ts
│   │   ├── crawler.service.ts
│   │   ├── anthropic.service.ts
│   │   └── websocket.service.ts
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   └── config/               # Configuration
├── dist/                     # Compiled JavaScript (git-ignored)
└── package.json
```

