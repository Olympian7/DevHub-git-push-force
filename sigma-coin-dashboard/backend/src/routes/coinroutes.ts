import { Router } from "express";

import { fetchCoins } from "../controllers/coincontroller";

// ─── Router ──────────────────────────────────────────────────────────────────

const router: Router = Router();

/**
 * GET /api/coins
 * Returns all coins with jittered sentiment scores.
 */
router.get("/", fetchCoins);

export { router as coinsRouter };