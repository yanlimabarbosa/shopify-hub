import { Request, Response } from "express";

/**
 * TODO (candidato):
 * - Ler shopDomain (ex: query ?shop=) ou escolher a última loja instalada
 * - Buscar accessToken no DB
 * - Chamar Shopify Admin API (REST ou GraphQL)
 * - Upsert em Product/Order
 * - Retornar contagem sincronizada
 */
export async function syncProducts(_req: Request, res: Response) {
  return res.status(501).json({ todo: "Implement products sync" });
}

export async function syncOrders(_req: Request, res: Response) {
  return res.status(501).json({ todo: "Implement orders sync" });
}
