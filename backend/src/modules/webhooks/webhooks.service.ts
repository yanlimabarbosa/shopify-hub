import crypto from "node:crypto";
import axios from "axios";
import { shopifyRepository } from "../shopify/shopify.repository.js";
import { webhooksRepository } from "./webhooks.repository.js";
import {
  ShopNotFoundError,
  WebhookValidationError,
  WebhookRegistrationError,
} from "../../shared/errors/shopify-errors.js";
import { logger } from "../../utils/logger.js";
import { env } from "../../config/env.js";
import { handleAxiosError, extractAxiosErrorMessage } from "../../utils/axios-error-handler.js";
import {
  shopifyWebhooksListResponseSchema,
  shopifyWebhookCreateResponseSchema,
  type WebhookTopic,
  type ShopifyWebhookPayload,
  type WebhookRegistrationResult,
  type WebhookEventData,
} from "./webhooks.types.js";

export class WebhooksService {
  private readonly API_VERSION = "2024-01";
  private readonly REQUIRED_TOPICS: WebhookTopic[] = [
    "products/create",
    "products/update",
    "orders/create",
    "orders/updated",
  ];

  private getCredentials() {
    return {
      apiSecret: env.SHOPIFY_API_SECRET,
      webhookBaseUrl: env.WEBHOOK_BASE_URL,
    };
  }

  validateHmac(rawBody: string, hmac: string): void {
    const { apiSecret } = this.getCredentials();

    const calculatedHmac = crypto
      .createHmac("sha256", apiSecret)
      .update(rawBody, "utf8")
      .digest("base64");

    if (!crypto.timingSafeEqual(Buffer.from(calculatedHmac), Buffer.from(hmac))) {
      throw new WebhookValidationError("Invalid HMAC signature");
    }
  }

  async registerWebhooks(shopDomain?: string): Promise<WebhookRegistrationResult[]> {
    const shop = shopDomain
      ? await shopifyRepository.findShopByDomain(shopDomain)
      : await shopifyRepository.getFirstShop();

    if (!shop) {
      throw new ShopNotFoundError();
    }

    logger.info({ shopDomain: shop.shopDomain }, "Starting webhook registration");

    const { webhookBaseUrl } = this.getCredentials();
    const webhookUrl = `${webhookBaseUrl}/webhooks/shopify`;
    const results: WebhookRegistrationResult[] = [];

    for (const topic of this.REQUIRED_TOPICS) {
      try {
        const existingWebhooks = await axios.get(
          `https://${shop.shopDomain}/admin/api/${this.API_VERSION}/webhooks.json`,
          {
            headers: {
              "X-Shopify-Access-Token": shop.accessToken,
            },
            params: {
              topic,
            },
          }
        );

        const webhooksListResult = shopifyWebhooksListResponseSchema.safeParse(existingWebhooks.data);

        if (!webhooksListResult.success) {
          logger.error({ errors: webhooksListResult.error.issues }, "Invalid webhooks list response");
          throw new Error("Invalid webhooks list response");
        }

        const existing = webhooksListResult.data.webhooks?.find(
          (wh) => wh.address === webhookUrl && wh.topic === topic
        );

        if (existing) {
          logger.debug({ topic, shopDomain: shop.shopDomain }, "Webhook already exists");
          results.push({
            topic,
            status: "exists",
            webhookId: existing.id,
          });
          continue;
        }

        const response = await axios.post(
          `https://${shop.shopDomain}/admin/api/${this.API_VERSION}/webhooks.json`,
          {
            webhook: {
              topic,
              address: webhookUrl,
              format: "json",
            },
          },
          {
            headers: {
              "X-Shopify-Access-Token": shop.accessToken,
              "Content-Type": "application/json",
            },
          }
        );

        const createResult = shopifyWebhookCreateResponseSchema.safeParse(response.data);

        if (!createResult.success) {
          logger.error({ errors: createResult.error.issues }, "Invalid webhook create response");
          throw new Error("Invalid webhook create response");
        }

        const webhookId = createResult.data.webhook?.id;

        logger.info({ topic, shopDomain: shop.shopDomain, webhookId }, "Webhook created");
        results.push({
          topic,
          status: "created",
          webhookId,
        });
      } catch (error) {
        const errorMessage = extractAxiosErrorMessage(error, "Failed to register webhook");
        logger.error({ error: errorMessage, topic, shopDomain: shop.shopDomain }, "Webhook registration failed");
        results.push({
          topic,
          status: "error",
          error: errorMessage,
        });
      }
    }

    const successCount = results.filter((r) => r.status === "created" || r.status === "exists").length;
    logger.info(
      { shopDomain: shop.shopDomain, successCount, total: results.length },
      "Webhook registration completed"
    );

    return results;
  }

  async processWebhook(data: WebhookEventData): Promise<void> {
    const { topic, shopDomain, payload } = data;

    const shop = await shopifyRepository.findShopByDomain(shopDomain);
    if (!shop) {
      throw new ShopNotFoundError();
    }

    const webhookId = payload.id?.toString();
    if (webhookId) {
      const existing = await webhooksRepository.findExistingWebhook({
        shopId: shop.id,
        topic,
        webhookId,
      });

      if (existing) {
        logger.info(
          { webhookId, topic, shopDomain, receivedAt: existing.receivedAt },
          "Webhook already processed, skipping"
        );
        return;
      }
    }

    try {
      await webhooksRepository.saveWebhookEvent({
        shopId: shop.id,
        topic,
        payloadJson: payload,
      });
    } catch (error) {
      logger.error({ error, shopId: shop.id, topic }, "Failed to save webhook event");
    }

    switch (topic) {
      case "products/create":
      case "products/update":
        await this.handleProductWebhook(shop.id, payload);
        break;

      case "orders/create":
      case "orders/updated":
        await this.handleOrderWebhook(shop.id, payload);
        break;

      default:
        logger.warn({ topic }, "Unknown webhook topic");
    }
  }

  private async handleProductWebhook(shopId: string, payload: ShopifyWebhookPayload): Promise<void> {
    if (!payload.title) {
      logger.warn({ shopId, payload }, "Invalid product webhook payload: missing title");
      return;
    }

    await shopifyRepository.upsertProduct({
      shopifyId: String(payload.id),
      shopId,
      title: payload.title,
      status: payload.status || null,
      vendor: payload.vendor || null,
      createdAtShopify: payload.created_at ? new Date(payload.created_at) : null,
      updatedAtShopify: payload.updated_at ? new Date(payload.updated_at) : null,
    });
  }

  private async handleOrderWebhook(shopId: string, payload: ShopifyWebhookPayload): Promise<void> {
    if (!payload.id) {
      logger.warn({ shopId, payload }, "Invalid order webhook payload");
      return;
    }

    await shopifyRepository.upsertOrder({
      shopifyId: String(payload.id),
      shopId,
      name: payload.name || null,
      totalPrice: payload.total_price || null,
      currency: payload.currency || null,
      financialStatus: payload.financial_status || null,
      createdAtShopify: payload.created_at ? new Date(payload.created_at) : null,
      updatedAtShopify: payload.updated_at ? new Date(payload.updated_at) : null,
    });
  }
}

export const webhooksService = new WebhooksService();
