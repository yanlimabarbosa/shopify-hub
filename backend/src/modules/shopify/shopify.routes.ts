import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { authStart, authCallback } from "./shopify.controller.js";

export const shopifyRouter = Router();

// OAuth start requires ADMIN (connecting a shop is privileged)
shopifyRouter.get("/auth", requireAuth, requireRole("ADMIN"), authStart);

// Callback is public (Shopify redirects here, validated via OAuth code)
shopifyRouter.get("/callback", authCallback);
