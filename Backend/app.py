from flask import Flask
from services.database import init_db

def create_app():
    app = Flask(__name__)
    
    # Initialize DB
    init_db(app)
    
    # Optionally register routes/blueprints
    # from routes.user_routes import user_bp
    # app.register_blueprint(user_bp)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
