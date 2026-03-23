import type { Request, Response } from "express";
import { scrapeAll, type ScrapedPost } from "../services/scraperservice";
import { updateSocialData } from "../services/coinservice";

// ─── Response Shapes ─────────────────────────────────────────────────────────

interface ScrapeSuccessBody {
  success: true;
  data: ScrapedPost[];
  count: number;
  scrapedAt: string;
}

interface ScrapeErrorBody {
  success: false;
  error: string;
  scrapedAt: string;
}

type ScrapeResponseBody = ScrapeSuccessBody | ScrapeErrorBody;

// ─── Controller ──────────────────────────────────────────────────────────────

/**
 * GET /scrape
 *
 * Returns scraped posts from Reddit and Telegram.
 *
 * 200 – ScrapeSuccessBody
 * 500 – ScrapeErrorBody
 */
export async function scrapePosts(
  req: Request,
  res: Response<ScrapeResponseBody>
): Promise<void> {
  const scrapedAt = new Date().toISOString();

  try {
    const posts = await scrapeAll();

    // Aggregate social sentiment and posts by ticker
    const data: Record<string, { sum: number; count: number; posts: any[] }> = {};
    const generalPosts: any[] = [];

    posts.forEach(p => {
        const ticker = p.coin_ticker.toUpperCase();
        if (ticker === "GENERAL") {
            generalPosts.push(p);
            return;
        }

        if (!data[ticker]) data[ticker] = { sum: 0, count: 0, posts: [] };
        
        if (p.sentiment_score !== undefined) {
            data[ticker].sum += p.sentiment_score;
            data[ticker].count += 1;
        }
        data[ticker].posts.push(p);
    });

    // Update specific coins
    Object.keys(data).forEach(ticker => {
        const item = data[ticker];
        const avg = item.count > 0 ? item.sum / item.count : 0;
        const mapped = (avg + 1) * 50; 
        updateSocialData(ticker, mapped, item.posts);
    });

    // Fallback: If any tracked coin has NO data, fallback to GENERAL intelligence
    const TRACKED_TICKERS = ["DOGE", "SHIB", "PEPE", "FLOKI", "BONK"];
    TRACKED_TICKERS.forEach(ticker => {
        if (!data[ticker] || data[ticker].posts.length === 0) {
            // Use average of general posts sentiment if available
            const genAvg = generalPosts.length > 0 
                ? generalPosts.reduce((s, p: any) => s + (p.sentiment_score || 0), 0) / generalPosts.length 
                : 0;
            const mapped = (genAvg + 1) * 50;
            updateSocialData(ticker, mapped, generalPosts.slice(0, 2));
        }
    });

    const body: ScrapeSuccessBody = {
      success: true,
      data: posts,
      count: posts.length,
      scrapedAt,
    };

    res.status(200).json(body);
  } catch (err) {
    const body: ScrapeErrorBody = {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      scrapedAt,
    };

    res.status(500).json(body);
  }
}