import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { config, validateConfig } from './config';
import { WebSocketService} from './services/websocket.service';
import { BrowserbaseService } from './services/browserbase.service';
import { CrawlerService } from './services/crawler.service';
import { AnthropicService } from './services/anthropic.service';
import { SessionService } from './services/session.service';
import scrapeRoutes from './routes/scrape';
import { errorHandler, notFoundHandler } from './utils/error-handler';
import { validateAndNormalizeUrl } from './utils/url-validator';

// Validate configuration on startup
validateConfig();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Initialize services
const wsService = new WebSocketService(wss);
const browserbaseService = new BrowserbaseService();
const crawlerService = new CrawlerService(browserbaseService, wsService);
const anthropicService = new AnthropicService();
const sessionService = new SessionService();

// Cleanup expired sessions every 10 minutes
setInterval(() => {
  sessionService.cleanup();
}, 10 * 60 * 1000);

// Middleware
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    websocketConnections: wsService.getConnectedClientsCount(),
  });
});

// API routes
app.use('/api', scrapeRoutes);

// Handle scraping requests from WebSocket
wss.on('scrape_request', async ({ ws, data }) => {
  console.log('Scrape request received:', data);
  
  try {
    const { url, maxPages = 5 } = data;

    // Validate URL
    const validation = validateAndNormalizeUrl(url);
    if (!validation.isValid) {
      wsService.sendError(ws, validation.error || 'Invalid URL');
      return;
    }

    wsService.sendStatusUpdate(ws, 'Starting web scraping...', 0, validation.normalizedUrl!);

    // Perform crawling
    const pagesData = await crawlerService.crawl({
      url: validation.normalizedUrl!,
      maxPages,
      ws,
    });

    console.log(`✅ Crawl complete! Scraped ${pagesData.length} pages`);

    // Create session to store crawled data
    const sessionId = sessionService.createSession(validation.normalizedUrl!, pagesData);

    // Check if Anthropic is configured
    if (!anthropicService.isConfigured()) {
      const fallbackSummary = `Successfully crawled ${pagesData.length} page(s):\n\n${pagesData
        .map((page, i) => `${i + 1}. ${page.title}\n   ${page.url}`)
        .join('\n\n')}\n\n⚠️ AI summarization is not available. Please add ANTHROPIC_API_KEY to your .env file.`;
      
      wsService.sendSummary(ws, fallbackSummary, pagesData.length);
      return;
    }

    // Generate AI summary
    wsService.sendStatusUpdate(ws, 'Analyzing content with AI...', 95, '');
    
    const summaryResult = await anthropicService.summarizeWebPages(pagesData, validation.normalizedUrl!);
    
    // Format the summary for display
    const formattedSummary = `${summaryResult.summary}

---

**Pages Analyzed:** ${pagesData.length} | **Model:** ${anthropicService.getModel()}`;

    wsService.sendSummary(ws, formattedSummary, pagesData.length, sessionId);
  } catch (error) {
    console.error('Scraping error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred during scraping';
    wsService.sendError(ws, errorMessage);
  }
});

// Handle chat questions from WebSocket
wss.on('chat_question', async ({ ws, data }) => {
  console.log('Chat question received:', data);
  
  try {
    const { question, sessionId } = data;

    if (!question || !sessionId) {
      wsService.sendError(ws, 'Invalid chat request');
      return;
    }

    // Retrieve session
    const session = sessionService.getSession(sessionId);
    if (!session) {
      wsService.sendError(ws, 'Session expired. Please analyze a new website.');
      return;
    }

    // Check if Anthropic is configured
    if (!anthropicService.isConfigured()) {
      wsService.sendError(ws, 'AI service is not available');
      return;
    }

    // Send status
    wsService.sendStatusUpdate(ws, 'Thinking...', 50, '');

    // Get answer from AI
    const answer = await anthropicService.answerQuestion(
      question,
      session.pages,
      session.url
    );

    // Send response
    wsService.sendChatResponse(ws, answer);
  } catch (error) {
    console.error('Chat question error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';
    wsService.sendError(ws, errorMessage);
  }
});

// Error handling - must be last
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
server.listen(config.port, () => {
  console.log('\n🚀 Web Research Agent Backend Started!');
  console.log('==========================================');
  console.log(`📍 Port: ${config.port}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🌐 CORS: ${config.cors.allowedOrigins.join(', ')}`);
  console.log(`🔌 WebSocket: ws://localhost:${config.port}`);
  console.log(`💚 Health Check: http://localhost:${config.port}/health`);
  console.log('==========================================\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

