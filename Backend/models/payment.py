from services.database import db

class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    donation_id = db.Column(db.Integer, db.ForeignKey('donations.id'), nullable=False)
    method = db.Column(db.String(50), nullable=False)
    transaction_id = db.Column(db.String(255))
    status = db.Column(db.String(20), default='pending')
    paid_at = db.Column(db.DateTime)

    donation = db.relationship('Donation', backref='payments')
