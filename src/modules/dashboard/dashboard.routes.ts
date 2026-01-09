import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { getDashboard } from "./dashboard.controller.js";

export const dashboardRouter = Router();
dashboardRouter.get("/", requireAuth, requireRole("ADMIN"), getDashboard);
