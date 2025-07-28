"""
WSGI entry point for Gunicorn
This file creates the Flask application instance that Gunicorn can import
"""
import os
from app import create_app
from app.services.database import db

# Import all models to ensure they're registered with SQLAlchemy
from app.models.user import User
from app.models.charity import Charity
from app.models.charity_application import CharityApplication
from app.models.donation import Donation
from app.models.payment import Payment
from app.models.story import Story
from app.models.beneficiary import Beneficiary
from app.models.inventory import Inventory
from app.models.reminder import Reminder

# Create the Flask application instance for Gunicorn
application = create_app()

# Initialize database tables (only in production)
if os.getenv('FLASK_ENV') == 'production':
    with application.app_context():
        try:
            db.create_all()
            application.logger.info("Database tables created successfully")
        except Exception as e:
            application.logger.error(f"Error creating tables: {e}")

# For compatibility, also expose as 'app'
app = application

if __name__ == "__main__":
    # For development server
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    application.run(host='0.0.0.0', port=port, debug=debug)