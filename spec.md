# Ali Tailor - Tailor Shop ERP

## Current State
Garment photos stored as base64 in IndexedDB (device-local). All other data is in ICP cloud backend.

## Requested Changes (Diff)

### Add
- Backend: customerPhotos map (customerId -> [Text] hashes), methods: addCustomerPhoto, getCustomerPhotos, deleteCustomerPhoto
- Frontend: upload photos using ExternalBlob.fromBytes(), store hash in backend
- Frontend: display photos using ExternalBlob.fromURL(hash).getDirectURL()

### Modify
- main.mo: add photo storage state and methods
- backend.d.ts: add new photo API
- CustomersPage.tsx: replace IDB/base64 logic with ExternalBlob cloud storage

### Remove
- IDB photo store usage for garment photos
- base64 canvas compression logic

## Implementation Plan
1. Update main.mo with customerPhotos state + CRUD
2. Update backend.d.ts
3. Rewrite photo upload/display/delete in CustomersPage.tsx using ExternalBlob
