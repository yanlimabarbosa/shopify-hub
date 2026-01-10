import { AppError } from "./AppError.js";
import { ZodError, ZodIssue } from "zod";

export class ValidationError extends AppError {
  public readonly details: ZodIssue[];

  constructor(zodError: ZodError) {
    super("Validation failed", 400);
    this.name = "ValidationError";
    this.details = zodError.issues;
  }
}
