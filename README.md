# দেশি মসলার রান্নাঘর — Deshi Moslar Rannaghar

**বাংলাদেশের বিশ্বস্ত অনলাইন মসলা ও গ্রোসারি শপ**
Premium Bengali grocery e-commerce platform — 100% authentic deshi products, delivered to your door.

---

## সূচিপত্র (Table of Contents)

- [প্রজেক্ট পরিচিতি](#প্রজেক্ট-পরিচিতি)
- [প্রযুক্তি স্ট্যাক](#প্রযুক্তি-স্ট্যাক)
- [বর্তমান অগ্রগতি](#বর্তমান-অগ্রগতি)
- [Frontend Pages](#frontend-pages)
- [Admin Panel](#admin-panel)
- [Backend Modules](#backend-modules)
- [Database Models](#database-models)
- [Payment System](#payment-system)
- [Delivery System](#delivery-system)
- [প্রজেক্ট Structure](#প্রজেক্ট-structure)
- [Setup ও Installation](#setup-ও-installation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [অসম্পন্ন কাজ](#অসম্পন্ন-কাজ)
- [ভবিষ্যৎ পরিকল্পনা](#ভবিষ্যৎ-পরিকল্পনা)

---

## প্রজেক্ট পরিচিতি

**দেশি মসলার রান্নাঘর** একটি সম্পূর্ণ বাংলাদেশি ই-কমার্স ওয়েবসাইট যেখানে দেশীয় মসলা, তেল, চাল, ডাল, মধু সহ সকল মুদি পণ্য অনলাইনে কেনা যায়। প্রজেক্টটিতে রয়েছে একটি আধুনিক customer-facing storefront এবং একটি সম্পূর্ণ admin panel।

**মূল বৈশিষ্ট্য:**
- Guest Checkout — login ছাড়াই পণ্য কেনা সম্ভব
- Dynamic Category System — admin থেকে category তৈরি করলে frontend-এ automatically চলে আসে
- Orange Brand Theme — সম্পূর্ণ custom orange branding
- Bilingual — বাংলা প্রাইমারি, ইংরেজি সাপোর্ট
- Mobile-first responsive design
- Cloudinary image hosting
- Multiple payment methods support

---

## প্রযুক্তি স্ট্যাক

### Frontend
| প্রযুক্তি | ব্যবহার |
|---|---|
| Next.js 16 (App Router) | React framework, SSR/CSR |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Radix UI | Accessible UI components |
| TanStack Query v5 | Server state management |
| Zustand | Client state (auth, cart) |
| React Hook Form + Zod | Form validation |
| Swiper.js | Image sliders/carousels |
| Lucide React | Icons |
| React Hot Toast | Notifications |
| Axios | HTTP client |

### Backend
| প্রযুক্তি | ব্যবহার |
|---|---|
| NestJS 10 | Node.js framework |
| TypeScript | Type safety |
| Prisma ORM | Database access |
| PostgreSQL | Primary database |
| JWT (Access + Refresh) | Authentication |
| Passport.js | Auth strategies |
| Cloudinary | Image upload/storage |
| Multer | File handling |
| Bcrypt | Password hashing |
| Helmet | Security headers |
| Express Rate Limit | Rate limiting |
| Swagger | API documentation |
| Class Validator | DTO validation |

### Infrastructure
| সার্ভিস | ব্যবহার |
|---|---|
| Railway | Backend hosting |
| Vercel | Frontend hosting |
| Neon (PostgreSQL) | Managed database |
| Cloudinary | Media storage |
| SSLCommerz | Payment gateway |

---

## বর্তমান অগ্রগতি

```
সামগ্রিক সম্পন্নতা: ~72%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Frontend UI/Pages        ████████████████████░░░  85%
Admin Panel (UI)         ████████████████████░░░  80%
Backend API              █████████████████░░░░░░  70%
Database Schema          ███████████████████████  95%
Payment Integration      ██████████░░░░░░░░░░░░░  40%
Delivery System          ██████████████░░░░░░░░░  60%
Deploy / Production      ████████████░░░░░░░░░░░  50%
```

---

## Frontend Pages

### Customer Storefront

| Page | Path | Status |
|---|---|---|
| Homepage | `/` | ✅ সম্পন্ন |
| Shop (All Products) | `/shop` | ✅ সম্পন্ন |
| Dynamic Category Page | `/category/[slug]` | ✅ সম্পন্ন |
| All Categories | `/categories` | ✅ সম্পন্ন |
| Product Detail | `/product/[slug]` | ✅ সম্পন্ন |
| Cart | `/cart` | ✅ সম্পন্ন |
| Checkout (Guest + Login) | `/checkout` | ✅ সম্পন্ন |
| Order Confirmation | `/order/[id]/confirmation` | ✅ সম্পন্ন |
| Payment Success | `/payment/success` | ✅ সম্পন্ন |
| Payment Failed | `/payment/failed` | ✅ সম্পন্ন |
| Payment Cancel | `/payment/cancel` | ✅ সম্পন্ন |
| Order Tracking | `/order-tracking` | ✅ সম্পন্ন |
| About Us | `/about` | ✅ সম্পন্ন |
| Blog | `/blog` | ✅ UI সম্পন্ন |
| FAQ | `/faq` | ✅ সম্পন্ন |
| Privacy Policy | `/privacy-policy` | ✅ সম্পন্ন |
| Return Policy | `/return-policy` | ✅ সম্পন্ন |
| Terms & Conditions | `/terms` | ✅ সম্পন্ন |

### Auth Pages

| Page | Path | Status |
|---|---|---|
| Login | `/login` | ✅ Orange theme |
| Register | `/register` | ✅ সম্পন্ন |
| Forgot Password | `/forgot-password` | ✅ সম্পন্ন |
| Reset Password | `/reset-password` | ✅ সম্পন্ন |

### Account Pages (Logged-in users)

| Page | Path | Status |
|---|---|---|
| Account Dashboard | `/account` | ✅ সম্পন্ন |
| Profile Settings | `/account/profile` | ✅ সম্পন্ন |
| My Orders | `/account/orders` | ✅ সম্পন্ন |
| Order Detail | `/account/orders/[id]` | ✅ সম্পন্ন |
| Wishlist | `/account/wishlist` | ✅ সম্পন্ন |
| Addresses | `/account/addresses` | ✅ সম্পন্ন |
| Coupons | `/account/coupons` | ✅ সম্পন্ন |
| Payment History | `/account/payment-history` | ✅ সম্পন্ন |
| Reviews | `/account/reviews` | ✅ সম্পন্ন |
| Settings | `/account/settings` | ✅ সম্পন্ন |

---

## Admin Panel

Admin panel-এ access: `/admin` — শুধুমাত্র authenticated admin users।

### Catalog Management

| Section | Features | Status |
|---|---|---|
| **Products** | Create/Edit/Delete, Image gallery upload, Variants, SEO, Stock | ✅ সম্পন্ন |
| **Categories** | Create/Edit, Banner upload, Description, Icon, Active/Inactive, Nav order | ✅ সম্পন্ন |
| **Brands** | Create/Edit/Delete, Logo upload | ✅ সম্পন্ন |
| **Collections** | Create/Edit, Products assign | ✅ সম্পন্ন |
| **Media Library** | Upload, Browse, Delete images | ✅ সম্পন্ন |
| **Tags** | Create/manage product tags | ✅ UI সম্পন্ন |

### Order Management

| Section | Features | Status |
|---|---|---|
| All Orders | List, Filter, Search, Detail drawer | ✅ সম্পন্ন |
| Pending / Confirmed / Processing | Status-filtered views | ✅ সম্পন্ন |
| Shipped / Delivered / Cancelled | Status-filtered views | ✅ সম্পন্ন |
| Refunds & Returns | Refund/return management | ✅ UI সম্পন্ন |
| Order Status Update | One-click status change | ✅ সম্পন্ন |

### Customer Management

| Section | Features | Status |
|---|---|---|
| Customers | List, Search, View details | ✅ সম্পন্ন |
| Reviews | Manage product reviews | ✅ সম্পন্ন |
| Wishlists | Customer wishlist overview | ✅ সম্পন্ন |

### Inventory Management

| Section | Features | Status |
|---|---|---|
| Inventory Dashboard | Stock overview | ✅ সম্পন্ন |
| Low Stock Alerts | Products with low quantity | ✅ সম্পন্ন |
| Stock Adjustments | Manual stock update | ✅ সম্পন্ন |
| Inventory History | Log of all changes | ✅ সম্পন্ন |

### Marketing

| Section | Features | Status |
|---|---|---|
| Coupons | Create discount codes, %, fixed | ✅ সম্পন্ন |
| Banners | Homepage/category banners | ✅ সম্পন্ন |
| Offers | Special offers management | ✅ UI সম্পন্ন |
| Promotions | Promotional campaigns | ✅ UI সম্পন্ন |
| Newsletter | Subscriber management | ✅ UI সম্পন্ন |

### Content Management

| Section | Features | Status |
|---|---|---|
| Hero Slides | Homepage slider | ✅ সম্পন্ন |
| Homepage Sections | CMS for home page | ✅ সম্পন্ন |
| Blog | Blog post management | ✅ UI সম্পন্ন |
| Recipes | Ranna recipe management | ✅ UI সম্পন্ন |
| FAQs | Q&A management | ✅ সম্পন্ন |
| Testimonials | Customer review showcase | ✅ সম্পন্ন |
| Static Pages | About, Terms etc. | ✅ UI সম্পন্ন |

### Delivery Management

| Section | Features | Status |
|---|---|---|
| Delivery Charges | Zone-based pricing | ✅ সম্পন্ন |
| Delivery Zones | Dhaka/outside zones | ✅ সম্পন্ন |
| Delivery Providers | Pathao, Steadfast etc. | ✅ UI সম্পন্ন |
| Delivery Settings | General config | ✅ সম্পন্ন |

### Payment Management

| Section | Features | Status |
|---|---|---|
| Transactions | All payment logs | ✅ সম্পন্ন |
| COD Orders | Cash on delivery overview | ✅ সম্পন্ন |
| Online Payments | SSLCommerz transactions | ⚠️ Test mode |
| Payment Settings | Gateway config | ✅ সম্পন্ন |

### Reports

| Section | Status |
|---|---|
| Sales Report | ✅ UI সম্পন্ন |
| Orders Report | ✅ UI সম্পন্ন |
| Products Report | ✅ UI সম্পন্ন |
| Customers Report | ✅ UI সম্পন্ন |
| Inventory Report | ✅ UI সম্পন্ন |

### Settings

| Section | Status |
|---|---|
| Store Settings | ✅ সম্পন্ন |
| Payment Settings | ✅ সম্পন্ন |
| SEO Settings | ✅ সম্পন্ন |
| Tax Settings | ✅ সম্পন্ন |
| Notification Settings | ✅ সম্পন্ন |

### Administration

| Section | Status |
|---|---|
| Admin Users | ✅ সম্পন্ন |
| Roles & Permissions | ✅ UI সম্পন্ন |
| Activity Log | ✅ সম্পন্ন |
| System Settings | ✅ সম্পন্ন |

---

## Backend Modules

NestJS-এ মোট **21টি module** তৈরি:

| Module | Responsibility |
|---|---|
| `auth` | Login, Register, JWT, OTP, Password reset |
| `users` | Customer profiles, addresses |
| `admin` | Admin auth, dashboard stats |
| `products` | CRUD, search, filter, variants |
| `categories` | Hierarchy, nav, dynamic pages |
| `brands` | Brand management |
| `cart` | Add/remove/update cart items |
| `orders` | Order placement, status tracking |
| `payments` | SSLCommerz integration, COD |
| `delivery` | Zone charges, providers |
| `coupons` | Discount codes, validation |
| `wishlist` | Save products |
| `inventory` | Stock tracking, adjustments |
| `reviews` | Product ratings & reviews |
| `recipes` | Recipe content |
| `banners` | Homepage/marketing banners |
| `collections` | Product collections/combos |
| `notifications` | In-app notifications |
| `media` | Cloudinary image management |
| `reports` | Sales/order analytics |
| `settings` | Site configuration |

---

## Database Models

PostgreSQL (Prisma ORM) — মোট **38টি model:**

```
User, Admin, AdminActivityLog, Address
Category, Brand, Product, ProductImage, ProductVariant
Inventory, InventoryLog
Cart, CartItem
Wishlist, WishlistItem
Coupon, CouponUsage
Order, OrderItem, OrderStatusHistory
Payment, PaymentTransaction
Delivery, DeliveryCharge
Review, Recipe, RecipeIngredient
Notification, Banner, Testimonial
SiteSettings, Collection, CollectionProduct
MediaFile, HeroSlide, HomepageSection
NewsletterSubscriber, Offer, Promotion
```

---

## Payment System

| Method | Status |
|---|---|
| Cash on Delivery (COD) | ✅ সম্পন্ন |
| SSLCommerz | ⚠️ Test mode (credentials দরকার) |
| bKash Direct API | ❌ এখনো হয়নি |
| Nagad Direct API | ❌ এখনো হয়নি |
| Rocket | ❌ এখনো হয়নি |
| Card (Visa/MC via SSL) | ⚠️ SSLCommerz-এর মাধ্যমে |

Payment logos (bKash, Nagad, Rocket, COD, SSLCommerz) frontend-এ দেখায়।
Checkout-এ payment method selection আছে।

---

## Delivery System

| Feature | Status |
|---|---|
| Dhaka / Outside Dhaka zones | ✅ সম্পন্ন |
| Zone-based charge calculation | ✅ সম্পন্ন |
| Free delivery threshold | ✅ সম্পন্ন |
| Pathao / Steadfast integration | ❌ এখনো হয়নি |
| Real-time tracking | ❌ এখনো হয়নি |
| SMS on delivery update | ❌ এখনো হয়নি |

---

## প্রজেক্ট Structure

```
deshi-moslar-rannaghar-website/
│
├── frontend/                     # Next.js Frontend
│   ├── src/
│   │   ├── app/                  # Next.js App Router pages
│   │   │   ├── (shop)/           # Customer pages (home, category, product, cart, checkout)
│   │   │   ├── (auth)/           # Login, register, forgot/reset password
│   │   │   ├── (account)/        # User account pages
│   │   │   ├── admin/            # Admin panel (70+ pages)
│   │   │   ├── payment/          # Payment callback pages
│   │   │   └── order/            # Order confirmation
│   │   ├── components/
│   │   │   ├── home/             # Homepage sections
│   │   │   ├── product/          # Product card, gallery, reviews
│   │   │   ├── shop/             # Filter, sort, grid, pagination
│   │   │   ├── cart/             # Cart drawer, items, summary
│   │   │   ├── checkout/         # Checkout components
│   │   │   ├── admin/            # Admin UI components
│   │   │   ├── layout/           # Header, Footer, MobileNav
│   │   │   ├── floating/         # FloatingCart, WhatsApp, BackToTop
│   │   │   └── payment/          # Payment logos
│   │   ├── hooks/                # React Query custom hooks
│   │   ├── store/                # Zustand stores (auth, cart)
│   │   ├── lib/                  # API client, utils, mock data
│   │   └── types/                # TypeScript interfaces
│   ├── .env.local                # Frontend env vars
│   └── package.json
│
├── backend/                      # NestJS Backend
│   ├── src/
│   │   ├── modules/              # 21 feature modules
│   │   ├── common/               # Guards, decorators, interceptors, filters
│   │   └── main.ts               # App bootstrap
│   ├── prisma/
│   │   ├── schema.prisma         # 38 database models
│   │   ├── migrations/           # DB migration history
│   │   └── seed/                 # Seed data scripts
│   ├── scripts/                  # Admin creation scripts
│   ├── .env                      # Backend env vars
│   ├── Dockerfile                # Docker config
│   ├── nixpacks.toml             # Railway deploy config
│   └── package.json
│
└── README.md
```

---

## Setup ও Installation

### Prerequisites

- Node.js 20+
- PostgreSQL database (Neon recommended)
- Cloudinary account
- Git

### Backend Setup

```bash
# 1. backend ফোল্ডারে যান
cd backend

# 2. dependencies install করুন
npm install

# 3. .env file তৈরি করুন
cp .env.example .env
# .env ফাইল এডিট করে সব values দিন

# 4. Database migrate করুন
npx prisma migrate deploy

# 5. Prisma client generate করুন
npx prisma generate

# 6. Admin user তৈরি করুন
npx ts-node scripts/create-admin.ts

# 7. Server চালু করুন (development)
npm run start:dev

# 8. Server চালু করুন (production)
npm run build
npm run start:prod
```

Backend চলবে: `http://localhost:5000`
Swagger API Docs: `http://localhost:5000/api/v1/docs`

### Frontend Setup

```bash
# 1. frontend ফোল্ডারে যান
cd frontend

# 2. dependencies install করুন
npm install

# 3. .env.local ফাইল তৈরি করুন
# নিচের Environment Variables দেখুন

# 4. Development server চালু করুন
npm run dev

# 5. Production build
npm run build
npm start
```

Frontend চলবে: `http://localhost:3000`

---

## Environment Variables

### Backend (.env)

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://USER:PASS@HOST/DB?sslmode=require
JWT_SECRET=your-32-char-minimum-secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
ADMIN_JWT_SECRET=your-admin-jwt-secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_password
SSLCOMMERZ_IS_LIVE=false
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
NEXT_PUBLIC_APP_NAME=দেশি মসলার রান্নাঘর
NEXT_PUBLIC_APP_NAME_EN=Deshi Moslar Rannaghar
NEXT_PUBLIC_APP_URL=https://your-frontend.vercel.app
NEXT_PUBLIC_WHATSAPP_NUMBER=+8801700000000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
```

---

## Deployment

### Backend → Railway

1. Railway-তে নতুন project তৈরি করুন
2. GitHub repo connect করুন
3. Environment variables সেট করুন (`.env.example` দেখুন)
4. `backend` ফোল্ডার root হিসেবে সেট করুন
5. Deploy — `nixpacks.toml` automatically configure করবে

### Frontend → Vercel

1. Vercel-এ নতুন project তৈরি করুন
2. GitHub repo connect করুন
3. Root directory: `frontend`
4. Environment variables সেট করুন
5. Deploy

### Database → Neon (PostgreSQL)

1. [neon.tech](https://neon.tech) এ account তৈরি করুন
2. নতুন database তৈরি করুন
3. Connection string নিন
4. Backend `.env`-এ `DATABASE_URL` সেট করুন
5. `npx prisma migrate deploy` চালান

---

## অসম্পন্ন কাজ

এই মুহূর্তে নিচের কাজগুলো বাকি আছে:

### উচ্চ অগ্রাধিকার
- [ ] **Production env vars** — Railway ও Vercel-এ সব environment variable সেট করতে হবে
- [ ] **SSLCommerz live credentials** — test mode থেকে live mode-এ নিতে হবে
- [ ] **Admin reports — real data** — charts ও graphs-এ actual API data connect করতে হবে

### মাঝারি অগ্রাধিকার
- [ ] **Email notifications** — order confirmation, shipping update emails
- [ ] **SMS notifications** — bKash/Nagad/Pathao SMS
- [ ] **Blog backend** — blog post CRUD API এবং frontend rendering
- [ ] **Recipe backend** — recipe CMS full connection
- [ ] **Promotions/Offers** — marketing module full API integration

### কম অগ্রাধিকার
- [ ] **Admin roles/permissions** — role-based access control পূর্ণাঙ্গ করা
- [ ] **Static page editor** — About/Terms এর WYSIWYG editor
- [ ] **Delivery provider integration** — Pathao, Steadfast API connect

---

## ভবিষ্যৎ পরিকল্পনা

### Phase 2 (নিকট ভবিষ্যৎ)
- bKash Payment Gateway direct integration
- Nagad Payment Gateway direct integration
- Pathao / Steadfast delivery API integration
- OTP-based login (mobile number)
- Push notifications

### Phase 3 (দীর্ঘমেয়াদী)
- Mobile app (React Native)
- Affiliate/referral system
- Loyalty points program
- Advanced analytics dashboard
- Multi-vendor support
- Product subscriptions (সাপ্তাহিক/মাসিক অর্ডার)
- AI-powered product recommendations
- Live chat support integration

---

## মূল ফিচার সারসংক্ষেপ

| Feature | Details |
|---|---|
| **Guest Checkout** | Login ছাড়া পণ্য কেনা যায় |
| **Dynamic Categories** | Admin থেকে category তৈরি → frontend-এ auto-appear |
| **Image Upload** | Cloudinary integration, admin panel থেকে সরাসরি upload |
| **Orange Brand Theme** | সম্পূর্ণ custom `#ea580c` orange branding |
| **Mobile Responsive** | Mobile-first design, swipe gallery, floating cart |
| **Filter & Sort** | Price, brand, availability, rating — live filter |
| **Cart Persistence** | Page refresh করলেও cart থাকে |
| **Wishlist** | Login ছাড়া save করা যায় (toast only) |
| **Order Tracking** | Customer order ID দিয়ে track করতে পারে |
| **Coupon System** | Discount code apply করা যায় checkout-এ |
| **Admin Guard** | JWT token verify করে, stale auth নেই |
| **Media Library** | Admin panel-এ centralized image management |

---

## License

Private project — All rights reserved.
© 2025 দেশি মসলার রান্নাঘর

---

## যোগাযোগ

- 📧 Email: info@deshimoslar.com
- 📞 Phone: +880 1700-000000
- 📍 Location: ঢাকা, বাংলাদেশ
- 🌐 Website: [deshimoslar.com](https://deshimoslar.com)

---

# দেশি মসলার রান্নাঘর — Admin Panel Complete Guide

**Deshi Moslar Rannaghar** — Bangladesh's online spice & grocery e-commerce platform.

---

## Admin Panel URL
```
https://deshi-moslar-rannaghar.vercel.app/admin
```
Login at `/admin/login` with admin credentials.

---

## ADMIN PANEL — সম্পূর্ণ বিবরণ

### ✅ Dashboard (`/admin`)
**কী করে:** রিয়েল-টাইম business overview দেখায়।
- মোট Revenue, Orders, Customers, Products stats
- Sales chart (daily breakdown)
- Recent orders list
- Low stock products alert
- Top selling products
- Recent customer signups

---

### ✅ Products (`/admin/catalog/products`)
**কী করে:** সব পণ্য manage করা।
- পণ্য list, search, filter (category/brand/status)
- **Add Product** — নতুন পণ্য তৈরি করো:
  - Basic info: নাম (Bengali + English), slug, description
  - Pricing: price, sale price, discount %
  - Inventory: SKU, stock quantity, low-stock threshold
  - Images: multiple image upload (Cloudinary)
  - Variants: size/weight options আলাদা price সহ
  - SEO: meta title, meta description
- **Edit Product** — যেকোনো পণ্য update করো
- **Delete Product** — পণ্য সরাও

---

### ✅ Categories (`/admin/catalog/categories`)
**কী করে:** Category system manage করা।
- Category list + sort order
- **Add/Edit Category:**
  - নাম (Bengali + English), slug, icon, description
  - Banner image upload
  - Active/Inactive toggle
  - Show in Navigation toggle + nav order
  - Parent category (sub-category support)
  - SEO title/description
- Admin থেকে category create করলে **automatically** frontend navigation-এ আসে
- Category disable করলে frontend থেকে hide হয়

---

### ✅ Brands (`/admin/catalog/brands`)
**কী করে:** Brand manage করা।
- Brand list, search
- Add/Edit/Delete brand
- Brand logo upload

---

### ✅ Collections (`/admin/catalog/collections`)
**কী করে:** Product collection/combo manage করা।
- Collection list
- Add/Edit collection with name, image, description
- Products assign/remove করা
- Homepage-এ collection section দেখানো

---

### ✅ All Orders (`/admin/orders`)
**কী করে:** সব customer order manage করা।
- **Status Tabs:** All / Pending / Confirmed / Processing / Packed / Shipped / Delivered / Cancelled / Returned / Refunded
- Order search (order number, customer name, phone, email)
- Filter: payment status, payment method, date range
- **Order Detail Drawer** (click any order):
  - Customer info + delivery address
  - All items with images, qty, price
  - Price breakdown (subtotal, discount, coupon, delivery, total)
  - Payment method + status
  - Delivery tracking info
  - Order timeline/history
  - **Status Update** buttons (Pending→Confirmed→Processing→Packed→Shipped→Delivered)
  - Refund processing
- **Bulk Status Update** — একসাথে multiple orders update
- Pagination

**Status Workflow:**
```
PENDING → CONFIRMED → PROCESSING → PACKED → SHIPPED → DELIVERED
                                                    ↓
                                               RETURNED → REFUNDED
PENDING/CONFIRMED → CANCELLED
```

---

### ✅ Customers (`/admin/customers`)
**কী করে:** Customer accounts manage করা।
- Customer list: name, email, phone, total orders, total spending
- Search by name/email/phone
- Filter: active/blocked status
- **Customer Profile Panel** (click any customer):
  - Personal info + contact
  - Order history (last 5)
  - Review history
  - Saved addresses
  - Total spending stats
- Activate / Deactivate / Block / Unblock actions

---

### ✅ Customer Reviews (`/admin/customers/reviews`)
**কী করে:** Product review moderate করা।
- Status tabs: All / Pending / Approved / Rejected
- Search by product, customer, comment
- Star rating filter
- **Approve** — review publish করা (product page-এ দেখাবে)
- **Reject** — reason সহ reject করা
- **Delete** — permanently remove
- Review approve/reject হলে product rating automatically recalculate হয়

---

### ✅ Inventory (`/admin/inventory`)
**কী করে:** Stock level manage করা।
- All products stock list
- Available / Total / Sold / Reserved stock দেখা
- Stock status badges: In Stock / Low Stock / Out of Stock
- **Adjust Stock** button — stock manually add/remove করো:
  - Types: Manual Add, Manual Remove, Correction, Damage, Return
  - Reason text
  - Preview before/after stock
- Filter by stock status (quick pills)

### ✅ Low Stock (`/admin/inventory/low-stock`)
- Out of Stock products আলাদা section
- Low Stock products আলাদা section
- **Quick Restock** button — fast stock addition

### ✅ Inventory History (`/admin/inventory/history`)
- সব stock change log
- Filter: type, date range
- Color coded: add=green, remove=red

---

### ✅ Coupons (`/admin/marketing/coupons`)
**কী করে:** Discount coupon manage করা।
- Coupon list
- **Create Coupon:**
  - Code, description
  - Type: Percentage / Fixed Amount / Free Delivery
  - Discount value + max discount cap
  - Min order amount
  - Start + expiry date
  - Usage limit (total + per user)
- Edit/Delete
- Usage count tracking

---

### ✅ Banners (`/admin/marketing/banners`)
- Banner image upload
- Position: homepage/category
- Active/inactive, start/end date

---

### ✅ Offers & Promotions (`/admin/marketing/offers`, `/admin/marketing/promotions`)
- Offer/promotion list
- Create with discount type, date range, target products/categories

---

### ✅ Newsletter (`/admin/marketing/newsletter`)
- Subscriber list
- Export CSV
- Delete/bulk-delete subscribers

---

### ✅ Homepage CMS (`/admin/content/homepage`)
**কী করে:** Homepage sections manage করা।
- Enable/disable sections (Featured Products, Best Sellers, etc.)
- Section title, subtitle customize
- Sort order drag

### ✅ Hero Slides (`/admin/content/hero-slides`)
- Banner slides create/edit/delete
- Image upload, title, subtitle, CTA buttons
- Slide sort order

### ✅ Testimonials (`/admin/content/testimonials`)
- Customer testimonials manage
- Name, role, avatar, rating, comment
- Active/inactive

### ✅ Blog (`/admin/content/blog`)
- Blog post list
- **Create/Edit Post:**
  - Title (Bengali + English), slug (auto-generate)
  - Excerpt, content
  - Cover image upload
  - Published/Draft toggle
  - SEO title, meta description
- Publish/unpublish
- Delete

### ✅ FAQs (`/admin/content/faqs`)
- FAQ list + sort order
- **Create/Edit FAQ:**
  - Question + Answer in Bengali
  - Question + Answer in English
  - Sort order
  - Published/unpublished
- Customer FAQ page-এ automatically দেখা যায়

---

### ✅ Delivery Charges (`/admin/delivery/charges`)
**কী করে:** District-based delivery charge configure করা।
- Charge list: label, division, district, area, charge amount, free delivery threshold
- **Add Charge** — নতুন zone create করো
- Edit/Delete existing charges
- Search + active/inactive filter
- এই charges checkout-এ automatically calculate হয়

### ✅ Delivery Zones (`/admin/delivery/zones`)
- Division-wise zone summary
- কত জেলা, গড় charge দেখা

### ✅ Delivery Settings (`/admin/delivery/settings`)
- Free delivery threshold amount
- Default delivery charge
- Settings database-এ persist হয়

### ✅ Delivery Providers (`/admin/delivery/providers`)
- Supported couriers: Pathao, Steadfast, Sundarban, Redx
- Future integration info

---

### ✅ Payment Transactions (`/admin/payments/transactions`)
**কী করে:** সব payment record দেখা।
- Transaction list: txn ID, order#, customer, method, amount, status, date
- Filter: payment method, status, date range
- Status badges: PAID/FAILED/PROCESSING/PENDING/CANCELLED

### ✅ COD Payments (`/admin/payments/cod`)
**কী করে:** Cash on Delivery order track করা।
- COD orders list
- Pending total amount at top
- Filter by COD status
- **Mark Collected** — delivery-তে cash নিলে mark করো
- **Mark Failed** — delivery fail হলে mark করো
- Status update করলে Order payment status sync হয়

### ✅ Online Payments (`/admin/payments/online`)
- bKash, Nagad, SSLCommerz transactions
- Method badge দিয়ে দেখানো
- Status filter

### ✅ Payment Settings (`/admin/payments/settings`)
- COD enable/disable toggle
- SSLCommerz enable/disable toggle
- Sandbox/Live mode indicator

---

### ✅ Reports — Sales (`/admin/reports/sales`)
**কী করে:** বিক্রয় analytics।
- Period selector: Today / 7 Days / 30 Days / Month / Year
- Summary: Total Orders, Revenue, Avg Order Value, Cancelled, Revenue change %
- By Status breakdown
- By Payment Method breakdown
- Daily revenue table

### ✅ Reports — Orders (`/admin/reports/orders`)
- Order count by status
- Payment method distribution
- Daily order volume

### ✅ Reports — Products (`/admin/reports/products`)
- Best Selling Products (rank, qty sold, revenue)
- Out of Stock products
- Low Stock products

### ✅ Reports — Customers (`/admin/reports/customers`)
- Total + new customers
- Top Spenders table
- Daily signup trends

### ✅ Reports — Inventory (`/admin/reports/inventory`)
- Stock summary stats
- Top sold products
- Recent adjustments log

---

### ✅ Settings — Store (`/admin/settings/store`)
- Store name (Bengali + English)
- Contact email, phone, address
- Currency code + symbol
- WhatsApp support number
- সব settings database-এ persist হয়

### ✅ Settings — SEO (`/admin/settings/seo`)
- Default page title
- Meta description
- SEO keywords

### ✅ Settings — Tax (`/admin/settings/tax`)
- Tax enable/disable
- Tax rate (%)

### ✅ Settings — Payment (`/admin/settings/payment`)
- COD toggle
- SSLCommerz toggle
- Gateway credential info

---

### ✅ Activity Logs (`/admin/administration/activity`)
**কী করে:** কে কী করলো track করা।
- Admin action log
- Filter: action type, entity, date range
- Color coded: CREATE=green, UPDATE=blue, DELETE=red, LOGIN=gray

### ✅ Admin Users (`/admin/administration/users`)
**কী করে:** Admin accounts manage করা।
- সব admin users list
- Role badges: SUPER_ADMIN / ADMIN / MANAGER / SUPPORT
- **Add Admin User:**
  - নাম, email, phone, password
  - Role assign করা
- **Edit** — নাম + role change
- **Reset Password** — নতুন password set
- **Deactivate** — account disable করা (delete করা যাবে না নিজের account)

### ✅ Roles (`/admin/administration/roles`)
- সব roles এবং তাদের permissions বর্ণনা
- SUPER_ADMIN / ADMIN / MANAGER / SUPPORT

### ✅ System Health (`/admin/administration/system`)
**কী করে:** Server + database status দেখা।
- Database connection status
- Total stats (users, products, orders)
- Total revenue
- Server info: Node version, uptime, memory usage
- Auto-refresh every 30 seconds

---

## ❌ এখনো Stub (ভবিষ্যতে করতে হবে)

| Section | কী বাকি |
|---|---|
| Notifications | Email/SMS template editor |
| Content → Recipes | Recipe CMS |
| Content → Pages | Static page editor |
| Catalog → Tags | Product tag management |
| Catalog → Media Library | Full media browser |
| Customers → Wishlist | Customer wishlist view |

---

## Tech Stack

### Backend
- NestJS 10, TypeScript, Prisma 5, PostgreSQL (Neon)
- JWT authentication, role-based authorization
- Cloudinary image storage
- Railway hosting

### Frontend
- Next.js 16, TypeScript, Tailwind CSS
- TanStack Query (data fetching)
- Zustand (state management)
- Vercel hosting

### Database
- 38+ Prisma models
- Neon PostgreSQL (serverless)

---

## Environment Variables Required

### Backend (Railway)
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
ADMIN_JWT_SECRET=...
FRONTEND_URL=https://deshi-moslar-rannaghar.vercel.app
BACKEND_URL=https://deshi-mosla-rannaghor-production.up.railway.app
CORS_ORIGINS=https://deshi-moslar-rannaghar.vercel.app
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SSLCOMMERZ_STORE_ID=testbox
SSLCOMMERZ_STORE_PASSWORD=qwerty
SSLCOMMERZ_IS_LIVE=false
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://deshi-mosla-rannaghor-production.up.railway.app/api/v1
NEXT_PUBLIC_APP_URL=https://deshi-moslar-rannaghar.vercel.app
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=sybyd7tu
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=deshi_moslar_uploads
```

---

*Last updated: 2026*