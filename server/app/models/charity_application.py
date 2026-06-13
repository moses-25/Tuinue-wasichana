from app.services.database import db
from datetime import datetime

class CharityApplication(db.Model):
    __tablename__ = 'charity_applications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    organization_name = db.Column(db.String(255), nullable=False)
    mission = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum('pending', 'approved', 'rejected', name='charity_status_enum'), default='pending')
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime)

    user = db.relationship('User', backref='charity_applications')

    def __repr__(self):
        return f'<CharityApplication {self.organization_name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'organization_name': self.organization_name,
            'mission': self.mission,
            'status': self.status,
            'submitted_at': self.submitted_at.isoformat(),
            'reviewed_at': self.reviewed_at.isoformat() if self.reviewed_at else None
        }
