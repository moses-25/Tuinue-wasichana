from app.services.database import db
from datetime import datetime

class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    donation_id = db.Column(db.Integer, db.ForeignKey('donations.id'), nullable=False)
    method = db.Column(db.Enum('mpesa', name='payment_method_enum'), nullable=False)
    transaction_id = db.Column(db.String(255), nullable=False)
    status = db.Column(db.Enum('success', 'failed', name='payment_status_enum'), nullable=False)
    paid_at = db.Column(db.DateTime, default=datetime.utcnow)

    donation = db.relationship('Donation', backref='payments')

    def __repr__(self):
        return f'<Payment {self.id} - {self.transaction_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'donation_id': self.donation_id,
            'method': self.method,
            'transaction_id': self.transaction_id,
            'status': self.status,
            'paid_at': self.paid_at.isoformat()
        }
