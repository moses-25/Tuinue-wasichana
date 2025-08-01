# Backend Project Overview

This backend is built using **Flask** (a Python web framework) and follows a modular structure for scalability and maintainability. It uses **SQLAlchemy** for database management and supports background tasks with Celery.

## Project Structure (Detailed)

- **app.py**: Main entry point for the Flask application. Initializes the app, sets up routes, and starts the server.
- **app/**: Core application code, organized into several submodules:
  - **controllers/**: Contains the logic for handling incoming requests, processing data, and returning responses. Controllers act as the bridge between routes and business logic.
  - **models/**: Defines the database schema using SQLAlchemy ORM. Each file represents a table/entity (e.g., User, Charity, Donation, Payment, Story, Beneficiary, Inventory, Reminder) and their relationships.
  - **routes/**: Houses the API endpoint definitions. Each route maps HTTP requests to controller functions, organizing endpoints by resource or feature.
  - **services/**: Implements reusable business logic and utility functions, such as database operations, email sending, or integrations with external services.
  - **middlewares/**: Custom middleware functions that process requests and responses globally (e.g., authentication, logging, error handling).
- **config/**: Contains configuration files and settings for different environments (development, production, etc.), such as database URIs, secret keys, and environment variables.
- **celery_app.py**: Sets up and configures Celery for running background tasks (e.g., sending emails, scheduled jobs) asynchronously alongside the Flask app.
- **requirements.txt**: Lists all Python dependencies required to run the backend, ensuring consistent environments across development and production.
- **migrations/**: Stores database migration scripts managed by tools like Flask-Migrate/Alembic, allowing for version-controlled schema changes.

## Key Features

- RESTful API endpoints for managing users, charities, donations, payments, stories, beneficiaries, inventory, and reminders.
- Modular codebase for easy maintenance and extension.
- Health check endpoint at `/health` for monitoring service status.
- Environment-based configuration (development, production, etc.).
- Background task support with Celery.
