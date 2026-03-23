import { Router } from "express";
import { fetchCoins } from "../controllers/coincontroller";

const router = Router();

router.get("/", fetchCoins);

export const coinsRouter = router;