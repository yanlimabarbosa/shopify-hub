import { z } from "zod";

export const webhookTopics = [
  "products/create",
  "products/update",
  "orders/create",
  "orders/updated",
] as const;

export type WebhookTopic = (typeof webhookTopics)[number];

export type ShopifyWebhookPayload = {
  id: number;
  title?: string;
  status?: string;
  vendor?: string;
  created_at?: string;
  updated_at?: string;
  name?: string;
  total_price?: string;
  currency?: string;
  financial_status?: string;
};

export type WebhookRegistrationResult = {
  topic: WebhookTopic;
  status: "created" | "exists" | "error";
  webhookId?: number;
  error?: string;
};

export type WebhookEventData = {
  topic: string;
  shopDomain: string;
  payload: ShopifyWebhookPayload;
};
