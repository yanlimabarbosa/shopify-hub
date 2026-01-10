import { prisma } from "../../config/prisma.js";
import { ordersRepository } from "../orders/orders.repository.js";

export class DashboardService {
  async getDashboardStats() {
    const totalProducts = await prisma.product.count();

    const totalOrders = await prisma.order.count();

    const ordersLast24h = await ordersRepository.countLast24Hours();

    return {
      totalProducts,
      totalOrders,
      ordersLast24h,
    };
  }
}

export const dashboardService = new DashboardService();
