from app.services.database import db

class Beneficiary(db.Model):
    __tablename__ = 'beneficiaries'

    id = db.Column(db.Integer, primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    inventory_given = db.Column(db.Boolean, default=False)

    charity = db.relationship('Charity', backref='beneficiaries')

    def __repr__(self):
        return f'<Beneficiary {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'charity_id': self.charity_id,
            'name': self.name,
            'description': self.description,
            'inventory_given': self.inventory_given
        }
