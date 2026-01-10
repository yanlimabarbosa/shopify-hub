import { Request, Response } from "express";
import { webhooksService } from "./webhooks.service.js";
import { WebhookValidationError } from "../../shared/errors/shopify-errors.js";
import { logger } from "../../utils/logger.js";
import { safeJsonParse } from "../../utils/axios-error-handler.js";
import {
  registerWebhooksBodySchema,
  registerWebhooksQuerySchema,
  webhookHeadersSchema,
  type ShopifyWebhookPayload,
} from "./webhooks.types.js";

export async function registerWebhooks(req: Request, res: Response): Promise<Response> {
  const bodyResult = registerWebhooksBodySchema.safeParse(req.body);
  const queryResult = registerWebhooksQuerySchema.safeParse(req.query);
  const shopDomain = bodyResult.data?.shop || queryResult.data?.shop || undefined;

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

  const headersResult = webhookHeadersSchema.safeParse({
    "x-shopify-hmac-sha256": req.headers["x-shopify-hmac-sha256"],
    "x-shopify-topic": req.headers["x-shopify-topic"],
    "x-shopify-shop-domain": req.headers["x-shopify-shop-domain"],
  });

  if (!headersResult.success) {
    logger.warn({ issues: headersResult.error.issues }, "Missing required webhook headers");
    throw new WebhookValidationError("Missing required webhook headers");
  }

  const { "x-shopify-hmac-sha256": hmac, "x-shopify-topic": topic, "x-shopify-shop-domain": shopDomain } =
    headersResult.data;

  logger.debug(
    {
      topic,
      shopDomain,
      hasHmac: !!hmac,
    },
    "Webhook headers received"
  );

  logger.debug("Validating HMAC");
  webhooksService.validateHmac(rawBody, hmac);
  logger.debug("HMAC validation passed");

  let payload: unknown;
  try {
    payload = safeJsonParse(rawBody, "Invalid JSON payload");
    logger.debug("Payload parsed successfully");
  } catch (error) {
    throw new WebhookValidationError("Invalid JSON payload");
  }

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