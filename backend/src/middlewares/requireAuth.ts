import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { UnauthorizedError } from "../shared/errors/AuthErrors.js";
import { logger } from "../utils/logger.js";

export type AuthedRequest = Request & { user?: { id: string; role: "ADMIN" | "USER" } };

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    logger.warn({ url: req.url }, "Missing token in request");
    throw new UnauthorizedError("Missing token");
  }

  try {
    const token = header.slice("Bearer ".length);
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    logger.debug({ userId: payload.sub, role: payload.role }, "Token validated");
    return next();
  } catch (error) {
    logger.warn({ url: req.url }, "Invalid token");
    throw new UnauthorizedError("Invalid token");
  }
}
