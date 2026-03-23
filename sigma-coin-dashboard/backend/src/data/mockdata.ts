import {
  type Coin,
  type Alert,
  type Insight,
  type DashboardSnapshot,
  toSentimentScore,
  toConfidenceScore,
  toPositiveNumber,
} from "../types/index";

// ─── Coins ───────────────────────────────────────────────────────────────────

export const mockCoins: ReadonlyArray<Coin> = [
  {
    id: "coin_btc",
    name: "Bitcoin",
    symbol: "BTC",
    sentiment: toSentimentScore(72),
    trend: "Spike",
    signal: "Buy",
    price: toPositiveNumber(87_430.15),
    change24h: 2.4,
  },
  {
    id: "coin_eth",
    name: "Ethereum",
    symbol: "ETH",
    sentiment: toSentimentScore(61),
    trend: "Stable",
    signal: "Hold",
    price: toPositiveNumber(3_184.92),
    change24h: 0.6,
  },
  {
    id: "coin_sol",
    name: "Solana",
    symbol: "SOL",
    sentiment: toSentimentScore(83),
    trend: "Spike",
    signal: "Buy",
    price: toPositiveNumber(198.47),
    change24h: 4.1,
  },
  {
    id: "coin_bnb",
    name: "BNB",
    symbol: "BNB",
    sentiment: toSentimentScore(55),
    trend: "Stable",
    signal: "Hold",
    price: toPositiveNumber(612.30),
    change24h: -0.3,
  },
  {
    id: "coin_xrp",
    name: "XRP",
    symbol: "XRP",
    sentiment: toSentimentScore(38),
    trend: "Drop",
    signal: "Sell",
    price: toPositiveNumber(0.5214),
    change24h: -3.2,
  },
  {
    id: "coin_ada",
    name: "Cardano",
    symbol: "ADA",
    sentiment: toSentimentScore(29),
    trend: "Drop",
    signal: "Sell",
    price: toPositiveNumber(0.3871),
    change24h: -4.5,
  },
  {
    id: "coin_avax",
    name: "Avalanche",
    symbol: "AVAX",
    sentiment: toSentimentScore(67),
    trend: "Spike",
    signal: "Buy",
    price: toPositiveNumber(41.88),
    change24h: 1.8,
  },
  {
    id: "coin_dot",
    name: "Polkadot",
    symbol: "DOT",
    sentiment: toSentimentScore(48),
    trend: "Stable",
    signal: "Hold",
    price: toPositiveNumber(7.63),
    change24h: 0.2,
  },
];

// ─── Alerts ──────────────────────────────────────────────────────────────────

export const mockAlerts: ReadonlyArray<Alert> = [
  {
    id: "alert_001",
    message: "BTC crossed the $87,000 resistance level — potential breakout in progress.",
    severity: "high",
    timestamp: new Date("2025-03-23T06:14:02.000Z"),
  },
  {
    id: "alert_002",
    message: "SOL 24h trading volume surged 340% above its 30-day average.",
    severity: "high",
    timestamp: new Date("2025-03-23T07:45:30.000Z"),
  },
  {
    id: "alert_003",
    message: "XRP sentiment dropped 18 points in under 4 hours — monitor for further decline.",
    severity: "medium",
    timestamp: new Date("2025-03-23T08:02:11.000Z"),
  },
  {
    id: "alert_004",
    message: "ADA price fell below the 200-day moving average for the first time this quarter.",
    severity: "medium",
    timestamp: new Date("2025-03-23T09:30:00.000Z"),
  },
  {
    id: "alert_005",
    message: "ETH gas fees elevated — average transaction cost at $8.40, up from $3.10 yesterday.",
    severity: "low",
    timestamp: new Date("2025-03-23T10:15:44.000Z"),
  },
  {
    id: "alert_006",
    message: "AVAX wallet activity up 27% — on-chain data suggests accumulation phase.",
    severity: "low",
    timestamp: new Date("2025-03-23T11:00:59.000Z"),
  },
];

// ─── Insights ─────────────────────────────────────────────────────────────────

export const mockInsights: ReadonlyArray<Insight> = [
  {
    id: "insight_001",
    text: "Bitcoin's funding rate across perpetual markets turned strongly positive overnight, historically preceding a 5–12% price extension within 72 hours.",
    confidence: toConfidenceScore(0.81),
  },
  {
    id: "insight_002",
    text: "Solana validator counts hit an all-time high this week. Increased decentralization correlates with reduced systemic risk and tends to attract institutional inflows.",
    confidence: toConfidenceScore(0.74),
  },
  {
    id: "insight_003",
    text: "XRP's current drop appears tied to renewed SEC commentary. Sentiment may stabilise once legal clarity is restored — averaging down carries elevated regulatory risk.",
    confidence: toConfidenceScore(0.63),
  },
  {
    id: "insight_004",
    text: "Cardano's on-chain development activity (GitHub commits) remains high despite the price decline, suggesting the drop is sentiment-driven rather than fundamental.",
    confidence: toConfidenceScore(0.69),
  },
  {
    id: "insight_005",
    text: "BNB shows low volatility relative to the broader market this cycle, making it a candidate for capital preservation within crypto-native portfolios.",
    confidence: toConfidenceScore(0.57),
  },
  {
    id: "insight_006",
    text: "Cross-chain bridge activity between Avalanche and Ethereum increased 61% this month. This typically precedes increased DeFi TVL on AVAX within 2–3 weeks.",
    confidence: toConfidenceScore(0.78),
  },
];

// ─── Dashboard Snapshot ──────────────────────────────────────────────────────
    
export const mockDashboardSnapshot: DashboardSnapshot = {
  coins: mockCoins,
  alerts: mockAlerts,
  insights: mockInsights,
  generatedAt: new Date("2025-03-23T11:30:00.000Z"),
};