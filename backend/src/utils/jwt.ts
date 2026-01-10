import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type JwtPayload = {
  sub: string;
  role: "ADMIN" | "USER";
};

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "8h" });
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Invalid token payload");
  }

  if (!("sub" in decoded) || typeof decoded.sub !== "string") {
    throw new Error("Token missing 'sub' field");
  }

  if (!("role" in decoded) || (decoded.role !== "ADMIN" && decoded.role !== "USER")) {
    throw new Error("Token missing or invalid 'role' field");
  }

  return {
    sub: decoded.sub,
    role: decoded.role,
  };
}
