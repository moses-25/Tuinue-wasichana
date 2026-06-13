# Tuinue Wasichana - System Design

## Architecture

- **Backend**: Flask (modular blueprint structure)
- **Database**: PostgreSQL
- **Asynchronous Tasks**: Celery + Redis (e.g. for monthly reminders)
- **Payment Gateway**: Mpesa Daraja API (STK Push)
- **Authentication**: JWT-based for users

---

## High-Level Flow

### Donor Donation Flow

1. Donor selects charity.
2. Chooses one-time or recurring option.
3. Confirms details.
4. Initiates Mpesa STK Push or card payment.
5. Server verifies payment via callback.
6. Donation saved to database.
7. Reminder scheduled if recurring.

---

## Models Overview

### User

- `id`, `name`, `email`, `password_hash`, `role` (`donor`, `charity`, `admin`), `is_anonymous`, `created_at`

### Charity

- `id`, `name`, `description`, `status` (`pending`, `approved`, `rejected`), `created_at`, `owner_id` (User FK)

### Donation

- `id`, `user_id`, `charity_id`, `amount`, `recurring` (bool), `status` (`pending`, `complete`, `failed`), `timestamp`

### Beneficiary

- `id`, `charity_id`, `name`, `description`, `inventory_given`

### Story

- `id`, `charity_id`, `title`, `content`, `created_at`

### Reminder (Scheduled Task)

- `id`, `user_id`, `charity_id`, `amount`, `scheduled_time`, `status`

---

## API Endpoints (v1)

### Auth

- `POST /api/v1/register`
- `POST /api/v1/login`

### Donor

- `GET /api/v1/charities`
- `POST /api/v1/donate`
- `POST /api/v1/donate/recurring`
- `GET /api/v1/stories`
- `GET /api/v1/my-donations`

### Charity

- `POST /api/v1/apply`
- `GET /api/v1/donors`
- `GET /api/v1/donations`
- `POST /api/v1/story`
- `POST /api/v1/beneficiary`

### Admin

- `GET /api/v1/admin/charities`
- `POST /api/v1/admin/charities/<id>/approve`
- `DELETE /api/v1/admin/charities/<id>`

### Payments

- `POST /api/v1/pay/mpesa`
- `POST /api/v1/pay/verify` (callback)

---

## Mpesa Flow

1. Donor enters phone number + amount.
2. Server sends STK Push via Daraja API.
3. Mpesa sends callback with transaction status.
4. System verifies and records donation.
