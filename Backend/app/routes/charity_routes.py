from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from app.services.database import db
from datetime import datetime
from app.models.charity_application import CharityApplication
from app.models.charity import Charity
from app.models.user import User
from app.middlewares.auth_middleware import roles_required
from flask_jwt_extended import get_jwt_identity
from app.controllers.charity_controller import CharityController

charity_ns = Namespace('charities', description='Charity related operations')

charity_application_model = charity_ns.model('CharityApplication', {
    'organization_name': fields.String(required=True, description='Organization name'),
    'mission': fields.String(required=True, description='Mission statement')
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
        user = User.query.get(user_id)

        if user.role != 'donor':
            charity_ns.abort(403, message='Only users with donor role can apply for charity')

        data = request.get_json()
        organization_name = data.get('organization_name')
        mission = data.get('mission')

        if not all([organization_name, mission]):
            charity_ns.abort(400, message='Missing organization name or mission')

        existing_application = CharityApplication.query.filter_by(user_id=user_id).first()
        if existing_application:
            charity_ns.abort(409, message=f'You have already submitted a charity application. Current status: {existing_application.status}')

        new_application = CharityApplication(
            user_id=user_id,
            organization_name=organization_name,
            mission=mission
        )

        db.session.add(new_application)
        db.session.commit()

        return new_application, 201

@charity_ns.route('/applications')
class CharityApplicationList(Resource):
    @charity_ns.doc('get_all_applications')
    @charity_ns.marshal_list_with(charity_application_response_model)
    @roles_required('admin')
    def get(self):
        applications = CharityApplication.query.all()
        return applications

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
            status='approved'
        )

        db.session.add(new_charity)
        db.session.commit()

        user = User.query.get(application.user_id)
        if user:
            user.role = 'charity'
            db.session.commit()

        return application

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

        return application

@charity_ns.route('/admin/charities')
class AdminCharityList(Resource):
    @charity_ns.doc('admin_get_all_charities')
    @charity_ns.param('status', 'Filter by charity status (pending, approved, rejected)')
    @charity_ns.marshal_list_with(charity_response_model)
    @roles_required('admin')
    def get(self):
        status = request.args.get('status')
        return CharityController.get_all_charities(status).json # .json to extract data from jsonify response

@charity_ns.route('/admin/charities/<int:charity_id>')
class AdminCharity(Resource):
    @charity_ns.doc('admin_delete_charity')
    @charity_ns.response(200, 'Charity deleted successfully')
    @charity_ns.response(404, 'Charity not found')
    @roles_required('admin')
    def delete(self, charity_id):
        return CharityController.delete_charity(charity_id)

