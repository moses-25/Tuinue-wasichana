import pytest
import json

def test_get_charity_beneficiaries(client, auth_headers_charity, approved_charity, app):
    """Test getting beneficiaries for a charity"""
    # Create a beneficiary first
    with app.app_context():
        from app.models.beneficiary import Beneficiary
        from app.services.database import db
        
        beneficiary = Beneficiary(
            charity_id=approved_charity.id,
            name='John Doe',
            description='A child who needs help with education'
        )
        db.session.add(beneficiary)
        db.session.commit()
    
    response = client.get(f'/api/v1/beneficiaries/charities/{approved_charity.id}/beneficiaries',
        headers=auth_headers_charity
    )
    
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]['name'] == 'John Doe'

def test_create_beneficiary_success(client, auth_headers_charity, approved_charity):
    """Test successful beneficiary creation"""
    response = client.post(f'/api/v1/beneficiaries/charities/{approved_charity.id}/beneficiaries',
        headers=auth_headers_charity,
        json={
            'name': 'Jane Smith',
            'description': 'A student who needs school supplies'
        }
    )
    
    assert response.status_code == 201
    data = response.get_json()
    assert data['name'] == 'Jane Smith'
    assert data['charity_id'] == approved_charity.id

def test_create_beneficiary_unauthorized_charity(client, auth_headers_donor, approved_charity):
    """Test creating beneficiary with unauthorized charity access"""
    response = client.post(f'/api/v1/beneficiaries/charities/{approved_charity.id}/beneficiaries',
        headers=auth_headers_donor,
        json={
            'name': 'Jane Smith',
            'description': 'A student who needs school supplies'
        }
    )
    
    assert response.status_code == 403

def test_create_beneficiary_missing_fields(client, auth_headers_charity, approved_charity):
    """Test creating beneficiary with missing required fields"""
    response = client.post(f'/api/v1/beneficiaries/charities/{approved_charity.id}/beneficiaries',
        headers=auth_headers_charity,
        json={
            'description': 'A student who needs school supplies'
            # Missing name
        }
    )
    
    assert response.status_code == 400

def test_get_beneficiary_by_id(client, auth_headers_charity, approved_charity, app):
    """Test getting specific beneficiary by ID"""
    # Create a beneficiary first
    with app.app_context():
        from app.models.beneficiary import Beneficiary
        from app.services.database import db
        
        beneficiary = Beneficiary(
            charity_id=approved_charity.id,
            name='John Doe',
            description='A child who needs help'
        )
        db.session.add(beneficiary)
        db.session.commit()
        beneficiary_id = beneficiary.id
    
    response = client.get(f'/api/v1/beneficiaries/{beneficiary_id}',
        headers=auth_headers_charity
    )
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['name'] == 'John Doe'

def test_get_beneficiary_not_found(client, auth_headers_charity):
    """Test getting non-existent beneficiary"""
    response = client.get('/api/v1/beneficiaries/999', headers=auth_headers_charity)
    assert response.status_code == 404

def test_update_beneficiary_success(client, auth_headers_charity, approved_charity, app):
    """Test successful beneficiary update"""
    # Create a beneficiary first
    with app.app_context():
        from app.models.beneficiary import Beneficiary
        from app.services.database import db
        
        beneficiary = Beneficiary(
            charity_id=approved_charity.id,
            name='John Doe',
            description='Original description'
        )
        db.session.add(beneficiary)
        db.session.commit()
        beneficiary_id = beneficiary.id
    
    response = client.put(f'/api/v1/beneficiaries/{beneficiary_id}',
        headers=auth_headers_charity,
        json={
            'name': 'John Updated',
            'description': 'Updated description',
            'inventory_given': True
        }
    )
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['beneficiary']['name'] == 'John Updated'
    assert data['beneficiary']['inventory_given'] == True

def test_update_beneficiary_unauthorized(client, auth_headers_donor, approved_charity, app):
    """Test unauthorized beneficiary update"""
    # Create a beneficiary first
    with app.app_context():
        from app.models.beneficiary import Beneficiary
        from app.services.database import db
        
        beneficiary = Beneficiary(
            charity_id=approved_charity.id,
            name='John Doe',
            description='Original description'
        )
        db.session.add(beneficiary)
        db.session.commit()
        beneficiary_id = beneficiary.id
    
    response = client.put(f'/api/v1/beneficiaries/{beneficiary_id}',
        headers=auth_headers_donor,
        json={
            'name': 'John Updated',
            'description': 'Updated description'
        }
    )
    
    assert response.status_code == 403

def test_delete_beneficiary_success(client, auth_headers_charity, approved_charity, app):
    """Test successful beneficiary deletion"""
    # Create a beneficiary first
    with app.app_context():
        from app.models.beneficiary import Beneficiary
        from app.services.database import db
        
        beneficiary = Beneficiary(
            charity_id=approved_charity.id,
            name='John Doe',
            description='To be deleted'
        )
        db.session.add(beneficiary)
        db.session.commit()
        beneficiary_id = beneficiary.id
    
    response = client.delete(f'/api/v1/beneficiaries/{beneficiary_id}',
        headers=auth_headers_charity
    )
    
    assert response.status_code == 200
    data = response.get_json()
    assert 'Beneficiary deleted successfully' in data['message']

def test_unauthorized_beneficiary_access(client):
    """Test accessing beneficiary endpoints without authentication"""
    response = client.get('/api/v1/beneficiaries/charities/1/beneficiaries')
    assert response.status_code == 401