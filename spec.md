# Ali Tailor - Cloud Backend Fix

## Current State
The app's `actor.ts` exports `localBackend` (IndexedDB-based). The generated IDL (`backend.did.js`) has `IDL.Service({})` (empty). This means ALL backend calls go to IndexedDB, never to the ICP canister. Data does not sync across devices.

## Requested Changes (Diff)

### Add
- Full IDL factory in `backend.did.js` covering all Motoko types and methods
- Updated `backend.did.d.ts` with complete `_SERVICE` type
- All backend methods in `backend.ts` `backendInterface` and `Backend` class
- Async actor initialization in `actor.ts` using `createActorWithConfig()`
- Loading state in `App.tsx` while actor initializes

### Modify
- `backend.did.js` → full IDL with all types (Measurements, Customer, Order, etc.)
- `backend.did.d.ts` → complete `_SERVICE` interface
- `backend.ts` → `backendInterface` and `Backend` class with all methods
- `actor.ts` → use real ICP actor instead of `localBackend`
- `App.tsx` → show loading state until backend is ready
- All pages that use `backend.*` → ensure compatibility with real actor return types

### Remove
- Nothing removed

## Implementation Plan
1. Rewrite `backend.did.js` with full Candid IDL for all Motoko types and public methods
2. Rewrite `backend.did.d.ts` with complete `_SERVICE` TypeScript interface
3. Update `backend.ts` to implement all methods in `backendInterface` and `Backend` class by calling the underlying actor
4. Update `actor.ts` to async-initialize the real ICP actor using `createActorWithConfig()`, with `localBackend` as offline fallback
5. Add loading/error state to `App.tsx`
6. The `tailor-types.ts` `TailorBackend` interface must match what `backend.ts` exports
