import { productsRepository } from "./products.repository.js";

export class ProductsService {
  private readonly DEFAULT_LIMIT = 20;
  private readonly MAX_LIMIT = 100;

  async listProducts(options: {
    limit?: number;
    cursor?: string;
    shop?: string;
  }) {
    const limit = Math.min(
      options.limit || this.DEFAULT_LIMIT,
      this.MAX_LIMIT
    );

    const result = await productsRepository.findMany({
      limit,
      cursor: options.cursor,
      shopDomain: options.shop,
    });

    const count = await productsRepository.count(options.shop);

    return {
      products: result.items,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
      count,
    };
  }
}

export const productsService = new ProductsService();
