import { Coin, Trend } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

interface BackendCoin {
  id: string;
  name: string;
  symbol: string;
  sentiment: number;
  trend: Trend;
  signal: string;
  price: number;
  change24h: number;
  image?: string;
}

interface FetchCoinsResponse {
  success: boolean;
  data: BackendCoin[];
}

export async function fetchLiveCoins(): Promise<Coin[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/coins`);
    
    if (!response.ok) throw new Error("Failed to fetch backend coin data");
    
    const payload = (await response.json()) as FetchCoinsResponse;
    if (!payload.success || !Array.isArray(payload.data)) {
      throw new Error("Invalid backend response format");
    }
    
    return payload.data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        symbol: item.symbol.toUpperCase(),
        sentiment: item.sentiment,
        trend: item.trend,
        signal: item.signal,
        price: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(item.price),
        change24h: Number(item.change24h.toFixed(2)),
        image: item.image,
      };
    });
  } catch (error) {
    console.error("Error fetching coins from backend:", error);
    return [];
  }
}

export async function triggerScrape(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/coins/scrape`);
    if (!response.ok) throw new Error("Scrape trigger failed");
  } catch (error) {
    console.error("Error triggering scrape:", error);
  }
}
