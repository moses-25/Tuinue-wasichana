# Backend Integration Requirements for Tuinue Frontend

This document lists all requirements and expectations for the backend to work seamlessly with the frontend deployed on Render.

---

## 1. API Endpoints

### Authentication
- `POST /api/auth/login` — User login
  - Request: `{ email, password }`
  - Response: `{ success, token, user: { id, email, role, ... }, message }`
- `POST /api/auth/register` — User registration (donor or charity)
  - Donor: `{ firstName, lastName, email, password }`
  - Charity: `{ charityName, email, password }`
  - Response: `{ success, user: { id, email, role, ... }, message }`
- `GET /api/auth/profile` — Get current user profile (JWT required)
  - Response: `{ success, user: { id, email, role, ... } }`

### Charities
- `GET /api/charities` — List all charities (with optional filters: search, category, location)
  - Query: `?search=...&category=...&location=...`
  - Response: `{ success, charities: [ { id, name, description, location, category, raised, donors, goal, status, ... } ] }`
- `GET /api/charities/:id` — Get details for a single charity
  - Response: `{ success, charity: { ... } }`
- `POST /api/charities` — Apply as a new charity (protected, charity role)
  - Request: `{ name, category, goalAmount, location, description }`
  - Response: `{ success, charity, message }`
- `PUT /api/charities/:id` — Edit charity (protected, charity/admin)
- `DELETE /api/charities/:id` — Delete charity (protected, charity/admin)
- `POST /api/charities/:id/approve` — Approve charity (admin only)
- `POST /api/charities/:id/reject` — Reject charity (admin only)

### Donations
- `GET /api/donations` — List all donations (admin/charity/donor views)
- `GET /api/donations/history` — Get donation history for current user (JWT required)
- `POST /api/donations` — Make a donation (supports M-Pesa)
  - Request: `{ charityId, amount, paymentMethod: 'mpesa' | 'paypal' | 'card', phoneNumber, ... }`
  - Response: `{ success, donation, message }`
- `POST /api/donations/mpesa/initiate` — Initiate M-Pesa STK Push
  - Request: `{ phoneNumber, amount, charityId }`
  - Response: `{ success, transactionId, message }`
- `POST /api/donations/mpesa/callback` — M-Pesa callback endpoint (for Daraja API to confirm payment)
  - Request: (from M-Pesa API)
  - Response: `{ success, message }`
- `GET /api/donations/mpesa/status/:transactionId` — Check M-Pesa payment status
  - Response: `{ success, status: 'pending' | 'success' | 'failed', donation, message }`

### Stories
- `GET /api/stories` — List all stories
- `GET /api/stories/:id` — Get story details
- `POST /api/stories` — Create a new story (protected, charity/admin)
- `PUT /api/stories/:id` — Edit story (protected, charity/admin)
- `DELETE /api/stories/:id` — Delete story (protected, charity/admin)

### Users/Admin
- `GET /api/users` — List all users (admin only)
- `GET /api/users/:id` — Get user details (admin/self)
- `PUT /api/users/:id` — Edit user (admin/self)
- `DELETE /api/users/:id` — Delete user (admin only)
- `GET /api/analytics` — Get analytics data (admin/charity dashboard)

### Admin-Specific & Dashboard Routes
- `GET /api/admin/charity-approvals` — List all pending charity applications
- `POST /api/admin/charities/:id/approve` — Approve a charity application
- `POST /api/admin/charities/:id/reject` — Reject a charity application
- `GET /api/admin/permission-requests` — List all permission requests (if applicable)
- `POST /api/admin/permission-requests/:id/approve` — Approve a permission request
- `POST /api/admin/permission-requests/:id/reject` — Reject a permission request
- `GET /api/admin/settings` — Get system/admin settings
- `PUT /api/admin/settings` — Update system/admin settings
- `GET /api/admin/activities` — Get recent admin/system activities
- `GET /api/admin/dashboard` — Get admin dashboard summary (users, charities, donations, recent activities, analytics)

#### Dashboard Data Endpoints (by user type)
- `GET /api/dashboard/admin` — Admin dashboard: total users, total charities, total donations, recent activities, analytics panels, approval stats
- `GET /api/dashboard/donor` — Donor dashboard: donation history, top charities, impact stats, recent donations
- `GET /api/dashboard/charity` — Charity dashboard: campaign progress, donations received, approval status, analytics, recent activities
- `GET /api/dashboard/analytics` — General analytics for charts/graphs (optionally filtered by user type, date range, etc.)

---

## 2. Request/Response Format
- All requests and responses must use JSON.
- Standard response structure:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "..."
  }
  ```
- On error:
  ```json
  {
    "success": false,
    "error": "Error message"
  }
  ```

## 3. Authentication
- Use JWT (JSON Web Tokens) for authentication.
- On login/register, return a JWT token in the response.
- All protected endpoints must require the `Authorization: Bearer <token>` header.
- Store user role in the JWT payload for role-based access.

## 4. CORS
- Allow CORS requests from the frontend domain (e.g., `https://<your-frontend>.vercel.app` or local dev `http://localhost:5173`).
- Allow credentials if needed.

## 5. Environment Variables (Backend)
- `JWT_SECRET` — Secret for signing JWT tokens
- `ALLOWED_ORIGINS` — Comma-separated list of allowed frontend origins
- Any other secrets required for third-party integrations (e.g., payment gateways)

## 6. Other Integration Notes
- If file uploads are needed, support multipart/form-data.
- If using websockets, document the endpoint and protocol.
- Provide clear error messages for all failed requests.
- All endpoints should validate input and return appropriate error messages.
- Admin endpoints should be protected and only accessible by users with the admin role.
- Charity approval/rejection should trigger notifications if needed.

---

Update this file as your API evolves. Share it with both frontend and backend teams to ensure smooth integration.
