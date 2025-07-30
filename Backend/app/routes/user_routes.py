from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from app.services.database import db
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

user_ns = Namespace('users', description='User related operations')

user_register_model = user_ns.model('UserRegister', {
    'name': fields.String(required=True, description="User's name"),
    'email': fields.String(required=True, description="User's email address"),
    'password': fields.String(required=True, description="User's password"),
    'role': fields.String(description="User's role (donor, charity, admin)", default='donor')
})

user_login_model = user_ns.model('UserLogin', {
    'email': fields.String(required=True, description="User's email address"),
    'password': fields.String(required=True, description="User's password")
})

user_response_model = user_ns.model('UserResponse', {
    'id': fields.Integer(readOnly=True, description='The unique identifier of a user'),
    'name': fields.String(required=True, description="The user's name"),
    'email': fields.String(required=True, description="The user's email address"),
    'role': fields.String(required=True, description="The user's role"),
    'created_at': fields.DateTime(readOnly=True, description="The timestamp of user creation")
})

@user_ns.route('/register')
class UserRegister(Resource):
    @user_ns.doc('register_user')
    @user_ns.expect(user_register_model)
    @user_ns.marshal_with(user_response_model, code=201)
    def post(self):
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'donor')

        if not all([name, email, password]):
            user_ns.abort(400, message='Missing name, email, or password')

        if User.query.filter_by(email=email).first():
            user_ns.abort(409, message='User with that email already exists')

        new_user = User(name=name, email=email, role=role)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        return new_user, 201

@user_ns.route('/login')
class UserLogin(Resource):
    @user_ns.doc('login_user')
    @user_ns.expect(user_login_model)
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            user_ns.abort(400, message='Missing email or password')

        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):
            access_token = create_access_token(identity=user.id)
            return {'access_token': access_token, 'user': user.to_dict()}, 200
        else:
            user_ns.abort(401, message='Invalid credentials')

@user_ns.route('/protected')
class ProtectedResource(Resource):
    @user_ns.doc('protected_resource')
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if user is None:
            user_ns.abort(404, message='User not found')
        return {'message': f'Hello {user.name}! You are {user.role}.'}, 200
