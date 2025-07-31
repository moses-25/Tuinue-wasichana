from app.services.database import db
from datetime import datetime

class Reminder(db.Model):
    __tablename__ = 'reminders'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    scheduled_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50)) # e.g., 'pending', 'sent', 'failed'

    user = db.relationship('User', backref='reminders')
    charity = db.relationship('Charity', backref='reminders')

    def __repr__(self):
        return f'<Reminder {self.id} for User {self.user_id} - {self.scheduled_time}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'charity_id': self.charity_id,
            'amount': str(self.amount),
            'scheduled_time': self.scheduled_time.isoformat(),
            'status': self.status
        }
