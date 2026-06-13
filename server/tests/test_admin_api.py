import pytest
import json

def test_admin_dashboard_stats(client, auth_headers_admin, donor_user, approved_charity, app):
    """Test admin dashboard statistics"""
    # Create some test data
    with app.app_context():
        from app.models.donation import Donation
        from app.services.database import db
        
        donation = Donation(
            user_id=donor_user.id,
            charity_id=approved_charity.id,
            amount=100.00,
            status='complete'
        )
        db.session.add(donation)
        db.session.commit()
    
    response = client.get('/api/v1/admin/dashboard', headers=auth_headers_admin)
    
    assert response.status_code == 200
    data = response.get_json()
    assert 'total_users' in data
    assert 'total_charities' in data
    assert 'total_donations' in data
    assert 'total_donation_amount' in data
    assert data['total_donations'] == 1
    assert float(data['total_donation_amount']) == 100.00

def test_admin_recent_activities(client, auth_headers_admin, donor_user, approved_charity, app):
    """Test admin recent activities"""
    # Create some test data
    with app.app_context():
        from app.models.donation import Donation
        from app.models.charity_application import CharityApplication
        from app.services.database import db
        
        donation = Donation(
            user_id=donor_user.id,
            charity_id=approved_charity.id,
            amount=100.00,
            status='complete'
        )
        db.session.add(donation)
        
        application = CharityApplication(
            user_id=donor_user.id,
            organization_name='New Charity',
            mission='Help people'
        )
        db.session.add(application)
        db.session.commit()
    
    response = client.get('/api/v1/admin/activities', headers=auth_headers_admin)
    
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) >= 2  # At least donation and application

def test_admin_approve_charity(client, auth_headers_admin, app):
    """Test admin approving charity"""
    # Create a pending charity
    with app.app_context():
        from app.models.charity import Charity
        from app.models.user import User
        from app.services.database import db
        
        user = User(name='Charity Owner', email='owner@test.com', role='donor')
        user.set_password('password123')
        db.session.add(user)
        db.session.flush()
        
        charity = Charity(
            owner_id=user.id,
            name='Pending Charity',
            description='A charity waiting for approval',
            status='pending'
        )
        db.session.add(charity)
        db.session.commit()
        charity_id = charity.id
    
    response = client.post(f'/api/v1/admin/charities/{charity_id}/approve',
        headers=auth_headers_admin
    )
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['charity']['status'] == 'approved'

def test_admin_reject_charity(client, auth_headers_admin, app):
    """Test admin rejecting charity"""
    # Create a pending charity
    with app.app_context():
        from app.models.charity import Charity
        from app.models.user import User
        from app.services.database import db
        
        user = User(name='Charity Owner', email='owner2@test.com', role='donor')
        user.set_password('password123')
        db.session.add(user)
        db.session.flush()
        
        charity = Charity(
            owner_id=user.id,
            name='Pending Charity',
            description='A charity waiting for approval',
            status='pending'
        )
        db.session.add(charity)
        db.session.commit()
        charity_id = charity.id
    
    response = client.post(f'/api/v1/admin/charities/{charity_id}/reject',
        headers=auth_headers_admin,
        json={'reason': 'Insufficient documentation'}
    )
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['charity']['status'] == 'rejected'
    assert data['reason'] == 'Insufficient documentation'

def test_admin_approve_nonexistent_charity(client, auth_headers_admin):
    """Test admin approving non-existent charity"""
    response = client.post('/api/v1/admin/charities/999/approve',
        headers=auth_headers_admin
    )
    
    assert response.status_code == 404

def test_admin_reject_nonexistent_charity(client, auth_headers_admin):
    """Test admin rejecting non-existent charity"""
    response = client.post('/api/v1/admin/charities/999/reject',
        headers=auth_headers_admin
    )
    
    assert response.status_code == 404

def test_unauthorized_admin_access(client, auth_headers_donor):
    """Test unauthorized access to admin endpoints"""
    response = client.get('/api/v1/admin/dashboard', headers=auth_headers_donor)
    assert response.status_code == 403

def test_unauthenticated_admin_access(client):
    """Test unauthenticated access to admin endpoints"""
    response = client.get('/api/v1/admin/dashboard')
    assert response.status_code == 401