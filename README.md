# bpshop - E-Commerce Platform

Full-stack e-commerce with Next.js 16 (frontend) and Strapi v5 (headless CMS). Products, cart, auth, checkout, orders. Production-ready with SSR, ISR, and type-safe data flows.

**Live:** https://e-shop.stackbp.es/

## Local development

> **Read this first.** This is a monorepo with two apps that run on **different Node
> versions**. Getting the Node version right per app is the only tricky part of running it
> locally — everything below explains exactly how.

### Why two Node versions

Each app pins its own runtime, and both enforce it with `engine-strict=true`:

| App        | Path        | Node   | Package manager | Runs on             |
| ---------- | ----------- | ------ | --------------- | ------------------- |
| Backend    | `backend/`  | **22** | pnpm `10.13.1`  | `localhost:1337`    |
| Frontend   | `frontend/` | **24** | pnpm `10.13.1`  | `localhost:3000`    |

- **Backend (Strapi 5.30)** only supports Node ≤ 22 → `backend/.nvmrc` = `22`.
- **Frontend (Next 16)** requires Node 24 → `frontend/.nvmrc` = `24`.

Because no single Node version satisfies both, **there is no combined `dev` script** — you
start each app in its own terminal with its own Node. In production this is a non-issue: the
backend deploys to Render and the frontend to Vercel, each with its own runtime.

### Prerequisites

