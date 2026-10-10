# Database Setup Guide
## দেশি মসলার রান্নাঘর — PostgreSQL + Prisma

---

## Prerequisites

PostgreSQL installed and running. Create a database:

```sql
CREATE DATABASE deshi_moslar_db;
```

---

## Step 1 — Environment Variables

```bash
cd backend
copy .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/deshi_moslar_db?schema=public"
JWT_SECRET="deshi-moslar-super-secret-jwt-key-minimum-32-chars-2025"
JWT_EXPIRES_IN=7d
PORT=5000
FRONTEND_URL=http://localhost:3000
BCRYPT_ROUNDS=12
```

---

## Step 2 — Install Dependencies

```bash
cd backend
npm install
```

---

## Step 3 — Generate Prisma Client

```bash
npx prisma generate
```

---

## Step 4 — Run Migration

```bash
npx prisma migrate dev --name init
```

This creates all 24 tables with proper indexes and constraints.

---

## Step 5 — Seed Database

```bash
npm run prisma:seed
```

### What gets seeded:

| Entity       | Count  | Details                                          |
|---|---|---|
| Admins       | 2      | Super Admin + Manager                            |
| Users        | 2      | Test customers                                   |
| Categories   | 16     | 13 main + 3 sub-categories (under মসলা)          |
| Brands       | 10     | রাঁধুনী, PRAN, Fresh, ACI, তীর etc.              |
| Products     | 50+    | Realistic Bangladeshi grocery items              |
| Inventory    | 50+    | Stock levels for all products                    |
| Recipes      | 6      | বিরিয়ানি, মাছের ঝোল, গরুর কারি, ভর্তা etc.     |
| Coupons      | 4      | WELCOME10, FREEDEL, EID2025, SAVE50              |
| Testimonials | 6      | Real-style customer reviews                      |
| Banners      | 2      | Hero + Promotional                               |
| Reviews      | 5      | Approved sample reviews                          |
| Settings     | 21     | General, SEO, Payment, Social, Support           |
| Delivery     | 9      | Charges by district + nationwide                 |

---

## Step 6 — Verify

```bash
npx prisma studio
```

Opens at: http://localhost:5555

---

## Login Credentials

```
Super Admin:  admin@deshimoslar.com   /  Admin@123456
Manager:      manager@deshimoslar.com /  Manager@123
Customer 1:   rahim@test.com          /  Customer@123
Customer 2:   karima@test.com         /  Customer@123
```

---

## Schema Entity Map

```
users ──────────────┬── carts ── cart_items ─── products
                    ├── wishlists ── wishlist_items
                    ├── addresses ── orders
                    ├── reviews
                    ├── notifications
                    └── coupon_usages ── coupons

products ───────────┬── product_images
                    ├── inventories ── inventory_logs
                    ├── categories (+ self-ref subcategory)
                    ├── brands
                    └── recipe_ingredients ── recipes

orders ─────────────┬── order_items
                    ├── payments ── payment_transactions
                    ├── deliveries
                    └── order_status_history

admins ─────────────── admin_activity_logs

standalone ─────────── banners, testimonials, site_settings,
                        delivery_charges
```

---

## Cloud Database (Alternative)

Use [Neon](https://neon.tech) or [Supabase](https://supabase.com) for free PostgreSQL hosting.

```env
DATABASE_URL="postgresql://user:pass@host/deshi_moslar_db?sslmode=require"
```
