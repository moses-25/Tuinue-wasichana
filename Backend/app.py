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

# Initialize database tables (only in production)
if os.getenv('FLASK_ENV') == 'production':
    with app.app_context():
        try:
            db.create_all()
            app.logger.info("Database tables created successfully")
        except Exception as e:
            app.logger.error(f"Error creating tables: {e}")

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