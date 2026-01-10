import { AppError } from "./AppError.js";

export class EmailAlreadyExistsError extends AppError {
  constructor() {
    super("Email already registered", 409);
    this.name = "EmailAlreadyExistsError";
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("Invalid credentials", 401);
    this.name = "InvalidCredentialsError";
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super("User not found", 404);
    this.name = "UserNotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}
