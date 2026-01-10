import { Request, Response } from "express";
import { shopifyService } from "../shopify/shopify.service.js";

export async function syncProducts(req: Request, res: Response): Promise<Response> {
  const shopDomain = req.body.shop || req.query.shop;
  const result = await shopifyService.syncProducts(shopDomain);

  return res.json({
    message: "Products synced successfully",
    syncedCount: result.syncedCount,
    shop: result.shop,
  });
}

export async function syncOrders(req: Request, res: Response): Promise<Response> {
  const shopDomain = req.body.shop || req.query.shop;
  const result = await shopifyService.syncOrders(shopDomain);

  return res.json({
    message: "Orders synced successfully",
    syncedCount: result.syncedCount,
    shop: result.shop,
  });
}
