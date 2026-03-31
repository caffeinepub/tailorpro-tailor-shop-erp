# Ali Tailor - Cloud Sync Migration

## Current State
- Customers, orders, appointments, inventory, invoices are stored in ICP Motoko backend (cloud)
- Staff passwords stored in localStorage (device-local)
- Owner password stored in localStorage (device-local)
- Garment photos stored in IndexedDB (device-local)
- Staff session stored in localStorage (acceptable, session-scoped)

## Requested Changes (Diff)

### Add
- Backend: `staffPasswords` state (phone -> password map)
- Backend: `setStaffPassword(phone, password)` function
- Backend: `verifyStaffPassword(phone, password)` returns Bool
- Backend: `getOwnerPassword()` returns Text
- Backend: `setOwnerPassword(newPassword)` function
- Backend: `initOwnerPassword(password)` for first-time setup
- blob-storage component for garment photos

### Modify
- StaffLoginPage: use `backend.verifyStaffPassword()` instead of localStorage for staff login
- StaffLoginPage: use `backend.getOwnerPassword()` instead of localStorage for owner login
- StaffPage: use `backend.setStaffPassword()` instead of localStorage when setting passwords
- CustomersPage: upload photos to blob-storage, retrieve via blob URL instead of IndexedDB

### Remove
- localStorage usage for `tailorpro_pw_*` keys
- localStorage usage for `tailorpro_owner_creds`
- IndexedDB usage for photos (idb.ts `photos` store)

## Implementation Plan
1. Add password functions to main.mo
2. Select blob-storage component
3. Frontend agent: update StaffLoginPage, StaffPage to use backend auth
4. Frontend agent: update CustomersPage photos to use blob-storage
5. Deploy
