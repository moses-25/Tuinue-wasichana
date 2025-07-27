# Tuinue Wasichana - Backend Requirements

## Overview

This document outlines the functional and non-functional requirements for the backend of the Tuinue Wasichana donation platform. The backend will be built using **Flask**, and integrated with **Mpesa API**, Stripe/PayPal (optional), and a PostgreSQL database.

---

## Functional Requirements

### Donor

- Register/Login
- View list of charities
- Donate to a charity (one-time or recurring)
- Set up monthly recurring donations
- Donate anonymously or with name
- Receive monthly donation reminders (email/SMS)
- View stories from charities

### Charity

- Apply to register on platform
- Post-approval, update charity profile
- Post beneficiary stories
- Manage list of beneficiaries
- Track donations (total, anonymous, named)
- Manage inventory sent to beneficiaries

### Administrator

- View and manage charity applications
- Approve/Reject/Delete charities
- Monitor platform activity

---

## Non-Functional Requirements

- Secure authentication (JWT tokens)
- RESTful API with versioning (`/api/v1`)
- Data validation and sanitization
- Mpesa integration for donation processing
- Modular Flask app structure
- Environment-based config management (.env)
- Docker-compatible setup
- Unit and integration tests
- Deployment-ready (Render, AWS, or Heroku)

---

## 3rd Party Services

- Mpesa Daraja API (Primary)
- Optional: PayPal/Stripe
- Email service (e.g. SendGrid) or SMS for reminders

---

## Tools & Stack

- Python 3.x
- Flask
- Flask-RESTful / Flask-Restx
- Flask-JWT-Extended
- PostgreSQL
- SQLAlchemy
- Celery + Redis (for reminders)
- Docker
- GitHub Actions (CI)
