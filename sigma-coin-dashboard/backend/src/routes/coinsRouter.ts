import { Router } from "express";
import { fetchCoins } from "../controllers/coincontroller";
import { scrapePosts } from "../controllers/scrapercontroller";

const router = Router();

router.get("/", fetchCoins);
router.get("/scrape", scrapePosts);

export const coinsRouter = router;