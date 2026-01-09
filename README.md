# Shopify Live Coding Skeleton (Node + TS + Express + Prisma)

## Requisitos
- Node 18+
- Docker (para Postgres)
- Conta Shopify Partner + loja dev + app criado

## Setup rápido
```bash
cp .env.example .env
npm i
docker compose up -d
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Ngrok
```bash
ngrok http 3000
```
Copie a URL https gerada e coloque em `WEBHOOK_BASE_URL`.

## Fluxo Shopify
1) Crie um app na Shopify Partner (Admin API access).
2) Configure Redirect URL = `SHOPIFY_REDIRECT_URI`
3) Acesse: `http://localhost:3000/shopify/auth?shop=SEU_SHOP.myshopify.com`
4) Conclua o OAuth → salvar token no DB

## Endpoints esperados
Veja ENUNCIADO.md na raiz do ZIP.
