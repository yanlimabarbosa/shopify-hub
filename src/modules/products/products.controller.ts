import { Request, Response } from "express";
import { productsService } from "./products.service.js";

export async function listProducts(req: Request, res: Response): Promise<Response> {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const cursor = req.query.cursor as string | undefined;
    const shop = req.query.shop as string | undefined;

    const result = await productsService.listProducts({
      limit,
      cursor,
      shop,
    });

    return res.status(200).json(result);
  } catch (error) {
    throw error;
  }
}
