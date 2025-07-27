from services.database import db

class CharityApplication(db.Model):
    __tablename__ = 'charity_applications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    organization_name = db.Column(db.String(255), nullable=False)
    mission = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='pending')
    submitted_at = db.Column(db.DateTime)
    reviewed_at = db.Column(db.DateTime)

    user = db.relationship('User', backref=db.backref('charity_applications', lazy=True))
