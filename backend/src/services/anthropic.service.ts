import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';
import { PageData } from '../types';

export interface SummaryResult {
  summary: string;
  companyOverview?: string;
  productsServices?: string[];
  keyFeatures?: string[];
  industryCategory?: string;
  targetAudience?: string;
  insights: string;
}

export class AnthropicService {
  private client: Anthropic;
  private model: string;

  constructor() {
    if (!config.anthropic.apiKey) {
      console.warn('Anthropic API key not configured. Please add it to .env file.');
    }

    this.client = new Anthropic({
      apiKey: config.anthropic.apiKey,
    });

    this.model = config.anthropic.model;
    console.log(`🤖 Anthropic service initialized with model: ${this.model}`);
  }

  async summarizeWebPages(pages: PageData[], originalUrl: string): Promise<SummaryResult> {
    try {
      const prompt = this.buildSummaryPrompt(pages, originalUrl);

      console.log('🤖 Sending request to Claude...');
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 2048, // Concise initial summary
        temperature: 0.5,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const response = message.content[0];
      if (response.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      console.log('✅ Summary generated successfully');
      
      // Return raw markdown - no need to parse since we have markdown rendering
      return {
        summary: response.text,
        insights: '',
      };
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw new Error('Failed to generate summary with AI');
    }
  }

  private buildSummaryPrompt(pages: PageData[], originalUrl: string): string {
    // Combine all page content
    const pagesContent = pages
      .map((page, index) => {
        return `
PAGE ${index + 1}: ${page.title}
URL: ${page.url}
CONTENT:
${page.content.substring(0, 3000)}
${page.content.length > 3000 ? '...(truncated)' : ''}
---
`;
      })
      .join('\n\n');

    return `You are an expert web analyst providing a concise initial summary of a website.

WEBSITE: ${originalUrl}
PAGES ANALYZED: ${pages.length}

CONTENT FROM CRAWLED PAGES:
${pagesContent}

INSTRUCTIONS:
Create a brief, scannable summary that gives the user a quick understanding. Keep it concise and informative.

**## What This Site Is About**
Write 2-3 sentences clearly explaining what this company/website does and their main value proposition.

**## Key Highlights**
List 4-6 of the most important or interesting points about this site (products, features, or notable aspects). Use bullet points (-).

**## Industry & Audience**
In 1-2 sentences, state the industry and who this is for.

**## 💬 Ask Me More**
Suggest 2-3 specific follow-up questions the user might want to ask, formatted as:
- "What are their main products?"
- "Who are their target customers?"
- "What makes them unique?"

FORMAT:
- Keep it brief and scannable
- Use bullet points for lists
- Be specific and factual
- Write in a friendly, professional tone
- Make the suggested questions relevant to THIS specific website`;
  }




  isConfigured(): boolean {
    return !!config.anthropic.apiKey;
  }

  async answerQuestion(question: string, pages: PageData[], originalUrl: string): Promise<string> {
    try {
      const prompt = this.buildQuestionPrompt(question, pages, originalUrl);

      console.log('🤖 Answering follow-up question...');
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 3072, // More tokens for detailed follow-up answers
        temperature: 0.5,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const response = message.content[0];
      if (response.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      console.log('✅ Question answered successfully');
      return response.text;
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw new Error('Failed to answer question with AI');
    }
  }

  private buildQuestionPrompt(question: string, pages: PageData[], originalUrl: string): string {
    // Combine all page content for context
    const pagesContext = pages
      .map((page, index) => {
        return `
PAGE ${index + 1}: ${page.title}
URL: ${page.url}
CONTENT:
${page.content.substring(0, 3500)}
${page.content.length > 3500 ? '...(truncated)' : ''}
---
`;
      })
      .join('\n\n');

    return `You are an AI assistant helping users understand information from a website that has been analyzed.

Website analyzed: ${originalUrl}
Number of pages crawled: ${pages.length}

Here is the content from the crawled pages:

${pagesContext}

USER QUESTION: ${question}

INSTRUCTIONS:
- Answer the question directly and comprehensively based on the website content above
- Be specific and detailed - this is a follow-up question where the user wants in-depth information
- Use bullet points or lists when appropriate for clarity
- Include relevant examples or specifics from the pages
- If the question asks for a list, provide as many items as you can find (5-10+ items if available)
- Use markdown formatting for better readability (headings, bold, lists)
- If the information isn't in the crawled content, say so politely

Keep your answer focused, informative, and well-structured.`;
  }

  getModel(): string {
    return this.model;
  }
}

