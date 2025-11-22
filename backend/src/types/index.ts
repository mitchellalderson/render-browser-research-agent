export interface ScrapeRequest {
  url: string;
  maxPages?: number;
}

export interface ChatRequest {
  question: string;
  sessionId: string;
}

export interface ScrapeResponse {
  sessionId: string;
  status: 'started';
}

export interface StatusUpdate {
  type: 'status_update';
  data: {
    message: string;
    progress: number;
    currentPage: string;
  };
}

export interface SummaryMessage {
  type: 'summary';
  data: {
    summary: string;
    pagesAnalyzed: number;
    sessionId?: string;
    pagesData?: PageData[];
  };
}

export interface ChatResponseMessage {
  type: 'chat_response';
  data: {
    answer: string;
  };
}

export interface ErrorMessage {
  type: 'error';
  data: {
    message: string;
  };
}

export interface PageData {
  url: string;
  title: string;
  content: string;
  timestamp: number;
}

export interface CrawlSession {
  id: string;
  url: string;
  pages: PageData[];
  createdAt: number;
}

export type WebSocketMessage = StatusUpdate | SummaryMessage | ChatResponseMessage | ErrorMessage;

