import { WebSocket, WebSocketServer } from 'ws';
import { WebSocketMessage, StatusUpdate, SummaryMessage, ChatResponseMessage, ErrorMessage } from '../types';

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Map<WebSocket, string> = new Map();

  constructor(wss: WebSocketServer) {
    this.wss = wss;
    this.setupWebSocketServer();
  }

  private setupWebSocketServer(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      const clientId = this.generateClientId();
      this.clients.set(ws, clientId);
      
      console.log(`Client connected: ${clientId}`);

      ws.on('message', (data: Buffer) => {
        this.handleMessage(ws, data);
      });

      ws.on('close', () => {
        console.log(`Client disconnected: ${clientId}`);
        this.clients.delete(ws);
      });

      ws.on('error', (error: Error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
      });

      // Send welcome message
      this.sendMessage(ws, {
        type: 'status_update',
        data: {
          message: 'Connected to Web Research Agent',
          progress: 0,
          currentPage: '',
        },
      });
    });
  }

  private handleMessage(ws: WebSocket, data: Buffer): void {
    try {
      const message = JSON.parse(data.toString());
      const clientId = this.clients.get(ws);

      console.log(`Received message from ${clientId}:`, message);

      // Emit event for services to handle
      if (message.type === 'start_scrape') {
        this.wss.emit('scrape_request', { ws, data: message.data });
      } else if (message.type === 'chat_question') {
        this.wss.emit('chat_question', { ws, data: message.data });
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
      this.sendError(ws, 'Invalid message format');
    }
  }

  sendMessage(ws: WebSocket, message: WebSocketMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  }

  sendStatusUpdate(ws: WebSocket, message: string, progress: number, currentPage: string): void {
    const statusUpdate: StatusUpdate = {
      type: 'status_update',
      data: {
        message,
        progress,
        currentPage,
      },
    };
    this.sendMessage(ws, statusUpdate);
  }

  sendSummary(ws: WebSocket, summary: string, pagesAnalyzed: number, sessionId?: string): void {
    const summaryMessage: SummaryMessage = {
      type: 'summary',
      data: {
        summary,
        pagesAnalyzed,
        sessionId,
      },
    };
    this.sendMessage(ws, summaryMessage);
  }

  sendChatResponse(ws: WebSocket, answer: string): void {
    const chatResponse: ChatResponseMessage = {
      type: 'chat_response',
      data: {
        answer,
      },
    };
    this.sendMessage(ws, chatResponse);
  }

  sendError(ws: WebSocket, message: string): void {
    const errorMessage: ErrorMessage = {
      type: 'error',
      data: {
        message,
      },
    };
    this.sendMessage(ws, errorMessage);
  }

  broadcast(message: WebSocketMessage): void {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        this.sendMessage(client, message);
      }
    });
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  getConnectedClientsCount(): number {
    return this.clients.size;
  }
}

