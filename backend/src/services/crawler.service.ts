import { chromium, Browser, Page } from 'playwright';
import { BrowserbaseService } from './browserbase.service';
import { WebSocketService } from './websocket.service';
import { isSameDomain } from '../utils/url-validator';
import { PageData } from '../types';
import { WebSocket } from 'ws';
import { config } from '../config';

interface CrawlOptions {
  url: string;
  maxPages: number;
  ws: WebSocket;
}

export class CrawlerService {
  private browserbaseService: BrowserbaseService;
  private wsService: WebSocketService;

  constructor(browserbaseService: BrowserbaseService, wsService: WebSocketService) {
    this.browserbaseService = browserbaseService;
    this.wsService = wsService;
  }

  async crawl(options: CrawlOptions): Promise<PageData[]> {
    const { url, maxPages, ws } = options;
    const startUrl = url;
    const visitedUrls = new Set<string>();
    const pagesData: PageData[] = [];
    const urlsToVisit: string[] = [startUrl];

    let browser: Browser | null = null;
    let sessionId: string | null = null;

    try {
      // Check if Browserbase is configured
      if (!this.browserbaseService.isConfigured()) {
        throw new Error(
          'Browserbase is not configured. Please add BROWSERBASE_API_KEY and BROWSERBASE_PROJECT_ID to your .env file.'
        );
      }

      this.wsService.sendStatusUpdate(ws, 'Initializing browser session...', 5, '');

      // Create Browserbase session
      sessionId = await this.browserbaseService.createSession();
      const connectUrl = this.browserbaseService.getConnectUrl(sessionId);

      this.wsService.sendStatusUpdate(ws, 'Connecting to browser...', 10, '');

      // Connect to Browserbase
      browser = await chromium.connectOverCDP(connectUrl);
      const context = browser.contexts()[0];
      const page = context.pages()[0] || (await context.newPage());

      this.wsService.sendStatusUpdate(ws, 'Browser connected, starting crawl...', 15, startUrl);

      // Crawl pages
      while (urlsToVisit.length > 0 && pagesData.length < maxPages) {
        const currentUrl = urlsToVisit.shift()!;

        if (visitedUrls.has(currentUrl)) {
          continue;
        }

        visitedUrls.add(currentUrl);

        const progress = 15 + ((pagesData.length / maxPages) * 70);
        this.wsService.sendStatusUpdate(
          ws,
          `Crawling page ${pagesData.length + 1} of ${maxPages}...`,
          Math.round(progress),
          currentUrl
        );

        try {
          // Navigate to the page first
          await page.goto(currentUrl, {
            waitUntil: 'domcontentloaded',
            timeout: config.scraping.timeout,
          });
          
          // Wait for dynamic content
          await page.waitForTimeout(1500);
          
          // Get HTML for link extraction
          const html = await page.content();
          
          // Extract page data (title and text)
          const pageData = await this.extractPageData(page, currentUrl);
          pagesData.push(pageData);

          // Extract and filter links from HTML
          const newLinks = this.extractLinks(html, currentUrl, startUrl);
          
          console.log(`📊 Found ${newLinks.length} links on ${currentUrl}`);
          
          // Add new links to queue (only if we haven't visited them)
          for (const link of newLinks) {
            if (!visitedUrls.has(link) && !urlsToVisit.includes(link)) {
              urlsToVisit.push(link);
            }
          }

          console.log(`✅ Scraped: ${currentUrl} (${pagesData.length}/${maxPages})`);
        } catch (error) {
          console.error(`Failed to scrape ${currentUrl}:`, error);
          // Continue to next page on error
        }

        // Small delay between requests
        await this.delay(1000);
      }

      this.wsService.sendStatusUpdate(
        ws,
        `Crawling complete! Analyzed ${pagesData.length} pages.`,
        90,
        ''
      );

      return pagesData;
    } catch (error) {
      console.error('Crawling error:', error);
      throw error;
    } finally {
      // Cleanup
      if (browser) {
        await browser.close();
      }
      if (sessionId) {
        await this.browserbaseService.endSession(sessionId);
      }
    }
  }

  private async extractPageData(page: Page, url: string): Promise<PageData> {
    try {
      // Extract page data (assumes page is already loaded)
      const title = await page.title();

      // Extract text content (runs in browser context)
      const textContent = await page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const doc = (globalThis as any).document;
        const clone = doc.body.cloneNode(true);
        const elementsToRemove = clone.querySelectorAll(
          'script, style, noscript, iframe, nav, footer, header'
        );
        elementsToRemove.forEach((el: any) => el.remove());

        return clone.innerText || clone.textContent || '';
      });

      return {
        url,
        title,
        content: this.cleanText(textContent),
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error(`Error extracting data from ${url}:`, error);
      throw error;
    }
  }

  private extractLinks(html: string, currentUrl: string, baseUrl: string): string[] {
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/gi;
    const links: string[] = [];
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[2];

      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        continue;
      }

      try {
        const absoluteUrl = new URL(href, currentUrl).href;

        // Only include links from the same domain
        if (isSameDomain(absoluteUrl, baseUrl)) {
          // Remove hash and query params for deduplication
          const cleanUrl = absoluteUrl.split('#')[0].split('?')[0];
          if (!links.includes(cleanUrl)) {
            links.push(cleanUrl);
          }
        }
      } catch {
        // Invalid URL, skip
      }
    }

    return links;
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\n+/g, '\n') // Collapse newlines
      .trim()
      .substring(0, 10000); // Limit text length
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