- **[fnm](https://github.com/Schniz/fnm)** (or nvm) to switch Node per app.
- **Node 22 and Node 24** installed:
  ```bash
  fnm install 22
  fnm install 24
  ```
- **pnpm** is pinned per package via the `packageManager` field, so **Corepack** resolves the
  right version automatically (`corepack enable` once, if not already).

### First-time setup

Install dependencies for each app (each has its own lockfile):

```bash
# Backend deps (under Node 22)
cd backend && fnm use 22 && pnpm install

# Frontend deps (under Node 24)
cd frontend && fnm use 24 && pnpm install
```

Copy and fill the backend env file (`backend/.env`). In dev the backend uses **SQLite**
(`backend/.tmp/`), so no external database is needed to run locally.

### Running it (two terminals)

```bash
# Terminal 1 — backend (Node 22)
cd backend
fnm use 22            # or rely on fnm's --use-on-cd with backend/.nvmrc
pnpm run develop      # → Strapi admin at http://localhost:1337/admin

# Terminal 2 — frontend (Node 24)
cd frontend
fnm use 24            # or rely on fnm's --use-on-cd with frontend/.nvmrc
pnpm dev              # → storefront at http://localhost:3000
```

> **Tip:** enable fnm's auto-switch (`fnm env --use-on-cd`) so `cd backend` / `cd frontend`
> picks the Node version from each `.nvmrc` automatically — then you can skip the `fnm use`
> lines.

### The monorepo root

The root `package.json` holds **no dependencies**. Its only jobs are pinning pnpm
(`packageManager`) for any command run from the repo root, and a single convenience script:

```bash
pnpm run dev:backend   # shortcut for the backend (runs under your default Node 22)
```

There is deliberately no frontend shortcut at the root: it would run under Node 22 and fail
the frontend's engine check. Always start the frontend from the `frontend/` folder on Node 24.

## What it does

- **Product catalog** with pagination (ISR), server/client search, and category filtering
- **Persistent cart** via session cookies + anonymous → user cart migration on login
- **JWT authentication** with localStorage token storage
- **Checkout flow** with shipping address form and order creation
- **Order history** for authenticated users
- **Theme toggle** with semantic Tailwind tokens
- **Toast notifications** for cart actions, login feedback, errors
- **PWA support** - installable app with offline caching and auto-updates
- **Analytics** - Google Analytics + Vercel Analytics integration

## Backend (Strapi v5)

Content types at `backend/src/api/`:

```
product/           # name, priceCents, image, keywords, rating, type
cart/              # session or user relation
cart-item/         # cart, product, quantity
order/             # orderId, totalCents, orderStatus, shippingAddress
order-item/        # order, product, quantity, priceCents
session/           # crypto UUID, httpOnly cookie, 30-day expiry
```

**Custom controllers**:

- `session.ts` - Generates UUIDs, sets secure cookies, handles HTTPS detection
- `custom-cart.ts` - Merges anonymous cart to user cart on login via `POST /api/carts/migrate`

**Database**: SQLite in dev (`backend/.tmp/data.db`, override with `DATABASE_FILENAME`), PostgreSQL in prod via `backend/config/database.ts`.

## Frontend (Next.js 16 App Router)

```
frontend/app/
├── page.tsx                    # Landing
├── products/
│   ├── page.tsx               # /products - SSR, fresh on every request
│   ├── [page]/page.tsx        # /products/2, /products/3 - ISR (60s)
│   └── loading.tsx            # Skeleton
├── cart/page.tsx              # Cart (client)
├── checkout/page.tsx          # Checkout (protected)
├── login/page.tsx             # Login (client)
├── register/page.tsx          # Register (client)
├── account/page.tsx           # Account (protected)
├── orders/page.tsx            # Orders (protected)
└── layout.tsx                 # Root layout with providers
```

**Rendering strategies**:

- `/products` - SSR, always fresh (`no-store`)
- `/products/2+` - ISR, revalidates every 60 seconds, pre-built at deploy
- `/products?search=xxx` - SSR, no cache
- All interactive bits - Client components with `'use client'`

**State**: React Context only. `AuthContext` handles JWT, `CartContext` handles cart operations. Both persist to localStorage.

## Search & filtering

Two search modes:

1. **Server search** (`/products?search=xxx`) - Fetches filtered results from Strapi, no-store cache
2. **Client filter** - Debounced 400ms, filters loaded products in-memory

Category groups map keywords to filters:
```typescript
{
  'Clothing': ['apparel', 'clothing', 'tshirts', 'hoodies'],
  'Sports': ['sports', 'basketballs', 'athletic'],
  'Home': ['home', 'bedroom', 'bathroom', 'kitchen'],
}
```

## Data flow

1. **Session**: First visit gets UUID cookie from `POST /api/sessions`
2. **Cart**: Anonymous cart linked to sessionId
3. **Login**: `POST /api/carts/migrate` merges session cart to user cart
4. **Checkout**: Creates order + order-items in Strapi, clears local cart
5. **Orders**: Fetches user's orders from `/api/orders?filters[user]=ID`

## Architecture

```
backend/src/api/
├── cart/         # controllers/custom-cart.ts (migration logic)
├── session/      # controllers/session.ts (cookie handling)
├── order/
├── order-item/
├── product/
└── cart-item/

frontend/app/
├── products/page.tsx          # SSR entry, fetches initial products
├── products/[page]/page.tsx   # ISR pages, pre-generated at build
└── products/loading.tsx       # Skeleton component

frontend/components/
├── ProductsClient.tsx         # Search, filter, pagination state
├── CartContext.tsx            # Cart operations, localStorage sync
├── AuthContext.tsx            # Auth state, JWT storage
└── Header.tsx                 # Search input, auth dropdown, cart badge
```

## Stack

- Next.js 16.0.7 (App Router)
- Strapi v5.30.1
- TypeScript 5
- Tailwind CSS 3.4
- React Context API
- Serwist 9.5.0 (PWA/Service Worker)
- Sonner (toast notifications)
- Google Analytics + Vercel Analytics
- pnpm

## PWA Features

The app is installable as a Progressive Web App with full offline support.

**Service Worker** (`app/sw.ts`):
- Pages: NetworkFirst (always fresh when online)
- Images: CacheFirst (30-day cache)
- CSS/JS: CacheFirst (immutable assets)
- Fonts: CacheFirst (1-year cache)
- API: NetworkFirst (5-min fallback cache)

**Components** (`components/pwa/`):
- `ServiceWorkerRegister` - Registers SW, checks updates hourly
- `UpdateNotification` - Toast when new version available
- `InstallPrompt` - Install button (Android) + iOS instructions modal

**Build requirement**: Uses webpack for production build (`next build --webpack`) as Serwist doesn't support Turbopack yet.

## Developer notes

- **ISR quirk**: First load of paginated pages after deploy is slow (60s sleep). Pages 2+ are static until revalidation.
- **Theming**: CSS variables in `app/globals.css`. Semantic classes like `bg-layer-1`, `text-text-secondary`.
- **Session cookies**: httpOnly, secure in prod, 30-day expiry.
- **Test creds**: `test` / `test123` in development.
- **CORS**: Configured in code at `backend/config/middlewares.ts` with an explicit origin
  allowlist (prod domain + `localhost:3000/3001`). Add new frontend origins there, not in the admin.

## Extending it

- **Product details**: Add `/product/[id]` page, fetch single product via Strapi
- **Wishlist**: New content type + context + UI component
- **Payment**: Stripe integration via custom controller, webhooks for order status
- **Email**: Strapi email plugin or custom provider
- **Reviews**: New content type, relate to product and user
- **Price filter**: Add to client filter, extend Strapi filtering

## Deployment

**Frontend** (Vercel, Node 24):
- Set `NEXT_PUBLIC_STRAPI_URL` and `NEXT_PUBLIC_STRAPI_API_URL`
- Build runs on webpack (`next build --webpack`, required by Serwist); ISR works out of the box

**Backend** (Render, Node 22):
- Use PostgreSQL; set `DATABASE_URL` (or the individual `DATABASE_*` vars) plus the Strapi
  secrets: `APP_KEYS`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `TRANSFER_TOKEN_SALT`, `ENCRYPTION_KEY`
- Allowed CORS origins live in `backend/config/middlewares.ts` (edit there for new domains)
- Build: `pnpm run build`, Start: `pnpm run start`

## The evolution

```
v1: Vanilla JS, localStorage only           (learning DOM + state)
v2: React + external API                    (component patterns)
v3: Next.js + Strapi full stack            (real backend, SSR)
v4: Current - auth, cart migration, ISR     (production features)
```

Started as an e-commerce learning project. Became a full platform because scope creep is a feature.

Built to be read, tweaked, and enjoyed.
