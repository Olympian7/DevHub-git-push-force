import { Coin, Trend } from "../types";

const COINGECKO_API = "https://api.coingecko.com/api/v3";

export async function fetchLiveCoins(): Promise<Coin[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false&price_change_percentage=24h`
    );
    
    if (!response.ok) throw new Error("Failed to fetch live data");
    
    const data = await response.json();
    
    return data.map((item: any) => {
      // Sigma AI Logic: Deriving sentiment and signals from real data
      const change = item.price_change_percentage_24h || 0;
      
      // Sentiment: Base 50, +3 for every 1% gain, -3 for every 1% loss, clamped 0-100
      const sentiment = Math.min(100, Math.max(0, Math.round(50 + (change * 3))));
      
      // Trend
      let trend: Trend = "Stable";
      if (change > 5) trend = "Spike";
      else if (change < -5) trend = "Drop";
      
      // Signal
      let signal = "Neutral";
      if (change > 8) signal = "Strong Buy";
      else if (change > 2) signal = "Buy";
      else if (change < -8) signal = "Strong Sell";
      else if (change < -2) signal = "Sell";
      else signal = "Hold";

      return {
        id: item.id,
        name: item.name,
        symbol: item.symbol.toUpperCase(),
        sentiment,
        trend,
        signal,
        price: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.current_price),
        change24h: Number(change.toFixed(2)),
        image: item.image,
      };
    });
  } catch (error) {
    console.error("Error fetching live coins:", error);
    return [];
  }
}
