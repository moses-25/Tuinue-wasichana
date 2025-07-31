#!/usr/bin/env python3
"""
Script to create an admin user for the Tuinue Wasichana platform.
Run this script to create an admin account that can access the admin dashboard.
"""

import os
import sys
from getpass import getpass

# Add the Backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.services.database import db
from app.models.user import User

def create_admin_user():
    """Create an admin user interactively."""
    
    # Create Flask app context
    app = create_app()
    
    with app.app_context():
        print("=== Tuinue Wasichana Admin User Creation ===\n")
        
        # Get admin details
        print("Enter admin user details:")
        name = input("Full Name: ").strip()
        email = input("Email: ").strip()
        
        # Validate email
        if not email or '@' not in email:
            print("❌ Invalid email address!")
            return False
            
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            print(f"❌ User with email '{email}' already exists!")
            
            # Ask if they want to make existing user an admin
            make_admin = input("Do you want to make this user an admin? (y/N): ").strip().lower()
            if make_admin == 'y':
                existing_user.role = 'admin'
                db.session.commit()
                print(f"✅ User '{email}' is now an admin!")
                return True
            else:
                return False
        
        # Get password
        while True:
            password = getpass("Password (min 8 characters): ")
            if len(password) < 8:
                print("❌ Password must be at least 8 characters long!")
                continue
            
            confirm_password = getpass("Confirm Password: ")
            if password != confirm_password:
                print("❌ Passwords don't match!")
                continue
            break
        
        try:
            # Create admin user
            admin_user = User(
                name=name,
                email=email,
                role='admin'
            )
            admin_user.set_password(password)
            
            # Add to database
            db.session.add(admin_user)
            db.session.commit()
            
            print(f"\n✅ Admin user created successfully!")
            print(f"📧 Email: {email}")
            print(f"👤 Name: {name}")
            print(f"🔑 Role: admin")
            print(f"\n🚀 You can now login to the admin dashboard at: /admin")
            
            return True
            
        except Exception as e:
            print(f"❌ Error creating admin user: {e}")
            db.session.rollback()
            return False

def list_existing_users():
    """List all existing users in the database."""
    app = create_app()
    
    with app.app_context():
        users = User.query.all()
        
        if not users:
            print("No users found in the database.")
            return
        
        print("\n=== Existing Users ===")
        print(f"{'ID':<5} {'Name':<20} {'Email':<30} {'Role':<10}")
        print("-" * 70)
        
        for user in users:
            print(f"{user.id:<5} {user.name:<20} {user.email:<30} {user.role:<10}")

def main():
    """Main function with menu options."""
    while True:
        print("\n=== Tuinue Wasichana Admin Management ===")
        print("1. Create new admin user")
        print("2. List existing users")
        print("3. Exit")
        
        choice = input("\nSelect an option (1-3): ").strip()
        
        if choice == '1':
            create_admin_user()
        elif choice == '2':
            list_existing_users()
        elif choice == '3':
            print("Goodbye! 👋")
            break
        else:
            print("❌ Invalid choice. Please select 1, 2, or 3.")

if __name__ == '__main__':
    main()