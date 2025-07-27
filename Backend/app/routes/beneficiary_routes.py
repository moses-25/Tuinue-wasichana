from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from app.controllers.beneficiary_controller import BeneficiaryController
from app.middlewares.auth_middleware import roles_required
from flask_jwt_extended import get_jwt_identity
from app.models.charity import Charity

beneficiary_ns = Namespace('beneficiaries', description='Beneficiary related operations')

beneficiary_request_model = beneficiary_ns.model('BeneficiaryRequest', {
    'name': fields.String(required=True, description="Beneficiary's name"),
    'description': fields.String(description="Beneficiary's description")
})

beneficiary_update_model = beneficiary_ns.model('BeneficiaryUpdate', {
    'name': fields.String(description="Beneficiary's name"),
    'description': fields.String(description="Beneficiary's description"),
    'inventory_given': fields.Boolean(description='Whether inventory has been given')
})

beneficiary_response_model = beneficiary_ns.model('BeneficiaryResponse', {
    'id': fields.Integer(readOnly=True),
    'charity_id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'inventory_given': fields.Boolean
})

@beneficiary_ns.route('/charities/<int:charity_id>/beneficiaries')
class BeneficiaryList(Resource):
    @beneficiary_ns.doc('get_charity_beneficiaries')
    @beneficiary_ns.marshal_list_with(beneficiary_response_model)
    @roles_required('charity', 'admin')
    def get(self, charity_id):
        user_id = get_jwt_identity()
        user_charity = Charity.query.filter_by(owner_id=user_id).first()

        if user_charity and user_charity.id != charity_id:
            beneficiary_ns.abort(403, message='Unauthorized to view these beneficiaries')

        return BeneficiaryController.get_all_beneficiaries(charity_id).json

    @beneficiary_ns.doc('create_beneficiary')
    @beneficiary_ns.expect(beneficiary_request_model)
    @beneficiary_ns.marshal_with(beneficiary_response_model, code=201)
    @roles_required('charity')
    def post(self, charity_id):
        user_id = get_jwt_identity()
        user_charity = Charity.query.filter_by(owner_id=user_id).first()

        if not user_charity or user_charity.id != charity_id:
            beneficiary_ns.abort(403, message='Unauthorized to add beneficiary to this charity')

        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        return BeneficiaryController.create_beneficiary(charity_id, name, description).json

@beneficiary_ns.route('/<int:beneficiary_id>')
@beneficiary_ns.response(404, 'Beneficiary not found')
class Beneficiary(Resource):
    @beneficiary_ns.doc('get_beneficiary')
    @beneficiary_ns.marshal_with(beneficiary_response_model)
    @roles_required('charity', 'admin')
    def get(self, beneficiary_id):
        user_id = get_jwt_identity()
        user_charity = Charity.query.filter_by(owner_id=user_id).first()
        beneficiary_response = BeneficiaryController.get_beneficiary_by_id(beneficiary_id)
        if beneficiary_response[1] != 200:
            beneficiary_ns.abort(beneficiary_response[1], message=beneficiary_response[0].json['message'])
        beneficiary_data = beneficiary_response[0].json

        if user_charity and beneficiary_data and user_charity.id != beneficiary_data['charity_id']:
            beneficiary_ns.abort(403, message='Unauthorized to view this beneficiary')

        return beneficiary_data

    @beneficiary_ns.doc('update_beneficiary')
    @beneficiary_ns.expect(beneficiary_update_model)
    @beneficiary_ns.marshal_with(beneficiary_response_model)
    @roles_required('charity')
    def put(self, beneficiary_id):
        user_id = get_jwt_identity()
        user_charity = Charity.query.filter_by(owner_id=user_id).first()
        beneficiary_response = BeneficiaryController.get_beneficiary_by_id(beneficiary_id)
        if beneficiary_response[1] != 200:
            beneficiary_ns.abort(beneficiary_response[1], message=beneficiary_response[0].json['message'])
        beneficiary_data = beneficiary_response[0].json

        if user_charity and beneficiary_data and user_charity.id != beneficiary_data['charity_id']:
            beneficiary_ns.abort(403, message='Unauthorized to update this beneficiary')

        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        inventory_given = data.get('inventory_given')
        return BeneficiaryController.update_beneficiary(beneficiary_id, name, description, inventory_given).json

    @beneficiary_ns.doc('delete_beneficiary')
    @beneficiary_ns.response(200, 'Beneficiary deleted successfully')
    @roles_required('charity')
    def delete(self, beneficiary_id):
        user_id = get_jwt_identity()
        user_charity = Charity.query.filter_by(owner_id=user_id).first()
        beneficiary_response = BeneficiaryController.get_beneficiary_by_id(beneficiary_id)
        if beneficiary_response[1] != 200:
            beneficiary_ns.abort(beneficiary_response[1], message=beneficiary_response[0].json['message'])
        beneficiary_data = beneficiary_response[0].json

        if user_charity and beneficiary_data and user_charity.id != beneficiary_data['charity_id']:
            beneficiary_ns.abort(403, message='Unauthorized to delete this beneficiary')

        return BeneficiaryController.delete_beneficiary(beneficiary_id).json
