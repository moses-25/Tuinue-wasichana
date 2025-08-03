from app.services.database import db
from datetime import datetime

class Charity(db.Model):
    __tablename__ = 'charities'

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    location = db.Column(db.String(100), default='Kenya')
    category = db.Column(db.String(100), default='Health')
    goal = db.Column(db.Integer, default=10000)
    status = db.Column(db.Enum('pending', 'approved', 'rejected', name='charity_status_enum'), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    owner = db.relationship('User', backref='charities')

    def __repr__(self):
        return f'<Charity {self.name}>'

    def get_total_raised(self):
        """Calculate total amount raised from donations"""
        from app.models.donation import Donation
        total = db.session.query(db.func.sum(Donation.amount)).filter(
            Donation.charity_id == self.id,
            Donation.status == 'complete'
        ).scalar()
        return total or 0

    def get_donor_count(self):
        """Get count of unique donors"""
        from app.models.donation import Donation
        count = db.session.query(db.func.count(db.distinct(Donation.donor_id))).filter(
            Donation.charity_id == self.id,
            Donation.status == 'complete'
        ).scalar()
        return count or 0

    def to_dict(self):
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'name': self.name,
            'description': self.description,
            'location': self.location,
            'category': self.category,
            'goal': self.goal,
            'raised': self.get_total_raised(),
            'donors': self.get_donor_count(),
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }
