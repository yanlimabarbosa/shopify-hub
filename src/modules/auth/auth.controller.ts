import { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";
import bcrypt from "bcrypt";
import { signToken } from "../../utils/jwt.js";
import { AuthedRequest } from "../../middlewares/requireAuth.js";

// TODO: add input validation
export async function register(req: Request, res: Response) {
  const { name, email, password, role } = req.body as { name: string; email: string; password: string; role?: "ADMIN" | "USER" };

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: role ?? "USER" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken({ sub: user.id, role: user.role });
  return res.json({ token });
}

export async function me(req: AuthedRequest, res: Response) {
  const id = req.user!.id;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return res.json(user);
}
