#!/usr/bin/env python3
"""
Simple test to verify basic API functionality
"""
import pytest
from app import create_app
from app.services.database import db
from app.models.user import User

@pytest.fixture
def app():
    """Create application for testing"""
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['JWT_SECRET_KEY'] = 'test-secret-key'
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()

def test_user_registration_simple(client):
    """Test simple user registration"""
    response = client.post('/api/v1/users/register', 
        json={
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'password123',
            'role': 'donor'
        }
    )
    
    assert response.status_code == 201
    data = response.get_json()
    assert data['name'] == 'John Doe'
    assert data['email'] == 'john@example.com'
    assert data['role'] == 'donor'

def test_user_login_simple(client):
    """Test simple user login"""
    # First register a user
    client.post('/api/v1/users/register', 
        json={
            'name': 'Jane Doe',
            'email': 'jane@example.com',
            'password': 'password123',
            'role': 'donor'
        }
    )
    
    # Then login
    response = client.post('/api/v1/users/login',
        json={
            'email': 'jane@example.com',
            'password': 'password123'
        }
    )
    
    assert response.status_code == 200
    data = response.get_json()
    assert 'access_token' in data
    assert 'user' in data
    assert data['user']['email'] == 'jane@example.com'

def test_get_charities_simple(client):
    """Test getting charities list (public endpoint)"""
    response = client.get('/api/v1/charities/')
    
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)  # Should return a list (even if empty)

if __name__ == '__main__':
    pytest.main([__file__, '-v'])