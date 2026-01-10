import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { authStart, authCallback } from "./shopify.controller.js";

export const shopifyRouter = Router();

shopifyRouter.get("/auth", authStart);
shopifyRouter.get("/callback", authCallback);
