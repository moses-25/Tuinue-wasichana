from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from app.services.database import db
from app.models.donation import Donation
from app.models.payment import Payment
from app.models.user import User
from app.models.charity import Charity
from app.middlewares.auth_middleware import roles_required
from flask_jwt_extended import get_jwt_identity

donation_ns = Namespace('donations', description='Donation related operations')

donation_request_model = donation_ns.model('DonationRequest', {
    'charity_id': fields.Integer(required=True, description='ID of the charity to donate to'),
    'amount': fields.Float(required=True, description='Amount of donation'),
    'recurring': fields.Boolean(description='Is this a recurring donation?', default=False),
    'is_anonymous': fields.Boolean(description='Donate anonymously?', default=False),
    'payment_method': fields.String(required=True, description='Payment method (e.g., mpesa)'),
    'transaction_id': fields.String(required=True, description='Transaction ID from payment gateway')
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

@donation_ns.route('/donate')
class Donate(Resource):
    @donation_ns.doc('make_donation')
    @donation_ns.expect(donation_request_model)
    @donation_ns.marshal_with(donation_response_model, code=201)
    @roles_required('donor', 'admin')
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()

        charity_id = data.get('charity_id')
        amount = data.get('amount')
        recurring = data.get('recurring', False)
        is_anonymous = data.get('is_anonymous', False)
        payment_method = data.get('payment_method')
        transaction_id = data.get('transaction_id')

        if not all([charity_id, amount, payment_method, transaction_id]):
            donation_ns.abort(400, message='Missing required donation details')

        charity = Charity.query.get(charity_id)
        if not charity:
            donation_ns.abort(404, message='Charity not found')

        try:
            amount = float(amount)
            if amount <= 0:
                donation_ns.abort(400, message='Amount must be positive')
        except ValueError:
            donation_ns.abort(400, message='Invalid amount')

        new_donation = Donation(
            user_id=user_id,
            charity_id=charity_id,
            amount=amount,
            recurring=recurring,
            is_anonymous=is_anonymous,
            status='pending'
        )
        db.session.add(new_donation)
        db.session.flush()

        new_payment = Payment(
            donation_id=new_donation.id,
            method=payment_method,
            transaction_id=transaction_id,
            status='success'
        )
        db.session.add(new_payment)
        db.session.commit()

        new_donation.status = 'complete'
        db.session.commit()

        return new_donation, 201

@donation_ns.route('/my-donations')
class MyDonations(Resource):
    @donation_ns.doc('get_my_donations')
    @donation_ns.marshal_list_with(donation_response_model)
    @roles_required('donor', 'admin')
    def get(self):
        user_id = get_jwt_identity()
        donations = Donation.query.filter_by(user_id=user_id).all()
        return donations

@donation_ns.route('/recurring')
class RecurringDonation(Resource):
    @donation_ns.doc('setup_recurring_donation')
    @donation_ns.expect(donation_request_model)
    @roles_required('donor', 'admin')
    def post(self):
        """Set up a recurring donation with reminder scheduling"""
        user_id = get_jwt_identity()
        data = request.get_json()

        charity_id = data.get('charity_id')
        amount = data.get('amount')
        is_anonymous = data.get('is_anonymous', False)

        if not all([charity_id, amount]):
            donation_ns.abort(400, message='Missing required donation details')

        charity = Charity.query.get(charity_id)
        if not charity:
            donation_ns.abort(404, message='Charity not found')

        try:
            amount = float(amount)
            if amount <= 0:
                donation_ns.abort(400, message='Amount must be positive')
        except ValueError:
            donation_ns.abort(400, message='Invalid amount')

        # Create the initial donation record
        new_donation = Donation(
            user_id=user_id,
            charity_id=charity_id,
            amount=amount,
            recurring=True,
            is_anonymous=is_anonymous,
            status='pending'
        )
        db.session.add(new_donation)
        db.session.flush()

        # Schedule monthly reminder using simplified service
        from app.services.reminder_service import ReminderService
        
        reminder = ReminderService.create_reminder(
            user_id=user_id,
            charity_id=charity_id,
            amount=amount,
            days_from_now=30
        )

        return {
            'message': 'Recurring donation set up successfully',
            'donation': new_donation.to_dict(),
            'next_reminder': reminder.scheduled_time.isoformat() if reminder else None
        }, 201
