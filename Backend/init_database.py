#!/usr/bin/env python3
"""
Robust database initialization script for Render deployment
Handles connection retries, table creation, and initial data setup
"""

import os
import sys
import time
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError, DatabaseError
import psycopg2
from psycopg2 import OperationalError as PsycopgError

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def wait_for_database(database_url, max_retries=30, delay=5):
    """
    Wait for database to become available with exponential backoff
    """
    logger.info("Waiting for database to become available...")
    
    for attempt in range(max_retries):
        try:
            # Try to connect using psycopg2 first (lighter weight)
            conn = psycopg2.connect(database_url)
            conn.close()
            logger.info("Database connection successful!")
            return True
            
        except (PsycopgError, Exception) as e:
            if attempt < max_retries - 1:
                wait_time = min(delay * (2 ** attempt), 60)  # Exponential backoff, max 60s
                logger.warning(f"Database not ready (attempt {attempt + 1}/{max_retries}): {e}")
                logger.info(f"Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
            else:
                logger.error(f"Failed to connect to database after {max_retries} attempts")
                return False
    
    return False

def get_database_url():
    """
    Get database URL with fallback options
    """
    # Primary database URL
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        logger.error("DATABASE_URL environment variable not set")
        return None
    
    # Handle Render's postgres:// URL format
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
        logger.info("Converted postgres:// to postgresql:// format")
    
    return database_url

def create_tables_with_sqlalchemy(database_url):
    """
    Create tables using SQLAlchemy with the app models
    """
    try:
        # Import Flask app and models
        sys.path.append(os.path.dirname(os.path.abspath(__file__)))
        from app import create_app
        from app.services.database import db
        
        # Create Flask app
        app = create_app()
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
        
        with app.app_context():
            logger.info("Creating database tables...")
            db.create_all()
            logger.info("Database tables created successfully!")
            return True
            
    except Exception as e:
        logger.error(f"Failed to create tables with SQLAlchemy: {e}")
        return False

def create_tables_with_sql(database_url):
    """
    Fallback: Create tables using raw SQL with enum handling
    """
    try:
        engine = create_engine(database_url)
        
        # Read schema.sql file
        schema_file = os.path.join(os.path.dirname(__file__), 'schema.sql')
        if not os.path.exists(schema_file):
            logger.warning("schema.sql file not found, skipping SQL table creation")
            return False
        
        with open(schema_file, 'r') as f:
            schema_sql = f.read()
        
        with engine.connect() as conn:
            # Execute schema with enum handling
            with conn.begin():
                # Split by semicolon and execute each statement
                statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]
                for statement in statements:
                    if statement:
                        try:
                            # Handle enum creation with IF NOT EXISTS logic
                            if 'CREATE TYPE' in statement and 'ENUM' in statement:
                                # Extract enum name
                                enum_name = statement.split('CREATE TYPE')[1].split('AS')[0].strip()
                                # Check if enum exists first
                                check_enum = f"SELECT 1 FROM pg_type WHERE typname = '{enum_name}'"
                                result = conn.execute(text(check_enum)).fetchone()
                                if not result:
                                    conn.execute(text(statement))
                                    logger.info(f"Created enum type: {enum_name}")
                                else:
                                    logger.info(f"Enum type {enum_name} already exists, skipping")
                            else:
                                conn.execute(text(statement))
                        except Exception as stmt_error:
                            if "already exists" in str(stmt_error):
                                logger.warning(f"Object already exists, skipping: {stmt_error}")
                            else:
                                raise stmt_error
                        
        logger.info("Database tables created using SQL schema!")
        return True
        
    except Exception as e:
        logger.error(f"Failed to create tables with SQL: {e}")
        return False

def run_migrations(database_url):
    """
    Run Alembic migrations if available
    """
    try:
        import subprocess
        
        # Set environment variable for migrations
        env = os.environ.copy()
        env['DATABASE_URL'] = database_url
        
        # Run migrations
        result = subprocess.run(
            ['python', '-m', 'flask', 'db', 'upgrade'],
            env=env,
            capture_output=True,
            text=True,
            cwd=os.path.dirname(__file__)
        )
        
        if result.returncode == 0:
            logger.info("Database migrations completed successfully!")
            return True
        else:
            logger.warning(f"Migration failed: {result.stderr}")
            return False
            
    except Exception as e:
        logger.warning(f"Could not run migrations: {e}")
        return False

def create_admin_user():
    """
    Create default admin user if it doesn't exist
    """
    try:
        sys.path.append(os.path.dirname(os.path.abspath(__file__)))
        from app import create_app
        from app.models.user import User
        from app.services.database import db
        from werkzeug.security import generate_password_hash
        
        app = create_app()
        
        with app.app_context():
            # Check if admin exists
            admin_email = os.getenv('ADMIN_EMAIL', 'admin@tuinuewasichana.org')
            admin_password = os.getenv('ADMIN_PASSWORD', 'TuinueAdmin2024!')
            admin_name = os.getenv('ADMIN_NAME', 'System Administrator')
            admin = User.query.filter_by(email=admin_email).first()
            
            if not admin:
                # Create admin user with correct field names
                admin_user = User(
                    email=admin_email,
                    name=admin_name,  # Use the admin_name from environment
                    role='admin'
                )
                # Set password using the model's method if available
                if hasattr(admin_user, 'set_password'):
                    admin_user.set_password(admin_password)
                else:
                    admin_user.password_hash = generate_password_hash(admin_password)
                
                db.session.add(admin_user)
                db.session.commit()
                logger.info(f"Default admin user created: {admin_email} / {admin_password}")
            else:
                logger.info("Admin user already exists")
                
        return True
        
    except Exception as e:
        logger.warning(f"Could not create admin user: {e}")
        return False

def main():
    """
    Main database initialization function
    """
    logger.info("Starting database initialization...")
    
    # Get database URL
    database_url = get_database_url()
    if not database_url:
        logger.error("No valid database URL found")
        sys.exit(1)
    
    # Wait for database to be available
    if not wait_for_database(database_url):
        logger.error("Database is not available, deployment will continue without DB initialization")
        # Don't exit with error - let the app start and handle DB issues gracefully
        return
    
    # Try different methods to initialize database
    success = False
    
    # Method 1: Try SQLAlchemy with app models
    logger.info("Attempting database initialization with SQLAlchemy...")
    if create_tables_with_sqlalchemy(database_url):
        success = True
    
    # Method 2: Try migrations
    if not success:
        logger.info("Attempting database initialization with migrations...")
        if run_migrations(database_url):
            success = True
    
    # Method 3: Try raw SQL
    if not success:
        logger.info("Attempting database initialization with SQL schema...")
        if create_tables_with_sql(database_url):
            success = True
    
    if success:
        logger.info("Database initialization completed successfully!")
        
        # Create admin user
        create_admin_user()
        
    else:
        logger.warning("Database initialization failed, but deployment will continue")
        logger.warning("Database tables may need to be created manually")

if __name__ == '__main__':
    main()