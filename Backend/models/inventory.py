from services.database import db

class Inventory(db.Model):
    __tablename__ = 'inventory'

    id = db.Column(db.Integer, primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'), nullable=False)
    item_name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    distributed_at = db.Column(db.DateTime)
    beneficiary_id = db.Column(db.Integer, db.ForeignKey('beneficiaries.id'))

    charity = db.relationship('Charity', backref='inventory')
    beneficiary = db.relationship('Beneficiary', backref='inventory')
