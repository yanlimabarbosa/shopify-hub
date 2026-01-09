import { Request, Response } from "express";

/**
 * TODO (candidato):
 * - total produtos
 * - total pedidos
 * - pedidos últimas 24h
 */
export async function getDashboard(_req: Request, res: Response) {
  return res.status(501).json({ todo: "Implement dashboard" });
}
