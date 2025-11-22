import Browserbase from '@browserbasehq/sdk';
import { config } from '../config';

export class BrowserbaseService {
  private client: Browserbase;

  constructor() {
    if (!config.browserbase.apiKey || !config.browserbase.projectId) {
      console.warn('Browserbase credentials not configured. Please add them to .env file.');
    }

    this.client = new Browserbase({
      apiKey: config.browserbase.apiKey,
    });
  }

  async createSession(): Promise<string> {
    try {
      const session = await this.client.sessions.create({
        projectId: config.browserbase.projectId,
      });

      console.log(`✅ Browserbase session created: ${session.id}`);
      return session.id;
    } catch (error) {
      console.error('Failed to create Browserbase session:', error);
      throw new Error('Failed to initialize browser session');
    }
  }

  async getSession(sessionId: string) {
    try {
      return await this.client.sessions.retrieve(sessionId);
    } catch (error) {
      console.error('Failed to retrieve session:', error);
      throw error;
    }
  }

  async endSession(sessionId: string): Promise<void> {
    try {
      // Note: Browserbase sessions automatically end when browser connection closes
      // This is a placeholder for future cleanup if needed
      console.log(`✅ Browserbase session ended: ${sessionId}`);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }

  getConnectUrl(sessionId: string): string {
    return `wss://connect.browserbase.com?apiKey=${config.browserbase.apiKey}&sessionId=${sessionId}`;
  }

  isConfigured(): boolean {
    return !!(config.browserbase.apiKey && config.browserbase.projectId);
  }
}

