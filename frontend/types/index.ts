export interface Message {
  id: string;
  type: 'user' | 'bot' | 'status';
  content: string;
  timestamp: number;
}

export interface ScrapeRequest {
  url: string;
  maxPages?: number;
}

export interface ChatRequest {
  question: string;
  sessionId: string;
}

export interface StatusUpdate {
  message: string;
  progress: number;
  currentPage: string;
}

export interface Summary {
  summary: string;
  pagesAnalyzed: number;
  sessionId?: string;
}

export interface ChatResponse {
  answer: string;
}

export interface WebSocketMessage {
  type: 'status_update' | 'summary' | 'error' | 'chat_response';
  data: StatusUpdate | Summary | ChatResponse | { message: string };
}

export interface Session {
  id: string;
  url: string;
  pagesAnalyzed: number;
  active: boolean;
}

