from flask import Blueprint, request, jsonify
from app.services.database import db
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'donor') # Default role to donor

    if not all([name, email, password]):
        return jsonify({'message': 'Missing name, email, or password'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User with that email already exists'}), 409

    new_user = User(name=name, email=email, role=role)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully', 'user': new_user.to_dict()}), 201

@user_bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'message': 'Missing email or password'}), 400

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token, user=user.to_dict()), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@user_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({'message': f'Hello {user.name}! You are {user.role}.'}), 200
