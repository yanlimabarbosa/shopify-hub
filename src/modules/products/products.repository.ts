import { prisma } from "../../config/prisma.js";

export class ProductsRepository {
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

    let products;

    if (cursor) {
      const cursorExists = await prisma.product.findUnique({
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

    products = await prisma.product.findMany({
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

    const hasMore = products.length > limit;
    const items = hasMore ? products.slice(0, limit) : products;
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

    return prisma.product.count({ where });
  }
}

export const productsRepository = new ProductsRepository();
