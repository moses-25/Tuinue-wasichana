#!/usr/bin/env python3
"""
Create admin user from environment variables.
Useful for production deployments.

Set these environment variables:
- ADMIN_NAME: Full name of admin user
- ADMIN_EMAIL: Email address for admin
- ADMIN_PASSWORD: Password for admin user
"""

import os
import sys

# Add the Backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.services.database import db
from app.models.user import User

def create_admin_from_env():
    """Create admin user from environment variables."""
    
    # Get environment variables
    admin_name = os.getenv('ADMIN_NAME')
    admin_email = os.getenv('ADMIN_EMAIL')
    admin_password = os.getenv('ADMIN_PASSWORD')
    
    # Validate environment variables
    if not all([admin_name, admin_email, admin_password]):
        print("❌ Missing environment variables!")
        print("Required: ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD")
        return False
    
    # Create Flask app context
    app = create_app()
    
    with app.app_context():
        # Check if admin already exists
        existing_admin = User.query.filter_by(email=admin_email).first()
        if existing_admin:
            print(f"✅ Admin user already exists: {admin_email}")
            # Update role to admin if not already
            if existing_admin.role != 'admin':
                existing_admin.role = 'admin'
                db.session.commit()
                print(f"✅ Updated user role to admin")
            return True
        
        try:
            # Create admin user
            admin_user = User(
                name=admin_name,
                email=admin_email,
                role='admin'
            )
            admin_user.set_password(admin_password)
            
            # Add to database
            db.session.add(admin_user)
            db.session.commit()
            
            print(f"✅ Admin user created successfully!")
            print(f"📧 Email: {admin_email}")
            print(f"👤 Name: {admin_name}")
            print(f"🔑 Role: admin")
            
            return True
            
        except Exception as e:
            print(f"❌ Error creating admin user: {e}")
            db.session.rollback()
            return False

if __name__ == '__main__':
    create_admin_from_env()