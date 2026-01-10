import { Router } from "express";

import { authRouter } from "./modules/auth/auth.routes.js";
import { shopifyRouter } from "./modules/shopify/shopify.routes.js";
import { syncRouter } from "./modules/sync/sync.routes.js";
import { webhooksRouter } from "./modules/webhooks/webhooks.routes.js";
import { productsRouter } from "./modules/products/products.routes.js";
import { ordersRouter } from "./modules/orders/orders.routes.js";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes.js";

export const router = Router();

router.use("/auth", authRouter);
router.use("/shopify", shopifyRouter);
router.use("/sync", syncRouter);
router.use("/webhooks", webhooksRouter);
router.use("/products", productsRouter);
router.use("/orders", ordersRouter);
router.use("/dashboard", dashboardRouter);
