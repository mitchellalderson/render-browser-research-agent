import { Message } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === 'user';
  const isStatus = message.type === 'status';

  if (isStatus) {
    return (
      <div className="flex justify-center my-4">
        <Badge variant="secondary" className="text-xs py-1 px-3">
          {message.content}
        </Badge>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex gap-3 mb-6',
        isUser && 'flex-row-reverse'
      )}
    >
      <Avatar className={cn(
        'h-8 w-8 shrink-0',
        isUser && 'bg-primary'
      )}>
        <AvatarFallback className={cn(
          isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          'flex flex-col gap-2 max-w-[80%]',
          isUser && 'items-end'
        )}
      >
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
          )}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <time className="text-xs text-muted-foreground px-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
      </div>
    </div>
  );
}

