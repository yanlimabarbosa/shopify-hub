import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { registerWebhooks, receiveWebhook } from "./webhooks.controller.js";

export const webhooksRouter = Router();

webhooksRouter.post("/register", requireAuth, requireRole("ADMIN"), registerWebhooks);
webhooksRouter.post("/shopify", receiveWebhook);
