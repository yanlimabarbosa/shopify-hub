import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { listOrders } from "./orders.controller.js";

export const ordersRouter = Router();
ordersRouter.get("/", requireAuth, listOrders);
