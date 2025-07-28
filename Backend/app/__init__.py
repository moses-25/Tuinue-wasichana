from flask import Flask, Blueprint
from app.services.database import db
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_restx import Api, Namespace

from app.routes.user_routes import user_ns
from app.routes.charity_routes import charity_ns
from app.routes.donation_routes import donation_ns
from app.routes.story_routes import story_ns
from app.routes.beneficiary_routes import beneficiary_ns
from app.routes.inventory_routes import inventory_ns
from app.routes.payment_routes import payment_ns
from app.routes.admin_routes import admin_ns
from config.config import Config

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    JWTManager(app)
    migrate.init_app(app, db)

    # Create a Blueprint for the API
    api_bp = Blueprint('api', __name__, url_prefix='/api/v1')
    api = Api(api_bp, title='Tuinue Wasichana API', version='1.0',
              description='API documentation for the Tuinue Wasichana platform')

    # Register namespaces
    # Example: api.add_namespace(user_ns, path='/users')
    # For now, we'll keep the existing blueprints registered directly to the app
    # and integrate them with Flask-RESTX later if needed.

    # Register blueprints
    api.add_namespace(user_ns, path='/users')
    api.add_namespace(charity_ns, path='/charities')
    api.add_namespace(donation_ns, path='/donations')
    api.add_namespace(story_ns, path='/stories')
    api.add_namespace(beneficiary_ns, path='/beneficiaries')
    api.add_namespace(inventory_ns, path='/inventory')
    api.add_namespace(payment_ns, path='/payments')
    api.add_namespace(admin_ns, path='/admin')

    # Register the API blueprint
    app.register_blueprint(api_bp)

    return app
