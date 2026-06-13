import pytest
import json

def test_get_charity_inventory(client, auth_headers_charity, approved_charity, app):
    """Test getting inventory for a charity"""
    # Create an inventory item first
    with app.app_context():
        from app.models.inventory import Inventory
        from app.services.database import db
        
        inventory_item = Inventory(
            charity_id=approved_charity.id,
            item_name='School Books',
            quantity=50
        )
        db.session.add(inventory_item)
        db.session.commit()
    
    response = client.get(f'/api/v1/inventory/charities/{approved_charity.id}/inventory',
        headers=auth_headers_charity
    )
    
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]['item_name'] == 'School Books'
    assert data[0]['quantity'] == 50

def test_create_inventory_item_success(client, auth_headers_charity, approved_charity):
    """Test successful inventory item creation"""
    response = client.post(f'/api/v1/inventory/charities/{approved_charity.id}/inventory',
        headers=auth_headers_charity,
        json={
            'item_name': 'Notebooks',
            'quantity': 100
        }
    )
    
    assert response.status_code == 201
    data = response.get_json()
    assert data['item']['item_name'] == 'Notebooks'
    assert data['item']['quantity'] == 100

def test_create_inventory_item_with_beneficiary(client, auth_headers_charity, approved_charity, app):
    """Test creating inventory item with beneficiary assignment"""
    # Create a beneficiary first
    with app.app_context():
        from app.models.beneficiary import Beneficiary
        from app.services.database import db
        
        beneficiary = Beneficiary(
            charity_id=approved_charity.id,
            name='John Doe',
            description='Student'
        )
        db.session.add(beneficiary)
        db.session.commit()
        beneficiary_id = beneficiary.id
    
    response = client.post(f'/api/v1/inventory/charities/{approved_charity.id}/inventory',
        headers=auth_headers_charity,
        json={
            'item_name': 'School Uniform',
            'quantity': 1,
            'beneficiary_id': beneficiary_id
        }
    )
    
    assert response.status_code == 201
    data = response.get_json()
    assert data['item']['item_name'] == 'School Uniform'
    assert data['item']['beneficiary_id'] == beneficiary_id
    assert data['item']['distributed_at'] is not None

def test_create_inventory_item_invalid_beneficiary(client, auth_headers_charity, approved_charity):
    """Test creating inventory item with invalid beneficiary"""
    response = client.post(f'/api/v1/inventory/charities/{approved_charity.id}/inventory',
        headers=auth_headers_charity,
        json={
            'item_name': 'School Uniform',
            'quantity': 1,
            'beneficiary_id': 999  # Non-existent beneficiary
        }
    )
    
    assert response.status_code == 404

def test_create_inventory_item_unauthorized(client, auth_headers_donor, approved_charity):
    """Test creating inventory item without proper authorization"""
    response = client.post(f'/api/v1/inventory/charities/{approved_charity.id}/inventory',
        headers=auth_headers_donor,
        json={
            'item_name': 'Notebooks',
            'quantity': 100
        }
    )
    
    assert response.status_code == 403

def test_create_inventory_item_missing_fields(client, auth_headers_charity, approved_charity):
    """Test creating inventory item with missing required fields"""
    response = client.post(f'/api/v1/inventory/charities/{approved_charity.id}/inventory',
        headers=auth_headers_charity,
        json={
            'item_name': 'Notebooks'
            # Missing quantity
        }
    )
    
    assert response.status_code == 400

def test_get_inventory_item_by_id(client, auth_headers_charity, approved_charity, app):
    """Test getting specific inventory item by ID"""
    # Create an inventory item first
    with app.app_context():
        from app.models.inventory import Inventory
        from app.services.database import db
        
        inventory_item = Inventory(
            charity_id=approved_charity.id,
            item_name='Pencils',
            quantity=200
        )
        db.session.add(inventory_item)
        db.session.commit()
        item_id = inventory_item.id
    
    response = client.get(f'/api/v1/inventory/{item_id}',
        headers=auth_headers_charity
    )
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['item_name'] == 'Pencils'
    assert data['quantity'] == 200

def test_get_inventory_item_not_found(client, auth_headers_charity):
    """Test getting non-existent inventory item"""
    response = client.get('/api/v1/inventory/999', headers=auth_headers_charity)
    assert response.status_code == 404

def test_update_inventory_item_success(client, auth_headers_charity, approved_charity, app):
    """Test successful inventory item update"""
    # Create an inventory item first
    with app.app_context():
        from app.models.inventory import Inventory
        from app.services.database import db
        
        inventory_item = Inventory(
            charity_id=approved_charity.id,
            item_name='Old Item',
            quantity=10
        )
        db.session.add(inventory_item)
        db.session.commit()
        item_id = inventory_item.id
    
    response = client.put(f'/api/v1/inventory/{item_id}',
        headers=auth_headers_charity,
        json={
            'item_name': 'Updated Item',
            'quantity': 20
        }
    )
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['item']['item_name'] == 'Updated Item'
    assert data['item']['quantity'] == 20

def test_update_inventory_item_assign_beneficiary(client, auth_headers_charity, approved_charity, app):
    """Test updating inventory item to assign to beneficiary"""
    # Create inventory item and beneficiary
    with app.app_context():
        from app.models.inventory import Inventory
        from app.models.beneficiary import Beneficiary
        from app.services.database import db
        
        inventory_item = Inventory(
            charity_id=approved_charity.id,
            item_name='School Bag',
            quantity=1
        )
        db.session.add(inventory_item)
        
        beneficiary = Beneficiary(
            charity_id=approved_charity.id,
            name='Jane Doe',
            description='Student'
        )
        db.session.add(beneficiary)
        db.session.commit()
        
        item_id = inventory_item.id
        beneficiary_id = beneficiary.id
    
    response = client.put(f'/api/v1/inventory/{item_id}',
        headers=auth_headers_charity,
        json={
            'beneficiary_id': beneficiary_id
        }
    )
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['item']['beneficiary_id'] == beneficiary_id
    assert data['item']['distributed_at'] is not None

def test_delete_inventory_item_success(client, auth_headers_charity, approved_charity, app):
    """Test successful inventory item deletion"""
    # Create an inventory item first
    with app.app_context():
        from app.models.inventory import Inventory
        from app.services.database import db
        
        inventory_item = Inventory(
            charity_id=approved_charity.id,
            item_name='To Delete',
            quantity=5
        )
        db.session.add(inventory_item)
        db.session.commit()
        item_id = inventory_item.id
    
    response = client.delete(f'/api/v1/inventory/{item_id}',
        headers=auth_headers_charity
    )
    
    assert response.status_code == 200
    data = response.get_json()
    assert 'Inventory item deleted successfully' in data['message']

def test_unauthorized_inventory_access(client):
    """Test accessing inventory endpoints without authentication"""
    response = client.get('/api/v1/inventory/charities/1/inventory')
    assert response.status_code == 401