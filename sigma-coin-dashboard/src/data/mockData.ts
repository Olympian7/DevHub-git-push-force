import { Coin, Alert, Insight, ChartData } from "../types";

export const mockCoins: Coin[] = [
  {
    id: "1",
    name: "Bitcoin",
    symbol: "BTC",
    sentiment: 82,
    trend: "Spike",
    signal: "Strong Buy",
    price: "$64,231.50",
    change24h: 2.4,
  },
  {
    id: "2",
    name: "Ethereum",
    symbol: "ETH",
    sentiment: 75,
    trend: "Stable",
    signal: "Hold",
    price: "$3,450.12",
    change24h: -0.5,
  },
  {
    id: "3",
    name: "Solana",
    symbol: "SOL",
    sentiment: 91,
    trend: "Spike",
    signal: "Strong Buy",
    price: "$145.80",
    change24h: 8.2,
  },
  {
    id: "4",
    name: "Dogecoin",
    symbol: "DOGE",
    sentiment: 87,
    trend: "Spike",
    signal: "Strong Uptrend",
    price: "$0.165",
    change24h: 12.5,
  },
  {
    id: "5",
    name: "Cardano",
    symbol: "ADA",
    sentiment: 45,
    trend: "Drop",
    signal: "Sell",
    price: "$0.45",
    change24h: -4.2,
  },
  {
    id: "6",
    name: "Polkadot",
    symbol: "DOT",
    sentiment: 62,
    trend: "Stable",
    signal: "Neutral",
    price: "$7.20",
    change24h: 0.8,
  },
];

export const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "danger",
    message: "Whale movement detected: 5,000 BTC moved to Binance.",
    timestamp: "2 mins ago",
  },
  {
    id: "2",
    type: "success",
    message: "SOL breakout confirmed. Target $160 reached.",
    timestamp: "15 mins ago",
  },
  {
    id: "3",
    type: "warning",
    message: "High volatility expected in next 4 hours.",
    timestamp: "1 hour ago",
  },
];

export const mockInsights: Insight[] = [
  {
    id: "1",
    text: "Market sentiment is shifting towards high-cap alts. Watch SOL and ETH closely.",
    author: "Sigma AI",
    timestamp: "10:45 AM",
  },
  {
    id: "2",
    text: "Social volume for DOGE is at a 30-day high. Potential hype cycle starting.",
    author: "Sigma AI",
    timestamp: "09:12 AM",
  },
];

export const mockChartData: ChartData[] = [
  { time: "00:00", sentiment: 65, volume: 1200 },
  { time: "04:00", sentiment: 68, volume: 1500 },
  { time: "08:00", sentiment: 75, volume: 2100 },
  { time: "12:00", sentiment: 72, volume: 1800 },
  { time: "16:00", sentiment: 80, volume: 2800 },
  { time: "20:00", sentiment: 85, volume: 3200 },
  { time: "23:59", sentiment: 82, volume: 2900 },
];
