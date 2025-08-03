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

# Create the Flask application instance
app = create_app()

# Initialize database tables with better error handling
def init_database():
    """Initialize database with retry logic"""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            with app.app_context():
                db.create_all()
                app.logger.info("Database tables created successfully")
                return True
        except Exception as e:
            app.logger.warning(f"Database init attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                import time
                time.sleep(5)  # Wait 5 seconds before retry
            else:
                app.logger.error(f"Failed to initialize database after {max_retries} attempts")
                return False
    return False

# Only initialize database in production or if explicitly requested
if os.getenv('FLASK_ENV') == 'production' or os.getenv('INIT_DB') == 'true':
    init_database()

# Health check route (already defined in app/__init__.py, but adding here for redundancy)
@app.route('/health')
def health_check():
    """Health check endpoint for monitoring"""
    return {'status': 'healthy', 'service': 'tuinue-wasichana-api'}, 200

# For development server
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)