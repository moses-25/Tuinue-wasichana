from app.services.database import db
from datetime import datetime

class Donation(db.Model):
    __tablename__ = 'donations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    recurring = db.Column(db.Boolean, default=False)
    status = db.Column(db.Enum('pending', 'complete', 'failed', name='donation_status_enum'), default='pending')
    is_anonymous = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='donations')
    charity = db.relationship('Charity', backref='donations')

    def __repr__(self):
        return f'<Donation {self.id} - {self.amount}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'charity_id': self.charity_id,
            'amount': str(self.amount),
            'recurring': self.recurring,
            'status': self.status,
            'is_anonymous': self.is_anonymous,
            'timestamp': self.timestamp.isoformat()
        }
