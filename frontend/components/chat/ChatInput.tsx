'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Send, Loader2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSubmit: (url: string, maxPages: number) => void;
  onChatQuestion: (question: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  chatMode?: boolean;
}

export function ChatInput({ 
  onSubmit, 
  onChatQuestion, 
  disabled = false, 
  isLoading = false,
  chatMode = false 
}: ChatInputProps) {
  const [url, setUrl] = useState('');
  const [question, setQuestion] = useState('');
  const [maxPages, setMaxPages] = useState(5);
  const [error, setError] = useState('');

  const validateUrl = (input: string): boolean => {
    try {
      // Add protocol if missing
      let urlToValidate = input.trim();
      if (!urlToValidate.startsWith('http://') && !urlToValidate.startsWith('https://')) {
        urlToValidate = 'https://' + urlToValidate;
      }

      const parsedUrl = new URL(urlToValidate);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (chatMode) {
      // Handle chat question
      if (!question.trim()) {
        setError('Please enter a question');
        return;
      }

      setError('');
      onChatQuestion(question);
      setQuestion('');
    } else {
      // Handle URL submission
      if (!url.trim()) {
        setError('Please enter a URL');
        return;
      }

      if (!validateUrl(url)) {
        setError('Please enter a valid URL (e.g., example.com or https://example.com)');
        return;
      }

      setError('');
      
      // Normalize URL
      let normalizedUrl = url.trim();
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }

      onSubmit(normalizedUrl, maxPages);
      setUrl('');
    }
  };

  if (chatMode) {
    // Chat mode - simple question input
    return (
      <div className="space-y-2">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                setError('');
              }}
              placeholder="Ask a question about the website..."
              disabled={disabled || isLoading}
              className={cn(
                'h-12 text-base',
                error && 'border-destructive focus-visible:ring-destructive'
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={disabled || isLoading || !question.trim()}
            size="lg"
            className="h-12 px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Ask
              </>
            )}
          </Button>
        </form>

        {error && (
          <p className="text-sm text-destructive px-1">{error}</p>
        )}

        <p className="text-xs text-muted-foreground px-1">
          💬 Ask me anything about the analyzed website
        </p>
      </div>
    );
  }

  // Initial mode - URL input with slider
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              placeholder="Enter website URL (e.g., example.com)"
              disabled={disabled || isLoading}
              className={cn(
                'h-12 text-base',
                error && 'border-destructive focus-visible:ring-destructive'
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={disabled || isLoading || !url.trim()}
            size="lg"
            className="h-12 px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
        </div>

        {/* Max Pages Slider */}
        <div className="space-y-2 px-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Pages to crawl
            </label>
            <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              {maxPages} {maxPages === 1 ? 'page' : 'pages'}
            </span>
          </div>
          <Slider
            value={[maxPages]}
            onValueChange={(value) => setMaxPages(value[0])}
            min={1}
            max={10}
            step={1}
            disabled={disabled || isLoading}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 page</span>
            <span>10 pages</span>
          </div>
        </div>
      </form>

      {error && (
        <p className="text-sm text-destructive px-1">{error}</p>
      )}

      <p className="text-xs text-muted-foreground px-1">
        Enter a website URL to analyze. The agent will crawl up to {maxPages} page{maxPages !== 1 ? 's' : ''} and provide an AI-powered summary.
      </p>
    </div>
  );
}

