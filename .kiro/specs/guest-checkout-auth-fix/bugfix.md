# Bugfix Requirements Document

## Introduction

Guest users are being incorrectly blocked from accessing the cart and checkout flows. The `(account)` layout's auth guard pattern appears to have leaked into cart/checkout navigation — or another redirect is firing — causing unauthenticated visitors to be sent to `/login` when they click the cart icon or attempt to reach `/checkout`. The fix must restore fully open guest access to cart and checkout while leaving all authenticated-user behaviour unchanged.

Bug condition: `C(X)` = the request is made by a user where `isAuthenticated === false`.

---

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a guest (unauthenticated) user clicks the cart icon in the Header THEN the system redirects the user to the `/login` page instead of opening the cart drawer or navigating to `/cart`.

1.2 WHEN a guest user clicks the floating cart card (`FloatingCart`) THEN the system redirects the user to the `/login` page instead of opening the cart drawer.

1.3 WHEN a guest user clicks the cart button in `MobileNav` THEN the system redirects the user to the `/login` page instead of opening the cart drawer.

1.4 WHEN a guest user navigates directly to `/cart` THEN the system redirects the user to `/login` instead of displaying the cart page.

1.5 WHEN a guest user navigates directly to `/checkout` or clicks "Checkout" from the cart THEN the system redirects the user to `/login` instead of displaying the checkout form.

1.6 WHEN a guest user adds a product to the cart and clicks "Checkout" in `CartDrawer` THEN the system redirects the user to `/login` instead of proceeding to the checkout page.

### Expected Behavior (Correct)

2.1 WHEN a guest user clicks the cart icon in the Header THEN the system SHALL open the `CartDrawer` overlay without any authentication check or redirect.

2.2 WHEN a guest user clicks the floating cart card (`FloatingCart`) THEN the system SHALL open the `CartDrawer` overlay without any authentication check or redirect.

2.3 WHEN a guest user clicks the cart button in `MobileNav` THEN the system SHALL open the `CartDrawer` overlay without any authentication check or redirect.

2.4 WHEN a guest user navigates directly to `/cart` THEN the system SHALL display the cart page with all items, allowing the user to review and modify their cart.

2.5 WHEN a guest user navigates to `/checkout` THEN the system SHALL display the full checkout form (name, phone, address, delivery, payment) without redirecting to login.

2.6 WHEN a guest user submits the checkout form with valid details THEN the system SHALL place the order via the `/orders/guest` API endpoint and show the confirmation page.

2.7 WHEN a guest user is on `/checkout` THEN the system SHALL display an informational banner offering an optional sign-in link — this SHALL be a soft suggestion, not a gate.

### Unchanged Behavior (Regression Prevention)

3.1 WHEN an authenticated user clicks the cart icon THEN the system SHALL CONTINUE TO open the `CartDrawer` as before.

3.2 WHEN an authenticated user navigates to `/cart` THEN the system SHALL CONTINUE TO display the cart page and load their server-synced cart items.

3.3 WHEN an authenticated user navigates to `/checkout` THEN the system SHALL CONTINUE TO use the `/orders` (authenticated) API endpoint, pre-fill their name/phone from `user`, and display the saved-address selector.

3.4 WHEN an authenticated user completes checkout THEN the system SHALL CONTINUE TO redirect to the order confirmation or order-tracking page.

3.5 WHEN an authenticated user logs in with guest cart items present THEN the system SHALL CONTINUE TO sync those guest items to the server before fetching the merged cart.

3.6 WHEN any user navigates to `/account/*` routes THEN the system SHALL CONTINUE TO enforce authentication and redirect unauthenticated users to `/login`.

3.7 WHEN an admin user navigates to `/admin/*` routes THEN the system SHALL CONTINUE TO enforce authentication via `AdminGuard` and redirect to `/admin/login`.

3.8 WHEN a guest user adds products to the cart THEN the system SHALL CONTINUE TO persist those items in `localStorage` via the Zustand `dmr-cart-v2` persist store so they survive page refreshes.

3.9 WHEN a guest places an order THEN the system SHALL CONTINUE TO clear the cart after successful order submission.

---

## Bug Condition Pseudocode

```pascal
FUNCTION isBugCondition(X)
  INPUT: X of type NavigationRequest
  OUTPUT: boolean

  // The bug is triggered whenever a guest attempts to access cart or checkout
  RETURN X.isAuthenticated = false
     AND (X.destination IN ['/cart', '/checkout', 'openCartDrawer'])
END FUNCTION
```

```pascal
// Property: Fix Checking — guests must never be redirected to login for cart/checkout
FOR ALL X WHERE isBugCondition(X) DO
  result ← navigate'(X)
  ASSERT result.destination ≠ '/login'
  ASSERT result.destination ≠ '/login?redirect=...'
  ASSERT result.cartDrawerOpens = true   // when destination = 'openCartDrawer'
  ASSERT result.pageRendered = true      // when destination = '/cart' or '/checkout'
END FOR
```

```pascal
// Property: Preservation Checking — authenticated-user flows must be unchanged
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT navigate'(X) = navigate(X)
END FOR
```
