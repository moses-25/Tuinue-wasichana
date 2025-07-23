TUINUE WASICHANA PROJECT
Group 6
frontend/
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   └── logo.png
│   │   └── icons/
│   │       └── search.svg
│   │
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   └── Button.css
│   │   ├── Modal/
│   │   │   ├── Modal.jsx
│   │   │   └── Modal.css
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.jsx
│   │   │   └── Sidebar.css
│   │   └── Loader/
│   │       ├── Loader.jsx
│   │       └── Loader.css
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── Login/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Login.css
│   │   │   ├── Register/
│   │   │   │   ├── Register.jsx
│   │   │   │   └── Register.css
│   │   │   ├── authSlice.js
│   │   │   └── authAPI.js
│   │   │
│   │   ├── charities/
│   │   │   ├── CharityList/
│   │   │   │   ├── CharityList.jsx
│   │   │   │   └── CharityList.css
│   │   │   ├── CharityDetails/
│   │   │   │   ├── CharityDetails.jsx
│   │   │   │   └── CharityDetails.css
│   │   │   ├── CharityApply/
│   │   │   │   ├── CharityApply.jsx
│   │   │   │   └── CharityApply.css
│   │   │   ├── charitiesSlice.js
│   │   │   └── charitiesAPI.js
│   │   │
│   │   ├── donations/
│   │   │   ├── DonationForm/
│   │   │   │   ├── DonationForm.jsx
│   │   │   │   └── DonationForm.css
│   │   │   ├── DonationHistory/
│   │   │   │   ├── DonationHistory.jsx
│   │   │   │   └── DonationHistory.css
│   │   │   ├── donationsSlice.js
│   │   │   └── donationsAPI.js
│   │   │
│   │   ├── stories/
│   │   │   ├── StoriesList/
│   │   │   │   ├── StoriesList.jsx
│   │   │   │   └── StoriesList.css
│   │   │   ├── StoryDetails/
│   │   │   │   ├── StoryDetails.jsx
│   │   │   │   └── StoryDetails.css
│   │   │   ├── storiesSlice.js
│   │   │   └── storiesAPI.js
│   │   │
│   │   ├── admin/
│   │   │   ├── CharityApproval/
│   │   │   │   ├── CharityApproval.jsx
│   │   │   │   └── CharityApproval.css
│   │   │   ├── AdminDashboard/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   └── AdminDashboard.css
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
│   ├── utils/
│   │   ├── helpers.js
│   │   └── validators.js
│   │
│   ├── constants/
│   │   ├── routes.js
│   │   └── roles.js
│   │
│   ├── app/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── store.js
│   │   ├── routes.jsx
│   │   └── index.js
│   │
│   ├── index.js
│   └── index.css
│
├── tests/
│   ├── components/
│   ├── features/
│   └── pages/
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