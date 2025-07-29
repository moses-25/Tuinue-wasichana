from services.database import db

class Beneficiary(db.Model):
    __tablename__ = 'beneficiaries'

    id = db.Column(db.Integer, primary_key=True)
    charity_id = db.Column(db.Integer, db.ForeignKey('charities.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    age = db.Column(db.Integer)
    school = db.Column(db.String(255))
    received_support = db.Column(db.Boolean, default=False)
    received_at = db.Column(db.DateTime)

    charity = db.relationship('Charity', backref='beneficiaries')
