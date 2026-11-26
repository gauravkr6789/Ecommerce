# MERN E-Commerce Platform

A full-stack e-commerce application built with **React 19 + Vite** on the frontend and **Node.js + Express 5 + MongoDB/Mongoose** on the backend. The project includes customer shopping flows, an admin dashboard, Razorpay payment integration, refund-request management, delivery-partner APIs, real-time Socket.IO notifications, Google OAuth, email/OTP utilities, product image upload support, and invoice generation.

> **Project status / scope:** This README describes the code present in the shared repository snapshot. Some integrations require credentials and external dashboard configuration. The repository does not include a formal automated test suite. Delivery-partner backend routes are present; a dedicated delivery-partner frontend page set was not found in the current frontend source tree.

---

## Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Application Architecture](#application-architecture)
- [Main User Flows](#main-user-flows)
- [Backend API Overview](#backend-api-overview)
- [Authentication and Authorization](#authentication-and-authorization)
- [Real-Time Communication](#real-time-communication)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Payment and Webhook Setup](#payment-and-webhook-setup)
- [Image Uploads and Static Files](#image-uploads-and-static-files)
- [Important Implementation Notes](#important-implementation-notes)
- [Testing](#testing)
- [Future Improvements](#future-improvements)

---

## Features

### Customer-facing frontend

- User registration, login and logout
- Google OAuth login flow
- Forgot-password and reset-password screens
- OTP-related backend endpoints
- Product listing and product detail pages
- Product search, category filtering, sorting and pagination components
- Product reviews
- Shopping cart: add, update, remove and clear items
- Wishlist management
- Address management
- Coupon code flow
- Checkout and order creation
- Razorpay checkout integration and payment result pages
- Order listing, order details and order timeline UI
- User profile page
- Invoice download service integration
- Responsive shared layout, navigation and footer
- Theme context and reusable UI components

### Admin functionality

- Admin dashboard with statistics and chart components
- User listing and role management
- Product management: create, edit, list and delete
- Category management
- Order listing and order-status management
- Coupon management
- Review management
- Monthly sales and top-product dashboard data endpoints
- Delivery partner assignment endpoint
- Refund request review: list, approve and reject

### Backend capabilities

- REST API built with Express
- MongoDB data persistence through Mongoose
- JWT-based authentication middleware
- Role-based authorization for admin and delivery users
- Google OAuth using Passport
- Password hashing utilities
- Email and OTP-related utilities
- Razorpay order creation and payment-signature verification
- Razorpay webhook endpoint and event handlers
- Refund request, approval and rejection flow
- Product/category/cart/order/address/review/wishlist/coupon modules
- Delivery assignment and delivery status workflow
- Socket.IO server with authenticated connections and role-specific rooms
- Product image upload middleware and `/uploads` static file serving
- PDF invoice generation utility

---

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React 19, Vite 8, React Router 7 |
| Styling | Tailwind CSS 4, CSS |
| Data fetching/state | Axios, TanStack React Query |
| UI and charts | Lucide React, React Icons, React Toastify, Recharts |
| Real-time client | Socket.IO Client 4 |
| Backend runtime | Node.js (package engine specifies Node 20.x) |
| Backend framework | Express 5 |
| Database | MongoDB, Mongoose 9 |
| Authentication | JSON Web Token, Passport, Google OAuth 2.0 |
| Password/security utilities | bcrypt dependency, OTP utilities |
| Payments | Razorpay Node SDK |
| Media | Multer, Cloudinary SDK; local `/uploads` static serving is also configured |
| Email | Nodemailer, Brevo SDK |
| PDF | PDFKit |

---

## Project Structure

The repository currently uses the folder name `fronted` (not `frontend`).

```text
Ecommerce-main/
├── backend/
│   ├── Database/             # MongoDB connection
│   ├── controller/           # Request handlers / business logic
│   ├── middleware/           # JWT, admin, delivery and socket auth
│   ├── model/                # Mongoose schemas
│   ├── router/               # Express route definitions
│   ├── services/             # Passport, email, upload services
│   ├── socket/               # Socket.IO server setup
│   ├── utils/                 # Token, OTP, invoice and helper utilities
│   ├── rozerpay/              # Razorpay client configuration
│   ├── public/uploads/        # Locally served uploaded files
│   ├── index.js               # Express + HTTP + Socket.IO entry point
│   └── package.json
│
└── fronted/
    ├── src/
    │   ├── assets/
    │   ├── components/        # Reusable customer/admin UI components
    │   ├── context/           # Auth and theme contexts
    │   ├── hooks/             # Auth, product, cart, category and admin hooks
    │   ├── layouts/           # Main and admin layouts
    │   ├── pages/             # Customer, auth and admin pages
    │   ├── routes/            # Application and protected routes
    │   ├── services/          # Axios instance and API service modules
    │   ├── socket/             # Socket.IO client connection
    │   ├── utils/              # Formatting, validation and helper functions
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## Application Architecture

```text
React Frontend (Vite :5173)
        |
        | HTTP requests (Axios, Bearer token)
        v
Express API (default :3500) -------- MongoDB
        |
        | HTTP server
        +---------------------------- Socket.IO
        |
        +---- Razorpay API
        |
        +---- Email / OTP providers
        |
        +---- Cloudinary / local uploads
        |
        +---- PDF invoice stream
```

- The frontend uses a shared Axios instance from `fronted/src/services/Axios.js`.
- The Axios request interceptor reads `token` from `localStorage` and sends it as `Authorization: Bearer <token>` when present.
- The backend connects to MongoDB before starting the HTTP server.
- Express and Socket.IO share the same HTTP server.
- Socket.IO is initialized in `backend/socket/socket.js`; authenticated socket users are placed in role-specific rooms.

---

## Main User Flows

### 1. Authentication

1. A customer registers or logs in using the authentication screens.
2. The backend validates the request and issues a JWT for authenticated sessions.
3. The frontend stores the token in browser local storage and the Axios interceptor attaches it to protected API requests.
4. Google OAuth starts at the backend `/api/auth/google` endpoint and returns through the configured callback URL.
5. Forgot-password, reset-password and OTP endpoints support account recovery/verification flows.

### 2. Shopping and checkout

1. Customer browses products and product details.
2. Customer adds products to cart or wishlist.
3. Customer manages a shipping address and applies a coupon where eligible.
4. Frontend submits an order request to the backend.
5. Backend creates an order record and returns the order information.
6. Frontend requests a Razorpay payment order for that application order.
7. Razorpay checkout returns payment identifiers and signature to the frontend.
8. Frontend sends the payment details to the backend verification endpoint.
9. Backend verifies the HMAC signature and updates the payment/order records.

### 3. Refund flow

1. A customer submits a refund request for an eligible paid order.
2. The backend creates a refund request record.
3. Admin can view refund requests and approve or reject them.
4. The approval handler uses the Razorpay integration to initiate the provider-side refund; final provider confirmation depends on the Razorpay response/webhook flow configured in the backend.

### 4. Delivery flow

1. Admin assigns a paid order to a delivery partner.
2. The assigned delivery partner can fetch assigned orders.
3. Partner can accept or reject an assignment.
4. Partner can update pickup and out-for-delivery states.
5. OTP can be sent and verified as part of delivery completion.
6. Delivery history endpoint is available to the delivery role.
7. Assignment notifications are emitted through Socket.IO to the delivery partner room.

---

## Backend API Overview

Base URL for local development: `http://localhost:3500`

All routes below are mounted by `backend/index.js`. Unless otherwise stated, request/response details should be confirmed from the corresponding controller before integrating a new client.

| Module | Base path | Available operations |
|---|---|---|
| Authentication | `/api/auth` | Register, login, logout, send OTP, verify OTP, forgot password, reset password, get users (admin), current user, Google OAuth start/callback |
| Categories | `/api/categories` | Create, list all, get one, update, delete |
| Products | `/api/products` | Add product, list products, get product by ID, update, delete |
| Cart | `/api/carts` | Add item, get user cart, update item, remove item, clear cart |
| Orders | `/api/orders` | Create order, get current user's orders, get order by ID |
| Payments | `/api/payment` | Create Razorpay order, verify payment |
| Coupons | `/api/coupon` | Create, list/get, get by ID/code, apply, update, delete |
| Admin | `/api/admin` | Dashboard stats, users, role update, orders, order status update, products, monthly sales, top products |
| Reviews | `/api/review` | Create review, get product reviews, delete review |
| Wishlist | `/api/wishlist` | Add, get, remove, clear |
| Addresses | `/api/address` | Create, list, get by ID, update, delete |
| Invoice | `/api/invoice` | Download invoice by ID |
| Delivery | `/api/delivery` | Assign partner, assigned orders, accept/reject, pickup, out-for-delivery, send/verify OTP, history |
| Refunds | `/api/refund` | Request refund, get own refunds, admin list, approve, reject |
| Razorpay webhook | `/api/webhook` | Receive Razorpay webhook events |

### Notable route paths

**Authentication**

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`
- `GET /api/auth/me` (authenticated)
- `GET /api/auth/google` and `GET /api/auth/google/callback`

**Products and categories**

- `GET /api/products/get-all-Product`
- `GET /api/products/get-ProductById/:id`
- `POST /api/products/add-product` (admin; multipart upload field: `images`, up to 2 files)
- `PUT /api/products/update-product/:id` (admin; multipart upload field: `images`, up to 2 files)
- `DELETE /api/products/delete-product/:id` (admin)
- Category CRUD routes are under `/api/categories` (`/create`, `/get-all`, `/get-single/:id`, `/update/:id`, `/delete/:id`).

**Cart, wishlist, address and orders**

- Cart routes are under `/api/carts`.
- Wishlist routes are under `/api/wishlist`.
- Address routes are under `/api/address` and require authentication.
- Order routes are under `/api/orders` and require authentication.

**Payment and refunds**

- `POST /api/payment/create-order`
- `POST /api/payment/verify-payment`
- `POST /api/refund/request/:orderId`
- `GET /api/refund/my-refunds`
- `GET /api/refund/all-refunds` (admin)
- `PATCH /api/refund/approve/:refundId` (admin)
- `PATCH /api/refund/reject/:refundId` (admin)

**Delivery**

- `POST /api/delivery/assign` (admin)
- `GET /api/delivery/assigned-orders` (delivery role)
- `PATCH /api/delivery/accept/:orderId` (delivery role)
- `PATCH /api/delivery/reject/:orderId` (delivery role)
- `PATCH /api/delivery/picked-up/:orderId` (delivery role)
- `PATCH /api/delivery/out-for-delivery/:orderId` (delivery role)
- `POST /api/delivery/send-otp/:id` (delivery role)
- `POST /api/delivery/verify-otp/:id` (delivery role)
- `GET /api/delivery/history` (delivery role)

---

## Authentication and Authorization

- Protected REST endpoints use JWT authentication middleware.
- Admin routes use authentication plus admin-role middleware.
- Delivery operations use authentication plus delivery-role middleware.
- The Socket.IO server uses a socket authentication middleware and places connected users in rooms based on role:
  - Admin: `admin`
  - Customer: `user_<userId>`
  - Delivery partner: `delivery_<userId>`
- For API testing, send the token as a Bearer token in the `Authorization` header.

---

## Real-Time Communication

Socket.IO is initialized on the backend HTTP server. The frontend socket helper currently connects to `http://localhost:3500` and sends the JWT in the Socket.IO `auth` payload.

The backend currently creates role-specific rooms and the delivery assignment controller emits the `new-delivery-assigned` event to the assigned delivery partner room.

For deployment, update the frontend socket URL to the deployed backend origin and configure matching CORS origins on the backend.

---

## Getting Started

### Prerequisites

- Node.js 20.x (backend `package.json` specifies `20.x`; use a compatible Node version for the Vite toolchain as well)
- npm
- MongoDB database (local MongoDB or MongoDB Atlas)
- Razorpay test credentials for payment testing
- Google OAuth credentials if Google login is to be tested
- Email provider credentials if email/OTP/password-reset email functionality is to be tested
- Cloudinary credentials if Cloudinary upload functionality is used

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd Ecommerce-main
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

Create `backend/.env` using the [Environment Variables](#environment-variables) section.

Start the backend:

```bash
npm run dev
```

The backend defaults to port `3500` when `PORT` is not set. It connects to MongoDB before listening.

### 3. Install frontend dependencies

Open a second terminal:

```bash
cd Ecommerce-main/fronted
npm install
```

Create `fronted/.env` and set the frontend variables described below.

Start Vite:

```bash
npm run dev
```

Vite normally serves the frontend at `http://localhost:5173`.

### 4. Production build

From the frontend folder:

```bash
npm run build
npm run preview
```

Backend start command:

```bash
cd backend
npm start
```

---

## Environment Variables

Never commit real `.env` files, API keys, OAuth secrets, database credentials or JWT secrets. Use placeholders in documentation and keep actual values in local environment configuration or deployment secrets.

### Backend: `backend/.env`

```env
PORT=3500
NODE_ENV=development

# MongoDB
MONGO_URL=mongodb://127.0.0.1:27017/ecommerce

# Frontend/backend URLs
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:3500

# Authentication and sessions
JWT_SECRET_KEY=replace_with_a_long_random_secret
SESSION_SECRET=replace_with_a_long_random_session_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (used by the configured email service)
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
EMAIL_FROM=your_from_email
EMAIL_FROM_NAME=Your_App_Name
BREVO_API_KEY=your_brevo_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Only configure the credentials for integrations you intend to run. Exact provider settings (SMTP host/port, OAuth callback allowlist, webhook URL) must match the provider dashboard.

### Frontend: `fronted/.env`

```env
VITE_API_URL=http://localhost:3500/api
VITE_API_URLL=http://localhost:3500
```

`VITE_API_URL` is used by the shared Axios instance and Google login URL construction. `VITE_API_URLL` is used in several components to construct uploaded-image URLs. The source also contains a commented/legacy `VITE_URL` reference. Keep the current variables consistent with the code, or standardize them before deployment.

> Vite exposes variables prefixed with `VITE_` to browser code. Do not put private secrets in frontend environment variables.

---

## Payment and Webhook Setup

### Razorpay checkout

1. Create a Razorpay account and use test mode while developing.
2. Add the test Key ID and Key Secret to backend environment variables.
3. Ensure the frontend uses the matching backend API URL.
4. Test the order-creation and payment-verification endpoints using the frontend or Postman.
5. Verify that the backend signature verification uses the Razorpay Key Secret.

### Razorpay webhook

- The webhook route is mounted at `POST /api/webhook/`.
- The router uses `express.raw({ type: "application/json" })` because signature validation is performed against the raw request body.
- Configure the webhook URL in the Razorpay dashboard, for example `https://<your-backend-domain>/api/webhook/`.
- Configure the webhook secret in `RAZORPAY_WEBHOOK_SECRET`.
- The current webhook controller contains handlers for `payment.captured`, `payment.failed` and `refund.processed` events.

Webhook delivery requires a publicly reachable backend URL (or a secure tunnelling tool during local development). The webhook is separate from the browser's payment-verification API call.

---

## Image Uploads and Static Files

The backend serves the local uploads directory at:

```text
GET /uploads/<uploaded-file-name>
```

The Express static mapping points to `backend/public/uploads`. Product create/update routes accept multipart form data with the file field named `images` and a maximum of two files per request.

The project also includes a Cloudinary service/configuration dependency. Confirm which upload path is active in the relevant service/controller before assuming all uploaded media is stored remotely.

---

## Important Implementation Notes

These are practical notes based on the current source snapshot:

1. **Frontend folder naming:** the folder is named `fronted`; use that exact path in commands unless you rename it.
2. **Frontend API origins:** the shared Axios base URL uses `VITE_API_URL`, while image URL construction uses `VITE_API_URLL`. The socket client currently has a hard-coded local backend URL. Update these for staging/production.
3. **CORS:** backend CORS currently allows `http://localhost:5173` and the value of `FRONTEND_URL`, with credentials enabled. Add the actual deployed frontend origin when deploying.
4. **Google OAuth:** configure the Google OAuth callback URL to match `${BASE_URL}/api/auth/google/callback` and set the correct frontend redirect URL.
5. **Webhook configuration:** webhook signature validation requires a separately configured webhook secret. Keep it different from the Razorpay API Key Secret.
6. **Test script:** the backend `npm test` script is currently a placeholder that exits with an error; no automated backend test suite is configured in this snapshot.
7. **Delivery UI:** delivery partner APIs and socket room handling are present in the backend. The current frontend page tree does not show a dedicated delivery-partner dashboard, so the delivery workflow may require a separate frontend implementation or a different branch/version.
8. **Credentials:** do not share real secrets in GitHub, screenshots, Postman exports or README files.

---

## Testing

### Manual API testing with Postman

- Set `baseUrl` to `http://localhost:3500`.
- Register/login and copy the returned JWT.
- Set the token as a Bearer token for protected endpoints.
- Test endpoints module-by-module: auth, categories/products, cart/wishlist, address/coupon, orders, payment, admin, refund and delivery.
- Use valid MongoDB document IDs and seed data where required.
- For product uploads, use `multipart/form-data` with the `images` field.
- Test Razorpay flows in test mode; test webhook events separately using the configured webhook URL.

### Frontend checks

```bash
cd fronted
npm run lint
npm run build
```

The frontend package defines `dev`, `build`, `lint` and `preview` scripts. Resolve build/lint issues before deployment.

---

## Future Improvements

Potential next steps for the project (not claims about already completed functionality):

- Add automated API tests and integration tests for all modules.
- Add request validation schemas and consistent centralized error handling.
- Add pagination/filter validation and rate limiting where appropriate.
- Add idempotency and robust retry handling for payment/refund/webhook operations.
- Persist webhook event IDs and reject duplicate event processing.
- Add a dedicated delivery-partner frontend dashboard.
- Move socket URL and all API/image origins into a single deployment configuration.
- Add structured logging and remove sensitive data from logs.
- Add CI workflow for lint, build and tests.
- Add deployment instructions for frontend, backend, MongoDB and webhook configuration.

---

## Maintainer / Contact

For project walkthrough, setup help, bug reports or collaboration, contact the repository owner through the GitHub repository profile.
