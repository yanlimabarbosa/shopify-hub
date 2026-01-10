import { prisma } from "../../config/prisma.js";

export class ShopifyRepository {
  async findShopByDomain(shopDomain: string) {
    return prisma.shop.findUnique({
      where: { shopDomain },
    });
  }

  async findShopById(shopId: string) {
    return prisma.shop.findUnique({
      where: { id: shopId },
    });
  }

  async upsertShop(data: {
    shopDomain: string;
    accessToken: string;
    scopes: string;
  }) {
    return prisma.shop.upsert({
      where: { shopDomain: data.shopDomain },
      update: {
        accessToken: data.accessToken,
        scopes: data.scopes,
        installedAt: new Date(),
      },
      create: {
        shopDomain: data.shopDomain,
        accessToken: data.accessToken,
        scopes: data.scopes,
      },
    });
  }

  async getFirstShop() {
    return prisma.shop.findFirst({
      orderBy: { installedAt: "desc" },
    });
  }

  async upsertProduct(data: {
    shopifyId: string;
    shopId: string;
    title: string;
    status: string | null;
    vendor: string | null;
    createdAtShopify: Date | null;
    updatedAtShopify: Date | null;
  }) {
    return prisma.product.upsert({
      where: {
        shopId_shopifyId: {
          shopId: data.shopId,
          shopifyId: data.shopifyId,
        },
      },
      update: {
        title: data.title,
        status: data.status,
        vendor: data.vendor,
        updatedAtShopify: data.updatedAtShopify,
        updatedAtLocal: new Date(),
      },
      create: {
        shopId: data.shopId,
        shopifyId: data.shopifyId,
        title: data.title,
        status: data.status,
        vendor: data.vendor,
        createdAtShopify: data.createdAtShopify,
        updatedAtShopify: data.updatedAtShopify,
      },
    });
  }

  async upsertOrder(data: {
    shopifyId: string;
    shopId: string;
    name: string | null;
    totalPrice: string | null;
    currency: string | null;
    financialStatus: string | null;
    createdAtShopify: Date | null;
    updatedAtShopify: Date | null;
  }) {
    return prisma.order.upsert({
      where: {
        shopId_shopifyId: {
          shopId: data.shopId,
          shopifyId: data.shopifyId,
        },
      },
      update: {
        name: data.name,
        totalPrice: data.totalPrice,
        currency: data.currency,
        financialStatus: data.financialStatus,
        updatedAtShopify: data.updatedAtShopify,
        updatedAtLocal: new Date(),
      },
      create: {
        shopId: data.shopId,
        shopifyId: data.shopifyId,
        name: data.name,
        totalPrice: data.totalPrice,
        currency: data.currency,
        financialStatus: data.financialStatus,
        createdAtShopify: data.createdAtShopify,
        updatedAtShopify: data.updatedAtShopify,
      },
    });
  }
}

export const shopifyRepository = new ShopifyRepository();
