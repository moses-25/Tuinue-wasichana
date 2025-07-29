from services.database import db

class Charity(db.Model):
    __tablename__ = 'charities'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime)

    user = db.relationship('User', backref=db.backref('charities', lazy=True))
