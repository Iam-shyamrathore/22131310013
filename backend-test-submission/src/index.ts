import * as dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';
// import { Log } from '../logging-middleware/log'; // Placeholder for later

interface Click {
  timestamp: Date;
  referrer: string;
  location: string;
}

interface Url {
  originalUrl: string;
  shortcode: string;
  shortLink: string;
  createdAt: Date;
  expiry: Date;
  clicks: Click[];
}

// In-memory store
const urlStore: Record<string, Url> = {};

const app = express();
app.use(express.json());

// Validate URL format
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Create Short URL - FIXED: Removed return statements
app.post('/shorturls', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url, validity, shortcode } = req.body;

    if (!url || !isValidUrl(url)) {
      // await Log('backend', 'error', 'handler', 'Invalid URL format');
      res.status(400).json({ error: 'Invalid URL format' });
      return;
    }

    const expiry = new Date(Date.now() + (validity || 30) * 60 * 1000);
    let finalShortcode = shortcode || nanoid(5);

    if (shortcode) {
      if (!/^[a-zA-Z0-9]{3,10}$/.test(shortcode)) {
        // await Log('backend', 'error', 'handler', 'Invalid shortcode: Must be alphanumeric, 3-10 characters');
        res.status(400).json({ error: 'Invalid shortcode: Must be alphanumeric, 3-10 characters' });
        return;
      }
      if (urlStore[shortcode]) {
        // await Log('backend', 'error', 'handler', 'Shortcode already in use');
        res.status(409).json({ error: 'Shortcode already in use' });
        return;
      }
    }

    while (!shortcode && urlStore[finalShortcode]) {
      finalShortcode = nanoid(5);
    }

    const shortLink = `${process.env.HOSTNAME}/${finalShortcode}`;
    urlStore[finalShortcode] = {
      originalUrl: url,
      shortcode: finalShortcode,
      shortLink,
      createdAt: new Date(),
      expiry,
      clicks: [],
    };

    // await Log('backend', 'info', 'handler', `Created short URL: ${shortLink}`);
    res.status(201).json({
      shortLink,
      expiry: expiry.toISOString(),
    });
  } catch (error: unknown) {
    // await Log('backend', 'error', 'handler', `Error creating short URL: ${(error instanceof Error ? error.message : 'Unknown error')}`);
    next(error);
  }
});

// Redirect - FIXED: Removed return statements
app.get('/:shortcode', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shortcode } = req.params;
    const urlDoc = urlStore[shortcode];

    if (!urlDoc) {
      // await Log('backend', 'error', 'handler', `Shortcode not found: ${shortcode}`);
      res.status(404).json({ error: 'Shortcode not found' });
      return;
    }

    if (urlDoc.expiry < new Date()) {
      // await Log('backend', 'error', 'handler', `Shortcode expired: ${shortcode}`);
      res.status(410).json({ error: 'Shortcode expired' });
      return;
    }

    urlDoc.clicks.push({
      timestamp: new Date(),
      referrer: req.get('Referrer') || 'unknown',
      location: 'unknown',
    });

    // await Log('backend', 'info', 'handler', `Redirecting to ${urlDoc.originalUrl}`);
    res.redirect(301, urlDoc.originalUrl);
  } catch (error: unknown) {
    // await Log('backend', 'error', 'handler', `Error redirecting: ${(error instanceof Error ? error.message : 'Unknown error')}`);
    next(error);
  }
});

// Get Statistics - FIXED: Removed return statements
app.get('/shorturls/:shortcode', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shortcode } = req.params;
    const urlDoc = urlStore[shortcode];

    if (!urlDoc) {
      // await Log('backend', 'error', 'handler', `Shortcode not found: ${shortcode}`);
      res.status(404).json({ error: 'Shortcode not found' });
      return;
    }

    // await Log('backend', 'info', 'handler', `Retrieved stats for ${shortcode}`);
    res.json({
      originalUrl: urlDoc.originalUrl,
      shortLink: urlDoc.shortLink,
      createdAt: urlDoc.createdAt.toISOString(),
      expiry: urlDoc.expiry.toISOString(),
      clickCount: urlDoc.clicks.length,
      clicks: urlDoc.clicks,
    });
  } catch (error: unknown) {
    // await Log('backend', 'error', 'handler', `Error retrieving stats: ${(error instanceof Error ? error.message : 'Unknown error')}`);
    next(error);
  }
});

// Error handling middleware
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));