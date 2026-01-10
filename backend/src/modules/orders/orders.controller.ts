import { Request, Response } from "express";
import { ordersService } from "./orders.service.js";
import { listOrdersQuerySchema } from "./orders.types.js";

export async function listOrders(req: Request, res: Response): Promise<Response> {
  const validatedQuery = listOrdersQuerySchema.parse(req.query);

  const result = await ordersService.listOrders({
    limit: validatedQuery.limit,
    cursor: validatedQuery.cursor,
    shop: validatedQuery.shop,
  });

  return res.status(200).json(result);
}
