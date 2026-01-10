# Shopify Orders & Products Hub - Frontend

Frontend application built with Next.js, React Query, Shadcn UI, React Hook Form, and Zod.

## Features

- ✅ Authentication (Login/Register)
- ✅ Dashboard with statistics
- ✅ Products listing with pagination
- ✅ Orders listing with pagination
- ✅ Shopify OAuth integration (ADMIN only)
- ✅ Manual sync (ADMIN only)
- ✅ Webhook registration (ADMIN only)
- ✅ Protected routes with role-based access
- ✅ Responsive design with Shadcn UI

## Tech Stack

- **Next.js 16** - React framework
- **React Query** - Data fetching and caching
- **Shadcn UI** - Component library
- **React Hook Form + Zod** - Form validation
- **Zustand** - State management
- **Axios** - HTTP client
- **TypeScript** - Type safety

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:8080`.

## Project Structure

```
app/
  ├── login/          # Login page
  ├── register/       # Register page
  ├── dashboard/      # Dashboard (protected)
  ├── products/       # Products listing (protected)
  ├── orders/         # Orders listing (protected)
  ├── shopify/        # Shopify OAuth (ADMIN only)
  │   └── callback/   # OAuth callback handler
  ├── sync/           # Manual sync (ADMIN only)
  └── webhooks/       # Webhook registration (ADMIN only)

hooks/                 # React Query hooks
  ├── use-auth.ts
  ├── use-products.ts
  ├── use-orders.ts
  ├── use-dashboard.ts
  ├── use-sync.ts
  └── use-webhooks.ts

lib/
  ├── api-client.ts   # Axios instance with interceptors
  ├── types.ts        # TypeScript types
  ├── store/          # Zustand stores
  └── providers/     # React Query provider

components/
  ├── ui/             # Shadcn UI components
  ├── layout/         # Layout components
  └── protected-route.tsx
```

## API Hooks

All API calls use React Query hooks:

- `useLogin()` - Login mutation
- `useRegister()` - Register mutation
- `useUser()` - Get current user
- `useListProducts()` - List products with pagination
- `useListOrders()` - List orders with pagination
- `useDashboard()` - Get dashboard stats
- `useSyncProducts()` - Sync products mutation
- `useSyncOrders()` - Sync orders mutation
- `useRegisterWebhooks()` - Register webhooks mutation

## Authentication

- First registered user automatically becomes ADMIN
- JWT token stored in localStorage
- Protected routes require authentication
- ADMIN-only routes check user role

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3000)
