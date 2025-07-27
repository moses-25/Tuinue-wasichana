from flask import Blueprint, request, jsonify
from app.services.database import db
from datetime import datetime
from app.models.charity_application import CharityApplication
from app.models.charity import Charity
from app.models.user import User
from app.middlewares.auth_middleware import roles_required
from flask_jwt_extended import get_jwt_identity

charity_bp = Blueprint('charity_bp', __name__)

@charity_bp.route('/apply', methods=['POST'])
@roles_required('donor') # Only donors can apply to become charities
def apply_for_charity():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    data = request.get_json()
    organization_name = data.get('organization_name')
    mission = data.get('mission')

    if not all([organization_name, mission]):
        return jsonify({'message': 'Missing organization name or mission'}), 400

    # Check if an application already exists for this user
    existing_application = CharityApplication.query.filter_by(user_id=user_id).first()
    if existing_application:
        return jsonify({'message': 'You have already submitted a charity application.', 'status': existing_application.status}), 409

    new_application = CharityApplication(
        user_id=user_id,
        organization_name=organization_name,
        mission=mission
    )

    db.session.add(new_application)
    db.session.commit()

    return jsonify({'message': 'Charity application submitted successfully', 'application': new_application.to_dict()}), 201

@charity_bp.route('/applications', methods=['GET'])
@roles_required('admin')
def get_all_applications():
    applications = CharityApplication.query.all()
    return jsonify([app.to_dict() for app in applications]), 200

@charity_bp.route('/applications/<int:application_id>/approve', methods=['POST'])
@roles_required('admin')
def approve_charity_application(application_id):
    application = CharityApplication.query.get(application_id)

    if not application:
        return jsonify({'message': 'Charity application not found'}), 404

    if application.status == 'approved':
        return jsonify({'message': 'Application already approved'}), 409

    application.status = 'approved'
    application.reviewed_at = datetime.utcnow()

    # Create a new Charity entry
    new_charity = Charity(
        owner_id=application.user_id,
        name=application.organization_name,
        description=application.mission,
        status='approved'
    )

    db.session.add(new_charity)
    db.session.commit()

    # Update user role to charity
    user = User.query.get(application.user_id)
    if user:
        user.role = 'charity'
        db.session.commit()

    return jsonify({'message': 'Charity application approved and charity created', 'application': application.to_dict(), 'charity': new_charity.to_dict()}), 200

@charity_bp.route('/applications/<int:application_id>/reject', methods=['POST'])
@roles_required('admin')
def reject_charity_application(application_id):
    application = CharityApplication.query.get(application_id)

    if not application:
        return jsonify({'message': 'Charity application not found'}), 404

    if application.status == 'rejected':
        return jsonify({'message': 'Application already rejected'}), 409

    application.status = 'rejected'
    application.reviewed_at = datetime.utcnow()
    db.session.commit()

    return jsonify({'message': 'Charity application rejected', 'application': application.to_dict()}), 200
