import { prisma } from "../../config/prisma.js";

export class OrdersRepository {
  async findMany(options: {
    limit: number;
    cursor?: string;
    shopDomain?: string;
  }) {
    const { limit, cursor, shopDomain } = options;

    const where: any = {};

    if (shopDomain) {
      where.shop = {
        shopDomain,
      };
    }

    let orders;

    if (cursor) {
      const cursorExists = await prisma.order.findUnique({
        where: { id: cursor },
        select: { id: true },
      });

      if (!cursorExists) {
        return {
          items: [],
          nextCursor: null,
          hasMore: false,
        };
      }
    }

    orders = await prisma.order.findMany({
      take: limit + 1, // Take one extra to check if there's more
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
    const where: any = {};

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
