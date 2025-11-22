import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight">Web Research Agent</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Website Analysis</p>
          </div>
        </div>
      </div>
    </header>
  );
}

