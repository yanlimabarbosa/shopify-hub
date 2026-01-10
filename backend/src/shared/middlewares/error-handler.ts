import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";
import { ValidationError } from "../errors/validation-error.js";
import { logger } from "../../utils/logger.js";
import { env } from "../../config/env.js";

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

    if (env.NODE_ENV === "development") {
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

  logger.error(
    {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
    },
    "Unhandled error"
  );

  const response: ErrorResponse = {
    status: "error",
    message: "Internal server error",
  };

  if (env.NODE_ENV === "development") {
    response.stack = error.stack;
    response.details = error.message;
  }

  return res.status(500).json(response);
}
