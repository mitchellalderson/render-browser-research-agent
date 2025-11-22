import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Globe, CheckCircle2 } from 'lucide-react';

interface ChatStatusProps {
  message: string;
  progress: number;
  currentPage: string;
}

export function ChatStatus({ message, progress, currentPage }: ChatStatusProps) {
  return (
    <Card className="p-4 mb-4 border-primary/20 bg-accent/50">
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-1">
          {progress < 100 ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-foreground">{message}</p>
            <Badge variant="outline" className="shrink-0">
              {progress}%
            </Badge>
          </div>

          {currentPage && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />
              <span className="truncate">{currentPage}</span>
            </div>
          )}

          {/* Progress bar */}
          <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

