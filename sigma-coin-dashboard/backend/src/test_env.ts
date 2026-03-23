import { exec } from "child_process";
import "dotenv/config";

console.log("TS TELEGRAM_API_ID:", process.env.TELEGRAM_API_ID);

exec("python -c \"import os; print('PY TELEGRAM_API_ID:', os.getenv('TELEGRAM_API_ID'))\"", (err, stdout, stderr) => {
    console.log(stdout);
});
