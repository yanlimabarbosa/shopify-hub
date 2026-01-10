import { AppError } from "./app-error.js";

export class InvalidShopDomainError extends AppError {
  constructor() {
    super("Invalid shop domain", 400);
    this.name = "InvalidShopDomainError";
  }
}

export class ShopifyOAuthError extends AppError {
  constructor(message = "Shopify OAuth failed") {
    super(message, 400);
    this.name = "ShopifyOAuthError";
  }
}

export class ShopifyAPIError extends AppError {
  constructor(message = "Shopify API request failed") {
    super(message, 502);
    this.name = "ShopifyAPIError";
  }
}

export class ShopNotFoundError extends AppError {
  constructor() {
    super("Shop not found", 404);
    this.name = "ShopNotFoundError";
  }
}

export class MissingShopifyCredentialsError extends AppError {
  constructor() {
    super("Missing Shopify API credentials", 500);
    this.name = "MissingShopifyCredentialsError";
  }
}

export class WebhookValidationError extends AppError {
  constructor(message = "Webhook validation failed") {
    super(message, 401);
    this.name = "WebhookValidationError";
  }
}

export class WebhookRegistrationError extends AppError {
  constructor(message = "Failed to register webhook") {
    super(message, 502);
    this.name = "WebhookRegistrationError";
  }
}
