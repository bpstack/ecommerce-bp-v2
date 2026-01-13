# bpshop - Modern E-Commerce Platform

A production-ready e-commerce application built with **Next.js 16** (frontend) and **Strapi v5** (headless CMS backend). This project represents a significant evolution from the vanilla JavaScript approach in `e-commerce-classic-js` to a modern full-stack architecture.

---

## 🎯 What's This Project About?

This is a full-featured e-commerce store that mimics Amazon's functionality. You can:
- Browse products with pagination and category filtering
- Search for products by name or keywords
- Add items to a persistent shopping cart
- Create an account or login
- Complete checkout with shipping address
- View your order history

The cool part? It's built with modern tech that handles all the heavy lifting for you - SSR, ISR, type safety, and a real backend API.

---

## 🏗️ Backend Architecture (Strapi CMS)

### The Stack
- **Framework**: Strapi v5.30.1 (Node.js headless CMS)
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Server**: Node.js 18-22
- **Port**: 1337 (configurable)

### Where's the Database?

The database lives **inside Strapi** - you don't write SQL directly. Strapi creates and manages it for you based on your "Content Types."

**Development mode** uses SQLite (`./backend/.tmp/db.sqlite`) - zero setup, just works.

**Production mode** should use PostgreSQL. The config lives in `backend/config/database.ts`:

```typescript
// You can switch between MySQL, PostgreSQL, or SQLite
// by changing the connection settings here
```

Strapi's admin panel at `localhost:1337/admin` lets you:
- Create/edit/delete products, orders, carts
- Manage users and permissions
- Configure API tokens and roles

### Content Types (The Data Model)

| Type | Purpose | Key Fields |
|------|---------|------------|
| **Product** | Product catalog | name, priceCents, image, keywords, rating, type |
| **Cart** | Shopping cart container | sessionId, user (relation) |
| **CartItem** | Individual cart entries | cart, product, quantity |
| **Order** | Completed purchases | orderId, totalCents, orderStatus, shippingAddress |
| **OrderItem** | Order line items | order, product, quantity, priceCents |
| **Session** | Anonymous session tracking | sessionId (UUID, 30-day cookie) |

### Custom Controllers & Business Logic

**Session Management** (`backend/src/api/session/controllers/session.ts`)
- Generates crypto UUIDs for each visitor
- Sets httpOnly cookies (secure, 30-day expiry)
- Detects HTTPS via x-forwarded-proto header
- This is how anonymous users get persistent carts

**Cart Migration** (`backend/src/api/cart/controllers/custom-cart.ts`)
- When a user logs in, their anonymous cart merges with their user cart
- Sums quantities for duplicate products
- Transfers ownership from session to user
- API endpoint: `POST /api/carts/migrate`

---

## 🎨 Frontend Architecture (Next.js 16 + App Router)

### The Stack
- **Framework**: Next.js 16.0.7 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **Package Manager**: pnpm
- **State**: React Context API

### How It's Built

The frontend uses **Next.js App Router** which is a paradigm shift from the old pages directory. Here's the structure:

```
frontend/app/
├── page.tsx                    # Landing page (static)
├── products/
│   ├── page.tsx               # /products - Server Component (dynamic)
│   ├── [page]/page.tsx        # /products/2, /products/3 - ISR
│   └── loading.tsx            # Skeleton while loading
├── cart/page.tsx              # Shopping cart (client)
├── checkout/page.tsx          # Checkout flow (protected)
├── login/page.tsx             # User login (client)
├── register/page.tsx          # User registration (client)
├── account/page.tsx           # User account (protected)
├── orders/page.tsx            # Order history (protected)
└── layout.tsx                 # Root layout with providers
```

### Rendering Strategies (This Is the Good Stuff)

Next.js gives you **three rendering modes**. Here's how we use them:

#### 1. Server Components (RSC) - The Default

Pages like `/products` fetch data on the server and send pre-rendered HTML to the browser.

