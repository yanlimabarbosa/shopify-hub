export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
};

export type LoginResponse = {
  token: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type Product = {
  id: string;
  shopifyId: string;
  shopId: string;
  title: string;
  status: string;
  vendor: string | null;
  createdAt: string;
  updatedAt: string;
  createdAtShopify: string | null;
  updatedAtShopify: string | null;
};

export type ProductsResponse = {
  products: Product[];
  nextCursor: string | null;
  hasMore: boolean;
  count: number;
};

export type Order = {
  id: string;
  shopifyId: string;
  shopId: string;
  name: string;
  totalPrice: string;
  currency: string;
  financialStatus: string | null;
  createdAt: string;
  updatedAt: string;
  createdAtShopify: string | null;
  updatedAtShopify: string | null;
};

export type OrdersResponse = {
  orders: Order[];
  nextCursor: string | null;
  hasMore: boolean;
  count: number;
};

export type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  ordersLast24h: number;
};

export type SyncResponse = {
  message: string;
  syncedCount: number;
  shop: string;
};

export type WebhookResult = {
  topic: string;
  status: "created" | "exists" | "error";
  webhookId?: number;
  error?: string;
};

export type WebhooksResponse = {
  message: string;
  webhooks: WebhookResult[];
  success: boolean;
};

export type ShopifyAuthResponse = {
  message: string;
  shop: {
    shopDomain: string;
    scopes: string;
    installedAt: string;
  };
};
