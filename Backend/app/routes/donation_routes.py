from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from app.services.database import db
from app.models.donation import Donation
from app.models.payment import Payment
from app.models.user import User
from app.models.charity import Charity
from app.middlewares.auth_middleware import roles_required
from flask_jwt_extended import get_jwt_identity, jwt_required
from datetime import datetime

# M-Pesa integration stub (replace with actual service)
def initiate_mpesa_stk_push(phone_number, amount, charity_id):
    # Simulate transaction
    return {'transactionId': 'MPESA123456', 'message': 'STK Push initiated'}

donation_ns = Namespace('donations', description='Donation related operations')

donation_request_model = donation_ns.model('DonationRequest', {
    'charityId': fields.Integer(required=True, description='ID of the charity to donate to'),
    'amount': fields.Float(required=True, description='Amount of donation'),
    'paymentMethod': fields.String(required=True, description='Payment method (e.g., mpesa, paypal, card)'),
    'phoneNumber': fields.String(description='Phone number for M-Pesa'),
    'is_anonymous': fields.Boolean(description='Donate anonymously?', default=False)
})

donation_response_model = donation_ns.model('DonationResponse', {
    'id': fields.Integer(readOnly=True),
    'user_id': fields.Integer,
    'charity_id': fields.Integer,
    'amount': fields.String,
    'recurring': fields.Boolean,
    'status': fields.String,
    'is_anonymous': fields.Boolean,
    'timestamp': fields.DateTime
})

@donation_ns.route('/')
class MakeDonation(Resource):
    @donation_ns.expect(donation_request_model)
    @jwt_required()
    def post(self):
        data = request.get_json()
        user_id = get_jwt_identity()
        charity_id = data.get('charityId')
        amount = data.get('amount')
        payment_method = data.get('paymentMethod')
        phone_number = data.get('phoneNumber')
        is_anonymous = data.get('is_anonymous', False)
        if not all([charity_id, amount, payment_method]):
            return {'success': False, 'error': 'Missing required donation details'}, 400
        charity = Charity.query.get(charity_id)
        if not charity:
            return {'success': False, 'error': 'Charity not found'}, 404
        try:
            amount = float(amount)
            if amount <= 0:
                return {'success': False, 'error': 'Amount must be positive'}, 400
        except ValueError:
            return {'success': False, 'error': 'Invalid amount'}, 400
        new_donation = Donation(
            user_id=user_id,
            charity_id=charity_id,
            amount=amount,
            recurring=False,
            is_anonymous=is_anonymous,
            status='pending'
        )
        db.session.add(new_donation)
        db.session.flush()
        # Simulate payment
        new_payment = Payment(
            donation_id=new_donation.id,
            method=payment_method,
            transaction_id='SIMULATED',
            status='success'
        )
        db.session.add(new_payment)
        db.session.commit()
        new_donation.status = 'complete'
        db.session.commit()
        return {
            'success': True,
            'donation': new_donation.to_dict(),
            'message': 'Donation successful.'
        }, 201

@donation_ns.route('/history')
class DonationHistory(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        donations = Donation.query.filter_by(user_id=user_id).all()
        return {
            'success': True,
            'donations': [d.to_dict() for d in donations],
            'message': 'Donation history retrieved.'
        }, 200

@donation_ns.route('/mpesa/initiate')
class MpesaInitiate(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        phone_number = data.get('phoneNumber')
        amount = data.get('amount')
        charity_id = data.get('charityId')
        if not all([phone_number, amount, charity_id]):
            return {'success': False, 'error': 'Missing required details'}, 400
        result = initiate_mpesa_stk_push(phone_number, amount, charity_id)
        return {
            'success': True,
            'transactionId': result['transactionId'],
            'message': result['message']
        }, 200

@donation_ns.route('/mpesa/callback')
class MpesaCallback(Resource):
    def post(self):
        # Simulate callback handling
        return {'success': True, 'message': 'Callback received.'}, 200

@donation_ns.route('/mpesa/status/<string:transactionId>')
class MpesaStatus(Resource):
    def get(self, transactionId):
        # Simulate status check
        return {
            'success': True,
            'status': 'success',
            'donation': {},
            'message': 'Payment status retrieved.'
        }, 200
