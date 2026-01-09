import { Request, Response } from "express";

/**
 * TODO (candidato):
 * - Paginação por cursor/limit
 * - Filtrar por shop (query ?shop=)
 */
export async function listOrders(_req: Request, res: Response) {
  return res.status(501).json({ todo: "Implement orders list with pagination" });
}
