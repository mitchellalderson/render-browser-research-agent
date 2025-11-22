'use client';

import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatStatus } from './ChatStatus';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { WebSocketClient } from '@/lib/websocket';
import { Message, StatusUpdate, Summary, ChatResponse } from '@/types';
import { Sparkles } from 'lucide-react';

// Convert API URL to WebSocket URL
const getWebSocketUrl = () => {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (wsUrl) {
    return wsUrl;
  }
  
  if (apiUrl) {
    return apiUrl.replace(/^https?:\/\//, (match) => 
      match === 'https://' ? 'wss://' : 'ws://'
    );
  }
  
  return 'ws://localhost:3001';
};

const WS_URL = getWebSocketUrl();

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<StatusUpdate | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState(false);
  const [wsClient] = useState(() => new WebSocketClient(WS_URL));
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSocket
    wsClient.connect();

    // Handle incoming messages
    const unsubscribe = wsClient.onMessage((message) => {
      switch (message.type) {
        case 'status_update': {
          const data = message.data as StatusUpdate;
          setCurrentStatus(data);
          break;
        }

        case 'summary': {
          const data = message.data as Summary;
          setCurrentStatus(null);
          setIsLoading(false);
          
          // Store session ID and enable chat mode
          if (data.sessionId) {
            setSessionId(data.sessionId);
            setChatMode(true);
          }
          
          addMessage({
            id: Date.now().toString(),
            type: 'bot',
            content: data.summary,
            timestamp: Date.now(),
          });
          
          addMessage({
            id: (Date.now() + 1).toString(),
            type: 'status',
            content: `Analysis complete! Analyzed ${data.pagesAnalyzed} page${data.pagesAnalyzed !== 1 ? 's' : ''}`,
            timestamp: Date.now(),
          });
          break;
        }

        case 'chat_response': {
          const data = message.data as ChatResponse;
          setCurrentStatus(null);
          setIsLoading(false);
          
          addMessage({
            id: Date.now().toString(),
            type: 'bot',
            content: data.answer,
            timestamp: Date.now(),
          });
          break;
        }

        case 'error': {
          const data = message.data as { message: string };
          setCurrentStatus(null);
          setIsLoading(false);
          
          addMessage({
            id: Date.now().toString(),
            type: 'bot',
            content: `❌ Error: ${data.message}`,
            timestamp: Date.now(),
          });
          break;
        }
      }
    });

    return () => {
      unsubscribe();
      wsClient.disconnect();
    };
  }, [wsClient]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStatus]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleSubmit = (url: string, maxPages: number) => {
    // Add user message
    addMessage({
      id: Date.now().toString(),
      type: 'user',
      content: url,
      timestamp: Date.now(),
    });

    // Add status message
    addMessage({
      id: (Date.now() + 1).toString(),
      type: 'status',
      content: 'Starting analysis...',
      timestamp: Date.now(),
    });

    setIsLoading(true);
    setChatMode(false);
    setSessionId(null);

    // Send request via WebSocket
    wsClient.send({
      type: 'start_scrape',
      data: { url, maxPages },
    });
  };

  const handleChatQuestion = (question: string) => {
    if (!sessionId) return;

    // Add user message
    addMessage({
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: Date.now(),
    });

    setIsLoading(true);

    // Send question via WebSocket
    wsClient.send({
      type: 'chat_question',
      data: { question, sessionId },
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    Web Research Agent
                  </h2>
                  <p className="text-muted-foreground max-w-md">
                    Enter any website URL and I'll analyze it for you. I'll crawl the pages, 
                    understand the content, and provide you with a comprehensive summary.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {currentStatus && (
                  <ChatStatus
                    message={currentStatus.message}
                    progress={currentStatus.progress}
                    currentPage={currentStatus.currentPage}
                  />
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto p-4">
          <ChatInput
            onSubmit={handleSubmit}
            onChatQuestion={handleChatQuestion}
            disabled={isLoading}
            isLoading={isLoading}
            chatMode={chatMode}
          />
        </div>
      </div>
    </div>
  );
}

