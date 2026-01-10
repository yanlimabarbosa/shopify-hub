import { z } from "zod";

export const webhookTopics = [
  "products/create",
  "products/update",
  "orders/create",
  "orders/updated",
] as const;

export type WebhookTopic = (typeof webhookTopics)[number];

export const shopifyWebhookPayloadSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  status: z.string().optional(),
  vendor: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  name: z.string().optional(),
  total_price: z.string().optional(),
  currency: z.string().optional(),
  financial_status: z.string().optional(),
});

export type ShopifyWebhookPayload = z.infer<typeof shopifyWebhookPayloadSchema>;

export const shopifyWebhookResponseSchema = z.object({
  id: z.number(),
  address: z.string(),
  topic: z.string(),
});

export const shopifyWebhooksListResponseSchema = z.object({
  webhooks: z.array(shopifyWebhookResponseSchema).optional(),
});

export const shopifyWebhookCreateResponseSchema = z.object({
  webhook: z
    .object({
      id: z.number(),
    })
    .optional(),
});

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

export const registerWebhooksBodySchema = z.object({
  shop: z.string().optional(),
});

export const registerWebhooksQuerySchema = z.object({
  shop: z.string().optional(),
});

export const webhookHeadersSchema = z.object({
  "x-shopify-hmac-sha256": z.string(),
  "x-shopify-topic": z.string(),
  "x-shopify-shop-domain": z.string(),
});
