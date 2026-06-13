import pytest
from app import create_app
from app.services.database import db
from app.models.user import User
from app.models.charity import Charity
from app.models.charity_application import CharityApplication
from app.models.donation import Donation
from app.models.payment import Payment
from app.models.story import Story
from app.models.beneficiary import Beneficiary
from app.models.inventory import Inventory
from app.models.reminder import Reminder
from flask_jwt_extended import create_access_token

@pytest.fixture(scope='function')
def app():
    """Create application for testing"""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['JWT_SECRET_KEY'] = 'test-secret-key'
    app.config['WTF_CSRF_ENABLED'] = False
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture(scope='function')
def client(app):
    """Create test client"""
    return app.test_client()

@pytest.fixture(scope='function')
def runner(app):
    """Create test runner"""
    return app.test_cli_runner()

@pytest.fixture
def donor_user(app):
    """Create a donor user for testing"""
    with app.app_context():
        user = User(name='Test Donor', email='donor@test.com', role='donor')
        user.set_password('password123')
        db.session.add(user)
        db.session.commit()
        user_id = user.id
        return user_id

@pytest.fixture
def charity_user(app):
    """Create a charity user for testing"""
    with app.app_context():
        user = User(name='Test Charity', email='charity@test.com', role='charity')
        user.set_password('password123')
        db.session.add(user)
        db.session.commit()
        user_id = user.id
        return user_id

@pytest.fixture
def admin_user(app):
    """Create an admin user for testing"""
    with app.app_context():
        user = User(name='Test Admin', email='admin@test.com', role='admin')
        user.set_password('password123')
        db.session.add(user)
        db.session.commit()
        user_id = user.id
        return user_id

@pytest.fixture
def approved_charity(app, charity_user):
    """Create an approved charity for testing"""
    with app.app_context():
        charity = Charity(
            owner_id=charity_user,  # charity_user is now just the ID
            name='Test Charity Organization',
            description='A test charity for helping people',
            status='approved'
        )
        db.session.add(charity)
        db.session.commit()
        charity_id = charity.id
        return charity_id

@pytest.fixture
def donor_token(app, donor_user):
    """Create JWT token for donor user"""
    with app.app_context():
        return create_access_token(identity=donor_user)

@pytest.fixture
def charity_token(app, charity_user):
    """Create JWT token for charity user"""
    with app.app_context():
        return create_access_token(identity=charity_user)

@pytest.fixture
def admin_token(app, admin_user):
    """Create JWT token for admin user"""
    with app.app_context():
        return create_access_token(identity=admin_user)

@pytest.fixture
def auth_headers_donor(donor_token):
    """Create authorization headers for donor"""
    return {'Authorization': f'Bearer {donor_token}'}

@pytest.fixture
def auth_headers_charity(charity_token):
    """Create authorization headers for charity"""
    return {'Authorization': f'Bearer {charity_token}'}

@pytest.fixture
def auth_headers_admin(admin_token):
    """Create authorization headers for admin"""
    return {'Authorization': f'Bearer {admin_token}'}