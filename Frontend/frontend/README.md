# Tuinue Wasichana - Donation Platform

A React-based platform that connects donors with local charities supporting African schoolgirls.

## Features
- Donate one-time or monthly
- Browse verified charities
- Track your donation history
- View real stories and impact

## Getting Started

1. Clone this repo
2. `cd frontend && npm install`
3. `npm start`

## Folder Structure

See `src/` for modular feature folders, component structure, and routing setup.

## License
MIT


tuinue-wasichana-frontend/
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── assets/                        # All static files like images and icons
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/                    # Reusable components
│   │   ├── Button/
│   │   ├── Navbar/
│   │   ├── Footer/
│   │   ├── HeroSection/                            Zaki
│   │   ├── ProgramCard/
│   │   ├── CharityCard/
│   │   ├── StoryCard/
│   │   ├── FAQItem/
│   │   └── Modal/
│   │
│   ├── layouts/                       # Shared layout wrappers
│   │   ├── MainLayout/
│   │   └── AuthLayout/                                    Elvis
│   │
│   ├── pages/                         # Route-based views (user-facing)
│   │   ├── Home/
│   │   │   ├── Home.jsx               # Hero section, intro, CTA
│   │   │   └── Home.css
│   │   ├── About/
│   │   ├── Programs/
│   │   ├── Stories/
│   │   ├── Charities/
│   │   ├── CharityDetails/                                  Moses
│   │   ├── Donate/
│   │   ├── FAQ/
│   │   ├── Contact/
│   │   ├── NotFound/
│   │   └── Dashboard/                # Wrapper if you decide to generalize dashboard
│   │
│   ├── features/                     # Logic per feature (Redux slices, APIs)
│   │   ├── auth/
│   │   │   ├── Login/
│   │   │   ├── Register/                                       
│   │   │   ├── authSlice.js
│   │   │   └── authAPI.js
│   │   │
│   │   ├── charities/
│   │   │   ├── CharityList/
│   │   │   ├── CharityDetails/
│   │   │   ├── CharityApply/
│   │   │   ├── charitiesSlice.js
│   │   │   └── charitiesAPI.js
│   │   ├── donations/
│   │   │   ├── DonationForm/
│   │   │   ├── DonationHistory/                                      Herman
│   │   │   ├── donationsSlice.js
│   │   │   └── donationsAPI.js
│   │   ├── stories/
│   │   │   ├── StoriesList/
│   │   │   ├── StoryDetails/
│   │   │   ├── storiesSlice.js
│   │   │   └── storiesAPI.js
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminDashboard/
│   │   │   ├── CharityApproval/                                      Elvis
│   │   │   ├── adminSlice.js
│   │   │   └── adminAPI.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useFetch.js
│   │   └── usePagination.js
│   │
│   ├── layouts/
│   │   ├── MainLayout/
│   │   │   ├── MainLayout.jsx
│   │   │   └── MainLayout.css
│   │   ├── AuthLayout/
│   │   │   ├── AuthLayout.jsx
│   │   │   └── AuthLayout.css
│   │
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── Home.jsx
│   │   │   └── Home.css
│   │   ├── About/
│   │   │   ├── About.jsx
│   │   │   └── About.css
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Dashboard.css
│   │   ├── NotFound/
│   │   │   ├── NotFound.jsx
│   │   │   └── NotFound.css
│   │
│   ├── services/
│   │   ├── api.js
│   │   └── axiosInstance.js
│   │
│   ├── constants/                    # Static enums, roles, routes, etc.
│   │   ├── routes.js
│   │   └── roles.js                      Moses
│   │
│   ├── app/                          
│   │   ├── routes.jsx                # React Router setup
│   │   └── store.js                  # Redux store
│   │
│   ├── index.jsx                     # React root
│   └── index.css                     # Global reset + variables (if any)
│
├── .env
├── .gitignore
├── package.json
├── README.md
└── ...


backend/
│
├── app/
│   ├── __init__.py                # App factory, initializes Flask app and extensions
│   ├── config.py                  # Configuration settings
│   ├── models/                    # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── charity.py
│   │   ├── donation.py
│   │   ├── beneficiary.py
│   │   ├── story.py
│   │   └── inventory.py
│   │
│   ├── schemas/                   # Marshmallow schemas for serialization/validation
│   │   ├── __init__.py
│   │   ├── user_schema.py
│   │   ├── charity_schema.py
│   │   ├── donation_schema.py
│   │   ├── beneficiary_schema.py
│   │   ├── story_schema.py
│   │   └── inventory_schema.py
│   │
│   ├── api/                       # API routes, organized by domain
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── charity.py
│   │   ├── donation.py
│   │   ├── beneficiary.py
│   │   ├── story.py
│   │   └── admin.py
│   │
│   ├── services/                  # Business logic, service classes/functions
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── charity_service.py
│   │   ├── donation_service.py
│   │   ├── beneficiary_service.py
│   │   ├── story_service.py
│   │   └── admin_service.py
│   │
│   ├── utils/                     # Utility functions/helpers
│   │   ├── __init__.py
│   │   ├── email.py
│   │   ├── pagination.py
│   │   └── validators.py
│   │
│   ├── extensions.py              # Flask extensions (db, migrate, jwt, mail, etc.)
│   └── tasks.py                   # Background tasks (e.g., reminders, Celery)
│
├── migrations/                    # Database migration scripts (Alembic/Flask-Migrate)
│
├── tests/                         # Unit and integration tests
│   ├── __init__.py
│   ├── conftest.py                # pytest fixtures
│   ├── test_auth.py
│   ├── test_charity.py
│   ├── test_donation.py
│   ├── test_beneficiary.py
│   ├── test_story.py
│   └── test_admin.py
│
├── instance/
│   └── config.py                  # Instance-specific settings (e.g., secrets)
│
├── .env                           # Environment variables
├── .flaskenv                      # Flask environment variables
├── .gitignore
├── requirements.txt               # Python dependencies
├── requirements-dev.txt           # Dev/test dependencies
├── manage.py                      # Entry point for app/run scripts
├── README.md
└── wsgi.py                        # WSGI entry point for production