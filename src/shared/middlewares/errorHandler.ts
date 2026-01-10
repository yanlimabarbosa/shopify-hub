import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";
import { ValidationError } from "../errors/ValidationError.js";

interface ErrorResponse {
  status: "error";
  message: string;
  details?: unknown;
  stack?: string;
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response {
  if (error instanceof AppError) {
    const response: ErrorResponse = {
      status: "error",
      message: error.message,
    };

    if (error instanceof ValidationError) {
      response.details = error.details;
    }

    if (process.env.NODE_ENV === "development") {
      response.stack = error.stack;
    }

    return res.status(error.statusCode).json(response);
  }

  if (error instanceof ZodError) {
    const validationError = new ValidationError(error);
    return res.status(400).json({
      status: "error",
      message: validationError.message,
      details: validationError.details,
    });
  }

  // Log error with full details
  console.error("=".repeat(50));
  console.error("Unhandled error:", error.message);
  console.error("Stack:", error.stack);
  console.error("Request URL:", req.url);
  console.error("Request Method:", req.method);
  if (error instanceof Error && error.stack) {
    console.error("Full Error Stack:", error.stack);
  }
  console.error("=".repeat(50));

  const response: ErrorResponse = {
    status: "error",
    message: "Internal server error",
  };

  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV !== "production") {
    response.stack = error.stack;
    response.details = error.message;
  }

  return res.status(500).json(response);
}
