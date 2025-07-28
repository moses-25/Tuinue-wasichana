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

app = create_app()

@app.before_first_request
def create_tables():
    """Create database tables on first request"""
    try:
        db.create_all()
    except Exception as e:
        app.logger.error(f"Error creating tables: {e}")

@app.route('/health')
def health_check():
    """Health check endpoint for monitoring"""
    return {'status': 'healthy', 'service': 'tuinue-wasichana-api'}, 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)