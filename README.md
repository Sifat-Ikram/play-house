# 🧸 Play House — Full-Stack Toy Store E-Commerce Platform

> A playful yet classy online toy store with a customer storefront, an AI shopping assistant, and a role-based admin dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)

**Live Demo:** [https://play-house-phi.vercel.app](https://play-house-phi.vercel.app)  
**Backend API:** https://play-house-backend.vercel.app/api

---

## 🔑 Demo Admin Access

Log in with the demo admin account below. **Admins are redirected straight to the Admin Dashboard** (`/admin`) after login; regular users go to the storefront.

| | |
|---|---|
| **Email** | `sifatikram@gmail.com` |
| **Password** | `sifat123` |

> This is a demo account for portfolio review. Please feel free to explore, but kindly don't delete core data.

---

## 📸 Screenshots

| Home | Product Listing | Product Details |
|------|-----------------|------------------|
| ![Home](https://i.ibb.co.com/pjDkyRsR/17-10-2026-18-07-07.png) | ![Listing](./screenshots/listing.png) | ![Details](./screenshots/details.png) |

| Cart & Checkout | AI Assistant | Admin Panel |
|-----------------|--------------|-------------|
| ![Checkout](./screenshots/checkout.png) | ![AI](./screenshots/ai.png) | ![Admin](./screenshots/admin.png) |

---

## ✨ Features

### Customer Storefront
- **Dynamic product browsing** by brand, category, interest, occasion, age range, wholesale and free-text search
- **Advanced filtering & sorting** — category, brand, interest, occasion, age, price range slider, price sort, with active filter chips
- **Smart pagination** — "Load More" that switches to numbered pagination for large result sets
- **Search autocomplete** with debounced suggestions
- **Product details** with color variants, image gallery (thumbnails, hover zoom, lightbox), stock status, specifications and delivery info
- **Reviews & replies** — star rating summary, review submission (login required), open replies, "Load More Reviews"
- **Wholesale pricing module** — bulk deals surfaced through the product listing
- **Welcome modal** for first-time guests explaining the project, tech stack and GitHub links
- **Playful micro-interactions** — Framer Motion animations, confetti on add-to-cart, floating cart bar, custom cursor

### Cart, Checkout & Orders
- **Persistent cart for guests and logged-in users** (cookie/localStorage token + user-based cart, auto-merge on login)
- **Checkout for both guest and authenticated users**, auto-filled from profile
- **Transactional order placement** — real-time stock validation, server-side shipping cost calculation, price snapshot, automatic stock deduction and cart clearing
- **My Orders & Order Detail** pages
- Payment: Cash on Delivery (Card UI ready for gateway integration)

### Authentication & Profile
- **JWT auth** — 15-minute access token, 30-day refresh token with rotation
- **Role-based access** — `user` and `admin` roles; admins land directly on the dashboard after login
- Automatic token refresh via an authenticated fetch wrapper
- Profile page — view, update and delete account
- Server-component data fetching using cookie-based tokens

### 🤖 AI Shopping Assistant
A conversational assistant that recommends toys from the **real product catalog** (no invented products).

- **Natural-language search**, e.g. *"a gift for a 5-year-old who loves cars under BDT 2000"*
- **Two-step pipeline** via **OpenRouter** (free-tier LLMs):
  1. **Understand:** the LLM extracts structured filters: `brand`, `category`, `interest`, `occasion`, `minAge`, `maxAge`, `max_price` and `keywords`. Any field that doesn't apply stays `null`.
  2. **Retrieve & answer:** the backend matches products against **all active filters together**, then the LLM writes a short friendly reply grounded only in the matched products.
- **Hallucination guard:** LLM-provided brand/category/interest/occasion values are validated against the store's real lists; unknown values are discarded.
- **Graceful relaxation:** if nothing matches every filter, less important filters (keywords → occasion → interest → category → brand) are relaxed step by step, while **age and budget are never dropped**. The reply honestly says these are the closest options.
- **Resilient by design:** JSON mode → plain mode → regex fallback for age/budget/keywords, request timeouts, and built-in fallback replies if the LLM fails or returns empty text.
- Multi-turn conversation context, starter prompts and inline product cards

### 🛠 Admin Dashboard
Role-protected panel (`/admin`) with a sidebar layout. Admin access is verified **server-side from the database on every request**, never trusted from the token alone.

- **Dashboard** — live stats: products, users, brands, categories, featured items, low stock, orders and revenue
- **Products** — searchable list with image, brand, category, price, total stock and a **Featured toggle**; enabling Featured opens a stock-check modal and only allows in-stock products to appear in the homepage Featured Collection
- **Product details & editing** — edit product info (including materials) and manage every **inventory variant**: colour, SKU, stock, buying/selling price, wholesale price and min quantity, tax, availability, and multiple images with a cover image
- **Add Product flow** — two-column form with searchable brand/category pickers, then add one or more inventories with images
- **Brands, Categories, Colours, Materials** — add, edit, delete with image upload; colours support both a colour picker and manual hex input; inventory and product forms pick from these saved lists
- **Orders** — status tabs (**All, Pending, Confirmed, Shipped, Delivered, Cancelled, Return Requested, Returned, Refunded**) with live counts, search, expandable item preview, and **inline status change directly in the table** guarded by a SweetAlert2 confirmation
- **Order detail** — customer, delivery, billing and items; same confirm-before-change flow
- **Smart stock handling** — cancelling, returning or refunding an order restores stock automatically; re-activating it deducts stock again (with a safety check)
- **Carts** — view all guest and user carts grouped by owner, update quantities or remove items
- **Users** — list of registered users with roles
- **Image uploads** to ImageKit through a protected endpoint
- Custom dropdowns (no native `<select>`) that open upward or downward depending on available screen space

### UI / UX
- Fully responsive (mobile, tablet, desktop)
- Custom design system — gold + deep teal palette, Fredoka + Plus Jakarta Sans fonts
- Skeleton loading states, custom 404 page, dynamic SEO metadata

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js (App Router), React 19, Tailwind CSS 4, Framer Motion, Swiper, React Icons, SweetAlert2 |
| **Backend** | Node.js, Express.js, `pg` (raw SQL), Multer |
| **Database** | PostgreSQL (Neon) |
| **Auth** | JWT (access + refresh), bcryptjs, role-based middleware |
| **AI** | OpenRouter (free LLM models) |
| **Media** | ImageKit (image upload & hosting) |
| **Deployment** | Vercel |

---

## 🏗 Architecture

```
frontend/ (Next.js App Router)
 ├── src/app/                 → Server components (data fetching, SEO metadata)
 │    └── admin/              → Admin pages (client components, role-guarded)
 ├── src/components/pages/    → Storefront client components (UI and interactions)
 ├── src/components/admin/    → Admin shell, shared UI, forms, modals
 ├── src/provider/            → AuthProvider, CartProvider, QueryProvider
 └── src/lib/                 → Token storage, server fetch helpers, utilities

backend/ (Express REST API)
 └── src/
     ├── routes/              → URL → controller mapping
     ├── controllers/         → Request/response handling
     ├── services/            → Business logic, validation, AI pipeline
     ├── models/              → SQL queries
     ├── middleware/          → Auth (required / optional / admin)
     └── utils/               → JWT, password hashing, OpenRouter & ImageKit clients
```

**Pattern:** `Route → Controller → Service → Model`, a layered MVC-style architecture.  
**Rendering:** Storefront pages that depend on query params or user data use SSR (`force-dynamic`, `no-store`). Admin pages are client-rendered because tokens live in the browser.

---

## 🗄 Database Overview

Core tables: `products`, `inventory`, `inventory_images`, `brands`, `categories`, `colors`, `materials`, `combos`, `combo_items`, `reviews`, `review_replies`, `users`, `refresh_tokens`, `cart_items`, `orders`, `order_items`.

- A product has many **inventory** rows (one per color variant), each with its own price, stock, wholesale pricing and images.
- Orders store a **price snapshot** (`unit_price`) so history stays accurate when prices change.
- Cart items are tied to either a `cart_token` (guest) or a `user_id` (logged in).
- `users.role` (`user` / `admin`) controls access to the admin panel.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (e.g. [Neon](https://neon.tech))
- (Optional) An [OpenRouter](https://openrouter.ai) API key for the AI assistant
- (Optional) An [ImageKit](https://imagekit.io) account for admin image uploads

### 1. Clone

```bash
git clone https://github.com/Sifat-Ikram/play-house.git
cd play-house
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
DATABASE_URL=your_neon_postgres_connection_string

JWT_ACCESS_SECRET=your_long_random_access_secret
JWT_REFRESH_SECRET=your_long_random_refresh_secret

OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free

IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

Run the SQL migrations for `users` (with the `role` column), `refresh_tokens`, `materials`, `cart_items`, `orders` and `order_items`, then make yourself an admin:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

```bash
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To open the admin panel, log in with an admin account; you'll be taken to `/admin` automatically.

---

## 🔌 API Overview

| Resource | Endpoints |
|----------|-----------|
| **Auth** | `POST /api/auth/register` · `login` · `refresh` · `logout` |
| **Profile** | `GET / PUT / DELETE /api/profile` (auth required) |
| **Products** | `GET /api/products/name/:name` · `/featured` · `/new-arrivals` · `/suggest?q=` |
| **Listing** | `GET /api/product-listing?brand=&category=&search=&wholesale=true…` |
| **Cart** | `GET / POST /api/cart` · `PUT / DELETE /api/cart/:id` · `POST /api/cart/merge` |
| **Orders** | `POST /api/orders` · `GET /api/orders/mine` · `GET /api/orders/:id` |
| **Reviews** | `GET / POST /api/review/products/:id/reviews` · `POST /api/review/reviews/:id/replies` |
| **AI** | `POST /api/ai-assistant/chat` |
| **Admin** 🔒 | `GET /api/admin/stats` · `/users` · `/products` · `/products/:id` · `PATCH /products/:id/featured` |
| **Admin Inventory** 🔒 | `POST / PUT / DELETE /api/admin/inventory` · `POST /api/admin/upload` |
| **Admin Orders** 🔒 | `GET /api/admin/orders?status=&q=` · `GET /orders/:id` · `PATCH /orders/:id/status` |
| **Admin Carts** 🔒 | `GET /api/admin/carts` · `PUT / DELETE /api/admin/carts/:id` |
| **Catalog management** 🔒 | write routes for `/api/brands` · `/categories` · `/colors` · `/materials` · `/products` |

🔒 = admin only (JWT + database role check)

---

## 🔐 Security Notes
- Passwords hashed with bcrypt
- Short-lived access tokens, rotating refresh tokens stored server-side
- **Admin routes protected by middleware that re-checks the user's role in the database** on every request
- Catalog write operations (create / update / delete) restricted to admins; public routes are read-only
- Shipping cost and totals calculated **server-side** (never trusted from the client)
- Cart item ownership checks to prevent modifying other users' carts
- Order placement and status changes wrapped in DB transactions with rollback on failure
- Upload endpoint restricted to image files with a size limit

---

## 🗺 Roadmap
- Payment gateway integration (card / mobile banking)
- Combo bundles with bundle-discount pricing
- Photo reviews upload
- Wishlist
- Email / SMS order notifications
- Admin analytics charts and review moderation

---

## 👤 Author

**Md. Sifat Ikram**  
[GitHub](https://github.com/Sifat-Ikram) · [LinkedIn](https://www.linkedin.com/in/sifat-ikram-17011713a/) · sifatikram@gmail.com

---

*Built with ❤️ for little adventures.*
