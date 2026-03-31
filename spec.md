# Ali Tailor - Performance & Bug Fixes

## Current State
Full-stack tailor ERP app with ICP cloud backend, React frontend. Features: Customers, Orders, Billing, Staff, Appointments, Inventory, Dashboard.

## Requested Changes (Diff)

### Add
- Loading skeletons on pages while data is fetching
- Memoize `sortCustomers` in BillingPage (already a function, make useMemo)

### Modify
- **CRITICAL BUG FIX**: In `BillingPage.tsx`, `createCheckoutSession` is called with swapped URL arguments. Signature is `(items, successUrl, cancelUrl)` but `url` (plain current page) is passed as successUrl and `successUrl` (with `?payment_success=1&inv_id=...`) is passed as cancelUrl. Fix: swap the 2nd and 3rd arguments.
- **Performance**: In `CustomersPage.tsx`, photo counts are loaded per-customer with N separate ICP calls on every page load. Remove this bulk loading; instead load counts lazily only after photos dialog is opened/closed.
- **Performance**: In `StaffPage.tsx`, `hasStaffPassword` is called once per staff member individually in `load()`. This is N ICP calls. Change to batch: call `getStaff()` once then fire all `hasStaffPassword` calls concurrently with `Promise.all` (already done), but also cache results — this is fine. Minor: remove unused `_pwRefresh` state.
- **Bug**: `sortedCustomers` in BillingPage is computed on every render (not memoized). Wrap in `useMemo`.
- **Performance**: DashboardPage fires 3 backend calls sequentially — already using `Promise.all`, keep as is.
- **UX Bug**: In `OrdersPage.tsx` `addOrder` function, if the user clicks "Create Order" before selecting a customer, it silently fails without any error message. Add validation and error display.
- **UX Bug**: In `BillingPage.tsx` `createInv`, if no order selected, silently returns. Already has `disabled={!form.orderId}`, but `createInv` doesn't guard. Keep button disabled guard.
- **Performance**: Remove per-customer photo count loading in `CustomersPage` (the big `useEffect` that fires N `getCustomerPhotos` calls). Replace with: when `openPhotos` is called, just show the photos dialog. When dialog closes, update the count only for that single customer (already done in `closePhotos`... actually not, closePhotos doesn't update count). Keep the `photoCounts` state but only load count for individual customers on demand via `openPhotos`.

### Remove
- The bulk photo count loading `useEffect` in `CustomersPage` that fires `backend.getCustomerPhotos(c.id)` for every customer on page load

## Implementation Plan
1. Fix Stripe URL swap in BillingPage.tsx (line: `backend.createCheckoutSession([...], url, successUrl)` → swap to `(items, successUrl, url)`)
2. Remove bulk photo count `useEffect` from CustomersPage; update `openPhotos` to set photo count when photos are loaded; update `closePhotos` to preserve the count
3. Wrap `sortedCustomers` in `useMemo` in BillingPage
4. Add customer validation error in OrdersPage `addOrder`
5. Remove unused `_pwRefresh` var in StaffPage
6. Add general loading states where missing (skeleton loaders on list pages)
