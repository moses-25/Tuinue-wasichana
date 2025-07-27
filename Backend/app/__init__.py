from flask import Flask
from app.services.database import db
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from app.routes.user_routes import user_bp
from app.routes.charity_routes import charity_bp
from app.routes.donation_routes import donation_bp
from config.config import Config

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    JWTManager(app)
    migrate.init_app(app, db)

    # Register blueprints
    app.register_blueprint(user_bp, url_prefix='/api/v1/users')
    app.register_blueprint(charity_bp, url_prefix='/api/v1/charities')
    app.register_blueprint(donation_bp, url_prefix='/api/v1/donations')

    return app
