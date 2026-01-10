import crypto from "node:crypto";
import axios from "axios";
import { shopifyRepository } from "../shopify/shopify.repository.js";
import { webhooksRepository } from "./webhooks.repository.js";
import {
  ShopNotFoundError,
  MissingShopifyCredentialsError,
  WebhookValidationError,
} from "../../shared/errors/ShopifyErrors.js";
import type {
  WebhookTopic,
  ShopifyWebhookPayload,
  WebhookRegistrationResult,
  WebhookEventData,
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
    const apiSecret = process.env.SHOPIFY_API_SECRET;
    const webhookBaseUrl = process.env.WEBHOOK_BASE_URL;

    if (!apiSecret || !webhookBaseUrl) {
      throw new MissingShopifyCredentialsError();
    }

    return { apiSecret, webhookBaseUrl };
  }

  validateHmac(rawBody: string, hmac: string): void {
    const { apiSecret } = this.getCredentials();

    const calculatedHmac = crypto
      .createHmac("sha256", apiSecret)
      .update(rawBody, "utf8")
      .digest("base64");

    // Timing-safe comparison
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

        const existing = existingWebhooks.data.webhooks?.find(
          (wh: any) => wh.address === webhookUrl && wh.topic === topic
        );

        if (existing) {
          results.push({
            topic,
            status: "exists",
            webhookId: existing.id,
          });
          continue;
        }

        // Create new webhook
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

        results.push({
          topic,
          status: "created",
          webhookId: response.data.webhook?.id,
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.errors || error.message || "Failed to register webhook";
          results.push({
            topic,
            status: "error",
            error: errorMessage,
          });
        } else {
          results.push({
            topic,
            status: "error",
            error: "Unknown error",
          });
        }
      }
    }

    return results;
  }

  async processWebhook(data: WebhookEventData): Promise<void> {
    const { topic, shopDomain, payload } = data;

    const shop = await shopifyRepository.findShopByDomain(shopDomain);
    if (!shop) {
      throw new ShopNotFoundError();
    }

    try {
      await webhooksRepository.saveWebhookEvent({
        shopId: shop.id,
        topic,
        payloadJson: payload,
      });
    } catch (error) {
      console.error("Failed to save webhook event:", error);
    }

    // Process based on topic
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
        console.warn(`Unknown webhook topic: ${topic}`);
    }
  }

  private async handleProductWebhook(shopId: string, payload: ShopifyWebhookPayload): Promise<void> {
    if (!payload.id || !payload.title) {
      console.warn("Invalid product webhook payload:", payload);
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
      console.warn("Invalid order webhook payload:", payload);
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
