from flask import Blueprint, request, jsonify
from app.services.database import db
from app.models.donation import Donation
from app.models.payment import Payment
from app.models.user import User
from app.models.charity import Charity
from app.middlewares.auth_middleware import roles_required
from flask_jwt_extended import get_jwt_identity

donation_bp = Blueprint('donation_bp', __name__)

@donation_bp.route('/donate', methods=['POST'])
@roles_required('donor', 'admin') # Donors and admins can make donations
def make_donation():
    user_id = get_jwt_identity()
    data = request.get_json()

    charity_id = data.get('charity_id')
    amount = data.get('amount')
    recurring = data.get('recurring', False)
    is_anonymous = data.get('is_anonymous', False)
    payment_method = data.get('payment_method') # Should be 'mpesa'
    transaction_id = data.get('transaction_id') # Mpesa transaction ID

    if not all([charity_id, amount, payment_method, transaction_id]):
        return jsonify({'message': 'Missing required donation details'}), 400

    charity = Charity.query.get(charity_id)
    if not charity:
        return jsonify({'message': 'Charity not found'}), 404

    try:
        amount = float(amount)
        if amount <= 0:
            return jsonify({'message': 'Amount must be positive'}), 400
    except ValueError:
        return jsonify({'message': 'Invalid amount'}), 400

    # Create Donation entry
    new_donation = Donation(
        user_id=user_id,
        charity_id=charity_id,
        amount=amount,
        recurring=recurring,
        is_anonymous=is_anonymous,
        status='pending' # Status is pending until payment is verified
    )
    db.session.add(new_donation)
    db.session.flush() # Flush to get donation.id for payment

    # Create Payment entry
    new_payment = Payment(
        donation_id=new_donation.id,
        method=payment_method,
        transaction_id=transaction_id,
        status='success' # Assuming Mpesa STK Push is successful for now
    )
    db.session.add(new_payment)
    db.session.commit()

    # Update donation status to complete if payment is successful
    new_donation.status = 'complete'
    db.session.commit()

    return jsonify({'message': 'Donation successful', 'donation': new_donation.to_dict()}), 201

@donation_bp.route('/my-donations', methods=['GET'])
@roles_required('donor', 'admin')
def get_my_donations():
    user_id = get_jwt_identity()
    donations = Donation.query.filter_by(user_id=user_id).all()
    return jsonify([donation.to_dict() for donation in donations]), 200
