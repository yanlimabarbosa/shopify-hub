import { Request, Response } from "express";
import { productsService } from "./products.service.js";
import { listProductsQuerySchema } from "./products.types.js";

export async function listProducts(req: Request, res: Response): Promise<Response> {
  const validatedQuery = listProductsQuerySchema.parse(req.query);

  const result = await productsService.listProducts({
    limit: validatedQuery.limit,
    cursor: validatedQuery.cursor,
    shop: validatedQuery.shop,
  });

  return res.status(200).json(result);
}