```typescript
// products/page.tsx - This runs ONLY on the server
export default async function ProductsPage({ searchParams }) {
  const productsData = await getProducts(1, PAGE_SIZE);
  return <ProductsClientWrapper products={productsData.data} />;
}
```

**Benefits**:
- Fast initial page load (HTML is ready)
- SEO-friendly (search engines see full content)
- No API keys leak to client
- Reduced client-side JavaScript

#### 2. Incremental Static Regeneration (ISR) - The "Sleep" Mode

Pages like `/products/2`, `/products/3` are **pre-built at build time** but **revalidated every 60 seconds**.

```typescript
// products/[page]/page.tsx
export const revalidate = 60;  // Rebuild page every 60 seconds max

export async function generateStaticParams() {
  const totalPages = await getTotalProductPages(PAGE_SIZE);
  // Pre-generate pages 2 through N at build time
  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    page: String(i + 2),
  }));
}
```

**What this means in practice**:
- Page 1 (`/products`) is **dynamic** - always fresh data
- Pages 2+ (`/products/2`, `/products/3`) are **static** for 60 seconds
- First load after deployment? **It "sleeps" for 60 seconds** before regenerating stale pages
- Updates propagate automatically in the background

This is HUGE for performance - you get static speed with dynamic freshness.

#### 3. Client Components - Interactive Bits

Anything with user interaction uses `'use client'`:

```typescript
'use client';
// These components hydrate on the client and handle interactivity:
- Header.tsx              (search, auth dropdown, cart badge)
- ProductsClient.tsx      (filtering, debounced search)
- CartPage.tsx            (quantity updates, remove items)
- CheckoutPage.tsx        (form state, order submission)
- Login/Register pages    (form handling)
- ThemeToggle.tsx         (dark mode)
```

**How it works**: Server renders initial HTML, then React "hydrates" and adds interactivity.

### State Management

No Redux, no Zustand - just **React Context**:

| Context | Purpose |
|---------|---------|
| `AuthContext` | User login/logout state, JWT token storage |
| `CartContext` | Cart items, quantities, add/remove operations |

Both persist to `localStorage` and restore on app mount.

---

## 🔍 Search & Product Loading

### The Search Flow

There are **two search implementations**:

**1. Server-Side Search** (URL: `/products?search=xxx`)
```typescript
// When you submit the search form, URL changes
router.push(`/products?search=${encodeURIComponent(searchQuery)}`);

// Server component fetches filtered results
async function searchProducts(query: string) {
  const response = await fetch(
    `${STRAPI_API_URL}/products?filters[name][$containsi]=${query}&populate=*`,
    { cache: 'no-store' }  // Always fresh, never cached
  );
  return response.json();
}
```

**2. Client-Side Filter** (instant, within loaded page)
```typescript
// Debounced search (400ms delay)
const debouncedSearch = useDebounce(searchInput, 400);

// Filters currently loaded products instantly
const filteredProducts = products.filter(product => {
  const matchesSearch = product.name.toLowerCase().includes(debouncedSearch);
  const matchesCategory = selectedCategories.length === 0 || 
    selectedCategories.some(cat => product.keywords.includes(cat));
  return matchesSearch && matchesCategory;
});
```

**Category Groups** map keywords to logical filters:
```typescript
{
  'Clothing': ['apparel', 'clothing', 'tshirts', 'hoodies', 'underwear'],
  'Sports': ['sports', 'basketballs', 'athletic'],
  'Home': ['home', 'bedroom', 'bathroom', 'kitchen'],
  // ...
}
```

### Product Loading by Render Type

| Route | Render Type | Caching | Use Case |
|-------|-------------|---------|----------|
| `/products` | SSR (dynamic) | no-store | First page, always fresh |
| `/products/2`, `/products/3` | ISR | 60s revalidation | Pagination pages |
| `/products?search=xxx` | SSR (dynamic) | no-store | Search results |
| `/product/[id]` | SSR (dynamic) | no-store | Product details |

---

## 🚀 Key Features & Workflows

