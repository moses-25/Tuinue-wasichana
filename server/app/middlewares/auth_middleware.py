from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.user import User

def roles_required(*roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)

            if user is None:
                return jsonify({'message': 'User not found'}), 404

            if user.role not in roles:
                return jsonify({'message': 'Access forbidden: Insufficient role'}), 403

            return fn(*args, **kwargs)
        return decorator
    return wrapper
