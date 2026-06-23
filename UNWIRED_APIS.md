# Unwired / Broken APIs

Audit of endpoints that don't do what they claim. Generated 2026-06-23.

## FAKE — endpoints exist but return wrong/mock data

### 1. `GET /loan/eligibility` and `GET /loan/eligibility/:farmerId`
- **File:** [controllers/loanController.js:31](controllers/loanController.js#L31)
- **Problem:** `creditScore` is hardcoded (most recently to `500` per commit `2f58fe4`, previously `400`). The `calculateCreditScore()` helper defined directly above is never called, so reward points and profit records are ignored.
- **Fix:** Invoke `calculateCreditScore(farmerId)` and use its result.

### 2. `GET /loan-history` and `GET /loan-history/:farmerId`
- **File:** [routes/loanRoutes.js:14-15](routes/loanRoutes.js#L14)
- **Problem:** Both routes point to `getLoanStatus`, so they return the same payload as `/loan-status` instead of a repayment history.
- **Fix:** Add a `getLoanHistory` controller that queries `LoanRepayment` records (optionally joined with `LoanApplication`).

### 3. `GET /crop-records`
- **File:** [index.js:193](index.js#L193)
- **Problem:** Documentation says "retrieve production records," but the handler returns all `Crop` rows — identical to `/crops`. The `ExpenseProfit` model in the Prisma schema is the one that should be queried.
- **Fix:** Query `ExpenseProfit` (filterable by `farmerId` / `cropId`).

### 4. `POST /crop-record/add`
- **File:** [index.js:287](index.js#L287)
- **Problem:** Documentation says "Add crop production record," but the handler creates a `Crop` row. Wrong model.
- **Fix:** Create an `ExpenseProfit` record from the request body.

---

## MISSING — documented in `API_DOCUMENTATION.md` but no route exists

### Equipment booking
- `POST /equipment/book`
- `POST /equipment/cancel-booking`
- `GET  /my-booking`

### Marketplace
- `GET  /products`
- `GET  /product/:id`
- `GET  /my-products`
- `GET  /orders`
- `POST /product/add`
- `POST /product/update`
- `POST /product/purchase`

### Loan
- `POST /loan/document-upload`

---

## Summary

| Status   | Count |
|----------|-------|
| FAKE     | 4 (covering 6 route paths) |
| MISSING  | 10 |
