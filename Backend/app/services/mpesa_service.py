import requests
import base64
from datetime import datetime
from flask import current_app
import json

class MpesaService:
    def __init__(self):
        self.consumer_key = current_app.config.get('MPESA_CONSUMER_KEY')
        self.consumer_secret = current_app.config.get('MPESA_CONSUMER_SECRET')
        self.business_short_code = current_app.config.get('MPESA_BUSINESS_SHORT_CODE')
        self.passkey = current_app.config.get('MPESA_PASSKEY')
        self.callback_url = current_app.config.get('MPESA_CALLBACK_URL')
        
        # Sandbox URLs (change to production URLs when ready)
        self.auth_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        self.stk_push_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

    def get_access_token(self):
        """Get OAuth access token from Mpesa"""
        try:
            credentials = base64.b64encode(f"{self.consumer_key}:{self.consumer_secret}".encode()).decode()
            headers = {
                'Authorization': f'Basic {credentials}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(self.auth_url, headers=headers)
            response.raise_for_status()
            
            return response.json().get('access_token')
        except Exception as e:
            current_app.logger.error(f"Failed to get Mpesa access token: {str(e)}")
            return None

    def generate_password(self):
        """Generate password for STK push"""
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password_string = f"{self.business_short_code}{self.passkey}{timestamp}"
        password = base64.b64encode(password_string.encode()).decode()
        return password, timestamp

    def initiate_stk_push(self, phone_number, amount, account_reference, transaction_desc):
        """Initiate STK push to user's phone"""
        access_token = self.get_access_token()
        if not access_token:
            return {'success': False, 'message': 'Failed to get access token'}

        password, timestamp = self.generate_password()
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            "BusinessShortCode": self.business_short_code,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": phone_number,
            "PartyB": self.business_short_code,
            "PhoneNumber": phone_number,
            "CallBackURL": self.callback_url,
            "AccountReference": account_reference,
            "TransactionDesc": transaction_desc
        }
        
        try:
            response = requests.post(self.stk_push_url, json=payload, headers=headers)
            response.raise_for_status()
            
            result = response.json()
            if result.get('ResponseCode') == '0':
                return {
                    'success': True,
                    'checkout_request_id': result.get('CheckoutRequestID'),
                    'merchant_request_id': result.get('MerchantRequestID'),
                    'message': 'STK push initiated successfully'
                }
            else:
                return {
                    'success': False,
                    'message': result.get('ResponseDescription', 'STK push failed')
                }
                
        except Exception as e:
            current_app.logger.error(f"STK push failed: {str(e)}")
            return {'success': False, 'message': 'Payment initiation failed'}

    def verify_transaction(self, checkout_request_id):
        """Verify transaction status"""
        # This would typically query Mpesa's transaction status API
        # For now, return a placeholder implementation
        return {
            'success': True,
            'transaction_status': 'completed',
            'transaction_id': f'MPX{checkout_request_id}'
        }