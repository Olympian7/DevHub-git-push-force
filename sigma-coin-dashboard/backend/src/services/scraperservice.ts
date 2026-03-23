import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export interface ScrapedPost {
  platform: string;
  text: string;
  coin_ticker: string;
  engagement: number;
  sentiment_label?: string;
  sentiment_score?: number;
  author?: string;
  timestamp: string;
}

export async function scrapeReddit(): Promise<ScrapedPost[]> {
  try {
    const scriptPath = path.join(__dirname, '../scrapers/reddit.py');
    const { stdout } = await execAsync(`python ${scriptPath}`);
    // The last line should be the JSON
    const lines = stdout.trim().split('\n');
    const jsonLine = lines[lines.length - 1];
    return JSON.parse(jsonLine);
  } catch (error) {
    console.error('Error scraping Reddit:', error);
    return [];
  }
}


export async function scrapeAll(): Promise<ScrapedPost[]> {
  const redditPosts = await scrapeReddit();
  return redditPosts;
}