# Ali Tailor - Payment Feature

## Current State
Billing page has invoices with payment status (Unpaid/PartiallyPaid/Paid) but only manual cash tracking. Stripe component is selected but not wired.

## Requested Changes (Diff)

### Add
- Stripe checkout session creation (backend: createStripeCheckoutSession)
- Stripe session status check (backend: getStripeSessionStatus)
- Stripe config storage (secretKey, allowedCountries) with owner-only setter/getter
- Pay Online button on each invoice in BillingPage
- After payment success, invoice status auto-updates to Paid
- OwnerSettingsPage: Stripe API key input

### Modify
- main.mo: import Stripe module, add config and checkout functions
- BillingPage: add Pay Online button per invoice
- OwnerSettingsPage: add Stripe key field

### Remove
- Nothing

## Implementation Plan
1. Add Stripe config and checkout functions to main.mo
2. Update frontend BillingPage with Pay Online button
3. Update OwnerSettingsPage with Stripe key setting
