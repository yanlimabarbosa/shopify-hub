import { prisma } from "../../config/prisma.js";
import { ordersRepository } from "../orders/orders.repository.js";

export class DashboardService {
  async getDashboardStats() {
    // Total products
    const totalProducts = await prisma.product.count();

    // Total orders
    const totalOrders = await prisma.order.count();

    // Orders in last 24 hours
    const ordersLast24h = await ordersRepository.countLast24Hours();

    return {
      totalProducts,
      totalOrders,
      ordersLast24h,
    };
  }
}

export const dashboardService = new DashboardService();
