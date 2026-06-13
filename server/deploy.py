#!/usr/bin/env python3
"""
Deployment script for Tuinue Wasichana API
Handles database initialization and admin user creation during deployment.
"""
import os
import sys
from datetime import datetime

def create_admin_user(db, User):
    """Create admin user from environment variables."""
    
    # Check if admin creation is enabled
    create_admin = os.getenv('CREATE_ADMIN_ON_DEPLOY', 'false').lower() == 'true'
    if not create_admin:
        print("⏭️  Admin user creation disabled (CREATE_ADMIN_ON_DEPLOY=false)")
        return
    
    # Get admin details from environment variables
    admin_name = os.getenv('ADMIN_NAME', 'Tuinue Wasichana Admin')
    admin_email = os.getenv('ADMIN_EMAIL', 'admin@tuinuewasichana.org')
    admin_password = os.getenv('ADMIN_PASSWORD', 'TuinueAdmin2024!')
    
    print(f"🔍 Checking for admin user: {admin_email}")
    
    # Check if admin user already exists
    existing_admin = User.query.filter_by(email=admin_email).first()
    
    if existing_admin:
        print(f"✅ Admin user already exists: {admin_email}")
        
        # Ensure the user has admin role
        if existing_admin.role != 'admin':
            print(f"🔄 Updating user role to admin...")
            existing_admin.role = 'admin'
            db.session.commit()
            print(f"✅ User role updated to admin")
        
        return existing_admin
    
    try:
        # Create new admin user
        print(f"👤 Creating admin user: {admin_email}")
        
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
        print(f"   📧 Email: {admin_email}")
        print(f"   👤 Name: {admin_name}")
        print(f"   🔑 Role: admin")
        
        return admin_user
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.session.rollback()
        raise

def initialize_database(app, db):
    """Initialize database tables and run migrations."""
    
    print("🗄️  Initializing database...")
    
    try:
        # Create all database tables
        print("📋 Creating database tables...")
        db.create_all()
        print("✅ Database tables created successfully")
        
        # Run database migrations if available
        print("🔄 Running database migrations...")
        try:
            from flask_migrate import upgrade
            upgrade()
            print("✅ Database migrations completed successfully")
        except ImportError:
            print("⚠️  Flask-Migrate not available, skipping migrations")
        except Exception as e:
            print(f"⚠️  Migration warning: {e}")
            # Continue deployment even if migrations fail
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        raise

def deploy():
    """Run all deployment tasks."""
    
    print("🚀 Starting Tuinue Wasichana API deployment...")
    print(f"⏰ Deployment started at: {datetime.now().isoformat()}")
    print(f"🌍 Environment: {os.getenv('FLASK_ENV', 'development')}")
    
    try:
        # Import Flask app and database
        print("📦 Loading application...")
        from app import create_app
        from app.services.database import db
        from app.models.user import User
        
        # Create Flask application
        app = create_app()
        
        with app.app_context():
            # Initialize database
            initialize_database(app, db)
            
            # Create admin user
            create_admin_user(db, User)
            
            # Print deployment summary
            print("\n" + "="*50)
            print("🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!")
            print("="*50)
            print(f"🌐 API URL: {os.getenv('RENDER_EXTERNAL_URL', 'https://your-app.onrender.com')}")
            print(f"👤 Admin Email: {os.getenv('ADMIN_EMAIL', 'admin@tuinuewasichana.org')}")
            print(f"🔐 Admin Password: {'*' * len(os.getenv('ADMIN_PASSWORD', ''))}")
            print("📱 Frontend: Connect your React app to this API")
            print("🔧 Admin Dashboard: Login with admin credentials")
            print("="*50)
            
    except Exception as e:
        print(f"\n❌ DEPLOYMENT FAILED: {e}")
        print("💡 Check the logs above for more details")
        sys.exit(1)

def main():
    """Main entry point."""
    if len(sys.argv) > 1 and sys.argv[1] == '--help':
        print("""
Tuinue Wasichana API Deployment Script

This script handles:
- Database table creation
- Database migrations
- Admin user creation (if enabled)

Environment Variables:
- CREATE_ADMIN_ON_DEPLOY: Set to 'true' to create admin user
- ADMIN_NAME: Full name for admin user
- ADMIN_EMAIL: Email address for admin user  
- ADMIN_PASSWORD: Password for admin user

Usage:
    python deploy.py           # Run full deployment
    python deploy.py --help    # Show this help
        """)
        return
    
    deploy()

if __name__ == '__main__':
    main()