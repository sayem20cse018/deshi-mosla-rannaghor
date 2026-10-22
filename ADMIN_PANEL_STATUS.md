# Admin Panel Status - Deshi Moslar Rannaghar

**Audit Date:** October 2026
**Framework:** Next.js 14 (App Router) + NestJS + PostgreSQL (Neon) + Cloudinary

---

## Completed Pages / Features

### Core Infrastructure
- Admin login page (standalone, no sidebar/header)
- AdminGuard (JWT token verification on every mount - no auto-login from stale state)
- AdminSidebar (dark theme, collapsible, 13 sections, hover tooltips when collapsed)
- AdminHeader (breadcrumbs, mobile hamburger, notifications bell, profile dropdown with logout)
- Mobile sidebar overlay (hamburger opens slide-in drawer with backdrop)
- Admin layout shell (guards all /admin/* routes)

### Dashboard
- Real-time stats: Revenue (with % change), Total Orders, Customers, Products
- Order status strip: Pending, Processing, Shipped, Delivered, Cancelled, Low Stock
- Period filter: Today, Yesterday, 7 Days, 30 Days, This Month, This Year, Custom date range
- Revenue trend mini bar chart (custom, no external library) with hover tooltips
- Recent Orders table (10 orders, status badges, customer info)
- Top Products list (5 products by revenue, with image + sold count)
- New Customers list (6 most recent)
- Recent Reviews list (5 most recent, with star rating)
- Low Stock alert list (8 products)
- Quick Actions shortcuts: Add Product, Add Category, Add Banner, Add Coupon, View Orders
- Refresh button for all sections

### Catalog
- Products: Full list with search, filter (category, brand, status, stock), sort, pagination
  - Bulk delete, bulk status toggle
  - Inline active/inactive toggle per product
  - Add Product: 6-tab form (Basic, Pricing, Inventory, Flags+SEO, Images, Variants)
  - Edit Product: Same form, pre-populated
  - Product Images: Multi-file drag-drop upload, gallery grid, set primary, delete per image
  - Product Variants: Inline create/edit/delete (SKU, price, sale price, stock, weight)
- Categories: List (tree + flat), create/edit/delete, reorder with arrows
  - UploadButton for category image (direct Cloudinary upload)
- Brands: List with logo preview, create/edit/delete
  - UploadButton for brand logo
- Collections: List with product count, create/edit/delete
  - UploadButton for cover image + banner image
  - Add/remove products from collection
- Media Library: Full grid/list view, single + bulk upload, drag-drop, progress bars
  - Search, folder filter (products/categories/brands/banners/etc.)
  - Alt text editing, copy URL, bulk delete, image preview modal

### Orders
- Full orders table: search, 10 status tabs with live counts, advanced filters
- Filter by: payment status, payment method (COD/bKash/Nagad/SSLCommerz), date range
- Bulk select + bulk status update (with confirmation dialog)
- Order Detail slide-in drawer: full order info, timeline, items, address, delivery, payment
- Status update from drawer: buttons for valid next statuses, courier/tracking input for SHIPPED
- Pagination

### Marketing
- Coupons: Full CRUD, percentage/fixed/free-delivery types, usage limits, date range, status toggle, copy code
- Banners: Full CRUD, position selector (HERO/PROMOTIONAL/etc.), desktop+mobile image upload, schedule
- Offers: Full CRUD, discount type, target type, schedule
- Promotions: Full CRUD, campaign name, discount, target, schedule
- Newsletter Subscribers: List, search, bulk delete, CSV export

### Content
- Hero Slides: CRUD, reorder (up/down arrows), desktop+mobile image upload, schedule, active toggle
- Homepage CMS: 14 sections toggle on/off, edit title/subtitle/image/button/extraData JSON, reorder
- Testimonials: CRUD, star rating selector, avatar upload, search, pagination

### Customers (partial)
- Placeholder pages for: Customers list, Reviews list, Wishlist

### Settings (partial)
- Placeholder pages for all settings sections

---

## Not Completed (Placeholder Pages)

All these pages show: PageHeader + "Coming soon / Under construction" EmptyState

### Customers
- Customers list (search, block/unblock, order history)
- Reviews moderation (approve/reject)
- Wishlist analytics

### Inventory
- Stock management
- Low Stock alerts (list exists in dashboard but no dedicated page)
- Stock adjustments
- Inventory history / logs

### Delivery
- Delivery providers
- Delivery zones
- Delivery charges (CRUD for district-based charges)
- Delivery settings

### Payments
- Transactions list
- COD management
- Online payment history
- Payment gateway settings

### Reports
- Sales report
- Orders report
- Products report
- Customers report
- Inventory report

### Notifications
- Notifications center
- Email templates
- SMS templates

### Settings
- General store settings
- Store profile
- SEO settings
- Tax configuration
- Payment method settings
- Notification preferences

### Administration
- Admin users management
- Roles and permissions
- Activity logs
- System health monitor

### Content (partial placeholders)
- Pages (static pages)
- Recipes management
- Blog management
- FAQs management

---

## Duplicates Removed

- **Admin Panel link from main website Header** - removed completely. Regular users no longer see an Admin Panel link in the public header or mobile drawer.
- **Dead sidebar nav item: Subcategories** (`/admin/catalog/subcategories`) - no page existed. Removed from navConfig.
- **Dead sidebar nav item: Checkout Settings** (`/admin/settings/checkout`) - no page existed. Removed from navConfig.

---

## Mobile Responsive Fixes

- Admin layout uses hamburger menu (`lg:hidden`) in header to open mobile sidebar drawer
- Sidebar is fully hidden on mobile, opens as overlay with `fixed inset-0 z-50 backdrop-blur`
- Orders table hides less-critical columns on mobile: Items (`hidden md:table-cell`), Payment + Date (`hidden lg:table-cell`)
- Dashboard stat cards: 2-column on mobile (`grid-cols-2`), 4-column on desktop (`lg:grid-cols-4`)
- Order status strip: 2-col mobile, 3-col sm, 6-col lg
- Period filter buttons wrap on small screens (`flex-wrap`)
- AdminHeader profile text hidden on xs (`hidden sm:block`)
- Quick Actions: 2-col mobile, 5-col sm+

---

## Payment Logos / Methods Implemented

Text-label based (no image assets):

| Method Key | Display Label | Brand Color |
|---|---|---|
| CASH_ON_DELIVERY | Cash on Delivery | Green |
| BKASH | bKash | Pink |
| NAGAD | Nagad | Orange |
| ROCKET | Rocket | Violet |
| SSLCOMMERZ | Card / Net Banking | Blue |
| VISA | Visa | Blue |
| MASTERCARD | Mastercard | Red |

`PAYMENT_BRAND_CONFIG` added to `orderUtils.ts` with brand bg/color/border per method.
`PaymentMethodBadge` component added to `OrderStatusBadge.tsx` with per-brand colors.
No SVG/PNG payment logo image files exist in the project (future improvement needed).

---

## UI/UX Improvements Made

1. **navConfig.ts** - Removed 2 dead-link nav items (Subcategories, Checkout Settings)
2. **orderUtils.ts** - Added `PAYMENT_BRAND_CONFIG` with brand colors per payment method
3. **OrderStatusBadge.tsx** - Added `PaymentMethodBadge` component with brand-specific bg/color
4. **Sidebar** - Collapse/expand working, hover tooltips when collapsed, orange active indicators
5. **Dashboard** - Real data from 7 backend APIs, period filter, custom date range, chart
6. **Orders** - Status tabs with live counts, advanced filters, bulk actions, detail drawer
7. **Product form** - 6-tab form with direct image upload (drag-drop, progress, gallery)
8. **UploadButton** - Direct file drag-drop + progress bar (no longer requires URL paste)

---

## Still Needs To Be Done

1. **~35 placeholder pages** - All Customers, Inventory, Delivery, Payments, Reports, Notifications, Settings, Administration pages need real implementation
2. **Payment logo image assets** - Add bKash/Nagad/Rocket/SSLCommerz SVG logos for use in order detail, checkout, payment settings
3. **Notifications bell** - Wire to real notification data (backend NotificationType exists in schema)
4. **Search button in header** - Add global admin search (products, orders, customers by ID/name/phone)
5. **Delivery charges CRUD** - Backend seed data exists but no admin UI
6. **Admin user management** - Create/edit/block admin accounts
7. **Activity logs** - Display AdminActivityLog records
8. **Reports** - Charts and data export for sales, orders, products, customers
9. **Image reorder in product gallery** - Drag-to-reorder not yet implemented (only up/down arrows in hero slides)
10. **Blog / Recipes / FAQs** - Content management pages are placeholders
11. **Hero Slides** - Currently DB tables may not exist on Railway (migration pending)
12. **Homepage sections DB** - `homepage_sections` table migration may need running on Railway