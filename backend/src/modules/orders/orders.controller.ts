import { Request, Response } from "express";
import { ordersService } from "./orders.service.js";

export async function listOrders(req: Request, res: Response): Promise<Response> {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const cursor = req.query.cursor as string | undefined;
    const shop = req.query.shop as string | undefined;

    const result = await ordersService.listOrders({
      limit,
      cursor,
      shop,
    });

    return res.status(200).json(result);
  } catch (error) {
    throw error;
  }
}
