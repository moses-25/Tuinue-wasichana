import pytest
import json

def test_charity_application_success(client, auth_headers_donor):
    """Test successful charity application"""
    response = client.post('/api/v1/charities/apply',
        headers=auth_headers_donor,
        json={
            'organization_name': 'Help Children Foundation',
            'mission': 'To help underprivileged children get education'
        }
    )
    
    assert response.status_code == 201
    data = response.get_json()
    assert data['organization_name'] == 'Help Children Foundation'
    assert data['status'] == 'pending'

def test_charity_application_duplicate(client, auth_headers_donor):
    """Test duplicate charity application"""
    # Submit first application
    client.post('/api/v1/charities/apply',
        headers=auth_headers_donor,
        json={
            'organization_name': 'Help Children Foundation',
            'mission': 'To help underprivileged children get education'
        }
    )
    
    # Try to submit another application
    response = client.post('/api/v1/charities/apply',
        headers=auth_headers_donor,
        json={
            'organization_name': 'Another Foundation',
            'mission': 'Another mission'
        }
    )
    
    assert response.status_code == 409

def test_charity_application_missing_fields(client, auth_headers_donor):
    """Test charity application with missing fields"""
    response = client.post('/api/v1/charities/apply',
        headers=auth_headers_donor,
        json={
            'organization_name': 'Help Children Foundation'
            # Missing mission
        }
    )
    
    assert response.status_code == 400

def test_get_approved_charities(client, approved_charity):
    """Test getting list of approved charities"""
    response = client.get('/api/v1/charities/')
    
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]['name'] == 'Test Charity Organization'
    assert data[0]['status'] == 'approved'

def test_get_charity_details(client, approved_charity):
    """Test getting specific charity details"""
    response = client.get(f'/api/v1/charities/{approved_charity.id}')
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['name'] == 'Test Charity Organization'
    assert data['status'] == 'approved'

def test_get_charity_details_not_found(client):
    """Test getting non-existent charity details"""
    response = client.get('/api/v1/charities/999')
    assert response.status_code == 404

def test_admin_get_all_applications(client, auth_headers_admin):
    """Test admin getting all charity applications"""
    response = client.get('/api/v1/charities/applications', headers=auth_headers_admin)
    assert response.status_code == 200

def test_admin_approve_application(client, auth_headers_admin, donor_user, app):
    """Test admin approving charity application"""
    # Create a charity application first
    with app.app_context():
        from app.models.charity_application import CharityApplication
        from app.services.database import db
        
        application = CharityApplication(
            user_id=donor_user.id,
            organization_name='Test Charity',
            mission='Test mission'
        )
        db.session.add(application)
        db.session.commit()
        app_id = application.id
    
    response = client.post(f'/api/v1/charities/applications/{app_id}/approve',
        headers=auth_headers_admin
    )
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'approved'

def test_admin_reject_application(client, auth_headers_admin, donor_user, app):
    """Test admin rejecting charity application"""
    # Create a charity application first
    with app.app_context():
        from app.models.charity_application import CharityApplication
        from app.services.database import db
        
        application = CharityApplication(
            user_id=donor_user.id,
            organization_name='Test Charity',
            mission='Test mission'
        )
        db.session.add(application)
        db.session.commit()
        app_id = application.id
    
    response = client.post(f'/api/v1/charities/applications/{app_id}/reject',
        headers=auth_headers_admin
    )
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'rejected'

def test_charity_get_donors(client, auth_headers_charity, approved_charity, donor_user, app):
    """Test charity getting their donors"""
    # Create a completed donation first
    with app.app_context():
        from app.models.donation import Donation
        from app.services.database import db
        
        donation = Donation(
            user_id=donor_user.id,
            charity_id=approved_charity.id,
            amount=100.00,
            status='complete',
            is_anonymous=False
        )
        db.session.add(donation)
        db.session.commit()
    
    response = client.get('/api/v1/charities/my-charity/donors', headers=auth_headers_charity)
    
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]['name'] == 'Test Donor'

def test_charity_get_donations(client, auth_headers_charity, approved_charity, donor_user, app):
    """Test charity getting their donations"""
    # Create a donation first
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
    
    response = client.get('/api/v1/charities/my-charity/donations', headers=auth_headers_charity)
    
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert float(data[0]['amount']) == 100.00

def test_unauthorized_access_to_charity_endpoints(client, auth_headers_donor):
    """Test unauthorized access to charity-only endpoints"""
    response = client.get('/api/v1/charities/my-charity/donors', headers=auth_headers_donor)
    assert response.status_code == 403