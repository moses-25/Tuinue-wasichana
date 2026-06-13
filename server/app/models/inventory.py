from app.services.database import db
from datetime import datetime

class Inventory(db.Model):
    __tablename__ = 'inventory'

    id = db.Column(db.Integer, primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'), nullable=False)
    item_name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    distributed_at = db.Column(db.DateTime)
    beneficiary_id = db.Column(db.Integer, db.ForeignKey('beneficiaries.id'), nullable=True)

    charity = db.relationship('Charity', backref='inventory_items')
    beneficiary = db.relationship('Beneficiary', backref='received_inventory')

    def __repr__(self):
        return f'<Inventory {self.item_name} - {self.quantity}>'

    def to_dict(self):
        return {
            'id': self.id,
            'charity_id': self.charity_id,
            'item_name': self.item_name,
            'quantity': self.quantity,
            'distributed_at': self.distributed_at.isoformat() if self.distributed_at else None,
            'beneficiary_id': self.beneficiary_id
        }
