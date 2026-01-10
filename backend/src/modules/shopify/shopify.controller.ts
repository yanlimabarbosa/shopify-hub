import { Request, Response } from "express";
import { shopifyService } from "./shopify.service.js";
import { authStartSchema, authCallbackSchema } from "./shopify.types.js";
import type { AuthStartInput, AuthCallbackInput } from "./shopify.types.js";

export async function authStart(req: Request, res: Response): Promise<Response | void> {
  const validatedInput: AuthStartInput = authStartSchema.parse(req.query);
  const oauthUrl = shopifyService.generateOAuthUrl(validatedInput);

  // If request is from API (has Authorization header or Accept: application/json), return JSON
  if (req.headers.authorization || req.headers.accept?.includes("application/json")) {
    return res.json({ oauthUrl });
  }

  // Otherwise, redirect (browser request)
  res.redirect(oauthUrl);
}

export async function authCallback(req: Request, res: Response): Promise<Response | void> {
  const validatedInput: AuthCallbackInput = authCallbackSchema.parse(req.query);

  try {
    await shopifyService.completeOAuth(validatedInput);

    // Get frontend URL from env or default
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";

    // Redirect to frontend callback page with success
    const redirectUrl = new URL(`${frontendUrl}/shopify-callback`);
    redirectUrl.searchParams.set("code", validatedInput.code);
    redirectUrl.searchParams.set("shop", validatedInput.shop);
    if (validatedInput.hmac) {
      redirectUrl.searchParams.set("hmac", validatedInput.hmac);
    }
    redirectUrl.searchParams.set("status", "success");

    res.redirect(redirectUrl.toString());
  } catch (error) {
    // On error, redirect to frontend with error status
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";
    const redirectUrl = new URL(`${frontendUrl}/shopify-callback`);
    redirectUrl.searchParams.set("status", "error");
    redirectUrl.searchParams.set("message", error instanceof Error ? error.message : "OAuth failed");

    res.redirect(redirectUrl.toString());
  }
}
