import { Request, Response } from "express";

/**
 * TODO (candidato):
 * - /webhooks/register: criar webhooks na Shopify apontando para WEBHOOK_BASE_URL + /webhooks/shopify
 * - /webhooks/shopify:
 *   - validar HMAC assinatura (X-Shopify-Hmac-Sha256) usando body RAW
 *   - ler headers: X-Shopify-Topic, X-Shopify-Shop-Domain
 *   - salvar evento (opcional) e atualizar Product/Order conforme topic
 */
export async function registerWebhooks(_req: Request, res: Response) {
  return res.status(501).json({ todo: "Implement webhook registration" });
}

export async function receiveWebhook(_req: Request, res: Response) {
  return res.status(501).json({ todo: "Implement webhook receiver with HMAC validation" });
}
