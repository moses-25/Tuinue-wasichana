from flask import jsonify
from app.models.beneficiary import Beneficiary
from app.models.charity import Charity
from app.services.database import db

class BeneficiaryController:
    @staticmethod
    def get_all_beneficiaries(charity_id):
        beneficiaries = Beneficiary.query.filter_by(charity_id=charity_id).all()
        return jsonify([b.to_dict() for b in beneficiaries])

    @staticmethod
    def get_beneficiary_by_id(beneficiary_id):
        beneficiary = Beneficiary.query.get(beneficiary_id)
        if beneficiary:
            return jsonify(beneficiary.to_dict())
        return jsonify({'message': 'Beneficiary not found'}), 404

    @staticmethod
    def create_beneficiary(charity_id, name, description):
        charity = Charity.query.get(charity_id)
        if not charity:
            return jsonify({'message': 'Charity not found'}), 404

        new_beneficiary = Beneficiary(charity_id=charity_id, name=name, description=description)
        db.session.add(new_beneficiary)
        db.session.commit()
        return jsonify({'message': 'Beneficiary created successfully', 'beneficiary': new_beneficiary.to_dict()}), 201

    @staticmethod
    def update_beneficiary(beneficiary_id, name=None, description=None, inventory_given=None):
        beneficiary = Beneficiary.query.get(beneficiary_id)
        if not beneficiary:
            return jsonify({'message': 'Beneficiary not found'}), 404

        if name: beneficiary.name = name
        if description: beneficiary.description = description
        if inventory_given is not None: beneficiary.inventory_given = inventory_given
        db.session.commit()
        return jsonify({'message': 'Beneficiary updated successfully', 'beneficiary': beneficiary.to_dict()})

    @staticmethod
    def delete_beneficiary(beneficiary_id):
        beneficiary = Beneficiary.query.get(beneficiary_id)
        if not beneficiary:
            return jsonify({'message': 'Beneficiary not found'}), 404

        db.session.delete(beneficiary)
        db.session.commit()
        return jsonify({'message': 'Beneficiary deleted successfully'}), 200
