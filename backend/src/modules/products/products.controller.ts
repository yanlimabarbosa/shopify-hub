import { Request, Response } from "express";
import { productsService } from "./products.service.js";

function getStringValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  return undefined;
}

export async function listProducts(req: Request, res: Response): Promise<Response> {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const cursor = getStringValue(req.query.cursor);
  const shop = getStringValue(req.query.shop);

  const result = await productsService.listProducts({
    limit,
    cursor,
    shop,
  });

  return res.status(200).json(result);
}
