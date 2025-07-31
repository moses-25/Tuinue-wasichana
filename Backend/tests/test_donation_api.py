import pytest
import json

def test_make_donation_success(client, auth_headers_donor, approved_charity):
    """Test successful donation"""
    response = client.post('/api/v1/donations/donate',
        headers=auth_headers_donor,
        json={
            'charity_id': approved_charity,  # approved_charity is now just the ID
            'amount': 100.00,
            'recurring': False,
            'is_anonymous': False,
            'payment_method': 'mpesa',
            'transaction_id': 'TEST123456'
        }
    )
    
    assert response.status_code == 201
    data = response.get_json()
    assert data['charity_id'] == approved_charity
    assert float(data['amount']) == 100.00
    assert data['status'] == 'complete'

def test_make_donation_invalid_charity(client, auth_headers_donor):
    """Test donation to non-existent charity"""
    response = client.post('/api/v1/donations/donate',
        headers=auth_headers_donor,
        json={
            'charity_id': 999,
            'amount': 100.00,
            'recurring': False,
            'is_anonymous': False,
            'payment_method': 'mpesa',
            'transaction_id': 'TEST123456'
        }
    )
    
    assert response.status_code == 404

def test_make_donation_invalid_amount(client, auth_headers_donor, approved_charity):
    """Test donation with invalid amount"""
    response = client.post('/api/v1/donations/donate',
        headers=auth_headers_donor,
        json={
            'charity_id': approved_charity.id,
            'amount': -50.00,  # Negative amount
            'recurring': False,
            'is_anonymous': False,
            'payment_method': 'mpesa',
            'transaction_id': 'TEST123456'
        }
    )
    
    assert response.status_code == 400

def test_make_donation_missing_fields(client, auth_headers_donor, approved_charity):
    """Test donation with missing required fields"""
    response = client.post('/api/v1/donations/donate',
        headers=auth_headers_donor,
        json={
            'charity_id': approved_charity.id,
            'amount': 100.00
            # Missing payment_method and transaction_id
        }
    )
    
    assert response.status_code == 400

def test_get_my_donations(client, auth_headers_donor, approved_charity, donor_user, app):
    """Test getting user's donation history"""
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
    
    response = client.get('/api/v1/donations/my-donations', headers=auth_headers_donor)
    
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert float(data[0]['amount']) == 100.00

def test_setup_recurring_donation(client, auth_headers_donor, approved_charity):
    """Test setting up recurring donation"""
    response = client.post('/api/v1/donations/recurring',
        headers=auth_headers_donor,
        json={
            'charity_id': approved_charity.id,
            'amount': 50.00,
            'is_anonymous': False
        }
    )
    
    assert response.status_code == 201
    data = response.get_json()
    assert 'Recurring donation set up successfully' in data['message']
    assert 'next_reminder' in data

def test_setup_recurring_donation_invalid_charity(client, auth_headers_donor):
    """Test setting up recurring donation for non-existent charity"""
    response = client.post('/api/v1/donations/recurring',
        headers=auth_headers_donor,
        json={
            'charity_id': 999,
            'amount': 50.00,
            'is_anonymous': False
        }
    )
    
    assert response.status_code == 404

def test_unauthorized_donation_access(client):
    """Test accessing donation endpoints without authentication"""
    response = client.get('/api/v1/donations/my-donations')
    assert response.status_code == 401

def test_charity_cannot_donate(client, auth_headers_charity, approved_charity):
    """Test that charity users cannot make donations"""
    response = client.post('/api/v1/donations/donate',
        headers=auth_headers_charity,
        json={
            'charity_id': approved_charity.id,
            'amount': 100.00,
            'recurring': False,
            'is_anonymous': False,
            'payment_method': 'mpesa',
            'transaction_id': 'TEST123456'
        }
    )
    
    assert response.status_code == 403