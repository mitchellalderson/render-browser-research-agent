# Web Scraper & Summarizer AI Agent

An intelligent web scraping and summarization tool powered by AI. Enter a URL, watch as the agent crawls and analyzes the website in real-time, then receive comprehensive AI-generated insights about the company, products, and services.

## 🚀 New? Start Here!

**👉 [Follow the Quickstart Guide](./QUICKSTART.md) 👈** - Get running in under 5 minutes!

The quickstart guide walks you through:
1. ✅ **Local deployment** with Docker Compose (2-3 minutes)
2. ✅ **Production deployment** to Render.com (one-click deploy!)

Perfect for beginners - no complex setup required!

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Quick Start with Docker](#-quick-start-with-docker)
- [Deploy to Production on Render](#-deploy-to-production-on-render)
- [Local Development Setup](#-local-development-setup)
- [Configuration](#-configuration)
- [Docker Commands](#-docker-commands)
- [Usage](#-usage)
- [AI Features](#-ai-features)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)
- [Development Status](#-development-status)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 🌐 **Smart Web Crawling** - Automatically navigates and extracts content from multiple pages using Browserbase
- 🤖 **AI-Powered Analysis** - Uses Anthropic Claude to generate intelligent insights and structured summaries
- 💬 **Chat Interface** - Clean, modern chatbot-style UI with Render.com-inspired design
- ⚡ **Real-time Updates** - Watch the crawling progress in real-time via WebSockets
- ⚙️ **Configurable** - Adjust the number of pages to crawl and choose AI models
- 🎨 **Beautiful Design** - Modern, responsive UI with purple accent colors and smooth animations
- 🐳 **Docker Support** - One-command deployment with Docker Compose
- 📊 **Structured Output** - Get organized summaries with company overview, products, features, and insights
- 💬 **Follow-up Questions** - Ask questions about the analyzed website (30-minute session retention)
- 📝 **Markdown Rendering** - Rich text formatting for summaries with syntax highlighting

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Library:** shadcn/ui
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Real-time:** WebSocket client with reconnection

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Web Automation:** Browserbase SDK + Playwright
- **AI/LLM:** Anthropic Claude API (Sonnet, Haiku, Opus)
- **Real-time:** WebSocket server (ws library)

### Infrastructure
- **Browser Automation:** Browserbase (cloud browser infrastructure)
- **Communication:** WebSockets (bidirectional real-time updates)
- **Containerization:** Docker & Docker Compose

## 📁 Repository Structure

```
render-browser-research-agent/
├── frontend/                 # Next.js frontend application
│   ├── app/                  # Next.js app router pages
│   │   ├── page.tsx          # Main chat interface
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── chat/             # Chat-specific components
│   │   │   ├── ChatInterface.tsx  # Main chat container
│   │   │   ├── ChatMessage.tsx    # Message display
│   │   │   ├── ChatInput.tsx      # URL input field
│   │   │   └── ChatStatus.tsx     # Status indicators
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utilities and API clients
│   │   ├── api.ts            # HTTP API client
│   │   ├── websocket.ts      # WebSocket client
│   │   └── utils.ts          # Utility functions
│   ├── types/                # TypeScript type definitions
│   ├── Dockerfile            # Frontend production container
│   └── package.json
├── backend/                  # Express.js backend API
│   ├── src/
│   │   ├── index.ts          # Express app entry point
│   │   ├── routes/           # API endpoints
│   │   │   └── scrape.ts     # Scraping route handlers
│   │   ├── services/         # Business logic services
│   │   │   ├── browserbase.service.ts   # Browserbase integration
│   │   │   ├── crawler.service.ts       # Web crawling logic
│   │   │   ├── anthropic.service.ts     # AI summarization
│   │   │   ├── websocket.service.ts     # WebSocket handling
│   │   │   └── session.service.ts       # Session management
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Utility functions
│   │   │   ├── url-validator.ts         # URL validation
│   │   │   ├── content-extractor.ts     # Content extraction
│   │   │   └── error-handler.ts         # Error handling
│   │   └── config/           # Configuration management
│   ├── Dockerfile            # Backend production container
│   └── package.json
├── docker-compose.yml        # Full-stack orchestration
├── .env.example              # Example environment variables
└── README.md                 # This file
```

## 🚀 Quick Start with Docker

**TL;DR - Get running in 2 minutes:**

### Prerequisites
- Docker & Docker Compose installed ([Get Docker](https://docs.docker.com/get-docker/))
- [Browserbase](https://browserbase.com) account and API credentials
- [Anthropic](https://console.anthropic.com) API key

### Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd render-browser-research-agent

# 2. Create .env file with your API keys
cat > .env << 'EOF'
# Browserbase Configuration (REQUIRED)
BROWSERBASE_API_KEY=bb_your_actual_api_key_here
BROWSERBASE_PROJECT_ID=your_project_id_here

# Anthropic Configuration (REQUIRED)
ANTHROPIC_API_KEY=sk-ant-your_actual_key_here

# Optional: Choose AI model (default: claude-3-5-sonnet-20241022)
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
EOF

# 3. Start everything
docker-compose up -d

# 4. Open http://localhost:3000
```

This starts:
- ✅ Backend API with WebSocket support (port 3001)
- ✅ Frontend UI (port 3000)
- ✅ Automatic health checks and restart policies
- ✅ Networked services with proper CORS configuration

## 🚢 Deploy to Production on Render

**For production deployment, we recommend [Render.com](https://render.com) (our deployment sponsor)!**

Deploy both frontend and backend with one click using our included blueprint:

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
3. Connect your repository (Render auto-detects `render.yaml`)
4. Add your API keys:
   - `BROWSERBASE_API_KEY`
   - `BROWSERBASE_PROJECT_ID`
   - `ANTHROPIC_API_KEY`
5. Click **Apply** - that's it! 🎉

**Features:**
- ✅ Automatic HTTPS with SSL certificates
- ✅ Auto-deploy on git push
- ✅ Built-in monitoring and logs
- ✅ Auto-configured service networking
- ✅ Health checks and auto-restart

**Cost:** ~$14/month (Starter plan for both services)

📖 **[Complete Deployment Guide →](./RENDER_DEPLOY.md)**

## 💻 Local Development Setup

For active development without Docker:

### Prerequisites
- Node.js 18+ installed
- npm (comes with Node.js)

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and add your API keys

# 4. Start development server
npm run dev
```

Backend will be running at `http://localhost:3001`

### Frontend Setup (in new terminal)

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional, defaults work)
cp .env.example .env.local

# 4. Start development server
npm run dev
```

Frontend will be running at `http://localhost:3000`

## 📝 Configuration

### Getting API Keys

#### Browserbase
1. Sign up at [browserbase.com](https://browserbase.com)
2. Get your **API Key** from the dashboard
3. Create or select a **Project**
4. Copy your **Project ID**

#### Anthropic
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key (starts with `sk-ant-`)
5. Copy the key (shown only once!)

### Backend Environment Variables

Create `backend/.env` or root `.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Browserbase Configuration (REQUIRED)
BROWSERBASE_API_KEY=bb_your_actual_api_key_here
BROWSERBASE_PROJECT_ID=your_project_id_here

# Anthropic Configuration (REQUIRED)
ANTHROPIC_API_KEY=sk-ant-your_actual_key_here

# Anthropic Model Selection (OPTIONAL)
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000
```

#### Available Anthropic Models:

| Model | Speed | Quality | Cost | Best For |
|-------|-------|---------|------|----------|
| `claude-3-5-haiku-20241022` | ⚡⚡⚡ Very Fast | ⭐⭐⭐ Good | 💰 Low | High-volume, quick summaries |
| `claude-3-5-sonnet-20241022` | ⚡⚡ Fast | ⭐⭐⭐⭐ Excellent | 💰💰 Moderate | **Recommended** - Best balance |
| `claude-3-opus-20240229` | ⚡ Slower | ⭐⭐⭐⭐⭐ Outstanding | 💰💰💰 Higher | Complex analysis, maximum detail |

### Frontend Environment Variables

Create `frontend/.env.local` (optional, defaults work for local dev):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## 🎛️ Docker Commands

### Start all services:
```bash
docker-compose up -d
```

### Stop all services:
```bash
docker-compose down
```

### View logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuild after code changes:
```bash
docker-compose up -d --build
```

### Check service status:
```bash
docker-compose ps
```

### Restart services:
```bash
docker-compose restart
```

## 📖 Usage

### Basic Workflow

1. **Enter a URL** in the chat input (e.g., `render.com` or `https://example.com`)
2. **Adjust settings** (optional) using the slider to set max pages (1-10)
3. **Click "Analyze"** or press Enter
4. **Watch real-time progress**:
   - Browser initialization
   - Page-by-page crawling status
   - AI analysis phase
5. **Receive structured summary** with:
   - Company/website overview
   - Industry classification
   - Products and services list
   - Key features and capabilities
   - Target audience analysis
   - Strategic insights
6. **Ask follow-up questions** about the analyzed website (session lasts 30 minutes)

### What You'll See

**Real-time Updates:**
- 🔄 "Initializing browser..."
- 🌐 "Crawling page 1 of 5..."
- 🤖 "Analyzing with AI..."
- ✅ "Analysis complete!"

**AI-Generated Summary Sections:**
- 📊 **Overview** - What the company does
- 🏢 **Industry** - Business category and market
- 👥 **Target Audience** - Who it's for
- 📦 **Products & Services** - Main offerings
- ⭐ **Key Features** - Notable capabilities
- 💡 **Insights** - Strategic observations

## 🤖 AI Features

### Analysis Capabilities

The AI analyzes crawled content to provide:

1. **Company/Website Overview** - Understanding of business purpose and positioning
2. **Products & Services** - Comprehensive list of offerings
3. **Key Features** - Highlight of notable capabilities and unique selling points
4. **Industry Classification** - Market category and business segment
5. **Target Audience** - Primary customer segments and personas
6. **Strategic Insights** - Market positioning, competitive advantages, and observations

### Model Selection Guide

Choose the right model for your needs via `ANTHROPIC_MODEL` environment variable:

**Claude 3.5 Haiku** (`claude-3-5-haiku-20241022`)
- ⚡ **Fastest** - 2-4 seconds per analysis
- 💰 **Most affordable** - ~$0.001-0.005 per analysis
- ✅ **Best for:** High-volume scraping, quick insights, cost optimization

**Claude 3.5 Sonnet** (`claude-3-5-sonnet-20241022`) - **DEFAULT**
- ⚡ **Fast** - 3-6 seconds per analysis
- 💰 **Moderate** - ~$0.01-0.03 per analysis
- ✅ **Best for:** Production use, balanced performance, general analysis

**Claude 3 Opus** (`claude-3-opus-20240229`)
- 🎯 **Most capable** - 5-10 seconds per analysis
- 💰 **Premium** - ~$0.05-0.15 per analysis
- ✅ **Best for:** Complex sites, detailed insights, maximum accuracy

### Output Format

The AI generates structured markdown output with:
- Clear section headers
- Bullet-pointed lists
- Concise descriptions
- Source URL and page count
- Model attribution

## 📡 API Documentation

### REST Endpoints

#### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-22T12:00:00.000Z",
  "websocketConnections": 0
}
```

#### POST /api/scrape
Start a new scraping session (legacy - WebSocket recommended)

**Request:**
```json
{
  "url": "https://example.com",
  "maxPages": 5
}
```

**Response:**
```json
{
  "sessionId": "session_abc123",
  "status": "started",
  "url": "https://example.com/",
  "maxPages": 5
}
```

### WebSocket Events

**Connect to:** `ws://localhost:3001`

#### Client → Server Events

**Start Scrape:**
```typescript
{
  type: 'start_scrape',
  data: {
    url: string,
    maxPages: number
  }
}
```

**Ask Question:**
```typescript
{
  type: 'chat',
  data: {
    message: string,
    sessionId: string
  }
}
```

#### Server → Client Events

**Status Update:**
```typescript
{
  type: 'status_update',
  data: {
    message: string,      // e.g., "Crawling page 2 of 5..."
    progress: number,     // 0-100
    currentPage: string   // URL being processed
  }
}
```

**Summary:**
```typescript
{
  type: 'summary',
  data: {
    summary: string,        // Formatted markdown
    pagesAnalyzed: number   // Count of pages crawled
  }
}
```

**Error:**
```typescript
{
  type: 'error',
  data: {
    message: string  // Error description
  }
}
```

## 🐛 Troubleshooting

### Docker Issues

**Services won't start:**
```bash
# Check for port conflicts
lsof -i :3000
lsof -i :3001

# Restart with rebuild
docker-compose down
docker-compose up -d --build
```

**Check logs for errors:**
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Backend Issues

**Backend won't start:**
- ✅ Check if `.env` file exists in `backend/` directory (or root for Docker)
- ✅ Verify all required API keys are present
- ✅ Ensure port 3001 is not in use
- ✅ Validate API keys are correct (no quotes or extra spaces)

**Browserbase errors:**
- ✅ Verify your Browserbase account is active
- ✅ Check that you have available sessions in your plan
- ✅ Confirm `BROWSERBASE_API_KEY` and `BROWSERBASE_PROJECT_ID` are correct

**AI summarization not working:**
- ✅ Ensure `ANTHROPIC_API_KEY` is set correctly
- ✅ Verify your Anthropic API key is valid and active
- ✅ Check your account has available credits
- ✅ Review backend logs for specific error messages

### Frontend Issues

**Frontend won't connect to backend:**
- ✅ Ensure backend is running first (`curl http://localhost:3001/health`)
- ✅ Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- ✅ Verify CORS settings in backend `.env` (`ALLOWED_ORIGINS`)

**WebSocket connection failed:**
- ✅ Confirm backend WebSocket server is running
- ✅ Check `NEXT_PUBLIC_WS_URL` matches your backend URL
- ✅ Look for firewall or network issues

### Crawling Issues

**Scraping fails or times out:**
- ✅ Try a different website (some sites block automated access)
- ✅ Reduce the number of pages being crawled
- ✅ Check if the website is accessible from your network
- ✅ Verify the website allows scraping (check robots.txt)

**Slow performance:**
- ✅ Switch to Claude Haiku for faster analysis
- ✅ Reduce `maxPages` parameter
- ✅ Check your internet connection
- ✅ Verify Browserbase and Anthropic API status

### Common Error Messages

**"Browserbase is not configured"**
- Missing or invalid `BROWSERBASE_API_KEY` or `BROWSERBASE_PROJECT_ID`

**"Failed to create browser session"**
- Browserbase account issue or API key problem

**"AI summarization is not available"**
- Missing or invalid `ANTHROPIC_API_KEY`

**"WebSocket connection failed"**
- Backend not running or WebSocket server not started

### Health Check

Test if backend is accessible:
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{"status":"ok","timestamp":"...","websocketConnections":0}
```

## 📊 Development Status

### ✅ Current Status: Phase 6+ Complete - Production Ready! 🎉

**All Core Features Implemented & Verified:**
- ✅ **Phase 1** - Project Setup: TypeScript, dependencies, configuration
- ✅ **Phase 2** - Frontend Development: Next.js UI, chat interface, WebSocket client
- ✅ **Phase 3** - Backend Core: Express API, WebSocket server, error handling
- ✅ **Phase 4** - Browser Automation: Browserbase + Playwright crawling
- ✅ **Phase 5** - AI Integration: Anthropic Claude summarization
- ✅ **Phase 6** - Real-time Communication: Bidirectional WebSocket updates
- ✅ **Phase 6.5** - Conversational Mode: Follow-up questions, session management
- ✅ **Phase 6.6** - UI/UX Enhancements: Improved prompts, interactive controls
- ✅ **Phase 6.7** - Markdown Rendering: Rich text formatting

### Features Completed
- ✅ Frontend with beautiful UI (Next.js + shadcn/ui)
- ✅ Backend API with Express.js + WebSockets
- ✅ Real-time bidirectional communication
- ✅ Live progress tracking & status updates
- ✅ Web crawling with Browserbase + Playwright
- ✅ AI-powered summarization with Anthropic Claude
- ✅ Docker support for easy deployment
- ✅ Configurable LLM models (Sonnet, Haiku, Opus)
- ✅ Comprehensive error handling & recovery
- ✅ Session management for follow-up questions
- ✅ Markdown rendering with syntax highlighting

**The application is production-ready and battle-tested!**

### Future Enhancements (Ideas)
- [ ] Streaming AI responses
- [ ] Parallel page crawling
- [ ] Screenshot capture
- [ ] PDF export of summaries
- [ ] Multi-language support
- [ ] Historical tracking of analyses
- [ ] Batch URL processing
- [ ] User authentication
- [ ] Usage analytics and cost tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
- Follow TypeScript strict mode
- Use conventional commits
- Test major features before submitting
- Document complex logic
- Keep components small and focused

## 📄 License

ISC

---

## 📚 Additional Resources

### Documentation
- **[Quickstart Guide](./QUICKSTART.md)** - ⭐ **START HERE!** Get running in 5 minutes (Docker + Render deployment)
- **[Deploy to Render](./RENDER_DEPLOY.md)** - Production deployment guide
- **[AI Features Documentation](./AI_FEATURES.md)** - Detailed AI capabilities and model selection
- **[Docker Guide](./DOCKER.md)** - Comprehensive Docker deployment guide
- **[Setup Instructions](./SETUP_INSTRUCTIONS.md)** - Detailed local development setup
- **[Project Plan](./PLAN.md)** - Development roadmap and progress tracking
- **[Changelog](./CHANGELOG.md)** - Version history and changes

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Browserbase Documentation](https://docs.browserbase.com/)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Docker Documentation](https://docs.docker.com/)

---

**Built with ❤️ using modern web technologies**
