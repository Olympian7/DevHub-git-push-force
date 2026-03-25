import { Router } from "express";
import { getPrediction } from "../controllers/predictcontroller";

const router = Router();

router.get("/", getPrediction);

export const predictRouter = router;
