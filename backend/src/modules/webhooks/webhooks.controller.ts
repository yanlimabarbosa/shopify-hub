import { Request, Response } from "express";
import { webhooksService } from "./webhooks.service.js";
import { WebhookValidationError } from "../../shared/errors/ShopifyErrors.js";
import { logger } from "../../utils/logger.js";
import type { ShopifyWebhookPayload } from "./webhooks.types.js";

function getStringValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  return undefined;
}

export async function registerWebhooks(req: Request, res: Response): Promise<Response> {
  const shopDomain = getStringValue(req.body?.shop) || getStringValue(req.query?.shop) || undefined;

  const results = await webhooksService.registerWebhooks(shopDomain);

  const allCreated = results.every((r) => r.status === "created" || r.status === "exists");
  const hasErrors = results.some((r) => r.status === "error");

  return res.status(hasErrors ? 207 : 200).json({
    message: "Webhook registration completed",
    webhooks: results,
    success: allCreated && !hasErrors,
  });
}

export async function receiveWebhook(req: Request, res: Response): Promise<Response> {
  logger.debug(
    {
      url: req.url,
      method: req.method,
    },
    "Webhook controller executed"
  );

  const rawBody = req.rawBody;
  if (!rawBody || typeof rawBody !== "string") {
    logger.warn("Webhook request missing raw body");
    throw new WebhookValidationError("Raw body is required for HMAC validation");
  }

  const hmac = getStringValue(req.headers["x-shopify-hmac-sha256"]);
  const topic = getStringValue(req.headers["x-shopify-topic"]);
  const shopDomain = getStringValue(req.headers["x-shopify-shop-domain"]);

  logger.debug(
    {
      topic,
      shopDomain,
      hasHmac: !!hmac,
    },
    "Webhook headers received"
  );

  if (!hmac || !topic || !shopDomain) {
    logger.warn({ hmac: !!hmac, topic: !!topic, shopDomain: !!shopDomain }, "Missing required webhook headers");
    throw new WebhookValidationError("Missing required webhook headers");
  }

  logger.debug("Validating HMAC");
  webhooksService.validateHmac(rawBody, hmac);
  logger.debug("HMAC validation passed");

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
    logger.debug("Payload parsed successfully");
  } catch (error) {
    logger.error({ error }, "Invalid JSON payload");
    throw new WebhookValidationError("Invalid JSON payload");
  }

  // Validate payload structure using Zod
  const { shopifyWebhookPayloadSchema } = await import("./webhooks.types.js");
  const validationResult = shopifyWebhookPayloadSchema.safeParse(payload);

  if (!validationResult.success) {
    logger.error({ issues: validationResult.error.issues }, "Invalid webhook payload structure");
    throw new WebhookValidationError("Invalid payload structure");
  }

  const validatedPayload: ShopifyWebhookPayload = validationResult.data;

  await webhooksService.processWebhook({
    topic,
    shopDomain,
    payload: validatedPayload,
  });

  logger.info({ topic, shopDomain }, "Webhook processed successfully");
  return res.status(200).json({ received: true });
}