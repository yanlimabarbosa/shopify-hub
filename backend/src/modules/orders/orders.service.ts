import { ordersRepository } from "./orders.repository.js";

export class OrdersService {
  private readonly DEFAULT_LIMIT = 20;
  private readonly MAX_LIMIT = 100;

  async listOrders(options: {
    limit?: number;
    cursor?: string;
    shop?: string;
  }) {
    const limit = Math.min(
      options.limit || this.DEFAULT_LIMIT,
      this.MAX_LIMIT
    );

    const result = await ordersRepository.findMany({
      limit,
      cursor: options.cursor,
      shopDomain: options.shop,
    });

    const count = await ordersRepository.count(options.shop);

    return {
      orders: result.items,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
      count,
    };
  }
}

export const ordersService = new OrdersService();
