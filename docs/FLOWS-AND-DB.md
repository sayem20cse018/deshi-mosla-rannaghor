# দেশি মসলার রান্নাঘর
## Customer Flow · Admin Flow · Payment Flow · Database Relationships

---

## 1. CUSTOMER FLOW

```
BROWSE
  └─ Homepage → Category / Search / Filter
        └─ Product Listing (sort, filter)
              └─ Product Details Page
                    ├─ Add to Cart ──────────────┐
                    ├─ Add to Wishlist            │
                    └─ Buy Now (skip cart) ───┐   │
                                              │   │
CART  ◄────────────────────────────────────┘   │
  └─ View Cart (items, qty, subtotal)           │
        ├─ Apply Coupon                          │
        ├─ Update Qty / Remove                   │
        └─ Proceed to Checkout ◄────────────────┘

CHECKOUT
  ├─ Customer Info (name, phone, email)
  ├─ Delivery Address (division, district, area)
  ├─ Delivery Note (optional)
  ├─ Select Payment Method
  │     ├─ COD → Order Placed immediately
  │     ├─ bKash / Nagad / Rocket / Upay → MFS redirect
  │     ├─ Mobile Banking → Bank details shown
  │     ├─ Internet Banking → Gateway redirect
  │     ├─ Bank Transfer → Show account info, submit TxnID
  │     └─ Card (Visa/MC/Amex) → SSLCommerz gateway
  └─ Place Order

PAYMENT PROCESSING
  ├─ COD: Order status = CONFIRMED
  ├─ MFS/Card/Bank: Gateway → Webhook → Verify → Confirm
  └─ Manual Bank Transfer: Admin verifies → Confirms

POST ORDER
  ├─ Order Confirmation notification (email/SMS)
  ├─ Order Tracking (status updates)
  │     Pending → Confirmed → Processing → Packed → Shipped → Delivered
  ├─ Return/Refund Request
  └─ Write Review (after delivery)
```

---

## 2. ADMIN FLOW

```
ADMIN LOGIN (separate auth)
  └─ Admin Dashboard
        ├─ Overview Stats
        │     Total Sales / Orders / Customers / Products
        │     Pending Orders / Low Stock / Today Sales
        │
        ├─ PRODUCT MANAGEMENT
        │     Add/Edit/Delete Product
        │     Set: Featured / BestSeller / NewArrival
        │     Upload Images (Cloudinary)
        │     Manage Inventory / Stock
        │
        ├─ ORDER MANAGEMENT
        │     View All Orders (filter by status)
        │     Update Order Status
        │     View Order Details + Customer Info
        │     Assign Delivery
        │
        ├─ PAYMENT MANAGEMENT
        │     View All Payments
        │     Verify Manual Bank Transfer
        │     Process Refund
        │     Payment Statistics
        │
        ├─ CUSTOMER MANAGEMENT
        │     View / Search Customers
        │     Block / Unblock / Delete
        │     View Order History
        │
        ├─ CONTENT MANAGEMENT
        │     Hero Banner Add/Edit/Delete
        │     Promotional Banners
        │     Homepage Sections
        │
        ├─ COUPON MANAGEMENT
        │     Create/Edit/Delete Coupons
        │     Percentage / Fixed / Free Delivery
        │
        ├─ RECIPE MANAGEMENT
        │     Add/Edit Recipes
        │     Link Products to Recipes
        │
        ├─ REVIEW MANAGEMENT
        │     Approve / Reject / Delete Reviews
        │
        ├─ DELIVERY MANAGEMENT
        │     Set Delivery Charges by Area
        │     Update Delivery Status
        │
        └─ REPORTS & ANALYTICS
              Daily/Weekly/Monthly/Yearly Sales
              Best Selling Products
              Customer Analytics
              Payment Method Breakdown
```

---

## 3. PAYMENT FLOW

