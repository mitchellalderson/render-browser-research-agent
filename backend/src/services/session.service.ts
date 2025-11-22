import { CrawlSession, PageData } from '../types';

export class SessionService {
  private sessions: Map<string, CrawlSession> = new Map();
  private readonly SESSION_TIMEOUT = 1000 * 60 * 30; // 30 minutes

  createSession(url: string, pages: PageData[]): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const session: CrawlSession = {
      id: sessionId,
      url,
      pages,
      createdAt: Date.now(),
    };

    this.sessions.set(sessionId, session);
    
    // Auto-cleanup after timeout
    setTimeout(() => {
      this.sessions.delete(sessionId);
      console.log(`✨ Session expired: ${sessionId}`);
    }, this.SESSION_TIMEOUT);

    console.log(`✨ Session created: ${sessionId} (${pages.length} pages)`);
    return sessionId;
  }

  getSession(sessionId: string): CrawlSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.warn(`⚠️  Session not found: ${sessionId}`);
      return null;
    }

    // Check if session is expired
    const age = Date.now() - session.createdAt;
    if (age > this.SESSION_TIMEOUT) {
      this.sessions.delete(sessionId);
      console.warn(`⚠️  Session expired: ${sessionId}`);
      return null;
    }

    return session;
  }

  deleteSession(sessionId: string): boolean {
    const deleted = this.sessions.delete(sessionId);
    if (deleted) {
      console.log(`🗑️  Session deleted: ${sessionId}`);
    }
    return deleted;
  }

  getActiveSessions(): number {
    return this.sessions.size;
  }

  cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      const age = now - session.createdAt;
      if (age > this.SESSION_TIMEOUT) {
        this.sessions.delete(sessionId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} expired session(s)`);
    }
  }
}

