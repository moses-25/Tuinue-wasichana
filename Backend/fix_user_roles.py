#!/usr/bin/env python3
"""
Migration script to fix user roles in the database.
This script converts users with 'charity' role back to 'donor' role
so they can use the new dual-functionality system.
"""

import os
import sys
from flask import Flask
from app.services.database import db
from app.models.user import User
from app.models.charity import Charity

def create_app():
    """Create Flask app for migration"""
    app = Flask(__name__)
    
    # Database configuration
    database_url = os.environ.get('DATABASE_URL')
    if database_url and database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url or 'sqlite:///./charity_platform.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    return app

def fix_user_roles():
    """Fix user roles to support new dual-functionality system"""
    app = create_app()
    
    with app.app_context():
        try:
            # Find all users with 'charity' role
            charity_users = User.query.filter_by(role='charity').all()
            
            print(f"Found {len(charity_users)} users with 'charity' role")
            
            for user in charity_users:
                print(f"Converting user {user.email} from 'charity' to 'donor' role")
                
                # Check if this user owns any charities
                owned_charities = Charity.query.filter_by(owner_id=user.id).all()
                print(f"  - User owns {len(owned_charities)} charities")
                
                # Change role to donor
                user.role = 'donor'
                
            # Commit all changes
            db.session.commit()
            print(f"Successfully converted {len(charity_users)} users to 'donor' role")
            print("Users can now both donate and manage charities!")
            
        except Exception as e:
            print(f"Error during migration: {e}")
            db.session.rollback()
            sys.exit(1)

if __name__ == '__main__':
    print("Starting user role migration...")
    fix_user_roles()
    print("Migration completed successfully!")