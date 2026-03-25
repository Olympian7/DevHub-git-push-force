import "dotenv/config";
import express from "express";
import cors from "cors";
import { coinsRouter } from "./routes/coinsRouter";
import { predictRouter } from "./routes/predictroutes";

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.use("/api/coins", coinsRouter);
app.use("/api/predict", predictRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

export { app };