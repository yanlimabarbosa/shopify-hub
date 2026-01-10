import { prisma } from "../../config/prisma.js";
import { Prisma } from "@prisma/client";
import type { ShopifyWebhookPayload } from "./webhooks.types.js";

function isJsonValue(value: unknown): value is Prisma.InputJsonValue {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    (typeof value === "object" && !Array.isArray(value)) ||
    Array.isArray(value)
  );
}

export class WebhooksRepository {
  async findExistingWebhook(data: {
    shopId: string;
    topic: string;
    webhookId: string;
  }) {
    return prisma.webhookEvent.findFirst({
      where: {
        shopId: data.shopId,
        topic: data.topic,
        payloadJson: {
          path: ["id"],
          equals: data.webhookId,
        },
      },
      select: {
        id: true,
        receivedAt: true,
      },
    });
  }

  async saveWebhookEvent(data: {
    shopId: string;
    topic: string;
    payloadJson: ShopifyWebhookPayload;
  }) {
    if (!isJsonValue(data.payloadJson)) {
      throw new Error("Invalid JSON value for payloadJson");
    }

    return prisma.webhookEvent.create({
      data: {
        shopId: data.shopId,
        topic: data.topic,
        payloadJson: data.payloadJson,
      },
    });
  }
}

export const webhooksRepository = new WebhooksRepository();
