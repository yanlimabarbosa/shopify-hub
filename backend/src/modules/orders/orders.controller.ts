import { Request, Response } from "express";
import { ordersService } from "./orders.service.js";

function getStringValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  return undefined;
}

export async function listOrders(req: Request, res: Response): Promise<Response> {
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const cursor = getStringValue(req.query.cursor);
  const shop = getStringValue(req.query.shop);

  const result = await ordersService.listOrders({
    limit,
    cursor,
    shop,
  });

  return res.status(200).json(result);
}
