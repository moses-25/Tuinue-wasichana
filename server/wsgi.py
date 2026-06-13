"""
WSGI entry point for Gunicorn - Free Plan Optimized
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

def initialize_database(app):
    """Initialize database tables and create default admin user"""
    with app.app_context():
        try:
            # Create database tables
            db.create_all()
            app.logger.info("Database tables created successfully")
            
            # Create default admin user if it doesn't exist
            admin_email = os.getenv('ADMIN_EMAIL', 'admin@tuinuewasichana.com')
            admin_password = os.getenv('ADMIN_PASSWORD', 'admin123')
            
            admin_user = User.query.filter_by(email=admin_email).first()
            if not admin_user:
                app.logger.info(f"Creating default admin user: {admin_email}")
                admin_user = User(
                    name='System Administrator',
                    email=admin_email,
                    role='admin'
                )
                admin_user.set_password(admin_password)
                db.session.add(admin_user)
                db.session.commit()
                app.logger.info("Default admin user created successfully")
            else:
                app.logger.info("Admin user already exists")
                
        except Exception as e:
            app.logger.error(f"Error during database initialization: {e}")

# Create the Flask application instance for Gunicorn
application = create_app()

# Add root routes after app creation
with application.app_context():
    @application.route('/')
    def root():
        return {
            'message': 'Tuinue Wasichana API is running!',
            'status': 'healthy',
            'endpoints': {
                'health': '/health',
                'api_docs': '/api/v1/',
                'api_health': '/api/v1/health/'
            }
        }, 200
    
    @application.route('/health')
    def health_check():
        return {'status': 'healthy', 'service': 'tuinue-wasichana-api'}, 200

# Initialize database (only in production)
if os.getenv('FLASK_ENV') == 'production':
    initialize_database(application)

# For compatibility, also expose as 'app'
app = application

if __name__ == "__main__":
    # For development server
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    application.run(host='0.0.0.0', port=port, debug=debug)