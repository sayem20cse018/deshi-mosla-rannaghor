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