import type { Request, Response } from "express";
import type { PredictionResult } from "../types";
import { fetchPrediction } from "../services/ml/predictionClient";

interface PredictSuccessBody {
  success: true;
  data: PredictionResult;
  fetchedAt: string;
}

interface PredictErrorBody {
  success: false;
  error: string;
  fetchedAt: string;
}

type PredictResponse = PredictSuccessBody | PredictErrorBody;

export async function getPrediction(req: Request, res: Response<PredictResponse>): Promise<void> {
  const fetchedAt = new Date().toISOString();
  const coinId = typeof req.query.coinId === "string" ? req.query.coinId : undefined;
  try {
    const data = await fetchPrediction(coinId);
    res.status(200).json({ success: true, data, fetchedAt });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to fetch prediction";
    res.status(500).json({ success: false, error: message, fetchedAt });
  }
}
