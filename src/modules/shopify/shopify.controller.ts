import { Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "../../config/prisma.js";

/**
 * TODO (candidato):
 * Implementar OAuth Shopify:
 * - /shopify/auth?shop=...
 *   - gerar state
 *   - redirecionar para authorize URL
 * - /shopify/callback
 *   - validar state + HMAC (querystring) se desejar
 *   - trocar code por access_token via Shopify
 *   - salvar/atualizar Shop no DB
 */
export async function authStart(req: Request, res: Response) {
  const shop = String(req.query.shop || "");
  if (!shop.endsWith(".myshopify.com")) return res.status(400).json({ error: "Invalid shop domain" });

  const state = crypto.randomBytes(16).toString("hex");
  // TODO: persistir state (cookie/sessão/DB) para validação
  const apiKey = process.env.SHOPIFY_API_KEY!;
  const scopes = process.env.SHOPIFY_SCOPES!;
  const redirectUri = process.env.SHOPIFY_REDIRECT_URI!;

  const url = new URL(`https://${shop}/admin/oauth/authorize`);
  url.searchParams.set("client_id", apiKey);
  url.searchParams.set("scope", scopes);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);

  return res.redirect(url.toString());
}

export async function authCallback(req: Request, res: Response) {
  // TODO: trocar code por token e salvar no banco
  return res.status(501).json({ todo: "Implement Shopify OAuth callback" });
}
