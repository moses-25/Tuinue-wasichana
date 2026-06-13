from flask import jsonify
from app.models.charity import Charity
from app.services.database import db

class CharityController:
    @staticmethod
    def get_all_charities(status=None):
        if status:
            charities = Charity.query.filter_by(status=status).all()
        else:
            charities = Charity.query.all()
        return jsonify([charity.to_dict() for charity in charities])

    @staticmethod
    def get_charity_by_id(charity_id):
        charity = Charity.query.get(charity_id)
        if charity:
            return jsonify(charity.to_dict())
        return jsonify({'message': 'Charity not found'}), 404

    @staticmethod
    def delete_charity(charity_id):
        charity = Charity.query.get(charity_id)
        if not charity:
            return jsonify({'message': 'Charity not found'}), 404

        db.session.delete(charity)
        db.session.commit()
        return jsonify({'message': 'Charity deleted successfully'}), 200
