# Tuinue Wasichana - Backend Task Breakdown

## Milestone 1: Setup & Auth

- [ ] Initialize Flask app with blueprint structure
- [ ] Setup PostgreSQL with SQLAlchemy
- [ ] Implement User model with JWT authentication
- [ ] Register & Login endpoints (Donor/Charity/Admin roles)
- [ ] Environment config and .env loader

## Milestone 2: Charity Application Flow

- [ ] Charity application submission endpoint
- [ ] Admin review and approval endpoints
- [ ] Approved charities can set up profile

## Milestone 3: Donations

- [ ] Charity listing endpoint for donors
- [ ] Donation model and STK Push endpoint (Mpesa)
- [ ] Mpesa callback endpoint for verification
- [ ] Handle one-time & recurring donations
- [ ] Anonymous donor support

## Milestone 4: Charity Dashboard

- [ ] View donation statistics (anonymous vs named)
- [ ] Add stories
- [ ] Manage beneficiaries and inventory

## Milestone 5: Reminders & Scheduler

- [ ] Celery + Redis setup
- [ ] Monthly donation reminder task
- [ ] Email/SMS notification (dummy or real API)

## Milestone 6: Admin Controls

- [ ] List charities (all/pending/approved)
- [ ] Approve/reject/delete charity entries

## Milestone 7: Final Polish

- [ ] API documentation (Swagger or Postman)
- [ ] Dockerfile & docker-compose
- [ ] Testing (Pytest + coverage)
- [ ] CI setup with GitHub Actions
