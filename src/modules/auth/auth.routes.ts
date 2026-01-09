import { Router } from "express";
import { register, login, me } from "./auth.controller.js";
import { requireAuth } from "../../middlewares/requireAuth.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", requireAuth, me);
