import type { Request, Response } from "express";

import type { Coin } from "../types/index";
import { getCoins } from "../services/coinservice";

// ─── Response Shapes ─────────────────────────────────────────────────────────

interface FetchCoinsSuccessBody {
  success: true;
  data: Coin[];
  count: number;
  fetchedAt: string; // ISO 8601
}

interface FetchCoinsErrorBody {
  success: false;
  error: string;
  fetchedAt: string; // ISO 8601
}

type FetchCoinsResponseBody = FetchCoinsSuccessBody | FetchCoinsErrorBody;

// ─── Controller ──────────────────────────────────────────────────────────────

/**
 * GET /coins
 *
 * Returns all coins with jittered sentiment scores.
 *
 * 200 – FetchCoinsSuccessBody
 * 500 – FetchCoinsErrorBody
 */
export async function fetchCoins(
  req: Request,
  res: Response<FetchCoinsResponseBody>
): Promise<void> {
  const fetchedAt = new Date().toISOString();

  try {
    const coins = await getCoins();

    const body: FetchCoinsSuccessBody = {
      success: true,
      data: coins,
      count: coins.length,
      fetchedAt,
    };

    res.status(200).json(body);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";

    const body: FetchCoinsErrorBody = {
      success: false,
      error: message,
      fetchedAt,
    };

    res.status(500).json(body);
  }
}