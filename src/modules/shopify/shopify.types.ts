import { z } from "zod";

export const authStartSchema = z.object({
  shop: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/, {
    message: "Invalid shop domain format",
  }),
});

export const authCallbackSchema = z.object({
  code: z.string().min(1),
  shop: z.string().min(1),
  state: z.string().min(1),
  hmac: z.string().optional(),
});

export type AuthStartInput = z.infer<typeof authStartSchema>;
export type AuthCallbackInput = z.infer<typeof authCallbackSchema>;

export type ShopifyAccessTokenResponse = {
  access_token: string;
  scope: string;
};

export type ShopResponse = {
  id: string;
  shopDomain: string;
  accessToken: string;
  scopes: string;
  installedAt: Date;
};

export type ShopifyProduct = {
  id: number;
  title: string;
  status: string;
  vendor: string;
  created_at: string;
  updated_at: string;
};

export type ShopifyOrder = {
  id: number;
  name: string;
  total_price: string;
  currency: string;
  financial_status: string;
  created_at: string;
  updated_at: string;
};

export type ShopifyProductsResponse = {
  products: ShopifyProduct[];
};

export type ShopifyOrdersResponse = {
  orders: ShopifyOrder[];
};
