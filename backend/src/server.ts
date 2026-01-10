import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes.js";
import { errorHandler } from "./shared/middlewares/errorHandler.js";
import { logger } from "./utils/logger.js";
import { env } from "./config/env.js";

// Load .env file (validation happens in env.ts)
dotenv.config();

const app = express();

app.use((req, res, next) => {
  logger.info(
    {
      method: req.method,
      url: req.url,
      ip: req.ip,
    },
    "Incoming request"
  );
  next();
});

app.use(cors());

app.use("/webhooks/shopify", express.raw({ type: "application/json" }), (req, res, next) => {
  logger.debug(
    {
      method: req.method,
      url: req.url,
      headers: req.headers,
    },
    "Webhook request received"
  );

  if (Buffer.isBuffer(req.body)) {
    req.rawBody = req.body.toString("utf8");
    logger.debug({ bodyLength: req.rawBody.length }, "Raw body parsed");

    try {
      req.body = JSON.parse(req.rawBody);
      logger.debug("JSON parsed successfully");
    } catch (error) {
      logger.error({ error }, "JSON parsing failed");
    }
  }
  next();
});

app.use(express.json());

app.get("/health", (req, res) => {
  const timestamp = new Date().toISOString();
  logger.debug({ timestamp }, "Health check requested");
  res.json({ ok: true, timestamp });
});

app.use(router);

app.use(errorHandler);

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, nodeEnv: env.NODE_ENV }, "API server started");
});
