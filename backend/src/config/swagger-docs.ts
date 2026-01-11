/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 timestamp: { type: string }
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, minLength: 2, maxLength: 100 }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8, maxLength: 100 }
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RegisterResponse"
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LoginResponse"
 */

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Authentication]
 *     security: [bearerAuth: []]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 */

/**
 * @openapi
 * /shopify/auth:
 *   get:
 *     tags: [Shopify]
 *     security: [bearerAuth: []]
 *     parameters:
 *       - in: query
 *         name: shop
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^[a-zA-Z0-9][a-zA-Z0-9-]*\\.myshopify\\.com$"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OAuthUrlResponse"
 */

/**
 * @openapi
 * /shopify/callback:
 *   get:
 *     tags: [Shopify]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: shop
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: hmac
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect
 */

/**
 * @openapi
 * /shopify/shops:
 *   get:
 *     tags: [Shopify]
 *     security: [bearerAuth: []]
 *     responses:
 *       200:
 *         description: List of all connected shops
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   shopDomain: { type: string }
 *                   installedAt: { type: string, format: date-time }
 */

/**
 * @openapi
 * /sync/products:
 *   post:
 *     tags: [Sync]
 *     security: [bearerAuth: []]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shop: { type: string }
 *     parameters:
 *       - in: query
 *         name: shop
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SyncResponse"
 */

/**
 * @openapi
 * /sync/orders:
 *   post:
 *     tags: [Sync]
 *     security: [bearerAuth: []]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shop: { type: string }
 *     parameters:
 *       - in: query
 *         name: shop
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SyncResponse"
 */

/**
 * @openapi
 * /webhooks/register:
 *   post:
 *     tags: [Webhooks]
 *     security: [bearerAuth: []]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shop: { type: string }
 *     parameters:
 *       - in: query
 *         name: shop
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WebhookRegistrationResponse"
 *       207:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WebhookRegistrationResponse"
 */

/**
 * @openapi
 * /webhooks/shopify:
 *   post:
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     parameters:
 *       - in: header
 *         name: x-shopify-hmac-sha256
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-shopify-topic
 *         required: true
 *         schema:
 *           type: string
 *           enum: [products/create, products/update, orders/create, orders/updated]
 *       - in: header
 *         name: x-shopify-shop-domain
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received: { type: boolean }
 */

/**
 * @openapi
 * /products:
 *   get:
 *     tags: [Products]
 *     security: [bearerAuth: []]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *       - in: query
 *         name: shop
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProductsList"
 */

/**
 * @openapi
 * /orders:
 *   get:
 *     tags: [Orders]
 *     security: [bearerAuth: []]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *       - in: query
 *         name: shop
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrdersList"
 */

/**
 * @openapi
 * /dashboard:
 *   get:
 *     tags: [Dashboard]
 *     security: [bearerAuth: []]
 *     responses:
 *       200:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/DashboardStats"
 */
