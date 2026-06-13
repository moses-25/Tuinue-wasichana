from flask import jsonify
from app.models.inventory import Inventory
from app.models.charity import Charity
from app.models.beneficiary import Beneficiary
from app.services.database import db
from datetime import datetime

class InventoryController:
    @staticmethod
    def get_all_inventory(charity_id):
        inventory_items = Inventory.query.filter_by(charity_id=charity_id).all()
        return jsonify([item.to_dict() for item in inventory_items])

    @staticmethod
    def get_inventory_item_by_id(item_id):
        item = Inventory.query.get(item_id)
        if item:
            return jsonify(item.to_dict())
        return jsonify({'message': 'Inventory item not found'}), 404

    @staticmethod
    def create_inventory_item(charity_id, item_name, quantity, beneficiary_id=None):
        charity = Charity.query.get(charity_id)
        if not charity:
            return jsonify({'message': 'Charity not found'}), 404

        if beneficiary_id:
            beneficiary = Beneficiary.query.get(beneficiary_id)
            if not beneficiary or beneficiary.charity_id != charity_id:
                return jsonify({'message': 'Beneficiary not found or does not belong to this charity'}), 404

        new_item = Inventory(
            charity_id=charity_id,
            item_name=item_name,
            quantity=quantity,
            beneficiary_id=beneficiary_id,
            distributed_at=datetime.utcnow() if beneficiary_id else None
        )
        db.session.add(new_item)
        db.session.commit()
        return jsonify({'message': 'Inventory item created successfully', 'item': new_item.to_dict()}), 201

    @staticmethod
    def update_inventory_item(item_id, item_name=None, quantity=None, beneficiary_id=None):
        item = Inventory.query.get(item_id)
        if not item:
            return jsonify({'message': 'Inventory item not found'}), 404

        if item_name: item.item_name = item_name
        if quantity: item.quantity = quantity
        if beneficiary_id is not None:
            if beneficiary_id:
                beneficiary = Beneficiary.query.get(beneficiary_id)
                if not beneficiary or beneficiary.charity_id != item.charity_id:
                    return jsonify({'message': 'Beneficiary not found or does not belong to this charity'}), 404
                item.beneficiary_id = beneficiary_id
                item.distributed_at = datetime.utcnow()
            else:
                item.beneficiary_id = None
                item.distributed_at = None

        db.session.commit()
        return jsonify({'message': 'Inventory item updated successfully', 'item': item.to_dict()})

    @staticmethod
    def delete_inventory_item(item_id):
        item = Inventory.query.get(item_id)
        if not item:
            return jsonify({'message': 'Inventory item not found'}), 404

        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Inventory item deleted successfully'}), 200
