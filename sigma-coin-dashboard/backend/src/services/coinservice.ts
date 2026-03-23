import { type Coin, toSentimentScore, toPositiveNumber } from "../types/index";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns a random integer in the inclusive range [min, max]. */
function randomIntInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Clamps a number to the inclusive range [min, max]. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Jitters a SentimentScore by a random integer offset in [-JITTER, +JITTER],
 * then clamps the result to [0, 100] before branding.
 */
const SENTIMENT_JITTER = 3;
const CACHE_TTL_MS = 30_000;

let cachedCoins: Coin[] | null = null;
let lastFetchMs = 0;
let hasLiveSnapshot = false;

// Store social sentiment scores (0-100) indexed by ticker
const socialSentimentCache: Record<string, number> = {};
const socialPostsCache: Record<string, any[]> = {};

export function updateSocialData(ticker: string, score: number, posts: any[]) {
  const symbol = ticker.toUpperCase();
  socialSentimentCache[symbol] = score;
  socialPostsCache[symbol] = posts.slice(0, 2); // Store latest 2 posts
}

function jitterSentiment(base: number): ReturnType<typeof toSentimentScore> {
  const offset = randomIntInRange(-SENTIMENT_JITTER, SENTIMENT_JITTER);
  return toSentimentScore(clamp(base + offset, 0, 100));
}

function toTrend(change24h: number | undefined): Coin["trend"] {
  if (typeof change24h !== "number") return "Stable";
  if (change24h >= 1.5) return "Spike";  // Bullish price action
  if (change24h <= -1.5) return "Drop";   // Bearish price action
  return "Stable";
}

function toSignal(sentiment: number): Coin["signal"] {
  // New adjusted bounds:
  // >= 60 is Buy
  // <= 40 is Sell
  if (sentiment >= 63) return "Buy";
  if (sentiment <= 40) return "Sell";
  return "Hold";
}

function toBoundedSentiment(symbol: string, change24h: number | undefined): ReturnType<typeof toSentimentScore> {
  const priceBase = typeof change24h === "number" ? 50 + change24h * 2 : 50;
  const socialScore = socialSentimentCache[symbol.toUpperCase()];

  // If we have social data, we blend it 20/80 with price data
  let finalBase = priceBase;
  if (socialScore !== undefined) {
    finalBase = (priceBase * 0.2) + (socialScore * 0.8);
  }

  return jitterSentiment(clamp(Math.round(finalBase), 0, 100));
}

interface CoinGeckoMarketItem {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h?: number;
  image?: string;
}

async function fetchFromCoinGecko(): Promise<Coin[]> {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets" +
    "?vs_currency=usd&category=meme-token&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h";

  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    throw new Error(`CoinGecko request failed with status ${res.status}`);
  }

  const data = (await res.json()) as CoinGeckoMarketItem[];

  return data
    .filter((item) => Number(item.current_price) > 0)
    .map((item): Coin => {
      const sentiment = toBoundedSentiment(item.symbol, item.price_change_percentage_24h);
      return {
        id: `cg_${item.id}`,
        name: item.name,
        symbol: item.symbol.toUpperCase(),
        price: toPositiveNumber(Number(item.current_price)),
        change24h: Number((item.price_change_percentage_24h ?? 0).toFixed(2)),
        sentiment,
        trend: toTrend(item.price_change_percentage_24h),
        signal: toSignal(sentiment),
        image: item.image,
        scrapedPosts: socialPostsCache[item.symbol.toUpperCase()] || [],
      };
    });
}

interface CoinCapAssetItem {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  changePercent24Hr?: string;
}

interface CoinCapResponse {
  data: CoinCapAssetItem[];
}

async function fetchFromCoinCap(): Promise<Coin[]> {
  const url =
    "https://api.coincap.io/v2/assets" +
    "?ids=dogecoin,pepe,shiba-inu,floki,bonk,dogwifhat,book-of-meme";

  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    throw new Error(`CoinCap request failed with status ${res.status}`);
  }

  const body = (await res.json()) as CoinCapResponse;

  return body.data
    .map((item) => {
      const price = Number(item.priceUsd);
      const change24h = item.changePercent24Hr !== undefined ? Number(item.changePercent24Hr) : undefined;
      return { item, price, change24h };
    })
    .filter((x) => Number.isFinite(x.price) && x.price > 0)
    .map((x): Coin => {
      const sentiment = toBoundedSentiment(x.item.symbol, x.change24h);
      return {
        id: `cc_${x.item.id}`,
        name: x.item.name,
        symbol: x.item.symbol.toUpperCase(),
        price: toPositiveNumber(x.price),
        change24h: Number((x.change24h ?? 0).toFixed(2)),
        sentiment,
        trend: toTrend(x.change24h),
        signal: toSignal(sentiment),
        scrapedPosts: socialPostsCache[x.item.symbol.toUpperCase()] || [],
      };
    });
}

async function fetchLiveCoins(): Promise<Coin[]> {
  try {
    return await fetchFromCoinGecko();
  } catch {
    return await fetchFromCoinCap();
  }
}

// ─── Service ─────────────────────────────────────────────────────────────────

/**
 * Returns all coins with their sentiment scores slightly randomised (+/- 3)
 * relative to the mock baseline on each call. All other fields are stable.
 */
export async function getCoins(): Promise<Coin[]> {
  const now = Date.now();
  if (cachedCoins !== null && now - lastFetchMs < CACHE_TTL_MS) {
    return cachedCoins;
  }

  try {
    const liveCoins = await fetchLiveCoins();
    cachedCoins = liveCoins;
    lastFetchMs = now;
    hasLiveSnapshot = true;
    return liveCoins;
  } catch {
    // If we have ever fetched live data successfully, keep serving that snapshot
    // during transient upstream outages instead of switching back to mock data.
    if (hasLiveSnapshot && cachedCoins !== null) {
      lastFetchMs = now;
      return cachedCoins;
    }

    throw new Error("Live coin providers are currently unavailable.");
  }
}

/**
 * Returns a single coin by id, or undefined if not found.
 * Sentiment is jittered the same way as in getCoins().
 */
export async function getCoinById(id: string): Promise<Coin | undefined> {
  const coins = await getCoins();
  return coins.find((c) => c.id === id);
}