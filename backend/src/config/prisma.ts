import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger.js";
import { env } from "./env.js";

export const prisma = new PrismaClient({
  log:
    env.NODE_ENV === "development"
      ? [
          { level: "query", emit: "event" },
          { level: "error", emit: "event" },
          { level: "warn", emit: "event" },
        ]
      : [{ level: "error", emit: "event" }],
});

if (env.NODE_ENV === "development") {
  prisma.$on("query", (e) => {
    logger.debug({ query: e.query, duration: `${e.duration}ms` }, "Prisma query");
  });
}

prisma.$on("error", (e) => {
  logger.error({ error: e.message }, "Prisma error");
});

prisma.$on("warn", (e) => {
  logger.warn({ message: e.message }, "Prisma warning");
});

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
  logger.info("Prisma client disconnected");
});
