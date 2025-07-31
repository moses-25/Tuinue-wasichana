import pytest
import json
from unittest.mock import patch, MagicMock

def test_initiate_mpesa_payment_success(client, auth_headers_donor, approved_charity):
    """Test successful Mpesa payment initiation"""
    with patch('app.services.mpesa_service.MpesaService.initiate_stk_push') as mock_stk:
        mock_stk.return_value = {
            'success': True,
            'message': 'STK push initiated successfully',
            'checkout_request_id': 'ws_CO_123456789',
            'merchant_request_id': 'MR_123456789'
        }
        
        response = client.post('/api/v1/payments/mpesa',
            headers=auth_headers_donor,
            json={
                'phone_number': '254712345678',
                'amount': 100.00,
                'charity_id': approved_charity.id,
                'recurring': False,
                'is_anonymous': False
            }
        )
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] == True
        assert 'checkout_request_id' in data

def test_initiate_mpesa_payment_failure(client, auth_headers_donor, approved_charity):
    """Test failed Mpesa payment initiation"""
    with patch('app.services.mpesa_service.MpesaService.initiate_stk_push') as mock_stk:
        mock_stk.return_value = {
            'success': False,
            'message': 'Payment initiation failed'
        }
        
        response = client.post('/api/v1/payments/mpesa',
            headers=auth_headers_donor,
            json={
                'phone_number': '254712345678',
                'amount': 100.00,
                'charity_id': approved_charity.id,
                'recurring': False,
                'is_anonymous': False
            }
        )
        
        assert response.status_code == 400
        data = response.get_json()
        assert data['success'] == False

def test_initiate_mpesa_payment_invalid_charity(client, auth_headers_donor):
    """Test Mpesa payment with invalid charity"""
    response = client.post('/api/v1/payments/mpesa',
        headers=auth_headers_donor,
        json={
            'phone_number': '254712345678',
            'amount': 100.00,
            'charity_id': 999,
            'recurring': False,
            'is_anonymous': False
        }
    )
    
    assert response.status_code == 404

def test_initiate_mpesa_payment_invalid_amount(client, auth_headers_donor, approved_charity):
    """Test Mpesa payment with invalid amount"""
    response = client.post('/api/v1/payments/mpesa',
        headers=auth_headers_donor,
        json={
            'phone_number': '254712345678',
            'amount': -100.00,  # Negative amount
            'charity_id': approved_charity.id,
            'recurring': False,
            'is_anonymous': False
        }
    )
    
    assert response.status_code == 400

def test_initiate_mpesa_payment_missing_fields(client, auth_headers_donor, approved_charity):
    """Test Mpesa payment with missing required fields"""
    response = client.post('/api/v1/payments/mpesa',
        headers=auth_headers_donor,
        json={
            'phone_number': '254712345678',
            'amount': 100.00
            # Missing charity_id
        }
    )
    
    assert response.status_code == 400

def test_payment_callback_success(client, donor_user, approved_charity, app):
    """Test successful payment callback"""
    # Create a pending payment first
    with app.app_context():
        from app.models.donation import Donation
        from app.models.payment import Payment
        from app.services.database import db
        
        donation = Donation(
            user_id=donor_user.id,
            charity_id=approved_charity.id,
            amount=100.00,
            status='pending'
        )
        db.session.add(donation)
        db.session.flush()
        
        payment = Payment(
            donation_id=donation.id,
            method='mpesa',
            transaction_id='ws_CO_123456789',
            status='pending'
        )
        db.session.add(payment)
        db.session.commit()
    
    callback_data = {
        "Body": {
            "stkCallback": {
                "MerchantRequestID": "MR_123456789",
                "CheckoutRequestID": "ws_CO_123456789",
                "ResultCode": 0,
                "ResultDesc": "The service request is processed successfully.",
                "CallbackMetadata": {
                    "Item": [
                        {
                            "Name": "Amount",
                            "Value": 100.00
                        },
                        {
                            "Name": "MpesaReceiptNumber",
                            "Value": "MPX123456789"
                        },
                        {
                            "Name": "PhoneNumber",
                            "Value": 254712345678
                        }
                    ]
                }
            }
        }
    }
    
    response = client.post('/api/v1/payments/verify', json=callback_data)
    
    assert response.status_code == 200
    data = response.get_json()
    assert 'Payment processed successfully' in data['message']

def test_payment_callback_failure(client, donor_user, approved_charity, app):
    """Test failed payment callback"""
    # Create a pending payment first
    with app.app_context():
        from app.models.donation import Donation
        from app.models.payment import Payment
        from app.services.database import db
        
        donation = Donation(
            user_id=donor_user.id,
            charity_id=approved_charity.id,
            amount=100.00,
            status='pending'
        )
        db.session.add(donation)
        db.session.flush()
        
        payment = Payment(
            donation_id=donation.id,
            method='mpesa',
            transaction_id='ws_CO_123456789',
            status='pending'
        )
        db.session.add(payment)
        db.session.commit()
    
    callback_data = {
        "Body": {
            "stkCallback": {
                "MerchantRequestID": "MR_123456789",
                "CheckoutRequestID": "ws_CO_123456789",
                "ResultCode": 1,
                "ResultDesc": "The service request failed."
            }
        }
    }
    
    response = client.post('/api/v1/payments/verify', json=callback_data)
    
    assert response.status_code == 200
    data = response.get_json()
    assert 'Payment failed' in data['message']

def test_payment_callback_payment_not_found(client):
    """Test payment callback for non-existent payment"""
    callback_data = {
        "Body": {
            "stkCallback": {
                "MerchantRequestID": "MR_999999999",
                "CheckoutRequestID": "ws_CO_999999999",
                "ResultCode": 0,
                "ResultDesc": "The service request is processed successfully."
            }
        }
    }
    
    response = client.post('/api/v1/payments/verify', json=callback_data)
    
    assert response.status_code == 404

def test_unauthorized_payment_access(client, approved_charity):
    """Test accessing payment endpoints without authentication"""
    response = client.post('/api/v1/payments/mpesa',
        json={
            'phone_number': '254712345678',
            'amount': 100.00,
            'charity_id': approved_charity.id,
            'recurring': False,
            'is_anonymous': False
        }
    )
    
    assert response.status_code == 401