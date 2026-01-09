import { Response, NextFunction } from "express";
import { AuthedRequest } from "./requireAuth.js";

export function requireRole(...roles: Array<"ADMIN" | "USER">) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role) return res.status(401).json({ error: "Unauthenticated" });
    if (!roles.includes(role)) return res.status(403).json({ error: "Forbidden" });
    return next();
  };
}
