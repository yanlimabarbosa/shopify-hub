import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";
import { env } from "./env.js";
import "./swagger-docs.js";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shopify Orders & Products Hub API",
      version: "1.0.0",
      description: "API for managing Shopify products and orders with OAuth authentication, webhooks, and synchronization",
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            status: { type: "string", example: "error" },
            message: { type: "string" },
            details: { type: "object" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["ADMIN", "USER"] },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
          },
        },
        RegisterResponse: {
          allOf: [{ $ref: "#/components/schemas/User" }, { type: "object", properties: { token: { type: "string" } } }],
        },
        SyncResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            syncedCount: { type: "number" },
            shop: { type: "string" },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "string" },
            shopifyId: { type: "string" },
            shopId: { type: "string" },
            title: { type: "string" },
            status: { type: "string", nullable: true },
            vendor: { type: "string", nullable: true },
            createdAtShopify: { type: "string", format: "date-time", nullable: true },
            updatedAtShopify: { type: "string", format: "date-time", nullable: true },
            updatedAtLocal: { type: "string", format: "date-time" },
            shop: { type: "object", properties: { shopDomain: { type: "string" } } },
          },
        },
        ProductsList: {
          type: "object",
          properties: {
            products: { type: "array", items: { $ref: "#/components/schemas/Product" } },
            nextCursor: { type: "string", nullable: true },
            hasMore: { type: "boolean" },
            count: { type: "number" },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "string" },
            shopifyId: { type: "string" },
            shopId: { type: "string" },
            name: { type: "string", nullable: true },
            totalPrice: { type: "string", nullable: true },
            currency: { type: "string", nullable: true },
            financialStatus: { type: "string", nullable: true },
            createdAtShopify: { type: "string", format: "date-time", nullable: true },
            updatedAtShopify: { type: "string", format: "date-time", nullable: true },
            updatedAtLocal: { type: "string", format: "date-time" },
            shop: { type: "object", properties: { shopDomain: { type: "string" } } },
          },
        },
        OrdersList: {
          type: "object",
          properties: {
            orders: { type: "array", items: { $ref: "#/components/schemas/Order" } },
            nextCursor: { type: "string", nullable: true },
            hasMore: { type: "boolean" },
            count: { type: "number" },
          },
        },
        DashboardStats: {
          type: "object",
          properties: {
            totalProducts: { type: "number" },
            totalOrders: { type: "number" },
            ordersLast24h: { type: "number" },
          },
        },
        WebhookRegistrationResult: {
          type: "object",
          properties: {
            topic: { type: "string" },
            status: { type: "string", enum: ["created", "exists", "error"] },
            webhookId: { type: "number", nullable: true },
            error: { type: "string", nullable: true },
          },
        },
        WebhookRegistrationResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            webhooks: { type: "array", items: { $ref: "#/components/schemas/WebhookRegistrationResult" } },
            success: { type: "boolean" },
          },
        },
        OAuthUrlResponse: {
          type: "object",
          properties: {
            oauthUrl: { type: "string", format: "uri" },
          },
        },
      },
    },
    tags: [
      { name: "Authentication", description: "User authentication and authorization" },
      { name: "Shopify", description: "Shopify OAuth and store management" },
      { name: "Sync", description: "Synchronize products and orders (ADMIN only)" },
      { name: "Webhooks", description: "Webhook registration and reception" },
      { name: "Products", description: "Product listing and querying" },
      { name: "Orders", description: "Order listing and querying" },
      { name: "Dashboard", description: "Dashboard statistics (ADMIN only)" },
      { name: "Health", description: "Health check endpoint" },
    ],
  },
  apis: ["./src/config/swagger-docs.ts", "./dist/config/swagger-docs.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Shopify Hub API Documentation",
  }));

  app.get("/api-docs.json", (_req, res) => {
    res.json(swaggerSpec);
  });
}
