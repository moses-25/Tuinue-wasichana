from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from app.controllers.inventory_controller import InventoryController
from app.middlewares.auth_middleware import roles_required
from flask_jwt_extended import get_jwt_identity
from app.models.charity import Charity

inventory_ns = Namespace('inventory', description='Inventory related operations')

inventory_request_model = inventory_ns.model('InventoryRequest', {
    'item_name': fields.String(required=True, description='Name of the inventory item'),
    'quantity': fields.Integer(required=True, description='Quantity of the item'),
    'beneficiary_id': fields.Integer(description='ID of the beneficiary who received the item', required=False)
})

inventory_update_model = inventory_ns.model('InventoryUpdate', {
    'item_name': fields.String(description='Name of the inventory item'),
    'quantity': fields.Integer(description='Quantity of the item'),
    'beneficiary_id': fields.Integer(description='ID of the beneficiary who received the item', required=False)
})

inventory_response_model = inventory_ns.model('InventoryResponse', {
    'id': fields.Integer(readOnly=True),
    'charity_id': fields.Integer,
    'item_name': fields.String,
    'quantity': fields.Integer,
    'distributed_at': fields.DateTime,
    'beneficiary_id': fields.Integer
})

@inventory_ns.route('/charities/<int:charity_id>/inventory')
class InventoryList(Resource):
    @inventory_ns.doc('get_charity_inventory')
    @inventory_ns.marshal_list_with(inventory_response_model)
    @roles_required('charity', 'admin')
    def get(self, charity_id):
        user_id = get_jwt_identity()
        user_charity = Charity.query.filter_by(owner_id=user_id).first()

        if user_charity and user_charity.id != charity_id:
            inventory_ns.abort(403, message='Unauthorized to view this inventory')

        return InventoryController.get_all_inventory(charity_id).json

    @inventory_ns.doc('create_inventory_item')
    @inventory_ns.expect(inventory_request_model)
    @inventory_ns.marshal_with(inventory_response_model, code=201)
    @roles_required('charity')
    def post(self, charity_id):
        user_id = get_jwt_identity()
        user_charity = Charity.query.filter_by(owner_id=user_id).first()

        if not user_charity or user_charity.id != charity_id:
            inventory_ns.abort(403, message='Unauthorized to add inventory to this charity')

        data = request.get_json()
        item_name = data.get('item_name')
        quantity = data.get('quantity')
        beneficiary_id = data.get('beneficiary_id')
        return InventoryController.create_inventory_item(charity_id, item_name, quantity, beneficiary_id).json

@inventory_ns.route('/<int:item_id>')
@inventory_ns.response(404, 'Inventory item not found')
class Inventory(Resource):
    @inventory_ns.doc('get_inventory_item')
    @inventory_ns.marshal_with(inventory_response_model)
    @roles_required('charity', 'admin')
    def get(self, item_id):
        user_id = get_jwt_identity()
        user_charity = Charity.query.filter_by(owner_id=user_id).first()
        item_response = InventoryController.get_inventory_item_by_id(item_id)
        if item_response[1] != 200:
            inventory_ns.abort(item_response[1], message=item_response[0].json['message'])
        item_data = item_response[0].json

        if user_charity and item_data and user_charity.id != item_data['charity_id']:
            inventory_ns.abort(403, message='Unauthorized to view this inventory item')

        return item_data

    @inventory_ns.doc('update_inventory_item')
    @inventory_ns.expect(inventory_update_model)
    @inventory_ns.marshal_with(inventory_response_model)
    @roles_required('charity')
    def put(self, item_id):
        user_id = get_jwt_identity()
        user_charity = Charity.query.filter_by(owner_id=user_id).first()
        item_response = InventoryController.get_inventory_item_by_id(item_id)
        if item_response[1] != 200:
            inventory_ns.abort(item_response[1], message=item_response[0].json['message'])
        item_data = item_response[0].json

        if user_charity and item_data and user_charity.id != item_data['charity_id']:
            inventory_ns.abort(403, message='Unauthorized to update this inventory item')

        data = request.get_json()
        item_name = data.get('item_name')
        quantity = data.get('quantity')
        beneficiary_id = data.get('beneficiary_id')
        return InventoryController.update_inventory_item(item_id, item_name, quantity, beneficiary_id).json

    @inventory_ns.doc('delete_inventory_item')
    @inventory_ns.response(200, 'Inventory item deleted successfully')
    @roles_required('charity')
    def delete(self, item_id):
        user_id = get_jwt_identity()
        user_charity = Charity.query.filter_by(owner_id=user_id).first()
        item_response = InventoryController.get_inventory_item_by_id(item_id)
        if item_response[1] != 200:
            inventory_ns.abort(item_response[1], message=item_response[0].json['message'])
        item_data = item_response[0].json

        if user_charity and item_data and user_charity.id != item_data['charity_id']:
            inventory_ns.abort(403, message='Unauthorized to delete this inventory item')

        return InventoryController.delete_inventory_item(item_id).json
