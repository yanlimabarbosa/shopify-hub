import { Request, Response } from "express";
import { shopifyService } from "./shopify.service.js";
import { authStartSchema, authCallbackSchema } from "./shopify.types.js";
import type { AuthStartInput, AuthCallbackInput } from "./shopify.types.js";

export async function authStart(req: Request, res: Response): Promise<void> {
  const validatedInput: AuthStartInput = authStartSchema.parse(req.query);
  const oauthUrl = shopifyService.generateOAuthUrl(validatedInput);
  res.redirect(oauthUrl);
}

export async function authCallback(req: Request, res: Response): Promise<Response> {
  const validatedInput: AuthCallbackInput = authCallbackSchema.parse(req.query);
  const shop = await shopifyService.completeOAuth(validatedInput);

  return res.json({
    message: "Shopify app installed successfully",
    shop: {
      shopDomain: shop.shopDomain,
      scopes: shop.scopes,
      installedAt: shop.installedAt,
    },
  });
}
