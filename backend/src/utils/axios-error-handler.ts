import axios from "axios";
import { ShopifyAPIError, ShopifyOAuthError } from "../shared/errors/shopify-errors.js";
import { logger } from "./logger.js";

export function handleAxiosError(
  error: unknown,
  context: string,
  customErrorClass: typeof ShopifyAPIError | typeof ShopifyOAuthError = ShopifyAPIError
): never {
  if (axios.isAxiosError(error)) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.errors ||
      error.message ||
      `${context} failed`;
    logger.error({ error: errorMessage, context }, `${context} failed`);
    throw new customErrorClass(errorMessage);
  }
  logger.error({ error, context }, `Unexpected error during ${context}`);
  throw error;
}

export function safeJsonParse<T = unknown>(json: string, errorMessage = "Invalid JSON"): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    logger.error({ error }, errorMessage);
    throw new Error(errorMessage);
  }
}

export function extractAxiosErrorMessage(error: unknown, fallback = "Request failed"): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.response?.data?.errors || error.message || fallback;
  }
  return fallback;
}
