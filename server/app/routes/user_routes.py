from flask import request
from flask_restx import Namespace, Resource
from app.services.database import db
from app.models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.middlewares.auth_middleware import roles_required

user_ns = Namespace('users', description='User related operations')

@user_ns.route('/')
class UserList(Resource):
    @jwt_required()
    @roles_required('admin')
    def get(self):
        users = User.query.all()
        return {
            'success': True,
            'users': [u.to_dict() for u in users],
            'message': 'Users retrieved successfully.'
        }, 200

@user_ns.route('/<int:user_id>')
class UserDetail(Resource):
    @jwt_required()
    def get(self, user_id):
        current_user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or (user.id != int(current_user_id) and not User.query.get(int(current_user_id)).role == 'admin'):
            return {'success': False, 'error': 'User not found or unauthorized.'}, 404
        return {
            'success': True,
            'user': user.to_dict(),
            'message': 'User details retrieved.'
        }, 200
    @jwt_required()
    def put(self, user_id):
        current_user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or (user.id != int(current_user_id) and not User.query.get(int(current_user_id)).role == 'admin'):
            return {'success': False, 'error': 'User not found or unauthorized.'}, 404
        data = request.get_json()
        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)
        db.session.commit()
        return {
            'success': True,
            'user': user.to_dict(),
            'message': 'User updated.'
        }, 200
    @jwt_required()
    @roles_required('admin')
    def delete(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {'success': False, 'error': 'User not found.'}, 404
        db.session.delete(user)
        db.session.commit()
        return {
            'success': True,
            'message': 'User deleted.'
        }, 200

@user_ns.route('/analytics')
class UserAnalytics(Resource):
    @jwt_required()
    @roles_required('admin')
    def get(self):
        # Stub for analytics
        return {
            'success': True,
            'analytics': {},
            'message': 'Analytics data.'
        }, 200
