# AgriTech API Documentation

This document describes the available REST APIs for the AgriTech backend. The APIs are grouped by feature area and include the supported HTTP methods with brief descriptions.

## Team API Ownership

- **Sneha**: Authentication & Profile, Weather & Farming, Notifications
- **Rinky**: Crop Management
- **Akshay**: Marketplace, Equipment Rental
- **Kanchan**: Community & Videos, Rewards, Loan System

---

## 1. Authentication & Profile

### GET APIs

- `GET /profile`
  - Retrieve the authenticated user's profile details.
- `GET /user/:id`
  - Retrieve profile details for a specific user by ID.

### POST APIs

- `POST /signup`
  - Register a new user account.
- `POST /login`
  - Authenticate a user with email/password and return user details.
- `POST /forgot-password`
  - Initiate password recovery by email.
- `POST /verify-otp`
  - Verify an OTP sent to the user's email.
- `POST /reset-password`
  - Reset the user's password after OTP verification.
- `POST /profile/create`
  - Create a user profile with additional profile details.
- `POST /profile/update`
  - Update an existing user profile.

---

## 2. Crop Management

### GET APIs

- `GET /crops`
  - Retrieve a list of all crops.
- `GET /crop/:id`
  - Retrieve details for a specific crop by ID.
- `GET /crop-records`
  - Retrieve crop records for the authenticated user.
- `GET /crop-history`
  - Retrieve historical crop performance or record history.

### POST APIs

- `POST /crop/add`
  - Add a new crop entry.
- `POST /crop/update`
  - Update an existing crop entry.
- `POST /crop-record/add`
  - Add a new crop production record.

---

## 3. Weather & Farming

### GET APIs

- `GET /weather`
  - Retrieve weather data for a specified location.
- `GET /farming-tips`
  - Retrieve farming tips and guidance.

### POST APIs

- `POST /weather/add`
  - Add weather data for a location.
- `POST /farming-tip/add`
  - Add farming tips and guidance for a crop.

---

## 4. Equipment Rental

### GET APIs

- `GET /21equipments`
  - Retrieve a list of available rental equipment.
- `GET /equipment/:id`
  - Retrieve details for a specific equipment item.
- `GET /my-booking`
  - Retrieve the authenticated user's equipment bookings.

### POST APIs

- `POST /equipment/add`
  - Add a new equipment item to the rental marketplace.
- `POST /equipment/book`
  - Book equipment for a user.
- `POST /equipment/cancel-booking`
  - Cancel an existing equipment booking.

---

## 5. Marketplace

### GET APIs

- `GET /products`
  - Retrieve a list of marketplace products.
- `GET /product/:id`
  - Retrieve details for a specific product by ID.
- `GET /my-products`
  - Retrieve products created by the authenticated user.
- `GET /orders`
  - Retrieve orders placed by the authenticated user.

### POST APIs

- `POST /product/add`
  - Create a new product listing.
- `POST /product/update`
  - Update an existing product listing.
- `POST /product/purchase`
  - Purchase a product from the marketplace.

---

## 6. Community & Videos

### GET APIs

- `GET /videos`
  - Retrieve a list of community videos.
- `GET /video/:id`
  - Retrieve details for a specific video by ID.
- `GET /posts`
  - Retrieve a list of community posts.
- `GET /post/:id`
  - Retrieve details for a specific post by ID.

### POST APIs

- `POST /video/upload`
  - Upload a new video.
- `POST /video/like`
  - Like a video.
- `POST /video/comment`
  - Add a comment to a video.
- `POST /post/create`
  - Create a new community post.
- `POST /post/comment`
  - Add a comment to a community post.
- `POST /post/like`
  - Like a community post.

---

## 7. Rewards

### GET APIs

- `GET /reward-points`
  - Retrieve the authenticated user's reward point balance.
- `GET /reward-points/:farmerId`
  - Retrieve reward point balance for a specific farmer.
- `GET /reward-history`
  - Retrieve the user's reward transaction history.
- `GET /reward-history/:farmerId`
  - Retrieve reward transaction history for a specific farmer.
- `GET /leaderboard`
  - Retrieve the reward leaderboard.

### POST APIs

- `POST /reward/claim`
  - Claim reward points or rewards.
- `POST /points/add`
  - Add reward points to the user's account.

---

## 8. Loan System

### GET APIs

- `GET /loan-status`
  - Retrieve the current loan status for the authenticated user.
- `GET /loan-status/:farmerId`
  - Retrieve loan status for a specific farmer.
- `GET /loan-history`
  - Retrieve the user's loan history.
- `GET /loan/eligibility`
  - Check loan eligibility using farmer reward points and profit records.
- `GET /loan/eligibility/:farmerId`
  - Check loan eligibility for a specific farmer.

### POST APIs

- `POST /loan/apply`
  - Submit a loan application.
- `POST /loan/document-upload`
  - Upload documents required for a loan application.
- `POST /loan/:loanId/repayment`
  - Record a loan repayment.

### PATCH APIs

- `PATCH /loan/:loanId/status`
  - Update loan application status.

---

## 10. Notifications

### GET APIs

- `GET /notifications`
  - Retrieve notifications for the authenticated user.

### POST APIs

- `POST /notification/send`
  - Send a notification to a user or group.
- `POST /notification/read`
  - Mark a notification as read.

---

## Notes

- `POST /verify-otp` is expected to verify one-time passwords sent via email, typically using NodeMailer or a similar email service.
- All endpoints that require authentication should enforce authorization and return appropriate HTTP status codes.
- Use consistent request/response formats for success and error payloads.
- Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` in `.env` to send OTP emails. Without SMTP config, OTP is returned in the API response for development testing.
