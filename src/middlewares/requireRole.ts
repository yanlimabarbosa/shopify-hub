import { Response, NextFunction } from "express";
import { AuthedRequest } from "./requireAuth.js";
import { UnauthorizedError, ForbiddenError } from "../shared/errors/AuthErrors.js";

export function requireRole(...roles: Array<"ADMIN" | "USER">) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role) {
      throw new UnauthorizedError("Unauthenticated");
    }
    if (!roles.includes(role)) {
      throw new ForbiddenError("Insufficient permissions");
    }
    return next();
  };
}
