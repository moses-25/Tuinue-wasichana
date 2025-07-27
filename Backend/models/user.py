from services.database import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    is_anonymous = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime)

    charities = db.relationship('Charity', backref='user', lazy=True)
    charity_applications = db.relationship('CharityApplication', backref='user', lazy=True)
    donations = db.relationship('Donation', backref='donor', lazy=True)
