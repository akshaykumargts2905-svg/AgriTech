# APIs Requiring `getAuthenticatedUserId` Middleware

Middleware location: [middleware/authCheck.js](middleware/authCheck.js)

---

## Should require auth (user-specific or state-changing)

### Auth / Profile — [routes/authRoutes.js](routes/authRoutes.js)
- `GET /profile`
- `POST /profile/create`
- `POST /profile/update`

### Notifications & Admin Writes — [routes/snehaRoutes.js](routes/snehaRoutes.js)
- `GET /notifications`
- `POST /notification/read`
- `POST /notification/send`
- `POST /weather/add`
- `POST /farming-tip/add`

### Loans — [routes/loanRoutes.js](routes/loanRoutes.js) — all routes
- `GET /loan-status`
- `GET /loan-status/:farmerId`
- `GET /loan-history`
- `GET /loan-history/:farmerId`
- `GET /loan/eligibility`
- `GET /loan/eligibility/:farmerId`
- `POST /loan/apply`
- `POST /loan/:loanId/repayment`
- `PATCH /loan/:loanId/status`

### Rewards — [routes/rewardRoutes.js](routes/rewardRoutes.js)
- `GET /reward-points`
- `GET /reward-points/:farmerId`
- `GET /reward-history`
- `GET /reward-history/:farmerId`
- `POST /points/add`
- `POST /reward/claim`

### Community — [routes/communityRoutes.js](routes/communityRoutes.js)
- `POST /post/create`
- `POST /post/comment`
- `POST /post/like`
- `POST /video/upload`
- `POST /video/like`
- `POST /video/comment`

### Equipment & Crop (inline in [index.js](index.js))
- `POST /equipments/add`
- `POST /crop/add`
- `POST /crop/update`
- `POST /crop-records/add`

---

## Should stay public (no middleware)

- `POST /signup`, `POST /login`
- `POST /forgot-password`, `POST /verify-otp`, `POST /reset-password`
- `GET /` (health)
- `GET /weather`, `GET /farming-tips`
- `GET /posts`, `GET /post/:id`, `GET /videos`, `GET /video/:id`
- `GET /leaderboard`
- `GET /crops`, `GET /crop/:id`, `GET /crop-records`, `GET /crop-history`, `GET /crop/name/:cropName`
- `GET /equipments`, `GET /equipments/:id`, `GET /equipments/search/:name`

---

## ⚠️ Known Bug in Middleware

[middleware/authCheck.js](middleware/authCheck.js) uses `jwt.verify(...)` without importing `jsonwebtoken`. It will throw `ReferenceError: jwt is not defined` on every request. Fix before wiring it in:

```js
import jwt from "jsonwebtoken";
```
