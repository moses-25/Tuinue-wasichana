from app.services.database import db
from app.models.user import User
# Import other models as they are created

def init_db_command():
    """Clear existing data and create new tables."""
    db.drop_all()
    db.create_all()
    print("Initialized the database.")

def init_app(app):
    app.cli.add_command(app.cli.command('init-db')(init_db_command))
