# Backend Services Documentation

This directory contains the core business logic services for the Web Research Agent.

---

## Services Overview

### 1. WebSocket Service (`websocket.service.ts`)

Manages real-time communication between the server and clients.

**Key Features:**
- Client connection management
- Message broadcasting
- Status update delivery
- Error handling
- Client ID tracking

**Methods:**
- `sendStatusUpdate(ws, message, progress, currentPage)` - Send progress updates
- `sendSummary(ws, summary, pagesAnalyzed)` - Send final summary
- `sendError(ws, message)` - Send error messages
- `broadcast(message)` - Send to all connected clients

---

### 2. Browserbase Service (`browserbase.service.ts`)

Interfaces with Browserbase cloud browser infrastructure.

**Key Features:**
- Browser session creation
- CDP (Chrome DevTools Protocol) connection
- Session management
- Configuration validation

**Methods:**
- `createSession()` - Create new browser session
- `getSession(sessionId)` - Retrieve session info
- `endSession(sessionId)` - Cleanup session
- `getConnectUrl(sessionId)` - Get WebSocket connection URL
- `isConfigured()` - Check if API keys are set

**Environment Variables:**
- `BROWSERBASE_API_KEY`
- `BROWSERBASE_PROJECT_ID`

---

### 3. Crawler Service (`crawler.service.ts`)

Handles web page crawling and content extraction.

**Key Features:**
- Breadth-first search (BFS) crawling
- Same-domain link filtering
- Content extraction (titles, text, links)
- Real-time progress updates
- Error recovery
- Configurable page limits

**Methods:**
- `crawl(options)` - Main crawling method
- `scrapePage(page, url)` - Extract content from single page
- `extractLinks(html, currentUrl, baseUrl)` - Find and filter links
- `cleanText(text)` - Clean and truncate text content

**Options:**
```typescript
{
  url: string;        // Starting URL
  maxPages: number;   // Maximum pages to crawl
  ws: WebSocket;      // WebSocket for updates
}
```

**Returns:**
```typescript
PageData[] = [{
  url: string;
  title: string;
  content: string;
  timestamp: number;
}]
```

---

### 4. Anthropic Service (`anthropic.service.ts`)

Integrates with Anthropic Claude AI for intelligent content analysis.

**Key Features:**
- Multi-model support (Sonnet, Haiku, Opus)
- Intelligent prompt engineering
- Structured output parsing
- Comprehensive analysis

**Methods:**
- `summarizeWebPages(pages, originalUrl)` - Generate AI summary
- `buildSummaryPrompt(pages, url)` - Create analysis prompt
- `parseResponse(text)` - Parse structured output
- `isConfigured()` - Check if API key is set
- `getModel()` - Get current model name

**Output Structure:**
```typescript
{
  summary: string;           // Full formatted summary
  companyOverview?: string;  // Company description
  productsServices?: string[]; // List of offerings
  keyFeatures?: string[];    // Notable features
  industryCategory?: string; // Industry classification
  targetAudience?: string;   // Target customers
  insights: string;          // Key observations
}
```

**Analysis Sections:**
1. **Company/Website Overview** - What the company does
2. **Products & Services** - Main offerings
3. **Key Features** - Notable capabilities
4. **Industry & Category** - Business classification
5. **Target Audience** - Primary customers
6. **Overall Insights** - Strategic observations

**Supported Models:**
- `claude-3-5-sonnet-20241022` (default) - Best balance
- `claude-3-5-haiku-20241022` - Fastest & cheapest
- `claude-3-opus-20240229` - Most capable

**Environment Variables:**
- `ANTHROPIC_API_KEY` (required)
- `ANTHROPIC_MODEL` (optional, defaults to Sonnet)

---

## Service Architecture

```
                    ┌─────────────┐
                    │   Client    │
                    └──────┬──────┘
                           │
                    WebSocket (ws)
                           │
                    ┌──────▼──────┐
                    │  WebSocket  │
                    │   Service   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Index.ts  │
                    │   (Router)  │
                    └──┬────┬────┬┘
                       │    │    │
        ┌──────────────┘    │    └────────────┐
        │                   │                  │
  ┌─────▼─────┐      ┌─────▼─────┐     ┌─────▼─────┐
  │  Crawler  │      │Browserbase│     │ Anthropic │
  │  Service  │◄─────┤  Service  │     │  Service  │
  └───────────┘      └───────────┘     └───────────┘
        │                   │                  │
        │            ┌──────▼──────┐          │
        └───────────►│  Playwright │          │
                     │   Browser   │          │
                     └─────────────┘          │
                                              │
                                       ┌──────▼──────┐
                                       │   Claude    │
                                       │     AI      │
                                       └─────────────┘
```

---

## Usage Example

```typescript
// Initialize services
const wsService = new WebSocketService(wss);
const browserbaseService = new BrowserbaseService();
const crawlerService = new CrawlerService(browserbaseService, wsService);
const anthropicService = new AnthropicService();

// Handle scrape request
wss.on('scrape_request', async ({ ws, data }) => {
  const { url, maxPages } = data;
  
  // 1. Crawl pages
  const pages = await crawlerService.crawl({ url, maxPages, ws });
  
  // 2. Generate AI summary
  const summary = await anthropicService.summarizeWebPages(pages, url);
  
  // 3. Send result
  wsService.sendSummary(ws, summary.summary, pages.length);
});
```

---

## Error Handling

All services include comprehensive error handling:

- **Browserbase Service**: Validates API credentials, handles session failures
- **Crawler Service**: Continues on individual page errors, handles timeouts
- **Anthropic Service**: Provides fallback if API key not configured
- **WebSocket Service**: Safely handles disconnections and errors

---

## Configuration

Services are configured via environment variables (see `config/index.ts`):

```typescript
{
  browserbase: {
    apiKey: string;
    projectId: string;
  },
  anthropic: {
    apiKey: string;
    model: string;
  },
  scraping: {
    defaultMaxPages: 5;
    timeout: 30000;
  }
}
```

---

## Testing

Each service can be tested independently:

```typescript
// Test Browserbase
const bb = new BrowserbaseService();
const sessionId = await bb.createSession();

// Test Crawler
const pages = await crawlerService.crawl({
  url: 'https://example.com',
  maxPages: 2,
  ws: mockWebSocket
});

// Test Anthropic
const summary = await anthropicService.summarizeWebPages(pages, url);
```

---

## Performance Considerations

- **Crawler**: Limits to 5 pages by default, adds 1s delay between requests
- **Anthropic**: Truncates page content to 3000 chars per page for API efficiency
- **WebSocket**: Batches updates to avoid overwhelming clients
- **Browserbase**: Automatically cleans up sessions after use

---

## Future Enhancements

Potential improvements:
- [ ] Streaming AI responses
- [ ] Parallel page crawling
- [ ] Caching for repeated URLs
- [ ] Advanced link prioritization
- [ ] Screenshot capture
- [ ] PDF generation
- [ ] Multi-language support

---

For more details, see the individual service files and inline documentation.

