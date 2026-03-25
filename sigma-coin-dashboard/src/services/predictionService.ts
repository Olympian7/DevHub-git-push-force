import { PredictionResult } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

interface PredictSuccessResponse {
  success: true;
  data: PredictionResult;
  fetchedAt: string;
}

interface PredictErrorResponse {
  success: false;
  error: string;
  fetchedAt: string;
}

type PredictResponse = PredictSuccessResponse | PredictErrorResponse;

export async function fetchPrediction(coinId?: string): Promise<PredictionResult> {
  const url = new URL(`${API_BASE_URL}/predict`, window.location.origin);
  if (coinId) {
    url.searchParams.set("coinId", coinId);
  }

  const response = await fetch(url.pathname + url.search);
  if (!response.ok) {
    throw new Error(`Prediction request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as PredictResponse;
  if (payload.success === false) {
    throw new Error(payload.error || "Prediction API returned an error");
  }

  return payload.data;
}
