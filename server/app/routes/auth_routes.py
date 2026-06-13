from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from app.services.database import db
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime

auth_ns = Namespace('auth', description='Authentication operations')

login_model = auth_ns.model('Login', {
    'email': fields.String(required=True, description="User's email address"),
    'password': fields.String(required=True, description="User's password")
})

register_model = auth_ns.model('Register', {
    'firstName': fields.String(description="Donor's first name"),
    'lastName': fields.String(description="Donor's last name"),
    'charityName': fields.String(description="Charity's name"),
    'email': fields.String(required=True, description="Email address"),
    'password': fields.String(required=True, description="Password")
})

profile_model = auth_ns.model('Profile', {
    'id': fields.Integer(readOnly=True),
    'email': fields.String,
    'role': fields.String,
    'name': fields.String,
    'created_at': fields.DateTime
})

@auth_ns.route('/login')
class Login(Resource):
    @auth_ns.expect(login_model)
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        if not all([email, password]):
            return {'success': False, 'error': 'Missing email or password'}, 400
        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            token = create_access_token(identity=str(user.id), additional_claims={'role': user.role})
            user_data = user.to_dict()
            return {
                'success': True,
                'token': token,
                'user': user_data,
                'message': 'Login successful'
            }, 200
        return {'success': False, 'error': 'Invalid credentials'}, 401

@auth_ns.route('/register')
class Register(Resource):
    @auth_ns.expect(register_model)
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        charity_name = data.get('charityName')
        if not all([email, password]):
            return {'success': False, 'error': 'Missing email or password'}, 400
        if User.query.filter_by(email=email).first():
            return {'success': False, 'error': 'User with that email already exists'}, 409
        if charity_name:
            # Register as charity
            user = User(email=email, role='charity', name=charity_name)
        else:
            # Register as donor
            full_name = f"{first_name} {last_name}".strip()
            user = User(email=email, role='donor', name=full_name)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        token = create_access_token(identity=str(user.id), additional_claims={'role': user.role})
        user_data = user.to_dict()
        return {
            'success': True,
            'user': user_data,
            'token': token,
            'message': 'Registration successful'
        }, 201

@auth_ns.route('/profile')
class Profile(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user:
            return {'success': False, 'error': 'User not found'}, 404
        user_data = user.to_dict()
        return {
            'success': True,
            'user': user_data
        }, 200
