import crypto from "node:crypto";
import axios from "axios";
import { shopifyRepository } from "./shopify.repository.js";
import {
  ShopifyOAuthError,
  ShopifyAPIError,
  ShopNotFoundError,
  MissingShopifyCredentialsError,
} from "../../shared/errors/shopify-errors.js";
import { logger } from "../../utils/logger.js";
import { env } from "../../config/env.js";
import { handleAxiosError } from "../../utils/axios-error-handler.js";
import type {
  AuthStartInput,
  AuthCallbackInput,
  ShopResponse,
  ShopifyAccessTokenResponse,
  ShopifyProductsResponse,
  ShopifyOrdersResponse,
} from "./shopify.types.js";

export class ShopifyService {
  private readonly API_VERSION = "2024-01";

  private getCredentials() {
    return {
      apiKey: env.SHOPIFY_API_KEY,
      apiSecret: env.SHOPIFY_API_SECRET,
      scopes: env.SHOPIFY_SCOPES,
      redirectUri: env.SHOPIFY_REDIRECT_URI,
    };
  }

  generateOAuthUrl(input: AuthStartInput): string {
    const { apiKey, scopes, redirectUri } = this.getCredentials();
    const state = crypto.randomBytes(16).toString("hex");

    const url = new URL(`https://${input.shop}/admin/oauth/authorize`);
    url.searchParams.set("client_id", apiKey);
    url.searchParams.set("scope", scopes);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("state", state);

    return url.toString();
  }

  async completeOAuth(input: AuthCallbackInput): Promise<ShopResponse> {
    const { apiKey, apiSecret } = this.getCredentials();
    const { code, shop } = input;

    logger.info({ shop }, "Completing OAuth flow");

    try {
      const requestUrl = `https://${shop}/admin/oauth/access_token`;
      const formData = new URLSearchParams();
      formData.append("client_id", apiKey);
      formData.append("client_secret", apiSecret);
      formData.append("code", code);

      const response = await axios.post<ShopifyAccessTokenResponse>(
        requestUrl,
        formData.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token, scope } = response.data;

      const savedShop = await shopifyRepository.upsertShop({
        shopDomain: shop,
        accessToken: access_token,
        scopes: scope,
      });

      logger.info({ shopDomain: shop, scopes: scope }, "OAuth completed successfully");
      return savedShop;
    } catch (error) {
      return handleAxiosError(error, "OAuth", ShopifyOAuthError);
    }
  }

  async syncProducts(shopDomain?: string): Promise<{ syncedCount: number; shop: string }> {
    const shop = shopDomain
      ? await shopifyRepository.findShopByDomain(shopDomain)
      : await shopifyRepository.getFirstShop();

    if (!shop) {
      throw new ShopNotFoundError();
    }

    logger.info({ shopDomain: shop.shopDomain }, "Starting products sync");

    try {
      const response = await axios.get<ShopifyProductsResponse>(
        `https://${shop.shopDomain}/admin/api/${this.API_VERSION}/products.json`,
        {
          headers: {
            "X-Shopify-Access-Token": shop.accessToken,
          },
          params: {
            published_status: "any",
            limit: 250,
          },
        }
      );

      const products = response.data.products || [];

      await Promise.all(
        products.map((product) =>
          shopifyRepository.upsertProduct({
            shopifyId: String(product.id),
            shopId: shop.id,
            title: product.title,
            status: product.status || null,
            vendor: product.vendor || null,
            createdAtShopify: product.created_at ? new Date(product.created_at) : null,
            updatedAtShopify: product.updated_at ? new Date(product.updated_at) : null,
          })
        )
      );

      logger.info(
        { shopDomain: shop.shopDomain, syncedCount: products.length },
        "Products sync completed"
      );

      return {
        syncedCount: products.length,
        shop: shop.shopDomain,
      };
    } catch (error) {
      return handleAxiosError(error, "Products sync", ShopifyAPIError);
    }
  }

  async syncOrders(shopDomain?: string): Promise<{ syncedCount: number; shop: string }> {
    const shop = shopDomain
      ? await shopifyRepository.findShopByDomain(shopDomain)
      : await shopifyRepository.getFirstShop();

    if (!shop) {
      throw new ShopNotFoundError();
    }

    logger.info({ shopDomain: shop.shopDomain }, "Starting orders sync");

    try {
      const response = await axios.get<ShopifyOrdersResponse>(
        `https://${shop.shopDomain}/admin/api/${this.API_VERSION}/orders.json`,
        {
          headers: {
            "X-Shopify-Access-Token": shop.accessToken,
          },
        }
      );

      const orders = response.data.orders;

      await Promise.all(
        orders.map((order) =>
          shopifyRepository.upsertOrder({
            shopifyId: String(order.id),
            shopId: shop.id,
            name: order.name || null,
            totalPrice: order.total_price || null,
            currency: order.currency || null,
            financialStatus: order.financial_status || null,
            createdAtShopify: order.created_at ? new Date(order.created_at) : null,
            updatedAtShopify: order.updated_at ? new Date(order.updated_at) : null,
          })
        )
      );

      logger.info(
        { shopDomain: shop.shopDomain, syncedCount: orders.length },
        "Orders sync completed"
      );

      return {
        syncedCount: orders.length,
        shop: shop.shopDomain,
      };
    } catch (error) {
      return handleAxiosError(error, "Orders sync", ShopifyAPIError);
    }
  }
}

export const shopifyService = new ShopifyService();
