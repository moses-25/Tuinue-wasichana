import pytest
import json

def test_user_registration_success(client):
    """Test successful user registration"""
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

def test_user_registration_duplicate_email(client):
    """Test registration with duplicate email"""
    # Register first user
    client.post('/api/v1/users/register', 
        json={
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'password123',
            'role': 'donor'
        }
    )
    
    # Try to register with same email
    response = client.post('/api/v1/users/register', 
        json={
            'name': 'Jane Doe',
            'email': 'john@example.com',
            'password': 'password456',
            'role': 'donor'
        }
    )
    
    assert response.status_code == 409

def test_user_registration_missing_fields(client):
    """Test registration with missing required fields"""
    response = client.post('/api/v1/users/register', 
        json={
            'name': 'John Doe',
            'email': 'john@example.com'
            # Missing password
        }
    )
    
    assert response.status_code == 400

def test_user_login_success(client, donor_user):
    """Test successful user login"""
    response = client.post('/api/v1/users/login',
        json={
            'email': 'donor@test.com',
            'password': 'password123'
        }
    )
    
    assert response.status_code == 200
    data = response.get_json()
    assert 'access_token' in data
    assert 'user' in data
    assert data['user']['email'] == 'donor@test.com'

def test_user_login_invalid_credentials(client, donor_user):
    """Test login with invalid credentials"""
    response = client.post('/api/v1/users/login',
        json={
            'email': 'donor@test.com',
            'password': 'wrongpassword'
        }
    )
    
    assert response.status_code == 401

def test_user_login_nonexistent_user(client):
    """Test login with non-existent user"""
    response = client.post('/api/v1/users/login',
        json={
            'email': 'nonexistent@test.com',
            'password': 'password123'
        }
    )
    
    assert response.status_code == 401

def test_protected_endpoint_without_token(client):
    """Test accessing protected endpoint without token"""
    response = client.get('/api/v1/users/protected')
    assert response.status_code == 401

def test_protected_endpoint_with_token(client, auth_headers_donor):
    """Test accessing protected endpoint with valid token"""
    response = client.get('/api/v1/users/protected', headers=auth_headers_donor)
    assert response.status_code == 200
    data = response.get_json()
    assert 'Hello Test Donor!' in data['message']