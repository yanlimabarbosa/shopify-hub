import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { listProducts } from "./products.controller.js";

export const productsRouter = Router();
productsRouter.get("/", requireAuth, listProducts);
