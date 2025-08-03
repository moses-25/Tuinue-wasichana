from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from app.services.database import db
from datetime import datetime
from app.models.charity_application import CharityApplication
from app.models.charity import Charity
from app.models.user import User
from app.models.donation import Donation
from app.middlewares.auth_middleware import roles_required
from flask_jwt_extended import get_jwt_identity
from app.controllers.charity_controller import CharityController

charity_ns = Namespace('charities', description='Charity related operations')

charity_application_model = charity_ns.model('CharityApplication', {
    'organization_name': fields.String(required=True, description='Organization name'),
    'mission': fields.String(required=True, description='Mission statement'),
    'location': fields.String(description='Organization location', default='Kenya'),
    'category': fields.String(description='Organization category', default='Health'),
    'goal': fields.Integer(description='Fundraising goal', default=10000)
})

charity_response_model = charity_ns.model('CharityResponse', {
    'id': fields.Integer(readOnly=True),
    'owner_id': fields.Integer(readOnly=True),
    'name': fields.String,
    'description': fields.String,
    'status': fields.String,
    'created_at': fields.DateTime
})

charity_application_response_model = charity_ns.model('CharityApplicationResponse', {
    'id': fields.Integer(readOnly=True),
    'user_id': fields.Integer(readOnly=True),
    'organization_name': fields.String,
    'mission': fields.String,
    'location': fields.String,
    'category': fields.String,
    'goal': fields.Integer,
    'status': fields.String,
    'submitted_at': fields.DateTime,
    'reviewed_at': fields.DateTime
})

@charity_ns.route('/apply')
class CharityApply(Resource):
    @charity_ns.doc('apply_for_charity')
    @charity_ns.expect(charity_application_model)
    @charity_ns.marshal_with(charity_application_response_model, code=201)
    @roles_required('donor')
    def post(self):
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))

        if user.role != 'donor':
            charity_ns.abort(403, message='Only users with donor role can apply for charity')

        data = request.get_json()
        organization_name = data.get('organization_name')
        mission = data.get('mission')
        location = data.get('location', 'Kenya')
        category = data.get('category', 'Health')
        goal = data.get('goal', 10000)

        if not all([organization_name, mission]):
            charity_ns.abort(400, message='Missing organization name or mission')

        existing_application = CharityApplication.query.filter_by(user_id=int(user_id)).first()
        if existing_application:
            charity_ns.abort(409, message=f'You have already submitted a charity application. Current status: {existing_application.status}')

        new_application = CharityApplication(
            user_id=int(user_id),
            organization_name=organization_name,
            mission=mission,
            location=location,
            category=category,
            goal=goal
        )

        db.session.add(new_application)
        db.session.commit()

        return {
            'success': True,
            'charity': new_application.to_dict(),
            'message': 'Charity application submitted successfully.'
        }, 201

@charity_ns.route('/applications')
class CharityApplicationList(Resource):
    @charity_ns.doc('get_all_applications')
    @roles_required('admin')
    def get(self):
        applications = CharityApplication.query.all()
        return {
            'success': True,
            'applications': [app.to_dict() for app in applications],
            'message': 'Charity applications retrieved successfully.'
        }, 200

@charity_ns.route('/applications/<int:application_id>/approve')
class CharityApplicationApprove(Resource):
    @charity_ns.doc('approve_charity_application')
    @charity_ns.marshal_with(charity_application_response_model)
    @roles_required('admin')
    def post(self, application_id):
        application = CharityApplication.query.get(application_id)

        if not application:
            charity_ns.abort(404, message='Charity application not found')

        if application.status == 'approved':
            charity_ns.abort(409, message='Application already approved')

        application.status = 'approved'
        application.reviewed_at = datetime.utcnow()

        new_charity = Charity(
            owner_id=application.user_id,
            name=application.organization_name,
            description=application.mission,
            location=application.location,
            category=application.category,
            goal=application.goal,
            status='approved'
        )

        db.session.add(new_charity)
        db.session.commit()

        user = User.query.get(application.user_id)
        if user:
            user.role = 'charity'
            db.session.commit()

        return {
            'success': True,
            'application': application.to_dict(),
            'message': 'Charity application approved.'
        }, 200

