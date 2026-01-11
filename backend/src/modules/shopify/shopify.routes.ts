import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { authStart, authCallback, getAllShops } from "./shopify.controller.js";

export const shopifyRouter = Router();

shopifyRouter.get("/auth", requireAuth, requireRole("ADMIN"), authStart);

shopifyRouter.get("/callback", authCallback);

shopifyRouter.get("/shops", requireAuth, getAllShops);
