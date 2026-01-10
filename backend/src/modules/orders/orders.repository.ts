import { prisma } from "../../config/prisma.js";
import { Prisma } from "@prisma/client";

export class OrdersRepository {
  async findMany(options: {
    limit: number;
    cursor?: string;
    shopDomain?: string;
  }) {
    const { limit, cursor, shopDomain } = options;

    const where: Prisma.OrderWhereInput = {};

    if (shopDomain) {
      where.shop = {
        shopDomain,
      };
    }

    const orders = await prisma.order.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      where,
      include: {
        shop: {
          select: {
            shopDomain: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    const hasMore = orders.length > limit;
    const items = hasMore ? orders.slice(0, limit) : orders;
    const nextCursor = hasMore ? items.at(-1)?.id ?? null : null;

    return {
      items,
      nextCursor,
      hasMore,
    };
  }

  async count(shopDomain?: string) {
    const where: Prisma.OrderWhereInput = {};

    if (shopDomain) {
      where.shop = {
        shopDomain,
      };
    }

    return prisma.order.count({ where });
  }

  async countLast24Hours() {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    return prisma.order.count({
      where: {
        createdAtShopify: {
          gte: last24h,
        },
      },
    });
  }
}

export const ordersRepository = new OrdersRepository();