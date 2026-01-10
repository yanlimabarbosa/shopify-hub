import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { syncProducts, syncOrders } from "./sync.controller.js";

export const syncRouter = Router();

syncRouter.post("/products", requireAuth, requireRole("ADMIN"), syncProducts);
syncRouter.post("/orders", requireAuth, requireRole("ADMIN"), syncOrders);
