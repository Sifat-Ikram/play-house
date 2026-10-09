# 🧸 Play House — Full-Stack Toy Store E-Commerce Platform

> A playful yet classy online toy store with a customer storefront, an AI shopping assistant, and an admin dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)

**Live Demo:** [https://play-house-phi.vercel.app](#)  
**Backend API:** https://play-house-backend.vercel.app/ap

---

## 📸 Screenshots

| Home | Product Listing | Product Details |
|------|-----------------|------------------|
| ![Home](./screenshots/home.png) | ![Listing](./screenshots/listing.png) | ![Details](./screenshots/details.png) |

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
- **Playful micro-interactions** — Framer Motion animations, confetti on add-to-cart, floating cart bar, custom cursor

### Cart, Checkout & Orders
- **Persistent cart for guests and logged-in users** (cookie/localStorage token + user-based cart, auto-merge on login)
- **Checkout for both guest and authenticated users**, auto-filled from profile
- **Transactional order placement** — real-time stock validation, server-side shipping cost calculation, price snapshot, automatic stock deduction and cart clearing
- **My Orders & Order Detail** pages
- Payment: Cash on Delivery (Card UI ready for gateway integration)

### Authentication & Profile
- **JWT auth** — 15-minute access token, 30-day refresh token with rotation
- Automatic token refresh via an authenticated fetch wrapper
- Profile page — view, update and delete account
- Server-component data fetching using cookie-based tokens

### 🤖 AI Shopping Assistant
- Natural-language product search ("a gift for a 5-year-old who loves cars")
- Two-step LLM pipeline via **OpenRouter** (free tier):
  1. Extracts structured filters from the user's message
  2. Queries the real product catalog, then writes a friendly reply grounded only in actual data (no hallucinated products)
- Multi-turn conversation context and inline product cards

### Admin Dashboard
- Manage products, inventory, categories, brands, colors, orders and reviews

### UI / UX
- Fully responsive (mobile, tablet, desktop)
- Custom design system — gold + deep teal palette, Fredoka + Plus Jakarta Sans fonts
- Skeleton loading states, custom 404 page, dynamic SEO metadata

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js (App Router), React 19, Tailwind CSS 4, Framer Motion, Swiper, React Icons |
| **Backend** | Node.js, Express.js, `pg` (raw SQL) |
| **Database** | PostgreSQL (Neon) |
| **Auth** | JWT (access + refresh), bcryptjs |
| **AI** | OpenRouter (free LLM models) |
| **Deployment** | Vercel |

---

## 🏗 Architecture

```
frontend/ (Next.js App Router)
 ├── src/app/                 → Server components (data fetching, SEO metadata)
 ├── src/components/pages/    → Client components (UI and interactions)
 ├── src/provider/            → AuthProvider, CartProvider, QueryProvider
 └── src/lib/                 → Token storage, server fetch helpers, utilities

backend/ (Express REST API)
 └── src/
     ├── routes/              → URL → controller mapping
     ├── controllers/         → Request/response handling
     ├── services/            → Business logic and validation
     ├── models/              → SQL queries
     ├── middleware/          → Auth (required / optional)
     └── utils/               → JWT, password hashing, OpenRouter client
```

**Pattern:** `Route → Controller → Service → Model`, a layered MVC-style architecture.  
**Rendering:** Pages that depend on query params or user data use SSR (`force-dynamic`, `no-store`).

---

## 🗄 Database Overview

Core tables: `products`, `inventory`, `inventory_images`, `brands`, `categories`, `colors`, `combos`, `combo_items`, `reviews`, `review_replies`, `users`, `refresh_tokens`, `cart_items`, `orders`, `order_items`.

- A product has many **inventory** rows (one per color variant), each with its own price, stock and images.
- Orders store a **price snapshot** (`unit_price`) so history stays accurate when prices change.
- Cart items are tied to either a `cart_token` (guest) or a `user_id` (logged in).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (e.g. [Neon](https://neon.tech))
- (Optional) An [OpenRouter](https://openrouter.ai) API key for the AI assistant

### 1. Clone

```bash
git clone https://github.com/your-username/play-house.git
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
```

Run the SQL migrations for `users`, `refresh_tokens`, `cart_items`, `orders` and `order_items` (see the Database section), then:

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

Open [http://localhost:3000](http://localhost:3000).

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

---

## 🔐 Security Notes
- Passwords hashed with bcrypt
- Short-lived access tokens, rotating refresh tokens stored server-side
- Shipping cost and totals calculated **server-side** (never trusted from the client)
- Cart item ownership checks to prevent modifying other users' carts
- Order placement wrapped in a DB transaction with rollback on failure

---

## 🗺 Roadmap
- Payment gateway integration (card / mobile banking)
- Combo bundles with bundle-discount pricing
- Photo reviews upload
- Wishlist
- Email / SMS order notifications

---

## 👤 Author

**Your Name**  
[GitHub](https://github.com/Sifat-Ikram) · [LinkedIn](https://www.linkedin.com/in/sifat-ikram-17011713a/) · sifatikram@gmail.com

---

*Built with ❤️ for little adventures.*
