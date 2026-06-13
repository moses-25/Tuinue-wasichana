from app.services.database import db
from datetime import datetime

class Story(db.Model):
    __tablename__ = 'stories'

    id = db.Column(db.Integer, primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    charity = db.relationship('Charity', backref='stories')

    def __repr__(self):
        return f'<Story {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'charity_id': self.charity_id,
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at.isoformat()
        }
