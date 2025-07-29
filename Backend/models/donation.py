from services.database import db

class Donation(db.Model):
    __tablename__ = 'donations'

    id = db.Column(db.Integer, primary_key=True)
    donor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    frequency = db.Column(db.String(20), default='one-time')
    status = db.Column(db.String(20), default='pending')
    is_anonymous = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime)

    donor = db.relationship('User', backref=db.backref('donations', lazy=True))
    charity = db.relationship('Charity', backref='donations')
