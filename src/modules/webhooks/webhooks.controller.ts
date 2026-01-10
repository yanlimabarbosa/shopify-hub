import { Request, Response } from "express";
import { webhooksService } from "./webhooks.service.js";
import { WebhookValidationError } from "../../shared/errors/ShopifyErrors.js";

export async function registerWebhooks(req: Request, res: Response): Promise<Response> {
  try {
    console.log("Registering webhooks...");
    const shopDomain = (req.body?.shop as string) || (req.query?.shop as string) || undefined;

    const results = await webhooksService.registerWebhooks(shopDomain);

    const allCreated = results.every((r) => r.status === "created" || r.status === "exists");
    const hasErrors = results.some((r) => r.status === "error");

    return res.status(hasErrors ? 207 : 200).json({
      message: "Webhook registration completed",
      webhooks: results,
      success: allCreated && !hasErrors,
    });
  } catch (error) {
    throw error;
  }
}

export async function receiveWebhook(req: Request, res: Response): Promise<Response> {
  try {
    console.log("🔥🔥🔥 WEBHOOK CONTROLLER EXECUTED 🔥🔥🔥");
    console.log(`Request URL: ${req.url}`);
    console.log(`Request Method: ${req.method}`);

    const rawBody = (req as any).rawBody as string;
    console.log("Raw body exists:", !!rawBody);
    if (!rawBody) {
      throw new WebhookValidationError("Raw body is required for HMAC validation");
    }

    const hmac = req.headers["x-shopify-hmac-sha256"] as string;
    const topic = req.headers["x-shopify-topic"] as string;
    const shopDomain = req.headers["x-shopify-shop-domain"] as string;

    console.log("Webhook Headers:");
    console.log("  Topic:", topic);
    console.log("  Shop Domain:", shopDomain);
    console.log("  HMAC exists:", !!hmac);

    if (!hmac || !topic || !shopDomain) {
      console.error("❌ Missing required webhook headers");
      throw new WebhookValidationError("Missing required webhook headers");
    }

    console.log("✅ Validating HMAC...");
    webhooksService.validateHmac(rawBody, hmac);
    console.log("✅ HMAC validation passed");

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
      console.log("✅ Payload parsed, processing webhook...");
    } catch (error) {
      console.error("❌ Invalid JSON payload:", error);
      throw new WebhookValidationError("Invalid JSON payload");
    }

    await webhooksService.processWebhook({
      topic,
      shopDomain,
      payload,
    });

    console.log("✅ Webhook processed successfully");
    return res.status(200).json({ received: true });
  } catch (error) {
    throw error;
  }
}