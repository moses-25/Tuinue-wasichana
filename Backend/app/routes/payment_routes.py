from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from app.services.database import db
from app.models.donation import Donation
from app.models.payment import Payment
from app.models.charity import Charity
from app.services.mpesa_service import MpesaService
from app.middlewares.auth_middleware import roles_required
from flask_jwt_extended import get_jwt_identity

payment_ns = Namespace('payments', description='Payment related operations')

mpesa_payment_model = payment_ns.model('MpesaPayment', {
    'phone_number': fields.String(required=True, description='Phone number in format 254XXXXXXXXX'),
    'amount': fields.Float(required=True, description='Amount to pay'),
    'charity_id': fields.Integer(required=True, description='ID of charity to donate to'),
    'recurring': fields.Boolean(description='Is this a recurring donation?', default=False),
    'is_anonymous': fields.Boolean(description='Donate anonymously?', default=False)
})

payment_callback_model = payment_ns.model('PaymentCallback', {
    'Body': fields.Raw(required=True, description='Mpesa callback data')
})

@payment_ns.route('/mpesa')
class MpesaPayment(Resource):
    @payment_ns.doc('initiate_mpesa_payment')
    @payment_ns.expect(mpesa_payment_model)
    @roles_required('donor', 'admin')
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        
        phone_number = data.get('phone_number')
        amount = data.get('amount')
        charity_id = data.get('charity_id')
        recurring = data.get('recurring', False)
        is_anonymous = data.get('is_anonymous', False)
        
        if not all([phone_number, amount, charity_id]):
            payment_ns.abort(400, message='Missing required payment details')
        
        # Validate charity exists
        charity = Charity.query.get(charity_id)
        if not charity:
            payment_ns.abort(404, message='Charity not found')
        
        # Validate amount
        try:
            amount = float(amount)
            if amount <= 0:
                payment_ns.abort(400, message='Amount must be positive')
        except ValueError:
            payment_ns.abort(400, message='Invalid amount')
        
        # Create pending donation
        donation = Donation(
            user_id=user_id,
            charity_id=charity_id,
            amount=amount,
            recurring=recurring,
            is_anonymous=is_anonymous,
            status='pending'
        )
        db.session.add(donation)
        db.session.flush()
        
        # Initiate Mpesa payment
        mpesa_service = MpesaService()
        account_reference = f"DONATION_{donation.id}"
        transaction_desc = f"Donation to {charity.name}"
        
        result = mpesa_service.initiate_stk_push(
            phone_number=phone_number,
            amount=amount,
            account_reference=account_reference,
            transaction_desc=transaction_desc
        )
        
        if result['success']:
            # Create payment record
            payment = Payment(
                donation_id=donation.id,
                method='mpesa',
                transaction_id=result['checkout_request_id'],
                status='pending'
            )
            db.session.add(payment)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': result['message'],
                'donation_id': donation.id,
                'checkout_request_id': result['checkout_request_id']
            }), 200
        else:
            db.session.rollback()
            return jsonify({
                'success': False,
                'message': result['message']
            }), 400

@payment_ns.route('/verify')
class PaymentVerify(Resource):
    @payment_ns.doc('mpesa_payment_callback')
    @payment_ns.expect(payment_callback_model)
    def post(self):
        """Handle Mpesa payment callback"""
        data = request.get_json()
        
        try:
            callback_data = data.get('Body', {})
            stk_callback = callback_data.get('stkCallback', {})
            
            checkout_request_id = stk_callback.get('CheckoutRequestID')
            result_code = stk_callback.get('ResultCode')
            result_desc = stk_callback.get('ResultDesc')
            
            # Find the payment record
            payment = Payment.query.filter_by(transaction_id=checkout_request_id).first()
            if not payment:
                return jsonify({'message': 'Payment record not found'}), 404
            
            donation = payment.donation
            
            if result_code == 0:  # Success
                # Extract transaction details from callback
                callback_metadata = stk_callback.get('CallbackMetadata', {}).get('Item', [])
                mpesa_receipt_number = None
                
                for item in callback_metadata:
                    if item.get('Name') == 'MpesaReceiptNumber':
                        mpesa_receipt_number = item.get('Value')
                        break
                
                # Update payment and donation status
                payment.status = 'success'
                payment.transaction_id = mpesa_receipt_number or checkout_request_id
                donation.status = 'complete'
                
                db.session.commit()
                
                return jsonify({'message': 'Payment processed successfully'}), 200
            else:
                # Payment failed
                payment.status = 'failed'
                donation.status = 'failed'
                
                db.session.commit()
                
                return jsonify({'message': f'Payment failed: {result_desc}'}), 200
                
        except Exception as e:
            return jsonify({'message': f'Callback processing failed: {str(e)}'}), 500