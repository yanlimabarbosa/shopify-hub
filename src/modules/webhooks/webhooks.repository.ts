import { prisma } from "../../config/prisma.js";
import type { ShopifyWebhookPayload } from "./webhooks.types.js";

export class WebhooksRepository {
  async saveWebhookEvent(data: {
    shopId: string;
    topic: string;
    payloadJson: ShopifyWebhookPayload;
  }) {
    return prisma.webhookEvent.create({
      data: {
        shopId: data.shopId,
        topic: data.topic,
        payloadJson: data.payloadJson as any,
      },
    });
  }
}

export const webhooksRepository = new WebhooksRepository();
