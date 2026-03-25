export type Trend = "Spike" | "Drop" | "Stable";

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  sentiment: number;
  trend: Trend;
  signal: string;
  price: string;
  change24h: number;
  image?: string;
}

export interface Alert {
  id: string;
  type: "info" | "warning" | "success" | "danger";
  message: string;
  timestamp: string;
}

export interface Insight {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

export interface ChartData {
  time: string;
  sentiment: number;
  volume: number;
}

export type PredictionTrend = "Up" | "Down" | "Stable";

export interface PredictionPoint {
  timestamp: string;
  price: number;
  sentiment: number;
}

export interface PredictionResult {
  predictedPrice: number;
  trend: PredictionTrend;
  confidence: number;
  historical: PredictionPoint[];
  predictedSeries: PredictionPoint[];
}