### Authentication Flow

1. **Login** → `POST /api/auth/local` → receives JWT
2. **Token** → stored in localStorage, included in API headers
3. **Protected Routes** → checkout, orders, account check auth status
4. **Logout** → clear localStorage, redirect to products

### Cart Workflow

1. **Anonymous User** → gets `sessionId` cookie (30-day)
2. **Add to Cart** → API creates/updates `cart_items` linked to sessionId
3. **Login** → `POST /api/carts/migrate` merges anonymous cart to user cart
4. **Auth User** → cart linked to user ID, persists across devices

### Checkout Flow

1. **Cart Review** → displays items with quantities
2. **Address Form** → shipping info (Spain, France, Germany, Italy, Portugal, UK, US)
3. **Order Submission** → creates order + order_items in Strapi
4. **Confirmation** → redirects to `/order-confirmation/[documentId]`
5. **Cart Clear** → clears local cart after successful order

---

## 📊 Vanilla JS vs Next.js Comparison

| Aspect | e-commerce-classic-js | bpshop (This Project) |
|--------|----------------------|----------------------|
| **Backend** | External API (`supersimplebackend.dev`) | Self-hosted Strapi CMS |
| **Database** | localStorage only | SQLite (dev) / PostgreSQL (prod) |
| **Rendering** | Pure client-side (CSR) | Next.js (SSR + ISR + CSR) |
| **Auth** | None | JWT authentication |
| **Search** | UI exists, not implemented | Full server + client search |
| **Pagination** | "Load More" button | URL-based pagination with ISR |
| **Type Safety** | None (vanilla JS) | Full TypeScript |
| **State Management** | localStorage + manual DOM | React Context + localStorage |
| **CSS** | Modular CSS files | Tailwind CSS |
| **Product Data** | Static JS file | Dynamic Strapi API |
| **Cart Persistence** | localStorage only | Session cookies + database |
| **Cart Migration** | N/A | Anonymous → user cart merge |
| **Deployment** | Static files only | Full stack (frontend + backend) |
| **SEO** | Poor (client-only) | Excellent (server-rendered) |
| **Performance** | Basic | ISR caching, skeleton loading |

### What We Gained

1. **Real Backend** - Strapi gives you a real API, database, and admin panel
2. **SEO** - Server-rendered pages are indexable by search engines
3. **Performance** - ISR gives static speed with dynamic freshness
4. **Type Safety** - TypeScript catches errors at compile time
5. **Authentication** - Real user accounts with JWT
6. **Cart Migration** - Anonymous carts persist through login
7. **Admin Panel** - Manage products without touching code
8. **Scalability** - Can swap SQLite for PostgreSQL in production

### What We Lost (Trade-offs)

1. **Simplicity** - More complex architecture to understand
2. **Zero Dependencies** - Now depends on Node.js, Strapi, Next.js
3. **Local Development** - Need to run two servers (Strapi + Next.js)

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 18-22
- pnpm (recommended) or npm

### Quick Start

```bash
# 1. Start the backend (Strapi)
cd backend
npm run develop
# Creates admin at localhost:1337/admin

# 2. In another terminal, start frontend
cd frontend
npm run dev
# Opens at localhost:3000
```

### Environment Variables

