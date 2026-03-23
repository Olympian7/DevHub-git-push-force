import express from "express";
import cors from "cors";
import { coinsRouter } from "./routes/coinsRouter";

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.use("/api/coins", coinsRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

export { app };