```
Customer selects Payment Method at Checkout
        │
        ├── COD
        │     Order Created (status: PENDING, paymentStatus: PENDING)
        │     COD status: PENDING
        │     Delivery agent collects → Admin updates COD status: COLLECTED
        │     Order status: DELIVERED
        │
        ├── bKash / Nagad / Rocket / Upay (MFS)
        │     Order Created → Payment record created (PENDING)
        │     Frontend redirects to MFS gateway
        │     Customer pays
        │     Gateway calls Webhook: POST /payments/webhook/mfs
        │     Backend verifies transaction
        │     Payment status: PAID → Order status: CONFIRMED
        │     Notification sent
        │
        ├── Internet Banking / Card (SSLCommerz)
        │     Order Created → SSLCommerz session created
        │     Customer redirected to SSLCommerz
        │     Payment completed → SSLCommerz calls Webhook
        │     POST /payments/webhook/sslcommerz
        │     Server-side verification (IPN)
        │     Payment status: PAID → Order status: CONFIRMED
        │     Redirect to /payment/success
        │
        ├── Bank Transfer (Manual)
        │     Order Created → Bank account details shown to customer
        │     Customer transfers and submits Transaction ID
        │     Admin reviews in Payment Management
        │     Admin clicks "Verify" → Payment status: PAID
        │     Order status: CONFIRMED
        │
        └── Refund Flow
              Customer requests return/refund
              Admin approves refund
              Manual refund OR gateway refund API
              Payment status: REFUNDED / PARTIALLY_REFUNDED
              Order status: REFUNDED
```

---

## 4. DATABASE ENTITY RELATIONSHIPS (PK/FK)

```
USER (PK: id)
  ├─ Cart (FK: userId → User.id)          [1:1]
  │    └─ CartItem (FK: cartId, productId) [1:N]
  ├─ Wishlist[] (FK: userId)               [1:N]
  │    └─ WishlistItem (FK: wishlistId, productId)
  ├─ Address[] (FK: userId)                [1:N]
  ├─ Order[] (FK: userId, addressId, couponId) [1:N]
  │    ├─ OrderItem[] (FK: orderId, productId)
  │    ├─ Payment (FK: orderId)            [1:1]
  │    │    └─ PaymentTransaction[] (FK: paymentId)
  │    ├─ Delivery (FK: orderId)           [1:1]
  │    └─ OrderStatusHistory[] (FK: orderId)
  ├─ Review[] (FK: userId, productId)      [1:N]
  ├─ Notification[] (FK: userId)           [1:N]
  └─ CouponUsage[] (FK: userId, couponId)  [1:N]

PRODUCT (PK: id)
  ├─ Category (FK: categoryId → Category.id)  [N:1]
  ├─ Brand? (FK: brandId → Brand.id)          [N:1]
  ├─ ProductImage[] (FK: productId)            [1:N]
  ├─ Inventory (FK: productId)                 [1:1]
  │    └─ InventoryLog[] (FK: inventoryId)
  ├─ CartItem[] (FK: productId)
  ├─ WishlistItem[] (FK: productId)
  ├─ OrderItem[] (FK: productId)
  ├─ Review[] (FK: productId)
  └─ RecipeIngredient[]? (FK: productId)

CATEGORY (PK: id)
  ├─ self-referential: parentId → Category.id  [N:1 for subcategory]
  └─ Product[] (FK: categoryId)

COUPON (PK: id)
  ├─ Order[] (FK: couponId)
  └─ CouponUsage[] (FK: couponId)

RECIPE (PK: id)
  └─ RecipeIngredient[] (FK: recipeId, productId?)

ADMIN (PK: id)
  └─ AdminActivityLog[] (FK: adminId)

SITE-LEVEL (no FK, standalone)
  ├─ Banner
  ├─ SiteSettings
  └─ DeliveryCharge
```

---

## 5. KEY ENTITY FIELD SUMMARY

| Entity | Critical Fields |
|---|---|
| User | id, name, email (unique), phone (unique), password (hashed), role, isActive, isBlocked |
| Product | id, slug (unique), sku (unique), price, discountPrice, stockStatus, isFeatured, isBestSeller |
| Order | id, orderNumber (unique), userId, status, paymentMethod, paymentStatus, totalAmount |
| Payment | id, orderId (unique), transactionId (unique), paymentStatus, gatewayResponse |
| Inventory | id, productId (unique), availableStock, lowStockAlert |
| Coupon | id, code (unique), discountType, discountValue, expiryDate, usageLimit |
| Review | id, [userId + productId + orderId] (unique constraint) |
| Cart | id, userId (unique) — one cart per user |

---

## 6. SECURITY CHECKLIST

| Layer | Implementation |
|---|---|
| Passwords | bcryptjs (12 rounds) |
| Auth Tokens | JWT (access 7d, refresh 30d) |
| Admin Auth | Separate JWT secret + 1d expiry |
| API Security | Helmet, CORS, Rate Limiting (ThrottlerModule) |
| Input Validation | class-validator + ValidationPipe (whitelist mode) |
| SQL Injection | Prisma parameterized queries (automatic) |
| XSS | Helmet CSP headers |
| Sensitive Data | Card PIN/CVV/passwords NEVER stored |
| Payments | Server-side webhook verification only |
| HTTPS | Required in production |