**Frontend** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api
```

**Backend** (`backend/.env`):
```bash
ADMIN_JWT_SECRET=your-jwt-secret
API_TOKEN_SALT=your-token-salt
# Database config (auto-configured for SQLite in dev)
```

### Database Notes

**Development**: Uses SQLite automatically (`backend/.tmp/db.sqlite`). Zero config.

**Production**: Edit `backend/config/database.ts` to use PostgreSQL:
```typescript
connection: {
  client: 'postgres',
  connection: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
}
```

---

## 🎓 Learning Journey

This project demonstrates:

1. **Next.js App Router** - Server Components, ISR, dynamic routes
2. **Strapi Headless CMS** - Content types, custom controllers, API
3. **React Context** - Global state without Redux
4. **TypeScript** - Type safety across the codebase
5. **Tailwind CSS** - Utility-first styling
6. **JWT Authentication** - Secure user sessions
7. **URL-Based State** - Search params, pagination in URL
8. **Debouncing** - Performance optimization for search

---

## 📁 Project Structure

```
ecommerce-bp/
├── backend/                    # Strapi CMS
│   ├── config/                 # Server, API, database, middleware config
│   ├── src/
│   │   ├── api/               # Content type controllers/routes/services
│   │   │   ├── cart/
│   │   │   ├── cart-item/
│   │   │   ├── order/
│   │   │   ├── order-item/
│   │   │   ├── product/
│   │   │   └── session/
│   │   └── index.ts
│   └── package.json
├── frontend/                   # Next.js application
│   ├── app/                   # App Router pages
│   │   ├── products/          # Product catalog
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout flow
│   │   ├── login/             # Authentication
│   │   └── orders/            # Order history
│   ├── components/            # React components
│   ├── context/               # React Context providers
│   ├── lib/                   # API utilities (strapi.ts)
│   ├── types/                 # TypeScript definitions
│   └── package.json
├── package.json               # Workspace config
└── pnpm-workspace.yaml        # Monorepo setup
```

---

## 🚀 Deployment Considerations

### Frontend (Vercel recommended)
- Automatic ISR support
- Edge caching for static pages
- Environment variables via Vercel dashboard

### Backend (Railway/Render/DigitalOcean)
- Requires PostgreSQL
- Environment variables for database connection
- Build command: `npm run build`
- Start command: `npm run start`

### Both Together
- Frontend makes API calls to backend URL
- Set `NEXT_PUBLIC_STRAPI_URL` to production backend URL
- Configure CORS in Strapi to allow frontend domain

---

## 📝 Notes

- **First Load "Sleep"**: Paginated product pages (`/products/2`, etc.) use ISR with 60-second revalidation. This means the FIRST load after deployment might be slightly slower while the page regenerates, but subsequent loads are instant from cache.

- **Session Cookies**: Anonymous carts use httpOnly cookies that last 30 days. Secure in production (HTTPS only).

- **Test Credentials**: In development mode, you can login with:
  - Username: `test`
  - Password: `test123`

- **Image Handling**: Product images are served from Strapi's media library or external URLs. Next.js Image component optimizes loading.

---

## 🧹 Future Improvements

- Product detail pages (`/product/[id]`)
- Wishlist functionality
- Order tracking
- Payment integration (Stripe)
- Email notifications
- Admin dashboard for order management
- Product reviews and ratings
- Advanced filtering (price range, ratings)

---

Built with Next.js 16 + Strapi v5 + TypeScript + Tailwind CSS

---

## 📜 License

### Open Source Demo Project

This is an open source project created for **educational and demonstration purposes**. It is not intended for production use without proper security audits, compliance checks, and additional development work.

### What This Means

You are **free to**:
- Study and understand the code architecture and patterns
- Fork and clone the repository for personal learning
- Modify and adapt the code for your own projects
- Use components, modules, or snippets in your own applications
- Share the project with others for educational purposes
- Reference this code in tutorials, courses, or documentation

### Usage Notice

This software is provided "as is" for learning and demonstration purposes. While it's open source and can be used freely, please note:

1. **Not Production Ready**: This is a demo project and lacks production-ready security measures, payment processing compliance (PCI-DSS), error handling, and scalability optimizations.

2. **No Warranty**: The authors and contributors provide no warranties of any kind. Use at your own risk.

3. **Attribution**: If you use this code as a reference or learning tool, attribution is appreciated but not required.

### Third Party Licenses

This project uses open source technologies with their own licenses:
- **Next.js** - MIT License
- **React** - MIT License  
- **Strapi** - MIT License
- **Tailwind CSS** - MIT License
- **TypeScript** - Apache License 2.0

Please review the respective licenses of these dependencies before using this project in your own applications.
