export type CoinTrend = "Spike" | "Drop" | "Stable";

export type CoinSignal = "Buy" | "Sell" | "Hold";

export interface Coin {
  readonly id: string;
  name: string;
  symbol: string;
  sentiment: SentimentScore;
  trend: CoinTrend;
  signal: CoinSignal;
  price: PositiveNumber;
  change24h: number;
  image?: string;
}

export type AlertSeverity = "low" | "medium" | "high";

export interface Alert {
  readonly id: string;
  message: string;
  severity: AlertSeverity;
  timestamp: Date;
}

export interface Insight {
  readonly id: string;
  text: string;
  confidence: ConfidenceScore;
}

export type SentimentScore = number & { readonly __brand: "SentimentScore" };
export type ConfidenceScore = number & { readonly __brand: "ConfidenceScore" };
export type PositiveNumber = number & { readonly __brand: "PositiveNumber" };

export function toSentimentScore(value: number): SentimentScore {
  if (!Number.isInteger(value) || value < 0 || value > 100) {
    throw new RangeError(
      `SentimentScore must be an integer in [0, 100]. Received: ${value}`
    );
  }
  return value as SentimentScore;
}

export function toConfidenceScore(value: number): ConfidenceScore {
  if (value < 0 || value > 1) {
    throw new RangeError(
      `ConfidenceScore must be a float in [0, 1]. Received: ${value}`
    );
  }
  return value as ConfidenceScore;
}

export function toPositiveNumber(value: number): PositiveNumber {
  if (value <= 0) {
    throw new RangeError(`PositiveNumber must be > 0. Received: ${value}`);
  }
  return value as PositiveNumber;
}

export interface PaginatedResponse<T> {
  data: ReadonlyArray<T>;
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
  fetchedAt: Date;
}

export interface DashboardSnapshot {
  coins: ReadonlyArray<Coin>;
  alerts: ReadonlyArray<Alert>;
  insights: ReadonlyArray<Insight>;
  generatedAt: Date;
}

export type TrendLabel = "Up" | "Down" | "Stable";

export interface PredictionPoint {
  timestamp: string; // ISO
  price: number;
  sentiment: number;
}

export interface PredictionResult {
  predictedPrice: number;
  trend: TrendLabel;
  confidence: number; // 0-1
  historical: PredictionPoint[];
  predictedSeries: PredictionPoint[];
}
