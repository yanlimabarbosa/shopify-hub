import { Request, Response } from "express";
import { AuthedRequest } from "../../middlewares/requireAuth.js";
import { authService } from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.types.js";
import type { RegisterInput, LoginInput } from "./auth.types.js";

export async function register(req: Request, res: Response): Promise<Response> {
  const validatedInput: RegisterInput = registerSchema.parse(req.body);
  const user = await authService.register(validatedInput);
  return res.status(201).json(user);
}

export async function login(req: Request, res: Response): Promise<Response> {
  const validatedInput: LoginInput = loginSchema.parse(req.body);
  const result = await authService.login(validatedInput);
  return res.json(result);
}

export async function me(req: AuthedRequest, res: Response): Promise<Response> {
  const userId = req.user!.id;
  const user = await authService.getUserProfile(userId);
  return res.json(user);
}