@charity_ns.route('/applications/<int:application_id>/reject')
class CharityApplicationReject(Resource):
    @charity_ns.doc('reject_charity_application')
    @charity_ns.marshal_with(charity_application_response_model)
    @roles_required('admin')
    def post(self, application_id):
        application = CharityApplication.query.get(application_id)

        if not application:
            charity_ns.abort(404, message='Charity application not found')

        if application.status == 'rejected':
            charity_ns.abort(409, message='Application already rejected')

        application.status = 'rejected'
        application.reviewed_at = datetime.utcnow()
        db.session.commit()

        return {
            'success': True,
            'application': application.to_dict(),
            'message': 'Charity application rejected.'
        }, 200

@charity_ns.route('/admin/charities')
class AdminCharityList(Resource):
    @charity_ns.doc('admin_get_all_charities')
    @charity_ns.param('status', 'Filter by charity status (pending, approved, rejected)')
    @charity_ns.marshal_list_with(charity_response_model)
    @roles_required('admin')
    def get(self):
        status = request.args.get('status')
        charities = CharityController.get_all_charities(status).json
        return {
            'success': True,
            'charities': charities,
            'message': 'Charities retrieved successfully.'
        }, 200

@charity_ns.route('/admin/charities/<int:charity_id>')
class AdminCharity(Resource):
    @charity_ns.doc('admin_delete_charity')
    @charity_ns.response(200, 'Charity deleted successfully')
    @charity_ns.response(404, 'Charity not found')
    @roles_required('admin')
    def delete(self, charity_id):
        result = CharityController.delete_charity(charity_id)
        return {
            'success': result[1] == 200,
            'message': result[0].get_json().get('message', 'Charity deleted.'),
        }, result[1]

@charity_ns.route('/admin/charities/<int:charity_id>/approve')
class AdminCharityApprove(Resource):
    @charity_ns.doc('admin_approve_charity')
    @charity_ns.response(200, 'Charity approved successfully')
    @charity_ns.response(404, 'Charity not found')
    @roles_required('admin')
    def post(self, charity_id):
        charity = Charity.query.get(charity_id)
        if not charity:
            charity_ns.abort(404, message='Charity not found')
        
        charity.status = 'approved'
        db.session.commit()
        
        return {
            'success': True,
            'charity': charity.to_dict(),
            'message': 'Charity approved successfully.'
        }, 200

# Public endpoints for donors
@charity_ns.route('/')
class CharityList(Resource):
    @charity_ns.doc('get_approved_charities')
    @charity_ns.marshal_list_with(charity_response_model)
    def get(self):
        """Get all approved charities for donors to view"""
        charities = Charity.query.filter_by(status='approved').all()
        return {
            'success': True,
            'charities': [charity.to_dict() for charity in charities],
            'message': 'Charities retrieved successfully.'
        }, 200

@charity_ns.route('/<int:charity_id>')
class CharityDetail(Resource):
    @charity_ns.doc('get_charity_details')
    @charity_ns.marshal_with(charity_response_model)
    def get(self, charity_id):
        """Get specific charity details"""
        charity = Charity.query.get(charity_id)
        if not charity:
            charity_ns.abort(404, message='Charity not found')
        return {
            'success': True,
            'charity': charity.to_dict(),
            'message': 'Charity details retrieved successfully.'
        }, 200

# Charity dashboard endpoints
@charity_ns.route('/my-charity/donors')
class CharityDonors(Resource):
    @charity_ns.doc('get_charity_donors')
    @roles_required('charity')
    def get(self):
        """Get donors for the current charity"""
        user_id = get_jwt_identity()
        charity = Charity.query.filter_by(owner_id=int(user_id)).first()
        
        if not charity:
            charity_ns.abort(404, message='Charity not found for current user')
        
        # Get unique donors who donated to this charity
        donors = db.session.query(User).join(Donation).filter(
            Donation.charity_id == charity.id,
            Donation.status == 'complete',
            Donation.is_anonymous == False
        ).distinct().all()
        
        return jsonify([{
            'id': donor.id,
            'name': donor.name,
            'email': donor.email
        } for donor in donors])

@charity_ns.route('/my-charity/donations')
class CharityDonations(Resource):
    @charity_ns.doc('get_charity_donations')
    @roles_required('charity')
    def get(self):
        """Get donations received by the current charity"""
        user_id = get_jwt_identity()
        charity = Charity.query.filter_by(owner_id=int(user_id)).first()
        
        if not charity:
            charity_ns.abort(404, message='Charity not found for current user')
        
        donations = Donation.query.filter_by(charity_id=charity.id).all()
        return jsonify([donation.to_dict() for donation in donations])

