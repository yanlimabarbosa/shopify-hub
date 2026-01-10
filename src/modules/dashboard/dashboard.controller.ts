import { Request, Response } from "express";
import { dashboardService } from "./dashboard.service.js";

export async function getDashboard(_req: Request, res: Response): Promise<Response> {
  try {
    const stats = await dashboardService.getDashboardStats();
    return res.status(200).json(stats);
  } catch (error) {
    throw error;
  }
}
