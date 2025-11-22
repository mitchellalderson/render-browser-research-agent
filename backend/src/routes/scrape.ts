import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validateAndNormalizeUrl } from '../utils/url-validator';

const router = Router();

// Validation schema
const scrapeRequestSchema = z.object({
  url: z.string().min(1, 'URL is required'),
  maxPages: z.number().min(1).max(50).optional().default(5),
});

// POST /api/scrape - Start a scraping session
router.post('/scrape', async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validationResult = scrapeRequestSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      res.status(400).json({
        error: 'Invalid request',
        details: validationResult.error.issues,
      });
      return;
    }

    const { url, maxPages } = validationResult.data;

    // Validate and normalize URL
    const urlValidation = validateAndNormalizeUrl(url);
    
    if (!urlValidation.isValid) {
      res.status(400).json({
        error: urlValidation.error || 'Invalid URL',
      });
      return;
    }

    // Generate session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // For now, return success. The actual scraping will be handled via WebSocket
    res.status(200).json({
      sessionId,
      status: 'started',
      url: urlValidation.normalizedUrl,
      maxPages,
    });
  } catch (error) {
    console.error('Error in /api/scrape:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
});

export default router;

