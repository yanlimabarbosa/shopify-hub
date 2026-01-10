import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes.js";
import { errorHandler } from "./shared/middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use((req, res, next) => {
  console.log("=".repeat(50));
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("=".repeat(50));
  next();
});

app.use(cors());

app.use("/webhooks/shopify", express.raw({ type: "application/json" }), (req, res, next) => {
  console.log("🔥🔥🔥 WEBHOOK REQUEST RECEIVED 🔥🔥🔥");
  console.log(`Method: ${req.method}, URL: ${req.url}`);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));

  (req as any).rawBody = req.body.toString("utf8");
  console.log("Raw body length:", (req as any).rawBody.length);

  try {
    (req as any).body = JSON.parse((req as any).rawBody);
    console.log("✅ JSON parsed successfully");
  } catch (error) {
    console.error("❌ JSON parsing failed:", error);
  }
  next();
});

app.use(express.json());

app.get("/health", (req, res) => {
  const timestamp = new Date().toISOString();
  console.log("Health check requested at:", timestamp);
  res.json({ ok: true, timestamp });
});

app.use(router);

app.use(errorHandler);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
