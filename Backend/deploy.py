#!/usr/bin/env python3
"""
Deployment script for Tuinue Wasichana API
"""
import os
import sys

def deploy():
    """Run deployment tasks"""
    try:
        # Import here to avoid circular imports
        from app import create_app
        from app.services.database import db
        
        app = create_app()
        
        with app.app_context():
            # Create database tables
            print("Creating database tables...")
            db.create_all()
            
            # Run database migrations if available
            print("Running database migrations...")
            try:
                from flask_migrate import upgrade
                upgrade()
                print("✅ Database migrations completed successfully")
            except Exception as e:
                print(f"⚠️  Migration warning: {e}")
                # Continue deployment even if migrations fail
            
            # Create default admin user if it doesn't exist
            print("Checking for admin user...")
            from app.models.user import User
            
            admin_email = os.getenv('ADMIN_EMAIL', 'admin@tuinuewasichana.com')
            admin_password = os.getenv('ADMIN_PASSWORD', 'admin123')
            
            admin_user = User.query.filter_by(email=admin_email).first()
            if not admin_user:
                print(f"Creating default admin user: {admin_email}")
                admin_user = User(
                    name='System Administrator',
                    email=admin_email,
                    role='admin'
                )
                admin_user.set_password(admin_password)
                db.session.add(admin_user)
                db.session.commit()
                print("✅ Default admin user created")
            else:
                print("✅ Admin user already exists")
            
            print("🚀 Deployment completed successfully!")
            
    except Exception as e:
        print(f"❌ Deployment failed: {e}")
        sys.exit(1)

if __name__ == '__main__':
    deploy()