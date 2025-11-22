# Frontend - Web Scraper & Summarizer AI Agent

Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui frontend with Render.com-inspired design.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` if needed (defaults should work for local development).

3. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

4. Build for production:
```bash
npm run build
npm start
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features

- Clean chatbot-style interface
- Real-time scraping progress updates
- URL validation
- Responsive design
- Render.com-inspired modern UI

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Icons:** Lucide React

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx              # Main chat interface
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # shadcn components
│   ├── chat/                 # Chat-specific components
│   └── layout/               # Layout components
├── lib/
│   ├── api.ts                # API client
│   ├── websocket.ts          # WebSocket client
│   └── utils.ts              # Utility functions
└── types/
    └── index.ts              # TypeScript types
```
