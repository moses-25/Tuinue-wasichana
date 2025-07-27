from app.services.database import db
from app.models.user import User
from app.models.charity import Charity
from app.models.charity_application import CharityApplication
from app.models.donation import Donation
from app.models.payment import Payment

def init_db_command():
    """Clear existing data and create new tables."""
    db.drop_all()
    db.create_all()
    print("Initialized the database.")

def init_app(app):
    app.cli.add_command(app.cli.command('init-db')(init_db_command))
