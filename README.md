# bpshop - E-Commerce Platform

Full-stack e-commerce with Next.js 16 (frontend) and Strapi v5 (headless CMS). Products, cart, auth, checkout, orders. Production-ready with SSR, ISR, and type-safe data flows.

**Live:** https://e-shop.stackbp.es/

## Quick start

```bash
cd backend && npm run develop    # Strapi at localhost:1337/admin
cd frontend && npm run dev       # Next.js at localhost:3000
```

## What it does

- **Product catalog** with pagination (ISR), server/client search, and category filtering
- **Persistent cart** via session cookies + anonymous → user cart migration on login
- **JWT authentication** with localStorage token storage
- **Checkout flow** with shipping address form and order creation
- **Order history** for authenticated users
- **Theme toggle** with semantic Tailwind tokens

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

**Database**: SQLite in dev (`backend/.tmp/db.sqlite`), PostgreSQL in prod via `backend/config/database.ts`.

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
- pnpm

## Developer notes

- **ISR quirk**: First load of paginated pages after deploy is slow (60s sleep). Pages 2+ are static until revalidation.
- **Theming**: CSS variables in `app/globals.css`. Semantic classes like `bg-layer-1`, `text-text-secondary`.
- **Session cookies**: httpOnly, secure in prod, 30-day expiry.
- **Test creds**: `test` / `test123` in development.
- **CORS**: Configure in Strapi admin to allow frontend domain.

## Extending it

- **Product details**: Add `/product/[id]` page, fetch single product via Strapi
- **Wishlist**: New content type + context + UI component
- **Payment**: Stripe integration via custom controller, webhooks for order status
- **Email**: Strapi email plugin or custom provider
- **Reviews**: New content type, relate to product and user
- **Price filter**: Add to client filter, extend Strapi filtering

## Deployment

**Frontend** (Vercel):
- Set `NEXT_PUBLIC_STRAPI_URL` and `NEXT_PUBLIC_STRAPI_API_URL`
- ISR works out of the box

**Backend** (Render):
- Use PostgreSQL
- Set `DATABASE_URL`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`
- Configure CORS for frontend domain
- Build: `npm run build`, Start: `npm run start`

## The evolution

```
v1: Vanilla JS, localStorage only           (learning DOM + state)
v2: React + external API                    (component patterns)
v3: Next.js + Strapi full stack            (real backend, SSR)
v4: Current - auth, cart migration, ISR     (production features)
```

Started as an e-commerce learning project. Became a full platform because scope creep is a feature.

Built to be read, tweaked, and enjoyed.
