import { Request, Response } from "express";
import { shopifyService } from "./shopify.service.js";
import { authStartSchema, authCallbackSchema } from "./shopify.types.js";
import type { AuthStartInput, AuthCallbackInput } from "./shopify.types.js";
import { env } from "../../config/env.js";

export async function authStart(req: Request, res: Response): Promise<Response | void> {
  const validatedInput: AuthStartInput = authStartSchema.parse(req.query);
  const oauthUrl = shopifyService.generateOAuthUrl(validatedInput);

  if (req.headers.authorization || req.headers.accept?.includes("application/json")) {
    return res.json({ oauthUrl });
  }

  res.redirect(oauthUrl);
}

export async function authCallback(req: Request, res: Response): Promise<Response | void> {
  const validatedInput: AuthCallbackInput = authCallbackSchema.parse(req.query);

  try {
    await shopifyService.completeOAuth(validatedInput);

    const frontendUrl = env.FRONTEND_URL || "http://localhost:8080";
    const redirectUrl = new URL(`${frontendUrl}/shopify-callback`);
    redirectUrl.searchParams.set("code", validatedInput.code);
    redirectUrl.searchParams.set("shop", validatedInput.shop);
    if (validatedInput.hmac) {
      redirectUrl.searchParams.set("hmac", validatedInput.hmac);
    }
    redirectUrl.searchParams.set("status", "success");

    res.redirect(redirectUrl.toString());
  } catch (error) {
    const frontendUrl = env.FRONTEND_URL || "http://localhost:8080";
    const redirectUrl = new URL(`${frontendUrl}/shopify-callback`);
    redirectUrl.searchParams.set("status", "error");
    redirectUrl.searchParams.set("message", error instanceof Error ? error.message : "OAuth failed");

    res.redirect(redirectUrl.toString());
  }
}

export async function getAllShops(req: Request, res: Response): Promise<Response> {
  const shops = await shopifyService.getAllShops();
  return res.json(shops);
}